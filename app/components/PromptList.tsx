"use client";

import { useState } from "react";
import PromptDetail from "./PromptDetail";

type Prompt = { id: string; text: string; theme?: string; createdAt: string };

export default function PromptList({ prompts }: { prompts: Prompt[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!prompts || prompts.length === 0) {
    return <div className="text-gray-500">まだ投稿がありません。</div>;
  }

  return (
    <div className="space-y-4">
      {prompts.map((p) => (
        <div key={p.id} className="border rounded-md p-3 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">{p.theme} — {new Date(p.createdAt).toLocaleString()}</div>
              <div className="mt-1 font-medium">
                <a href={`/prompts/${p.id}`} className="text-blue-600 hover:underline text-lg font-semibold">{p.text}</a>
              </div>
            </div>
            <div>
              <button
                onClick={() => setOpenId(openId === p.id ? null : p.id)}
                className="ml-3 text-sm text-blue-600"
              >
                {openId === p.id ? "閉じる" : "開く"}
              </button>
            </div>
          </div>

          {openId === p.id && (
            <div className="mt-3">
              <PromptDetail promptId={p.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
