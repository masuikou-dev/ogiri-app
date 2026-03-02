export type Prompt = {
  id: string;
  text: string;
  theme?: string;
  createdAt: string;
};

export type Answer = {
  id: string;
  promptId: string;
  text: string;
  createdAt: string;
  likeCount?: number;
};

export const prompts: Prompt[] = [
  {
    id: "1",
    text: "こんな校長先生は嫌だ。どんな人？",
    theme: "学校",
    createdAt: new Date().toISOString(),
  },
];

export const answers: Answer[] = [];
