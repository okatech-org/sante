import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSuggestions } from "@/utils/cartography-filters";
import { CartographyProvider } from "@/types/cartography";

interface CartographySearchBarProps {
  onSearch: (text: string) => void;
  onGeolocate: () => void;
  providers: CartographyProvider[];
}

export default function CartographySearchBar({ 
  onSearch, 
  onGeolocate,
  providers 
}: CartographySearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ type: string; value: string; icon: string }>>([]);

  useEffect(() => {
    const results = getSuggestions(query, providers);
    setSuggestions(results);
  }, [query, providers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    onSearch(value);
  };

  const handleSuggestionClick = (value: string) => {
    setQuery(value);
    setShowSuggestions(false);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un prestataire, spécialité, ville..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-4"
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.value)}
                  className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 transition-colors"
                >
                  <span>{suggestion.icon}</span>
                  <span className="text-sm">{suggestion.value}</span>
                  <span className="text-xs text-muted-foreground ml-auto capitalize">
                    {suggestion.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={onGeolocate}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Ma position</span>
        </Button>
      </form>
    </div>
  );
}
