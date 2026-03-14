"use client";

import { useEffect, useState } from "react";


type Answer = { id: string; promptId: string; text: string; createdAt: string; likeCount?: number };
const PAGE_SIZE = 50;

export default function PromptDetail({ promptId }: { promptId: string }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "likes">("likes");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/prompts/${promptId}/answers`);
        const data: Answer[] = await res.json();
        // ページロード時のみ並び替え
        setAnswers(
          sortBy === "likes"
            ? [...data].sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
            : [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [promptId, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [promptId, sortBy]);

  const totalPages = Math.max(1, Math.ceil(answers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const pagedAnswers = answers.slice(startIndex, startIndex + PAGE_SIZE);

  const paginationLinks = (
    <div className="text-sm pt-1 text-[#0000cc]">
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page, index) => (
        <span key={page}>
          {index > 0 && <span className="mx-1 text-black">/</span>}
          {safeCurrentPage === page ? (
            <span className="text-black font-bold">{page}</span>
          ) : (
            <a
              href={`#answer-page-${page}`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page);
              }}
              className="text-[#0000cc] underline cursor-pointer"
            >
              {page}
            </a>
          )}
        </span>
      ))}
    </div>
  );

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
    <div className="border-t border-black pt-3 mt-3">
      <div className="mb-2 text-sm text-gray-700">回答する</div>
      <textarea
        className="w-full border border-black p-2 mb-2 bg-white"
        rows={2}
        placeholder="ここに回答を書いてください..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-[#000080] text-white px-3 py-1 border border-black disabled:opacity-60"
        >
          {submitting ? "送信中..." : "回答を投稿"}
        </button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-700">回答一覧</div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("newest")}
              className={`px-2 py-1 border text-xs ${sortBy === "newest" ? "bg-[#000080] text-white border-black" : "bg-[#dcdcdc] text-black border-[#808080]"}`}
            >
              新着順
            </button>
            <button
              onClick={() => setSortBy("likes")}
              className={`px-2 py-1 border text-xs ${sortBy === "likes" ? "bg-[#000080] text-white border-black" : "bg-[#dcdcdc] text-black border-[#808080]"}`}
            >
              いいね順
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-700">読み込み中...</div>
        ) : answers.length === 0 ? (
          <div className="text-gray-700">まだ回答がありません。</div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              全{answers.length}件（{safeCurrentPage}/{totalPages}ページ）
            </div>

            {paginationLinks}

            {pagedAnswers.map((a) => (
              <div key={a.id} className="p-2 bg-[#fffff0] border border-[#808080]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-700">{new Date(a.createdAt).toLocaleString()}</div>
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
                      className="mt-2 bg-[#dcdcdc] text-black px-4 py-2 border border-black text-sm disabled:opacity-60 font-medium"
                    >
                      ♡ {a.likeCount ?? 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {paginationLinks}
          </div>
        )}
      </div>
    </div>
  );
}
