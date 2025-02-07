import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
//import { useQuery } from "@tanstack/react-query"; // REMOVE
import { searchVerses } from "@/services/bibleApi";
import useFetch from "@/hooks/useFetch"; // ADD

export function BibleSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults, isLoading, error } = useFetch( // Use useFetch
    searchQuery
      ? `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_verses?select=*&text=ilike.%${searchQuery}%`
      : null, // Only fetch if there's a query
    {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
      },
    },
    !!searchQuery // Enable only when searchQuery is not empty
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // No need to refetch here, as useFetch will handle it automatically, based on the URL change
    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search the Bible..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading || isSearching}>
          {isLoading || isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {searchResults?.data && (
        <div className="space-y-4">
          {searchResults.data.map((verse: any) => (
            <Card key={verse.id}>
              <CardContent className="pt-4">
                <p className="font-semibold">{verse.reference}</p>
                <p className="text-sm text-muted-foreground">{verse.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
