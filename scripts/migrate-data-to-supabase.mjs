import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const root = process.cwd();
readEnvFile(path.join(root, ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase env vars are missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const dataPath = path.join(root, "data.json");

if (!fs.existsSync(dataPath)) {
  console.error("data.json not found");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const prompts = Array.isArray(raw.prompts) ? raw.prompts : [];
const answers = Array.isArray(raw.answers) ? raw.answers : [];

const topicMap = new Map();

const { data: existingTopics, error: topicSelectError } = await supabase
  .from("topics")
  .select("id, title, created_at")
  .limit(10000);

if (topicSelectError) {
  console.error("topics select failed:", topicSelectError.message);
  process.exit(1);
}

const existingTopicByKey = new Map(
  (existingTopics || []).map((t) => [`${t.title}__${new Date(t.created_at).toISOString()}`, t.id])
);

let insertedTopics = 0;
for (const prompt of prompts) {
  const title = String(prompt.text || "").trim();
  if (!title) continue;
  const createdAt = prompt.createdAt ? new Date(prompt.createdAt).toISOString() : new Date().toISOString();
  const key = `${title}__${createdAt}`;

  let topicId = existingTopicByKey.get(key);
  if (!topicId) {
    const newId = crypto.randomUUID();
    const { error } = await supabase.from("topics").insert({
      id: newId,
      title,
      created_at: createdAt,
    });
    if (error) {
      console.error("topics insert failed:", error.message, { title, createdAt });
      continue;
    }
    topicId = newId;
    existingTopicByKey.set(key, topicId);
    insertedTopics += 1;
  }

  topicMap.set(String(prompt.id), topicId);
}

const { data: existingAnswers, error: answerSelectError } = await supabase
  .from("answers")
  .select("topic_id, content, created_at")
  .limit(20000);

if (answerSelectError) {
  console.error("answers select failed:", answerSelectError.message);
  process.exit(1);
}

const existingAnswerKey = new Set(
  (existingAnswers || []).map((a) => `${a.topic_id}__${a.content}__${new Date(a.created_at).toISOString()}`)
);

let insertedAnswers = 0;
for (const answer of answers) {
  const oldPromptId = String(answer.promptId || "");
  const topicId = topicMap.get(oldPromptId);
  if (!topicId) continue;

  const content = String(answer.text || "").trim();
  if (!content) continue;
  const createdAt = answer.createdAt ? new Date(answer.createdAt).toISOString() : new Date().toISOString();
  const likes = Number.isFinite(answer.likeCount) ? Number(answer.likeCount) : 0;
  const key = `${topicId}__${content}__${createdAt}`;

  if (existingAnswerKey.has(key)) continue;

  const { error } = await supabase.from("answers").insert({
    topic_id: topicId,
    content,
    likes,
    created_at: createdAt,
  });

  if (error) {
    console.error("answers insert failed:", error.message, { topicId, content });
    continue;
  }

  existingAnswerKey.add(key);
  insertedAnswers += 1;
}

console.log(`Migration done. inserted topics=${insertedTopics}, inserted answers=${insertedAnswers}`);
