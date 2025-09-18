export type Progress = {
    id: number
    lane: string
    message: string
    type: 'success' | 'fail' | 'info'
    createdAt: Date
}

export type BaseProgress = Omit<Progress, "id" | "createdAt">