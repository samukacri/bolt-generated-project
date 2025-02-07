import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
//import { useQuery } from "@tanstack/react-query"; // Removed react-query import
import useFetch from "@/hooks/useFetch"; // Imported custom hook

const Prayers = () => {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [prayers, setPrayers] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPrayers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/prayers?select=*,prayer_categories(*)`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            },
          },
          true
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPrayers(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrayers();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) return setFavorites([]);

        const { data, error } = await supabase
          .from("user_prayer_favorites")
          .select("prayer_id")
          .eq("user_id", session.session.user.id);

        if (error) {
          console.error("Error fetching favorites:", error);
          throw error;
        }

        setFavorites(data.map(fav => fav.prayer_id));
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      } 
    };

    fetchFavorites();
  }, []);


  const toggleFavorite = async (prayerId: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        title: t("Error"),
        description: t("You must be logged in to add favorites"),
        variant: "destructive",
      });
      return;
    }

    const isFavorite = favorites?.includes(prayerId);
    
    if (isFavorite) {
      const { error } = await supabase
        .from("user_prayer_favorites")
        .delete()
        .eq("prayer_id", prayerId)
        .eq("user_id", session.session.user.id);

      if (error) {
        toast({
          title: t("Error"),
          description: t("Failed to remove from favorites"),
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("user_prayer_favorites")
        .insert({ 
          prayer_id: prayerId,
          user_id: session.session.user.id
        });

      if (error) {
        toast({
          title: t("Error"),
          description: t("Failed to add to favorites"),
          variant: "destructive",
        });
        return;
      }
    }

    setIsFavorite(!isFavorite);
    toast({
      title: t("Success"),
      description: isFavorite ? t("Removed from favorites") : t("Added to favorites"),
    });
  };

  const getLocalizedTitle = (prayer: any) => {
    switch (currentLanguage) {
      case "pt-BR":
        return prayer.title_pt;
      case "es":
        return prayer.title_es;
      default:
        return prayer.title;
    }
  };

  const getLocalizedCategoryName = (category: any) => {
    switch (currentLanguage) {
      case "pt-BR":
        return category.name_pt;
      case "es":
        return category.name_es;
      default:
        return category.name;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-lg text-red-500">{t("Error loading prayers")}</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-20">
      <header className="bg-primary/90 text-white p-8 rounded-b-3xl shadow-lg">
        <h1 className="text-heading-large font-bold text-center">{t("Prayers")}</h1>
        <p className="text-sm text-center mt-2 text-primary-foreground/80">
          {t("Find peace in prayer")}
        </p>
      </header>

      <main className="container mx-auto px-4 -mt-6 space-y-6">
        {prayers?.map((prayer) => (
          <Card key={prayer.id} className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 border-none shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-lg">
                {getLocalizedTitle(prayer)}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(prayer.id)}
                className="text-primary hover:text-primary/80"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites?.includes(prayer.id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {prayer.prayer_categories && getLocalizedCategoryName(prayer.prayer_categories)}
              </p>
              <Link to={`/prayers/${prayer.id}`}>
                <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                  {t("Read more")} →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Prayers;
