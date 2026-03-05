"use client";

import { useState } from "react";

type Props = {
  onAdd: (p: { id: string; text: string; theme?: string; createdAt: string }) => void;
};

export default function PromptForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState(""); // optional answer field
  const [theme, setTheme] = useState("学校");
  const [loading, setLoading] = useState(false);

  const randomize = () => {
    import("../lib/randomPrompt").then((mod) => {
      const r = mod.generatePrompt();
      setText(r.text);
      setTheme(r.theme);
    });
  };

  const submit = async () => {
    // prompt required, answer optional
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), theme, answer: answer.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        onAdd(data);
        setText("");
        setAnswer("");
      } else {
        console.error("failed to post", await res.text());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-2 text-sm text-gray-600">テーマ</div>
      <input
        className="w-full border rounded-md p-2 mb-3"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      />

      <div className="flex gap-2 mb-3">
        <textarea
          className="flex-1 border rounded-md p-2"
          rows={3}
          placeholder="ここにお題を入力してください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          onClick={randomize}
          className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
        >
          ランダム
        </button>
      </div>

      <div className="mb-3">
        <textarea
          className="w-full border rounded-md p-2"
          rows={2}
          placeholder="ここに回答を入力してください...（省略可）"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        disabled={loading || !text.trim()}
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-60"
      >
        {loading ? "送信中..." : "投稿する"}
      </button>
    </div>
  );
}
