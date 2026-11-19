import type { Metadata } from "next";
import "./globals.css";
import { RestaurantProvider } from "@/context/RestaurantContext";

export const metadata: Metadata = {
  title: "Foodies Restaurant",
  description: "Good Food, Great Moments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <RestaurantProvider>
          {children}
        </RestaurantProvider>
      </body>
    </html>
  );
}