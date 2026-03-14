"use client";

import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "ホーム", href: "/" },
    { label: "マイページ", href: "/mypage" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#dcdcdc] border-t-2 border-[#808080]">
      <ul className="flex justify-around p-2">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              className={`text-sm underline ${pathname === it.href ? "font-bold text-black" : "text-[#0000ee]"}`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}