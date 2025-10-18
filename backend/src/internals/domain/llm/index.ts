export type Message = {
    role?: string
    text?: string
    data?: MessageData
    uploadedData?: { uri: string, mimeType: string },
}

export type MessagesWithRole = {
    role: string,
    messages: Message[]
}

export type MessageData = {
    fileUri: string
    fps?: number
    endOffset?: number
    startOffset?: number
}

export type ModelResponse = { response: string, tokenCount: number }