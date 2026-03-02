"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PromptForm from "./components/PromptForm";
import PromptList from "./components/PromptList";

type Prompt = { id: string; text: string; theme?: string; createdAt: string };

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/prompts');
        const data = await res.json();
        setPrompts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (p: Prompt) => {
    setPrompts((s) => [p, ...s]);
  };

  const filtered = prompts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.text.toLowerCase().includes(q) || 
      (p.theme?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 お題投稿アプリ</h1>

        <PromptForm onAdd={handleAdd} />

        <section>
          <h2 className="text-lg font-semibold mb-3">投稿一覧</h2>
          {loading ? (
            <div className="text-gray-500">読み込み中...</div>
          ) : (
            <PromptList prompts={filtered} />
          )}
        </section>
      </div>
    </main>
  );
}

  