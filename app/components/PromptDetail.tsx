"use client";

import { useEffect, useState } from "react";


type Answer = { id: string; promptId: string; text: string; createdAt: string; likeCount?: number };

export default function PromptDetail({ promptId }: { promptId: string }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "likes">("likes");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/prompts/${promptId}/answers`);
        const data: Answer[] = await res.json();
        setAnswers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [promptId]);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/prompts/${promptId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (res.ok) {
        const a = await res.json();
        console.log("Posted answer:", a);
        setAnswers((s) => [a, ...s]);
        setText("");
      } else {
        console.error("failed to post answer", await res.text());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t pt-3">
      <div className="mb-2 text-sm text-gray-600">回答する</div>
      <textarea
        className="w-full border rounded-md p-2 mb-2"
        rows={2}
        placeholder="ここに回答を書いてください..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-black text-white px-3 py-1 rounded-md disabled:opacity-60"
        >
          {submitting ? "送信中..." : "回答を投稿"}
        </button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">回答一覧</div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("newest")}
              className={`px-2 py-1 rounded-md text-xs ${sortBy === "newest" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              新着順
            </button>
            <button
              onClick={() => setSortBy("likes")}
              className={`px-2 py-1 rounded-md text-xs ${sortBy === "likes" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              いいね順
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-500">読み込み中...</div>
        ) : answers.length === 0 ? (
          <div className="text-gray-500">まだ回答がありません。</div>
        ) : (
          <div className="space-y-2">
            {answers
              .sort((a, b) => {
                if (sortBy === "likes") {
                  return (b.likeCount ?? 0) - (a.likeCount ?? 0);
                } else {
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
              })
              .map((a) => (
                <div key={a.id} className="p-2 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                      <div className="mt-1">{a.text}</div>
                    </div>
                    <div className="ml-3 text-right">
                      <button
                        onClick={async () => {
                          console.log("Liking answer:", a.id);
                          try {
                            const res = await fetch(`/api/answers/${a.id}/like`, {
                              method: "POST",
                            });
                            console.log("Answer like response:", res.status);
                            if (res.ok) {
                              const updated = await res.json();
                              console.log("Updated answer:", updated);
                              setAnswers((s) => s.map((x) => (x.id === updated.id ? updated : x)));
                            } else {
                              const errorText = await res.text();
                              console.error("Error response:", res.status, errorText);
                              alert(errorText);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        disabled={false}
                        className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 disabled:opacity-60 font-medium"
                      >
                        ♡ {a.likeCount ?? 0}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
