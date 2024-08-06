import ThemeRegistry from "@/app/components/ThemeRegistry";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppProvider from "@/app/components/Provider";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RadioView",
  description: "Admin panel for RadioView",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get("x-nonce")!;
  return (
    <html lang="en" nonce={nonce}>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <meta httpEquiv="Content-Security-Policy" content={nonce} />

      <body className={openSans.className} nonce={nonce}>
        <AppProvider>
          <ThemeRegistry
            nonce={nonce}
            options={{ key: "mui-theme", nonce: nonce }}
          >
            {children}
          </ThemeRegistry>
        </AppProvider>
      </body>
      <Script {...{ nonce }} />
    </html>
  );
}
