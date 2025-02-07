import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
//import { useQuery } from "@tanstack/react-query"; // Removed react-query import
import useFetch from "@/hooks/useFetch"; // Import custom useFetch hook
import { useState, useEffect } from "react"; // Import useState and useEffect


const PrayerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [prayer, setPrayer] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [prayerError, setPrayerError] = useState(null);


  useEffect(() => {
    const fetchPrayer = async () => {
      if (!id) return;

      setPrayerLoading(true);
      setPrayerError(null);

      try {
        const { data, error } = await supabase
          .from("prayers")
          .select(`
            *,
            prayer_categories (
              name,
              name_pt,
              name_es,
              icon
            )
          `)
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching prayer:", error);
          setPrayerError(error);
        } else {
          setPrayer(data);
        }
      } finally {
        setPrayerLoading(false);
      }
    };

    fetchPrayer();
  }, [id]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!id) return;

      setFavoriteLoading(true);

      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) return setIsFavorite(false);

        const { data, error } = await supabase
          .from("user_prayer_favorites")
          .select("id")
          .eq("prayer_id", id)
          .eq("user_id", session.session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching favorite status:", error);
        } else {
          setIsFavorite(!!data);
        }
      } finally {
        setFavoriteLoading(false);
      }
    };

    fetchFavoriteStatus();
  }, [id]);


  const toggleFavorite = async () => {
    if (!id) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        title: t("Error"),
        description: t("You must be logged in to add favorites"),
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("user_prayer_favorites")
        .delete()
        .eq("prayer_id", id)
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
          prayer_id: id,
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

  const getLocalizedContent = (field: string) => {
    if (!prayer) return "";
    
    switch (currentLanguage) {
      case "pt-BR":
        return prayer[`${field}_pt`];
      case "es":
        return prayer[`${field}_es`];
      default:
        return prayer[field];
    }
  };

  const getLocalizedCategoryName = () => {
    if (!prayer?.prayer_categories) return "";
    
    switch (currentLanguage) {
      case "pt-BR":
        return prayer.prayer_categories.name_pt;
      case "es":
        return prayer.prayer_categories.name_es;
      default:
        return prayer.prayer_categories.name;
    }
  };

  if (prayerLoading || favoriteLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (prayerError || !prayer) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-lg text-red-500">{t("Prayer not found")}</p>
        <Button variant="outline" onClick={() => navigate("/prayers")}>
          {t("Back to Prayers")}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-8">
      <header className="bg-primary/90 text-white p-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white hover:text-white/80"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{getLocalizedContent("title")}</h1>
          <p className="text-sm text-primary-foreground/80">
            {getLocalizedCategoryName()}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="bg-white/50 backdrop-blur-sm border-none shadow-xl">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-lg">{t("Prayer")}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="text-primary hover:text-primary/80"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{getLocalizedContent("content")}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PrayerDetails;
