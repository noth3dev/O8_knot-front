"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/topbarsearch";
import theme from "@/styles/theme";

interface SearchResult {
  link: string;
  title: string;
  snippet: string;
  siteName?: string;
  favicon?: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [googleResults, setGoogleResults] = useState<SearchResult[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setQuery(queryParam);
      handleSearch(queryParam, 1);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string, page: number) => {
    setLoading(true);
    setStatus("Searching...");
    setError(null);
    const socket = new WebSocket("ws://localhost:8000/ws/search");

    socket.onopen = () => {
      socket.send(JSON.stringify({ query: searchQuery, page }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) setStatus(data.status);
      if (data.googleResults) {
        const resultsWithIcons = data.googleResults.map((result: SearchResult) => {
          const url = new URL(result.link);
          return {
            ...result,
            siteName: url.hostname,
            favicon: `https://www.google.com/s2/favicons?sz=64&domain=${url.hostname}`,
          };
        });
        setGoogleResults(resultsWithIcons);
      }
      if (data.result) {
        setAiResult(data.result);
        setSources(data.sources);
      }
      if (data.detail) setError(data.detail);
    
      // When the status is "Summarizing results...", ensure that results show after the progress bar hits 100%
      if (data.status === "Summarizing results...") {
        setLoading(false); // Stop loading after summarization is complete
      }
    };
    

    socket.onerror = () => {
      setError("An unexpected error occurred.");
      setStatus("Search failed.");
      setLoading(false);
    };
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    handleSearch(query, pageNumber);
  };

  const paginatedResults = googleResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const getProgress = () => {
    switch (status) {
      case "Extracting keywords...":
        return 20;
      case "Generating search query...":
        return 40;
      case "Performing search...":
        return 60;
      case "Evaluating and filtering results...":
        return 80;
      case "Summarizing results...":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 pt-24" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <TopBar />
      <div className="w-full flex mt-6 gap-6">
        <div className="flex-1 space-y-6" style={{ flexBasis: '70%', wordWrap: 'break-word' }}>
          {loading && <p className="text-center text-gray-400">{status}</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {googleResults.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <ul className="space-y-6">
                {paginatedResults.map((result, index) => (
                  <li key={index} className="border-b border-gray-700 pb-6 last:border-none">
                    {/* 사이트 정보 추가 */}
                    <div className="flex items-center space-x-3 mb-2">
                      {result.favicon && <img src={result.favicon} alt="Favicon" className="w-5 h-5 rounded-full" />}
                      <span className="text-gray-400 text-sm">{result.siteName}</span>
                    </div>
                    <a href={result.link} target="_blank" rel="noopener noreferrer" className="block">
                      <h3 className="text-blue-400 font-semibold text-lg hover:underline">{result.title}</h3>
                      <p className="text-gray-400 text-md mt-2">{result.snippet}</p>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-6">
                {Array.from({ length: 3 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4 border-l border-gray-700 pl-6 sticky top-24 self-start w-20" style={{ flexBasis: '30%', wordWrap: 'break-word' }}>
          <h2 className="text-xl font-semibold">AI Answer</h2>
          {loading && (
            <div className="flex flex-col items-center">
              <p className="text-gray-300 text-md leading-relaxed">{status}</p>
              <div className="loader mt-4"></div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${getProgress()}%` }}></div>
              </div>
            </div>
          )}
          {aiResult && <p className="text-gray-300 text-md leading-relaxed" dangerouslySetInnerHTML={{ __html: aiResult }}></p>}
          {sources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Sources</h3>
              <div className="flex space-x-4 overflow-x-auto no-scrollbar mt-3">
                {sources.map((source, index) => (
                  <div key={index} className="flex-none w-30 h-30 p-2 border rounded-lg bg-gray-800 flex flex-col items-center justify-center">
                    <img src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(source).hostname}`} alt="Favicon" className="w-10 h-10 rounded-full mb-2" />
                    <a href={source} target="_blank" rel="noopener noreferrer" className="hover:underline text-center text-blue-400">
                      {new URL(source).hostname}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </main>
  );
};

export default SearchPage;
