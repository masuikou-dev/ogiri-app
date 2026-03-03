"use client";

import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "ホーム", href: "/" },
    { label: "検索", href: "/search" },
    { label: "マイページ", href: "/mypage" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-inner">
      <ul className="flex justify-around p-2">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              className={`text-sm ${pathname === it.href ? "font-bold text-black" : "text-gray-600"}`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}