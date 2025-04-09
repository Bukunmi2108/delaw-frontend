export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  chat_id?: string;
}

export interface ChatResponse {
  response: string;
  history: Message[];
  chat_id: string;
  title: string;
}

export interface ChatHistoryResponse {
    response: string[],
    history: Message[],
    chat_id: string,
    title: string,
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

export interface User {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface TokenData {
    username: string | null;
}