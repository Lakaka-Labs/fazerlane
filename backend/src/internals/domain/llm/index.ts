export type Message = {
    text?: string
    data?: MessageData
}

export type MessageData = {
    fileUri: string
    fps?: number
    endOffset?: number
    startOffset?: number
}