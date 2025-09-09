export type Progress = {
    id: number
    lane: string
    message: string
    type: 'success' | 'fail' | 'info'
    stage: 'analysis' | 'milestone_generation' | 'challenge_generation'
    createdAt: Date
}

export type BaseProgress = Omit<Progress, "id" | "createdAt">