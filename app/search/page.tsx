"use client";

import { useEffect, useState } from "react";
import PromptList from "../components/PromptList";

type Prompt = { id: string; text: string; theme?: string; createdAt: string };

export default function SearchPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [themeFilter, setThemeFilter] = useState("");

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

  const themes = ["", "学校", "職場", "ホラー", "SF", "日常", "ファンタジー", "スポーツ", "動物", "旅行", "料理"];

  const filtered = prompts.filter(p => {
    const matchesTheme = themeFilter ? p.theme === themeFilter : true;
    const q = keyword.toLowerCase();
    const matchesText = q ? p.text.toLowerCase().includes(q) : true;
    return matchesTheme && matchesText;
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl mt-8">
        <h1 className="text-2xl font-bold mb-4 text-center">🔍 検索</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-1 text-sm">キーワード検索</label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="お題の文面を検索"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">テーマで絞り込み</label>
            <select
              value={themeFilter}
              onChange={e => setThemeFilter(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              {themes.map(t => (
                <option key={t} value={t}>{t || "(すべて)"}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500">読み込み中...</div>
        ) : (
          <PromptList prompts={filtered} />
        )}
      </div>
    </main>
  );
}