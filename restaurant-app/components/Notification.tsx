"use client";
import { useEffect, useState } from "react";

export default function Notification({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow animate-slide-left">
      {message}
    </div>
  );
}
