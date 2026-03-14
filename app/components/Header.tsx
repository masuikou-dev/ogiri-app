"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#000080] border-b-2 border-black z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-between p-2">
        <div className="site-title-link text-lg font-bold drop-shadow-[1px_1px_0_#000]">
          大喜利研究所
        </div>

        <form onSubmit={submit} className="flex items-center">
          <input
            type="text"
            placeholder="検索..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border border-black bg-white text-black p-1 mr-2"
          />
          <button
            type="submit"
            className="bg-[#dcdcdc] text-black px-2 py-1 border border-black"
          >
            検索
          </button>
        </form>
      </div>
    </header>
  );
}