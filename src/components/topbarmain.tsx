// components/topbar.tsx
"use client";

import { useState } from "react";
import { User } from "lucide-react";
import AccountDropdown from "./accountdropdown";
import theme from "@/styles/theme";

export default function TopBar() {
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const toggleAccountMenu = () => {
        setAccountMenuOpen((prev) => !prev);
    };

    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-20"
                style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                }}
        >
            {/* 우측: 계정 아이콘 및 드롭다운 */}
            <div className="relative ml-auto">
                <button
                    onClick={toggleAccountMenu}
                    className="text-white focus:outline-none"
                    aria-label="Toggle Account Menu"
                >
                    <User className="w-6 h-6" />
                </button>
                <AccountDropdown isOpen={accountMenuOpen} />
            </div>
        </header>
    );
}
