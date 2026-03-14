"use client";

import { useState } from "react";

type Props = {
  onAdd: (topic: { id: string; text: string; createdAt: string; likeCount?: number }) => void;
};

export default function TopicForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const randomize = () => {
    import("../lib/randomPrompt").then((mod) => {
      const r = mod.generatePrompt();
      setTitle(r.text);
    });
  };

  const submit = async () => {
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: title.trim(), answer: answer.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "failed to post topic");
      }

      const data = await res.json();
      onAdd(data);
      setTitle("");
      setAnswer("");
    } catch (error) {
      console.error(error);
      alert("お題の保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6 border border-[#808080] bg-[#f5f5f5] p-3">
      <div className="flex gap-2 mb-3">
        <textarea
          className="flex-1 border border-black p-2 bg-white"
          rows={3}
          placeholder="ここにお題を入力してください..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={randomize}
          className="bg-[#dcdcdc] text-black px-3 py-2 border border-black"
        >
          ランダム
        </button>
      </div>

      <div className="mb-3">
        <textarea
          className="w-full border border-black p-2 bg-white"
          rows={2}
          placeholder="ここに回答を入力してください...（省略可）"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        disabled={submitting || !title.trim()}
        className="w-full bg-[#000080] text-white py-2 border border-black disabled:opacity-60"
      >
        {submitting ? "送信中..." : "投稿する"}
      </button>
    </div>
  );
}
