"use client";

import { useState } from "react";
import { User } from "lucide-react";
import AccountDropdown from "./accountdropdown";
import SearchInput from "./SearchInput";
import theme from "@/styles/theme";
import Link from "next/link"; // Import Link from next/link

export default function TopBarMain() {
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const toggleAccountMenu = () => {
        setAccountMenuOpen((prev) => !prev);
    };

    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-20"
                style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    height: '100px', // Increased height
                    borderBottom: `1px solid ${theme.colors.border}`, // Bottom border
                }}
        >
            <div className="flex items-center">
                <Link href="/"> {/* Wrap logo in Link */}
                <div className="text-4xl">
                <span style={{ fontFamily: 'suit, sans-serif !important' }}>O8_KNOT</span>
                </div>
                </Link>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2" style={{ width: '60%' }}> {/* Increased width */}
                <SearchInput />
            </div>
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
