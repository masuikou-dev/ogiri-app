"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PromptForm from "./components/PromptForm";
import PromptList from "./components/PromptList";

type Prompt = { id: string; text: string; createdAt: string; likeCount?: number };

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "likes">("newest");
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
    return p.text.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "likes") {
      return (b.likeCount || 0) - (a.likeCount || 0);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 お題投稿アプリ</h1>

        <PromptForm onAdd={handleAdd} />

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">投稿一覧</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-3 py-1 rounded-md text-sm ${sortBy === "newest" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                新着順
              </button>
              <button
                onClick={() => setSortBy("likes")}
                className={`px-3 py-1 rounded-md text-sm ${sortBy === "likes" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                いいね順
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-gray-500">読み込み中...</div>
          ) : (
            <PromptList prompts={sorted} />
          )}
        </section>
      </div>
    </main>
  );
}

  