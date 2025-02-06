import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BibleVerse, getChapterContent, getVerses, saveHighlight, deleteHighlight, getHighlights } from "@/services/bibleApi";
import { Loader2, List, BookOpen, Share2, Trash2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import BibleNarrator from "./BibleNarrator";
import { useToast } from "@/components/ui/use-toast";
import { Share } from "@capacitor/share";
import type { Highlight, HighlightInsert } from "@/types";

interface VerseListProps {
  chapterId: string;
  book?: string;
  chapter?: number;
}

export const VerseList = ({ chapterId, book, chapter }: VerseListProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [chapterContent, setChapterContent] = useState<string>("");
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'text' | 'verses'>('text');
  const [selectedText, setSelectedText] = useState<{ text: string; verseNumber: number } | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Função para buscar versículos
  const fetchChapterContent = async () => {
    try {
      setIsLoading(true);
      console.log('Buscando versículos para:', chapterId);
      console.log('Usuário atual:', user);
      console.log('Livro:', book);
      console.log('Capítulo:', chapter);
      
      // Buscar versículos
      const versesData = await getVerses(chapterId);
      console.log('Versículos retornados pela API:', versesData);
      
      if (!versesData || !Array.isArray(versesData)) {
        throw new Error('Formato de resposta inválido');
      }

      console.log('Versículos processados:', versesData);
      setVerses(versesData);

      // Buscar conteúdo do capítulo
      const content = await getChapterContent(chapterId);
      if (content && typeof content === 'string') {
        setChapterContent(content);
      }

      // Buscar destaques do usuário
      if (user && book && chapter) {
        console.log('Buscando highlights para:', {
          userId: user.id,
          book,
          chapter
        });
        const userHighlights = await getHighlights(user.id, book, chapter);
        console.log('Highlights encontrados:', userHighlights);
        setHighlights(userHighlights);
      } else {
        console.warn('Não foi possível buscar highlights:', {
          user: !!user,
          book: !!book,
          chapter: !!chapter
        });
      }
    } catch (error) {
      console.error('Erro ao buscar versículos:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar versículos. Tente novamente.',
        variant: 'destructive'
      });
      // Garantir que verses seja um array vazio em caso de erro
      setVerses([]);
      setChapterContent("");
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para carregar versículos
  useEffect(() => {
    if (chapterId) {
      console.log('Iniciando busca de versículos para capítulo:', chapterId);
      fetchChapterContent();
    }
  }, [chapterId, book, chapter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle text selection
  const handleTextSelect = (event: React.MouseEvent, verse: BibleVerse) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      const verseNumber = parseInt(verse.reference.split(':')[1]);
      setSelectedText({ text: selection, verseNumber });
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      }
    }
  };

  const handleHighlight = async (color: string) => {
    if (!user || !selectedText || !book || !chapter) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o destaque. Verifique se está logado.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const newHighlight = await saveHighlight({
        user_id: user.id,
        book,
        chapter,
        verse: selectedText.verseNumber,
        highlighted_text: selectedText.text,
        color,
        is_favorite: false
      });
      setHighlights([...highlights, newHighlight]);
      setSelectedText(null);
      toast({
        title: 'Destaque criado',
        description: 'Versículo destacado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao salvar destaque:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o destaque',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteHighlight = async (highlightId: string) => {
    try {
      await deleteHighlight(highlightId);
      setHighlights(highlights.filter(h => h.id !== highlightId));
      toast({
        title: 'Destaque removido',
        description: 'O destaque foi excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover destaque:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o destaque',
        variant: 'destructive'
      });
    }
  };

  const handleShareHighlight = async (highlight: Highlight) => {
    try {
      await Share.share({
        title: 'Destaque Bíblico',
        text: `${highlight.highlighted_text}\n\n${highlight.book} ${highlight.chapter}:${highlight.verse}`,
        url: '',
        dialogTitle: 'Compartilhar destaque'
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível compartilhar o destaque',
        variant: 'destructive'
      });
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'text' ? 'verses' : 'text');
  };

  return (
    <div ref={containerRef}>
      <div className="mb-4">
        <BibleNarrator chapterContent={chapterContent} verses={verses} />
      </div>

      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleViewMode}
            title={viewMode === 'text' ? t('showVerses') : t('showFullText')}
          >
            {viewMode === 'text' ? <List className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-250px)] rounded-md border p-4">
          <div className="space-y-4">
            {viewMode === 'verses' ? (
              verses.map((verse) => {
                const highlight = highlights.find(h => 
                  h.verse === parseInt(verse.reference.split(':')[1])
                );
                
                return (
                  <Card 
                    key={verse.id} 
                    className={`shadow-sm ${highlight ? `border-2 border-${highlight.color}` : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <span className="font-semibold text-primary min-w-[2rem]">
                          {verse.reference.split(':')[1]}
                        </span>
                        <p 
                          className="text-foreground"
                          onMouseUp={(e) => handleTextSelect(e, verse)}
                        >
                          {verse.text}
                        </p>
                      </div>
                      {highlight && (
                        <div className="mt-2 flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleShareHighlight(highlight)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteHighlight(highlight.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {chapterContent}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {selectedText && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <div className="bg-background border rounded-lg p-2 flex space-x-2 shadow-lg">
            {['yellow', 'green', 'blue', 'red'].map((color) => (
              <Button 
                key={color} 
                variant="outline" 
                size="icon" 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => handleHighlight(color)}
              />
            ))}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedText(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
