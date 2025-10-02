import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onUseLocation: () => void;
  onToggleFilters: () => void;
}

const suggestions = [
  "Cardiologue à Libreville",
  "Pharmacie de garde à Port-Gentil",
  "Laboratoire proche de moi",
  "Dr KOMBILA Pierre",
  "Gynécologue Libreville",
  "Hôpital Franceville"
];

export const SearchBar = ({ onSearch, onUseLocation, onToggleFilters }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Que recherchez-vous ?"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => query.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 h-12 text-base"
            />
            
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {suggestions
                  .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
                    >
                      <Search className="inline h-4 w-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onUseLocation}
              className="h-12 px-4"
            >
              <MapPin className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Ma position</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onToggleFilters}
              className="h-12 px-4 md:hidden"
            >
              Filtres
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
