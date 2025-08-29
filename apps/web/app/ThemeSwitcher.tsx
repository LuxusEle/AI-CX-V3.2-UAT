"use client";
import React from "react";

export default function ThemeSwitcher() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      className="fixed top-4 right-4 z-50 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded shadow"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
