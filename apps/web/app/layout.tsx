

import "./globals.css";
import { usePathname } from "next/navigation";

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "home" },
    { name: "Clients", href: "/clients", icon: "users" },
    { name: "Leads", href: "/leads", icon: "user-plus" },
    { name: "Quotes", href: "/quotes", icon: "file-text" },
  ];
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/images/favicon.svg" type="image/x-icon" />
        <link href="/assets/css/style.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        {/* Add other font and icon CSS links as needed */}
      </head>
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#1a2232]">
        {/* Sidebar */}
        <nav className="fixed left-0 top-0 h-screen w-64 bg-[#232a3b] dark:bg-[#232a3b] shadow-lg flex flex-col z-40">
          <div className="flex items-center h-20 px-6 border-b border-gray-700 dark:border-gray-800">
            <a href="/dashboard">
              <img className="w-[130px]" src="/assets/images/logo-white.svg" alt="Nexus ERP" />
            </a>
          </div>
          <ul className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                    ${pathname === item.href
                      ? "bg-[#1a2232] text-white dark:bg-[#1a2232] dark:text-white shadow"
                      : "text-gray-300 dark:text-gray-400 hover:bg-[#1a2232] hover:text-white"}
                  `}
                >
                  <i className={`feather feather-${item.icon} text-lg`} aria-hidden="true"></i>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Main Content */}
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
