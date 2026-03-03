"use client";

import PromptForm from "../components/PromptForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleAdd = () => {
    // After creation, navigate to home
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 お題投稿</h1>
        <PromptForm onAdd={handleAdd} />
      </div>
    </main>
  );
}