import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ToastListener } from "@/components/toast-listener";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "The Web Store",
	description: "Web store demo using Next.js and json-server",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scrollbar-gutter-stable overflow-auto`}
		>
			<body className="bg-neutral-100">
				<Toaster position="bottom-right" />
				{/* <ToastListener /> */}
				{children}
			</body>
		</html>
	);
}
