import ChatService from "../../../services/chat";
import {type Request, type Response, Router} from "express";
import ValidationMiddleware from "../middlewares/validation.ts";
import {BadRequestError} from "../../../../packages/errors";
import {z} from "zod";
import type {User} from "../../../domain/user";
import type BaseFilter from "../../../../packages/types/filter";
import {SuccessResponse} from "../../../../packages/responses/success.ts";

export default class ChatHandler {
    chatService: ChatService
    router = Router()

    constructor(chatService: ChatService) {
        this.chatService = chatService

        this.configureRoutes()
    }

    private configureRoutes() {
        this.router.route("/:laneId").post(
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            ValidationMiddleware(z.object({
                content: z.string(),
                conversationId: z.uuid().optional(),
            }), "body"),
            this.chat
        ).get(
            ValidationMiddleware(z.object({
                laneId: z.uuid(),
            }), "params"),
            ValidationMiddleware(z.object({
                title: z.string().optional(),
                limit: z.string().optional(),
                page: z.string().optional(),
            }), "query"),
            this.getConversations
        )
        ;

        this.router.route("/conversation/:conversationId")
            .get(
                ValidationMiddleware(z.object({
                    conversationId: z.uuid(),
                }), "params"),
                ValidationMiddleware(z.object({
                    limit: z.string().optional(),
                    page: z.string().optional(),
                }), "query"),
                this.getMessages
            )

    }

    chat = async (req: Request, res: Response): Promise<void> => {
        const {content, conversationId} = req.body;
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const userId = (req.user as User).id;

        if (!content || typeof content !== 'string') {
            res.status(400).json({error: 'Content is required'});
            return;
        }

        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

        // Create abort controller for this request
        const abortController = new AbortController();

        // Handle client disconnect
        req.on('close', () => {
            abortController.abort();
        });

        try {
            const {generator, messageId, conversationId: finalConversationId} =
                await this.chatService.commands.chat.handle(
                    userId,
                    req.params.laneId,
                    content,
                    conversationId,
                    abortController.signal
                );

            // Send initial metadata
            res.write(`data: ${JSON.stringify({
                type: 'started',
                messageId,
                conversationId: finalConversationId
            })}\n\n`);

            // Stream the response
            for await (const chunk of generator) {
                if (abortController.signal.aborted) {
                    break;
                }
                res.write(`data: ${chunk}\n\n`);
            }

            // End the stream
            res.end();

        } catch (error) {
            console.error('SSE streaming error:', error);

            // Send error event
            res.write(`data: ${JSON.stringify({
                type: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            })}\n\n`);

            res.end();
        }
    }

    getConversations = async (req: Request, res: Response): Promise<void> => {
        if (!req.params.laneId) throw new BadRequestError("provide lane id")
        const userId = (req.user as User).id;

        const messages = await this.chatService.queries.getConversations.handle({
            userId,
            laneId: req.params.laneId,
            title: req.query.title as string | undefined,
            limit: Number(req.query.limit) || undefined, page: Number(req.query.page)
        })

        new SuccessResponse(res, {messages}).send();
    }

    getMessages = async (req: Request, res: Response): Promise<void> => {
        if (!req.params.conversationId) throw new BadRequestError("provide conversationId")
        const userId = (req.user as User).id;

        const messages = await this.chatService.queries.getMessages.handle(userId, {
            conversationId: req.params.conversationId,
            limit: Number(req.query.limit) || undefined, page: Number(req.query.page)
        })

        new SuccessResponse(res, {messages}).send();
    }
}