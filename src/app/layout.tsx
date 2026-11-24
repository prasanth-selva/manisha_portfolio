import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Manisha Nithya — Portfolio", template: "%s — Manisha Nithya" },
  description: "Portfolio of Manisha Nithya, a second-year B.E. CSE & Cybersecurity student at KGISL Institute of Technology.",
  authors: [{ name: "Manisha Nithya" }],
  creator: "Manisha Nithya",
  openGraph: { type: "website", siteName: "Manisha Nithya — Portfolio", title: "Manisha Nithya — Portfolio", description: "Portfolio of Manisha Nithya, a second-year B.E. CSE & Cybersecurity student at KGISL Institute of Technology." },
  twitter: { card: "summary_large_image", title: "Manisha Nithya — Portfolio", description: "Portfolio of Manisha Nithya, a second-year B.E. CSE & Cybersecurity student at KGISL Institute of Technology." },
  robots: { index: true, follow: true },
  icons: { icon: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#050505"/><path d="M15 49V15h6l11 17 11-17h6v34h-7V27L32 40 22 27v22z" fill="#D9B780"/></svg>') },
};

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="min-h-screen bg-base font-sans">{children}</body></html>;
}
