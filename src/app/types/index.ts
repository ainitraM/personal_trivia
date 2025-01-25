export interface Trivia {
    id: string
    trivia: string
    createdAt: Date
    updatedAt: Date
    authorId: string // The ID of the associated author
}
