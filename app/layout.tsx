import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telegram clone",
  description: "Telegram website",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const s = JSON.parse(localStorage.getItem('tg_settings') || '{}');
              const t = s.theme || 'system';
              if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          `,
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
