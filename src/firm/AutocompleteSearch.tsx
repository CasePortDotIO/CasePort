import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, TrendingUp } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "recent" | "popular" | "case";
  icon: React.ReactNode;
}

interface AutocompleteSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: "1",
    text: "Auto accidents in Houston",
    type: "popular",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "2",
    text: "High-value cases",
    type: "popular",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "3",
    text: "Outcome pending",
    type: "recent",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: "4",
    text: "CP-2024-001",
    type: "case",
    icon: <Search className="w-4 h-4" />,
  },
];

export function AutocompleteSearch({
  onSearch,
  placeholder = "Search cases...",
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = MOCK_SUGGESTIONS.filter((s) =>
        s.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (query) {
          onSearch(query);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "popular":
        return "text-chart-1";
      case "recent":
        return "text-chart-3";
      case "case":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setShowSuggestions(true)}
          className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
        />
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-muted rounded-lg shadow-lg z-50"
          >
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    idx === selectedIndex
                      ? "bg-primary/10 text-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={getTypeColor(suggestion.type)}>
                    {suggestion.icon}
                  </span>
                  <span className="text-sm flex-1">{suggestion.text}</span>
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {suggestion.type}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
