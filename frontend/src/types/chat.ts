export interface Message {
    role: 'user' | 'ai';
    content: string;
    images?: string[];
}

export interface ChatThread {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}
