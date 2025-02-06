import { Book, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BibleBook } from "@/services/bibleApi";

interface BookListProps {
  books: BibleBook[];
  onSelectBook: (book: BibleBook) => void;
}

export const BookList = ({ books, onSelectBook }: BookListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books?.map((book) => (
          <Card
            key={book.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors duration-200 shadow-md"
            onClick={() => onSelectBook(book)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-primary" />
                  {book.name}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
