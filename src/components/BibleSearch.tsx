import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchVerses } from "@/services/bibleApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";

export function BibleSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ["bible-search", searchQuery],
    queryFn: () => searchVerses(searchQuery),
    enabled: false,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    await refetch();
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

      {searchResults?.verses && (
        <div className="space-y-4">
          {searchResults.verses.map((verse) => (
            <Card key={verse.id}>
              <CardContent className="pt-4">
                <p className="font-semibold">{verse.reference}</p>
                <p className="text-sm text-muted-foreground">{verse.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
