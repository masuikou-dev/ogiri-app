"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PromptDetail from "../../components/PromptDetail";

type Prompt = { id: string; text: string; theme?: string; createdAt: string };

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    (async () => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (res.ok) {
          const p = await res.json();
          setPrompt(p);
        } else {
          setPrompt(null);
        }
      } catch (e) {
        console.error(e);
        setPrompt(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-500">読み込み中...</div>
      </main>
    );
  }

  if (!prompt) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-500">お題が見つかりません。</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl mt-8">
        <div className="mb-4">
          <a href="/" className="text-blue-600 hover:underline">← ホームに戻る</a>
        </div>
        <h1 className="text-2xl font-bold mb-2">{prompt.text}</h1>
        <div className="text-sm text-gray-500 mb-4">{prompt.theme} — {new Date(prompt.createdAt).toLocaleString()}</div>

        <PromptDetail promptId={prompt.id} />
      </div>
    </main>
  );
}
