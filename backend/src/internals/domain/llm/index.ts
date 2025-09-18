export type Message = {
    text?: string
    data?: MessageData
    uploadedData?: {uri: string, mimeType: string}
}

export type MessageData = {
    fileUri: string
    fps?: number
    endOffset?: number
    startOffset?: number
}