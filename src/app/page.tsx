"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/topbarmain";
import { Input } from "@/components/ui/input";
import { Search, Clock, X, BrainCircuit, IdCard } from "lucide-react";
import theme from "@/styles/theme";

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState<string[]>(["최근 검색 1", "검색 제안 2"]);
    const [customSuggestions, setCustomSuggestions] = useState<string[]>([]);

    const [isToggled, setIsToggled] = useState(false); // 첫 번째 토글 상태
    const [isToggled2, setIsToggled2] = useState(false); // 두 번째 토글 상태
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const suggestions = ["검색 제안 1", "검색 제안 2", "검색 제안 3"];

    const router = useRouter();

    const handleSidebarToggle = () => {
        setSidebarOpen((prev) => !prev);
    };

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
        <main
            className="relative min-h-screen flex flex-col items-start justify-center p-4 pt-16 font-pretendard"
            style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
            }}
        >
            <TopBar />

            <div className="w-full max-w-3xl mx-auto text-left space-y-4 -mt-10">
                <div className="space-y-6">
                    <div className="h-16 flex items-center justify-center text-4xl font-suit">
                        <span style={{ fontFamily: 'suit, sans-serif !important' }}>O8_KNOT</span>
                    </div>
                </div>
                <div className="relative w-full space-y-2"> 
                    <form onSubmit={handleSearchSubmit} className="space-y-0">
                        <Input
                            type="input"
                            placeholder="Search anything"
                            className="w-full bg-transparent text-white h-12 pr-12 rounded-full font-pretendard pl-10 focus:outline-none focus:ring-0"
                            style={{
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

                {/* 버튼들 */}
                <div className="flex gap-4">
                    {/* 첫 번째 토글 버튼 */}
                    <button
                        className={`w-24 px-4 py-2 text-sm rounded-full transition duration-200 flex items-center justify-center space-x-2`}
                        style={{
                            backgroundColor: isToggled ? theme.colors.primary : theme.colors.hover,
                            color: isToggled ? theme.colors.text : theme.colors.subText, // 텍스트 색상만 변경
                            border: `2px solid ${isToggled ? theme.colors.primary : theme.colors.hover}`, // 윤곽선 추가
                        }}
                        onClick={() => setIsToggled((prev) => !prev)}
                    >
                        <BrainCircuit className="w-4 h-4" /> {/* 아이콘 변경 */}
                        <span>이성</span> {/* 텍스트는 그대로 유지 */}
                    </button>

                    {/* 두 번째 토글 버튼 */}
                    <button
                        className={`w-24 px-4 py-2 text-sm rounded-full transition duration-200 flex items-center justify-center space-x-2`}
                        style={{
                            backgroundColor: isToggled2 ? theme.colors.primary : theme.colors.hover,
                            color: isToggled2 ? theme.colors.text : theme.colors.subText, // 텍스트 색상만 변경
                            border: `2px solid ${isToggled2 ? theme.colors.primary : theme.colors.hover}`, // 윤곽선 추가
                        }}
                        onClick={() => setIsToggled2((prev) => !prev)}
                    >
                        <IdCard className="w-4 h-4" /> {/* 아이콘 변경 */}
                        <span>개인화</span> {/* 텍스트는 그대로 유지 */}
                    </button>
                </div>
            </div>
        </main>
    );
}
