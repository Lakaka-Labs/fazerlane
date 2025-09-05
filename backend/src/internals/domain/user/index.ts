export type User = {
    id: string
    email: string
    googleId?: string
    username?: string
    createdAt: string
    updatedAt: string
}

export type GetUserParameters = {
    id?: string
    email?: string
    googleId?: string
    username?: string
}