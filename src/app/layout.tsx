import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Loading from "./loading";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const googleSans = localFont({
  src: [
    {
      path: "./../assets/fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../assets/fonts/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../assets/fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },

    {
      path: "./../assets/fonts/GoogleSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./../assets/fonts/GoogleSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./../assets/fonts/GoogleSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "GDSC MBCET Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={googleSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            <div className="flex flex-row bg-slate-50 min-h-[100vh]">
              <div className="flex flex-col bg-white p-24">
                {["events", "members", "sponsors", "skills"].map(
                  (pageName, index) => (
                    <Button key={index} asChild variant={"link"}>
                      <Link href={`/${pageName}`}>{pageName}</Link>
                    </Button>
                  )
                )}
              </div>

              {children}
            </div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
