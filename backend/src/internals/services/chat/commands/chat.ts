import type LLMRepository from "../../../domain/llm/repository.ts";
import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import type {MemoriesRepository} from "../../../domain/memories/repository.ts";
import type {ChatRepository} from "../../../domain/chat/repository.ts";
import type {MessagesWithRole, ModelResponse} from "../../../domain/llm";
import type {Conversation} from "../../../domain/chat";
import {BadRequestError} from "../../../../packages/errors";

export default class Chat {
    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly llmRepository: LLMRepository,
        private readonly chatMemoriesRepository: MemoriesRepository,
        private readonly challengeRepository: ChallengeRepository
    ) {
    }

    async handle(
        userId: string,
        laneId: string,
        content: string,
        conversationId?: string,
        signal?: AbortSignal
    ): Promise<{ generator: AsyncGenerator<string>; messageId: string; conversationId: string }> {
        // Create conversation if needed
        if (!conversationId) {
            conversationId = await this.chatRepository.createConversation(userId, laneId, content.slice(0, 50))
        }

        // Parallel fetch: conversation and embedding generation
        const conversation = await this.chatRepository.GetConversation(conversationId, userId)

        if (conversation.generating) {
            throw new BadRequestError("a message is currently being generated. Please wait or stop it first")
        }

        try {
            // Parallel operations: add user message and fetch context data
            const [userMessageId, relevantChallenges, memories, history] = await Promise.all([
                this.chatRepository.AddMessage({
                    conversationId,
                    content,
                    role: 'user'
                }),
                this.challengeRepository.get(laneId),
                this.chatMemoriesRepository.search(content, userId),
                this.chatRepository.GetConversationHistory({
                    conversationId,
                    limit: 50
                })
            ]);

            // Update conversation state (non-blocking for stream start)
            this.chatRepository.updateConversation(conversationId, {generating: true}).catch(console.error);

            // Build context strings (optimized with single join)
            const challengesContext = relevantChallenges.length > 0
                ? relevantChallenges.map(challenge => JSON.stringify(challenge)).join('\n\n')
                : '';

            const memoryContext = memories.length > 0 ? memories.join('\n') : '';

            // Build conversation history context (excluding the newest message)
            const historyContext = history.length > 0
                ? history.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')
                : '';

            // Build system prompt with all context including history
            const systemPrompt = this.buildSystemPrompt(challengesContext, memoryContext, historyContext);

            // Build user messages array - only include the newest message as actual conversation
            const userMessages: MessagesWithRole[] = [
                {role: 'user', messages: [{text: systemPrompt}]},
                {role: 'model', messages: [{text: 'Understood.'}]},
                {role: 'user', messages: [{text: content}]}
            ];

            // Parallel: get tokens and create assistant message
            const [userToken, assistantMessageId] = await Promise.all([
                this.llmRepository.getTokens(userMessages),
                this.chatRepository.AddMessage({
                    conversationId,
                    content: "",
                    role: 'model'
                })
            ]);

            // Add token count to user message (non-blocking)
            this.chatRepository.AddChunkToMessage(userMessageId, '', userToken).catch(console.error);

            // Start streaming
            const result = this.llmRepository.getTextStream(userMessages, signal);
            const generator = this.streamResponse(
                result,
                conversationId,
                assistantMessageId,
                userMessageId,
                content
            );

            return {generator, messageId: assistantMessageId, conversationId};
        } catch (e) {
            await this.chatRepository.updateConversation(conversationId, {generating: false})
            throw e
        }
    }

    private async* streamResponse(
        streamResult: AsyncGenerator<ModelResponse>,
        conversationId: string,
        messageId: string,
        userId: string,
        userMessage: string
    ): AsyncGenerator<string> {
        let fullResponse = '';
        const BATCH_SIZE = 10; // Write chunks in batches
        let pendingChunks: Array<{ text: string, tokenCount: number }> = [];

        const flushChunks = async () => {
            if (pendingChunks.length === 0) return;

            const chunksToWrite = [...pendingChunks];
            pendingChunks = [];

            // Concatenate all chunks and write in a single operation
            const concatenatedText = chunksToWrite.map(c => c.text).join('');
            const totalTokens = chunksToWrite[chunksToWrite.length - 1]?.tokenCount || 0

            await this.chatRepository.AddChunkToMessage(messageId, concatenatedText, totalTokens);
        };

        try {
            for await (const chunk of streamResult) {
                const text = chunk.response;
                fullResponse += text;
                pendingChunks.push({text, tokenCount: chunk.tokenCount});

                yield JSON.stringify({
                    type: 'chunk',
                    data: text,
                    messageId,
                    conversationId
                });

                // Flush chunks in batches to reduce DB calls
                if (pendingChunks.length >= BATCH_SIZE) {
                    await flushChunks();
                }
            }

            // Flush any remaining chunks
            await flushChunks();

            // After successful completion, update conversation and save memory
            await Promise.all([
                this.chatRepository.updateConversation(conversationId, {generating: false}),
                this.chatMemoriesRepository.add(
                    `User asked: ${userMessage}\nAssistant: ${fullResponse}`,
                    userId,
                )
            ]);

            yield JSON.stringify({
                type: 'complete',
                messageId,
                conversationId
            });

        } catch (error) {
            // Flush any remaining chunks before handling error
            try {
                await flushChunks();
            } catch (flushError) {
                console.error('Failed to flush chunks on error:', flushError);
            }

            await this.chatRepository.updateConversation(conversationId, {generating: false})

            if (error instanceof Error && error.name === 'AbortError') {
                yield JSON.stringify({
                    type: 'aborted',
                    messageId,
                    conversationId
                });
            } else {
                yield JSON.stringify({
                    type: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    messageId
                });
            }
        }
    }

    private buildSystemPrompt(relevantContext: string, memories: string, history: string): string {
        const parts = [
            '# Role',
            'You are an adaptive AI instructor designed to facilitate effective learning through natural conversation.',
            '',
            '## Core Behaviors',
            'Adapt to the student\'s tone, learning pace, and knowledge level. Make the conversation feel natural, supportive, and approachable.',
            '',
            '## Teaching Approach',
            '- Respond thoughtfully to questions and check for understanding',
            '- Show genuine interest in the student\'s learning journey',
            '- Encourage deeper thinking through strategic questions',
            '- Reference previous learning to build connections',
            '- Provide relevant examples and celebrate progress',
            '- Do not use emojis'
        ];

        if (relevantContext) {
            parts.push(`\n\n## Relevant Learning Context:\n${relevantContext}`);
        }

        if (memories) {
            parts.push(`\n\n## Student Background & Previous Interactions:\n${memories}`);
        }

        if (history) {
            parts.push(`\n\n## Previous Conversation History:\n${history}`);
        }

        return parts.join('');
    }
}
