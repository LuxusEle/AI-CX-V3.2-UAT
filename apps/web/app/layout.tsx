import "./globals.css";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

export const metadata = {
  title: "Nexus ERP",
  description: "Professional UI",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/images/favicon.svg" type="image/x-icon" />
        <link href="/assets/css/style.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#1a2232]">
        <Sidebar />
        <main className="ml-64 pt-10 px-8">
          <div className="flex justify-end mb-6">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded shadow transition-colors duration-200">
              <i className="feather feather-plus mr-2"></i>
              New Item
            </button>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
