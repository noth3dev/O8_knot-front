"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Clock, X, BrainCircuit } from "lucide-react";
import { Input } from "@/components/ui/input";
import theme from "@/styles/theme";
import { useRouter } from "next/navigation";
import React from 'react';

interface SearchInputProps {
    style?: React.CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = ({ style }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>(["최근 검색 1", "검색 제안 2"]);
    const [customSuggestions, setCustomSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const suggestions = ["검색 제안 1", "검색 제안 2", "검색 제안 3"];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setDropdownOpen(query.length > 0);
        setFocusedIndex(-1);

        const updatedSuggestions = [query, ...recentSearches, ...suggestions];
        const uniqueSuggestions = Array.from(new Set(updatedSuggestions));

        setCustomSuggestions(uniqueSuggestions);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Tab" && dropdownOpen) {
            e.preventDefault();

            if (focusedIndex < customSuggestions.length - 1) {
                setFocusedIndex(focusedIndex + 1);
            } else {
                setFocusedIndex(0);
            }

            setSearchQuery(customSuggestions[focusedIndex + 1] || customSuggestions[0]);
        }
    };

    const handleSuggestionClick = (index: number) => {
        const selectedSuggestion = customSuggestions[index];
        setSearchQuery(selectedSuggestion);
        setDropdownOpen(false);
        setFocusedIndex(-1);

        if (!recentSearches.includes(selectedSuggestion)) {
            setRecentSearches([...recentSearches, selectedSuggestion]);
        }

        router.push(`/search?query=${selectedSuggestion}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?query=${searchQuery}`);
    };

    const handleFocus = () => {
        setDropdownOpen(true);
    };

    const handleSearchIconClick = () => {
        if (searchQuery.trim()) {
            router.push(`/search?query=${searchQuery}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                inputRef.current && !inputRef.current.contains(e.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full max-w-lg mx-auto space-y-2">
            <form onSubmit={handleSearchSubmit} className="space-y-0">
                <Input
                    type="input"
                    placeholder="Search anything"
                    className="w-full bg-transparent text-white h-12 pr-12 rounded-full font-pretendard pl-10 focus:outline-none focus:ring-0"
                    style={{
                        ...style,
                        boxShadow: dropdownOpen ? `0 0 5px 5px rgba(255,255,255,0.1)` : "none",
                        backgroundColor: "transparent", // 배경 색상도 추가 가능
                        transition: "box-shadow 0.2s ease-in-out",
                    }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    ref={inputRef}
                    
                />

                <Search
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer 
                        ${searchQuery.trim() ? "text-white" : "text-white/60 pointer-events-none"}`}
                    onClick={handleSearchIconClick}
                />
            </form>

            {dropdownOpen && (
                <div
                    className="overflow-hidden absolute w-full mt-2 bg-transparent text-white rounded-lg shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out opacity-100 transform translate-y-0"
                    ref={dropdownRef}
                >
                    <ul>
                        {customSuggestions.map((suggestion, index) => {
                            const isRecent = recentSearches.includes(suggestion);
                            return (
                                <li
                                    key={index}
                                    className="p-3 cursor-pointer transition-colors duration-200"
                                    onClick={() => handleSuggestionClick(index)}
                                    style={{
                                        backgroundColor: focusedIndex === index ? "rgba(1,1,1,0.5)" : "transparent",
                                        color: focusedIndex === index
                                            ? theme.colors.text
                                            : theme.colors.subText,
                                        opacity: dropdownOpen ? 1 : 0,
                                        transform: dropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                                    }}
                                >
                                    <span className="flex items-center justify-between">
                                        <span className="flex items-center">
                                            {index === 0 ? (
                                                <BrainCircuit className="w-4 h-4 text-white/60" />
                                            ) : isRecent ? (
                                                <Clock className="w-4 h-4 text-white/60" />
                                            ) : (
                                                <Search className="w-4 h-4 text-white/60" />
                                            )}
                                            <span className="ml-2">{suggestion}</span>
                                        </span>
                                        {isRecent && (
                                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all">
                                                <X className="w-4 h-4 text-white/60" />
                                            </span>
                                        )}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchInput;
