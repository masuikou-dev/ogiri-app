import fs from "fs";
import path from "path";

export type Prompt = {
  id: string;
  text: string;
  theme?: string;
  createdAt: string;
  likeCount?: number;
};

export type Answer = {
  id: string;
  promptId: string;
  text: string;
  createdAt: string;
  likeCount?: number;
  likedBy?: string[]; // user ids who liked this answer
};

const dataFile = path.resolve(process.cwd(), "data.json");

interface DataSchema {
  prompts: Prompt[];
  answers: Answer[];
}

function loadData(): DataSchema {
  try {
    const txt = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(txt) as DataSchema;
  } catch (e) {
    // file not exist or parse error
    return { prompts: [], answers: [] };
  }
}

function saveData(data: DataSchema) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

export function getPrompts(): Prompt[] {
  return loadData().prompts;
}

export function addPrompt(p: Prompt) {
  const d = loadData();
  d.prompts.unshift(p);
  saveData(d);
}

export function getAnswers(): Answer[] {
  return loadData().answers;
}

export function addAnswer(a: Answer) {
  const d = loadData();
  d.answers.unshift(a);
  saveData(d);
}

export function updateAnswer(updated: Answer) {
  const d = loadData();
  const idx = d.answers.findIndex((x) => x.id === updated.id);
  if (idx !== -1) {
    d.answers[idx] = updated;
    saveData(d);
  }
}

export function updatePrompt(updated: Prompt) {
  const d = loadData();
  const idx = d.prompts.findIndex((x) => x.id === updated.id);
  if (idx !== -1) {
    d.prompts[idx] = updated;
    saveData(d);
  }
}

