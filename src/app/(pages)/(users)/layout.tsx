import type { Metadata } from "next";
import { Inter, Montserrat, Roboto, Roboto_Mono } from "next/font/google";
import "../../globals.css";
import Sidebar from "@/app/components/sidebar/Sidebar";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${roboto.variable} ${inter.variable}`}
      >
        <div className=" ">
        <div className="fixed left-0 top-0 h-full max-sm:h-24  ">
            <Sidebar />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
