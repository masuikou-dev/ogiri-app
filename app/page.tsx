"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopicForm from "./components/TopicForm";
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
        if (!res.ok) {
          console.error("failed to fetch prompts", data);
          setPrompts([]);
          return;
        }

        setPrompts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (p: Prompt) => {
    setPrompts((s) => [p, ...s]);
  };

  const filtered = (Array.isArray(prompts) ? prompts : []).filter((p) => {
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#c0c0c0]">
      <div className="bg-[#efefef] p-5 border-2 border-[#808080] w-full max-w-2xl shadow-[2px_2px_0_#808080]">
        <h1 className="text-xl font-bold mb-4 text-center border-b border-black pb-2 text-[#222244]"> 大喜利研究所</h1>

        <TopicForm onAdd={handleAdd} />

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">投稿一覧</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-3 py-1 border text-sm ${sortBy === "newest" ? "bg-[#000080] text-white border-black" : "bg-[#dcdcdc] text-black border-[#808080]"}`}
              >
                新着順
              </button>
              <button
                onClick={() => setSortBy("likes")}
                className={`px-3 py-1 border text-sm ${sortBy === "likes" ? "bg-[#000080] text-white border-black" : "bg-[#dcdcdc] text-black border-[#808080]"}`}
              >
                いいね順
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-[#333355]">読み込み中...</div>
          ) : (
            <PromptList prompts={sorted} />
          )}
        </section>
      </div>
    </main>
  );
}

  