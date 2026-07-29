import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { DevIndicatorHider } from "@/components/DevIndicatorHider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
  Display serif for one-word emphasis inside headlines: the hero's
  emphasized word and one keyword per section title. Never used for body
  text or full headings, see Section 4.1 of the taste skill.
*/
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: "700",
  style: "italic",
});

const title = "Amazon Hydro Sense | River monitoring for the Amazon";
const description =
  "Sensor buoys and AI-driven analysis detecting heavy-metal contamination in rivers around Carajás, Pará. Continuous data for mining operators, regulators and communities.";

export const metadata: Metadata = {
  metadataBase: new URL("https://amazon-hydro-sense.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Amazon Hydro Sense",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip bg-background text-ink">
        <DevIndicatorHider />
        {children}
      </body>
    </html>
  );
}
