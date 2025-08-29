"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "home" },
  { name: "Clients", href: "/clients", icon: "users" },
  { name: "Leads", href: "/leads", icon: "user-plus" },
  { name: "Quotes", href: "/quotes", icon: "file-text" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-[#232a3b] dark:bg-[#232a3b] shadow-lg flex flex-col z-40">
      <div className="flex items-center h-20 px-6 border-b border-gray-700 dark:border-gray-800">
        <Link href="/dashboard">
          <img className="w-[130px]" src="/assets/images/logo-white.svg" alt="Nexus ERP" />
        </Link>
      </div>
      <ul className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} legacyBehavior>
              <a
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${pathname === item.href
                    ? "bg-[#1a2232] text-white dark:bg-[#1a2232] dark:text-white shadow"
                    : "text-gray-300 dark:text-gray-400 hover:bg-[#1a2232] hover:text-white"}
                `}
              >
                <i className={`feather feather-${item.icon} text-lg`} aria-hidden="true"></i>
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
