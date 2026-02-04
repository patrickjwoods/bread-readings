import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  title: "BREAD 2026",
  description: "Yesterday, today, and tomorrow's scripture readings from the Reality SF BREAD reading plan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BREAD",
  },
  openGraph: {
    title: "BREAD 2026",
    description: "Yesterday, today, and tomorrow's scripture readings from the Reality SF BREAD reading plan.",
    url: "https://breadreadings.com",
    siteName: "BREAD 2026",
    images: [
      {
        url: "https://breadreadings.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Library interior with bookshelves",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BREAD 2026",
    description: "Yesterday, today, and tomorrow's scripture readings from the Reality SF BREAD reading plan.",
    images: ["https://breadreadings.com/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme === 'dark' ||
                    (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
