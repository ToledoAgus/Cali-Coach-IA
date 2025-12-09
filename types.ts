export enum Sender {
  Bot = 'bot',
  User = 'user'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isMarkdown?: boolean;
}

export interface UserData {
  [key: string]: string;
}

export interface Step {
  id: string;
  question: string;
  field: string;
  placeholder: string;
  options?: string[]; // For quick replies
}
