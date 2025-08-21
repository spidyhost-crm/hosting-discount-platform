import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hosting Discount - Compare Web Hosting Providers & Exclusive Deals",
  description: "Find the best web hosting deals and compare top hosting providers. Get exclusive discounts on shared hosting, VPS, dedicated servers, and more.",
  icons: {
    icon: "data:image/svg+xml,%3csvg width='32' height='32' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='favicon-gradient' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%239B99FE'/%3e%3cstop offset='100%25' stop-color='%232BC8B7'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath d='M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z' fill='url(%23favicon-gradient)'/%3e%3c/svg%3e",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
