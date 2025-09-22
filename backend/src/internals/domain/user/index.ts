export type User = {
    id: string
    email: string
    password?: string
    googleId?: string
    username?: string
    emailVerified: boolean
    streak: number
    xp: number
    createdAt: string
    updatedAt: string
}

export type GetUserParameters = {
    id?: string
    email?: string
    googleId?: string
    username?: string
}