import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const DailyVerse = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const verse = {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
  };

  // Convert base64 to Uint8Array in chunks to prevent stack overflow
  const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    
    // Process in chunks of 8KB
    const chunkSize = 8192;
    for (let i = 0; i < length; i += chunkSize) {
      const chunk = Math.min(chunkSize, length - i);
      for (let j = 0; j < chunk; j++) {
        bytes[i + j] = binaryString.charCodeAt(i + j);
      }
    }
    
    return bytes;
  };

  const playVerse = async () => {
    try {
      setIsPlaying(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: verse.text },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      // Convert base64 to Uint8Array in chunks
      const bytes = base64ToUint8Array(data.audioContent);

      // Create audio blob and play
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        toast.error("Error playing audio");
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing verse:", error);
      setIsPlaying(false);
      toast.error("Failed to play verse");
    }
  };

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 border-none shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-primary flex items-center justify-between">
          Daily Verse
          <Button
            variant="ghost"
            size="icon"
            onClick={playVerse}
            disabled={isPlaying}
            className="text-primary hover:text-primary/80"
          >
            <Volume2 className={isPlaying ? "animate-pulse" : ""} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body-large mb-4 text-gray-700 font-medium leading-relaxed">
          "{verse.text}"
        </p>
        <span className="text-sm font-medium text-primary/80 italic">
          {verse.reference}
        </span>
      </CardContent>
    </Card>
  );
};
