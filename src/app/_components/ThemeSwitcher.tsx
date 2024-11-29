"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="cursor-pointer text-sm">
            {theme === "dark" ? "다크모드 끄기" : "다크모드 켜기"}
        </div>
    );
}
