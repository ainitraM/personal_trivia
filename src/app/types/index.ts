export interface Trivia {
    id: string
    trivia: string
    createdAt: Date
    updatedAt: Date
    authorId: string // The ID of the associated author
}

export interface GameTrivia {
    id: string
    question: string
    answer: string
    [key: string]: string
}