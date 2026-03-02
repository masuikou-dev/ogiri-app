"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [q, setQ] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-between p-2">
        <a href="/" className="font-bold text-lg">
          お題アプリ
        </a>
        <form onSubmit={submit} className="flex items-center">
          <input
            type="text"
            placeholder="検索..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded-md p-1 mr-2"
          />
          <button
            type="submit"
            className="bg-black text-white px-2 py-1 rounded-md"
          >
            検索
          </button>
        </form>
      </div>
    </header>
  );
}