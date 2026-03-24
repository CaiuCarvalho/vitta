"use client";

import dynamic from "next/dynamic";

const Background = dynamic(() => import("@/components/Background"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black/40" />
    </div>
  ),
});

export default function BackgroundClient() {
  return <Background />;
}
