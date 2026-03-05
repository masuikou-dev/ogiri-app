"use client";

import { useState } from "react";

type Prompt = { id: string; text: string; theme?: string; createdAt: string; likeCount?: number };

export default function PromptList({ prompts }: { prompts: Prompt[] }) {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  if (!prompts || prompts.length === 0) {
    return <div className="text-gray-500">まだ投稿がありません。</div>;
  }

  const handleLike = async (promptId: string) => {
    setIsLoading((prev) => ({ ...prev, [promptId]: true }));
    try {
      const res = await fetch(`/api/prompts/${promptId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const updated = await res.json();
        setLikes((prev) => ({ ...prev, [promptId]: updated.likeCount }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading((prev) => ({ ...prev, [promptId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {prompts.map((p) => (
        <div key={p.id} className="border rounded-md p-3 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-sm text-gray-500">{p.theme} — {new Date(p.createdAt).toLocaleString()}</div>
              <a
                href={`/prompts/${p.id}`}
                className="mt-1 text-lg font-semibold text-blue-600 hover:underline block"
              >
                {p.text}
              </a>
            </div>
            <div className="ml-3 flex items-center gap-2">
              <button
                onClick={() => handleLike(p.id)}
                disabled={isLoading[p.id]}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:opacity-60"
              >
                ❤️ {likes[p.id] !== undefined ? likes[p.id] : p.likeCount || 0}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
