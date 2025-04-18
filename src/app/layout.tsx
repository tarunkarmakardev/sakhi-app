import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/features/header";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sakhi App",
  description: "Sakhi App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-normal text-primary font-roboto`}
      >
        <Providers>
          <main className="bg-background h-screen w-screen overflow-auto p-4">
            <Header />
            <div className="max-w-2xl lg:max-w-5xl mx-auto mt-16">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
