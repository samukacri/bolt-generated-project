import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";

const Favorites = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto pb-20">
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">{t('myFavorites')}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('favoriteVerses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('versesWillAppear')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('favoritePrayers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('prayersWillAppear')}
            </p>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Favorites;
