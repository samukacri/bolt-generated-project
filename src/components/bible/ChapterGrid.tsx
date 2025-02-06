import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BibleChapter } from "@/services/bibleApi";

interface ChapterGridProps {
  chapters: BibleChapter[];
  onSelectChapter: (chapter: BibleChapter) => void;
}

export const ChapterGrid = ({ chapters, onSelectChapter }: ChapterGridProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {chapters?.map((chapter) => (
          <Card
            key={chapter.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors duration-200 shadow-sm"
            onClick={() => onSelectChapter(chapter)}
          >
            <CardContent className="p-4 flex items-center justify-center aspect-square">
              <span className="text-lg font-medium">{chapter.number}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
