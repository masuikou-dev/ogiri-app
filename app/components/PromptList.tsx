"use client";

import { useEffect, useState } from "react";

type Prompt = { id: string; text: string; createdAt: string; likeCount?: number };

const PAGE_SIZE = 50;

export default function PromptList({ prompts }: { prompts: Prompt[] }) {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [prompts]);

  if (!prompts || prompts.length === 0) {
    return <div className="text-gray-700">まだ投稿がありません。</div>;
  }

  const totalPages = Math.max(1, Math.ceil(prompts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const pagedPrompts = prompts.slice(startIndex, startIndex + PAGE_SIZE);

  const paginationLinks = (
    <div className="text-sm pt-1 text-[#0000cc]">
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page, index) => (
        <span key={page}>
          {index > 0 && <span className="mx-1 text-black">/</span>}
          {safeCurrentPage === page ? (
            <span className="text-black font-bold">{page}</span>
          ) : (
            <a
              href={`#prompt-page-${page}`}
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

  const handleLike = async (promptId: string) => {
    console.log("Liking prompt:", promptId);
    setIsLoading((prev) => ({ ...prev, [promptId]: true }));
    try {
      const res = await fetch(`/api/prompts/${promptId}/like`, {
        method: "POST",
      });
      console.log("Like response:", res.status);
      if (res.ok) {
        const updated = await res.json();
        console.log("Updated prompt:", updated);
        setLikes((prev) => ({ ...prev, [promptId]: updated.likeCount }));
      } else {
        console.error("Failed to like:", await res.text());
      }
    } catch (e) {
      console.error("Like error:", e);
    } finally {
      setIsLoading((prev) => ({ ...prev, [promptId]: false }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-700">
        全{prompts.length}件（{safeCurrentPage}/{totalPages}ページ）
      </div>

      {paginationLinks}

      {pagedPrompts.map((p) => (
        <div key={p.id} className="border border-[#808080] p-3 bg-[#fffff0]">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-sm text-gray-700">{new Date(p.createdAt).toLocaleString()}</div>
              <a
                href={`/prompts/${p.id}`}
                className="mt-1 text-lg font-semibold text-[#0000cc] underline block"
              >
                {p.text}
              </a>
            </div>
            <div className="ml-3 flex items-center gap-2">
              <button
                onClick={() => handleLike(p.id)}
                disabled={isLoading[p.id]}
                className="bg-[#dcdcdc] text-black px-4 py-2 border border-black disabled:opacity-60 text-sm font-medium"
              >
                ♡ {likes[p.id] !== undefined ? likes[p.id] : p.likeCount || 0}
              </button>
            </div>
          </div>
        </div>
      ))}

      {paginationLinks}
    </div>
  );
}
