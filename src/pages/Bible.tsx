import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBooks, getChapters, getVerses } from "@/services/bibleApi";
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
import { Loader2, Search, X } from "lucide-react";
import useFetch from "@/hooks/useFetch"; // Import custom hook
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // Import Drawer components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Import the Button component


const Bible = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(
    searchParams.get("book")
  );
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | null>(1);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any | null>(null); // Add selectedBook state
  const [searchOpen, setSearchOpen] = useState(false); // State for drawer
  const [searchText, setSearchText] = useState(""); // State for search text
  const [filteredVerses, setFilteredVerses] = useState<any[]>([]); // State for filtered verses


  // Fetch Bible books
    const { data: books, error: booksError, isLoading: isLoadingBooks } = useFetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_books?select=*`,
     {headers: {
        apikey: import.meta.env.VITE_SUPABASE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`
      }},
    true
  );


  // Fetch chapters when a book is selected
  const { data: chapters, error: chaptersError, isLoading: isLoadingChapters } = useFetch(
    selectedBookId ? `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_chapters?select=*,bible_verses(*)&book_id=eq.${selectedBookId}`: null,
    {headers: {
        apikey: import.meta.env.VITE_SUPABASE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`
      }},
    !!selectedBookId
  );

    // Fetch verses when a chapter is selected.  Use the chapter ID directly.
  const { data: verses, error: versesError, isLoading: isLoadingVerses } = useFetch(
    selectedChapter ? `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_verses?select=*&chapter_id=eq.${selectedChapter.id}` : null,
    {headers: {
        apikey: import.meta.env.VITE_SUPABASE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`
      }},
    !!selectedChapter
  );


  useEffect(() => {
    if (books && selectedBookId) {
      const book = books.find((b: any) => b.id === parseInt(selectedBookId));
      setSelectedBook(book);
      if(chapters && chapters.length > 0){
        setSelectedChapterNumber(1);
        setSelectedChapter(chapters[0]);
      }
      navigate(`/bible?book=${selectedBookId}&chapter=1`);
    }
  }, [books, selectedBookId, navigate, chapters]);


  useEffect(() => {
    if (chapters && selectedChapterNumber) {
      const chapter = chapters.find((c: any) => c.chapter_number === selectedChapterNumber);
      setSelectedChapter(chapter);
    }
  }, [chapters, selectedChapterNumber]);

    useEffect(() => {
    if (verses) {
      setFilteredVerses(verses); // Initialize filteredVerses with all verses
    }
  }, [verses]);

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterNumber(1); // Reset chapter to 1
    setSelectedChapter(null); // Reset chapter selection
    navigate(`/bible?book=${bookId}&chapter=1`);
  };

  const handleChapterChange = (chapterNumber: string) => {
    setSelectedChapterNumber(parseInt(chapterNumber));
    const chapter = chapters.find((c:any) => c.chapter_number === parseInt(chapterNumber))
    setSelectedChapter(chapter)
    navigate(`/bible?book=${selectedBookId}&chapter=${chapterNumber}`);
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  // Function to filter verses based on search text
  const filterVerses = (text: string) => {
    if (!verses) {
      return [];
    }
    if (!text) {
      return verses; // Return all verses if search text is empty
    }
    const searchTextLower = text.toLowerCase();
    return verses.filter((verse: any) =>
      verse.text.toLowerCase().includes(searchTextLower)
    );
  };

  // Update filtered verses whenever searchText changes
  useEffect(() => {
    setFilteredVerses(filterVerses(searchText));
  }, [searchText, verses]);

  return (
    <div className="container mx-auto pb-20 bg-background text-foreground min-h-screen">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-2 mt-4 ml-4">
          <div className="flex items-center gap-2">
          <Select onValueChange={handleBookChange} value={selectedBookId ?? undefined}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectBook')} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingBooks ? (
                renderLoader()
              ) : (
                books?.map((book: any) => (
                  <SelectItem key={book.id} value={String(book.id)}>
                    {book.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select onValueChange={handleChapterChange} value={String(selectedChapterNumber)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectChapter')} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingChapters ? (
                renderLoader()
              ) : (
                chapters?.filter((chapter: any) => chapter.number !== 'Intro') // Remove "Intro"
                .map((chapter: any) => (
                  <SelectItem key={chapter.id} value={String(chapter.chapter_number)}>
                    {chapter.chapter_number}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          </div>
          
          <Drawer open={searchOpen} onOpenChange={setSearchOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full sm:max-w-sm">
              <div className="p-4">
                <Input
                  type="text"
                  placeholder={t('searchBible')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="mb-4"
                />
                {/* You could add a close button here if you want */}
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} className="absolute top-2 right-2">
                    <X className="h-4 w-4" />
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>


        {isLoadingVerses ? (
          renderLoader()
        ) : (
          selectedChapter && selectedBook && (
            <VerseList
              chapterId={selectedChapter.id}
              book={selectedBook.name}
              chapter={selectedChapterNumber!}
              verses={filteredVerses || []}
            />
          )
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Bible;
