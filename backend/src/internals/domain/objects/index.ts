export type StorageObject = {
    id: string
    publicUrl: string
    llmUrl: string
    mimeType: string
    userId:string
    createdAt: Date
    lastAccessed: Date
}

export type FileParameter = {
    path: string
    mimeType: string
}