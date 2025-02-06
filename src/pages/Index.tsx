import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, Heart, Bookmark, Scroll } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { BibleSearch } from "@/components/BibleSearch";
import { DailyVerse } from "@/components/DailyVerse";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-4xl font-bold text-center mb-8">{t('appName')}</h1>
      
      <div className="space-y-8">
        <DailyVerse />
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('searchBible')}</h2>
          <BibleSearch />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/bible">
            <Card className="hover:bg-primary/5 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  {t('bible')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('readAndStudy')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/prayers">
            <Card className="hover:bg-primary/5 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="h-5 w-5" />
                  {t('prayers')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('findPeace')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/favorites">
            <Card className="hover:bg-primary/5 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {t('favorites')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('accessFavorites')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/last-reading">
            <Card className="hover:bg-primary/5 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  {t('continueReading')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('continueReadingDescription')}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;
