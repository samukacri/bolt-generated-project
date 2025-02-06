import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBooks, getChapters, getVerses, setBibleVersion, getBibleVersion } from "@/services/bibleApi";
import { BibleSearch } from "@/components/BibleSearch";
import { VerseList } from "@/components/bible/VerseList";
import { BottomNav } from "@/components/BottomNav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BIBLE_VERSIONS } from "@/config/bibleVersions";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

const Bible = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(
    searchParams.get("book")
  );
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | null>(
    searchParams.get("chapter") ? parseInt(searchParams.get("chapter")!) : null
  );
  const [bibleVersion, setLocalBibleVersion] = useState(getBibleVersion());

  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);

  // Fetch Bible books
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: ['bible-books', bibleVersion],
    queryFn: getBooks,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Fetch chapters when a book is selected
  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['bible-chapters', selectedBookId, bibleVersion],
    queryFn: () => selectedBookId ? getChapters(selectedBookId) : Promise.resolve([]),
    enabled: !!selectedBookId,
  });

    // Fetch verses when a chapter is selected
  const { data: verses, isLoading: isLoadingVerses } = useQuery({
    queryKey: ['bible-verses', selectedChapter?.id, bibleVersion],
    queryFn: () => selectedChapter ? getVerses(selectedChapter.id) : Promise.resolve([]),
    enabled: !!selectedChapter
  });

  useEffect(() => {
    if (books && selectedBookId) {
      const book = books.find((b: any) => b.id === selectedBookId);
      setSelectedBook(book);
    }
  }, [books, selectedBookId]);

  useEffect(() => {
    if (chapters && selectedChapterNumber) {
      const chapter = chapters.find((c: any) => c.number === String(selectedChapterNumber));
      setSelectedChapter(chapter);
    }
  }, [chapters, selectedChapterNumber]);


  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterNumber(null); // Reset chapter
    setSelectedChapter(null); // Reset chapter object
    navigate(`/bible?book=${bookId}&chapter=1`); // Navigate to chapter 1
  };

  const handleChapterChange = (chapterNumber: string) => {
    setSelectedChapterNumber(parseInt(chapterNumber));
     if (selectedBookId) {
        const chapter = chapters.find((c:any) => c.number === chapterNumber)
        setSelectedChapter(chapter)
        navigate(`/bible?book=${selectedBookId}&chapter=${chapterNumber}`);
    }
  };

  const handleVersionChange = (version: string) => {
    setLocalBibleVersion(version);
    setBibleVersion(version);
    // Limpar seleções ao mudar a versão
    setSelectedBookId(null);
    setSelectedChapterNumber(null);
    navigate(`/bible`);
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="container mx-auto pb-20 bg-background text-foreground min-h-screen">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-start gap-4 mb-6">
          <Select onValueChange={handleVersionChange} value={bibleVersion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectBibleVersion')} />
            </SelectTrigger>
            <SelectContent>
              {BIBLE_VERSIONS.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {version.abbreviation} - {version.name} ({version.language})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleBookChange} value={selectedBookId ?? undefined}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectBook')} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingBooks ? (
                renderLoader()
              ) : (
                books?.map((book: any) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select onValueChange={handleChapterChange} value={selectedChapterNumber ? String(selectedChapterNumber) : undefined}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectChapter')} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingChapters ? (
                renderLoader()
              ) : (
                chapters?.map((chapter: any) => (
                  <SelectItem key={chapter.id} value={chapter.number}>
                    {chapter.number}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <BibleSearch />

        {isLoadingVerses ? (
          renderLoader()
        ) : (
          selectedChapter && (
            <VerseList
              chapterId={selectedChapter.id}
              book={selectedBook?.name}
              chapter={parseInt(selectedChapter.number)}
              verses={verses || []}
            />
          )
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Bible;
