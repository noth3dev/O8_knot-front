// components/accountdropdown.tsx
"use client";

import React from "react";
import theme from "@/styles/theme"; // 테마 가져오기

interface AccountDropdownProps {
    isOpen: boolean;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen }) => {
    return (
        <div
            className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg transform transition-all duration-300 ease-in-out
            ${isOpen ? "translate-x-0 opacity-100 visible" : "translate-x-16 opacity-0 invisible"}
        `}
            style={{
                backgroundColor: theme.colors.subBackground,
            }}
        >
            <ul className="py-2">
                <li
                    className="px-4 py-2 cursor-pointer"
                    style={{
                        color: theme.colors.text,
                        backgroundColor: theme.colors.subBackground,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.subBackground)}
                >
                    프로필
                </li>
                <li
                    className="px-4 py-2 cursor-pointer"
                    style={{
                        color: theme.colors.text,
                        backgroundColor: theme.colors.subBackground,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.subBackground)}
                >
                    설정
                </li>
                <li
                    className="px-4 py-2 cursor-pointer"
                    style={{
                        color: theme.colors.text,
                        backgroundColor: theme.colors.subBackground,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.subBackground)}
                >
                    로그아웃
                </li>
            </ul>
        </div>
    );
};

export default AccountDropdown;
