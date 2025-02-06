import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Prayers = () => {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();

  const { data: prayers, isLoading } = useQuery({
    queryKey: ["prayers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prayers")
        .select(`
          id,
          title,
          title_pt,
          title_es,
          content,
          content_pt,
          content_es,
          category_id,
          is_featured,
          prayer_categories (
            name,
            name_pt,
            name_es,
            icon
          )
        `);

      if (error) {
        console.error("Error fetching prayers:", error);
        throw error;
      }

      return data;
    },
  });

  const { data: favorites } = useQuery({
    queryKey: ["prayer-favorites"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return [];

      const { data, error } = await supabase
        .from("user_prayer_favorites")
        .select("prayer_id")
        .eq("user_id", session.session.user.id);

      if (error) {
        console.error("Error fetching favorites:", error);
        throw error;
      }

      return data.map(fav => fav.prayer_id);
    },
  });

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
