import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Shuffle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { SpeechService } from '@/services/speechService';
import { Capacitor } from '@capacitor/core';

interface BibleNarratorProps {
  chapterContent: string;
}

export function BibleNarrator({ chapterContent }: BibleNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('05:10');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const { language } = useLanguage();
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audioUrlRef.current!);
      }
      if (Capacitor.getPlatform() === 'android') {
        SpeechService.stop();
      }
    };
  }, [audio]);

  const togglePlay = async () => {
    if (isPlaying) {
      if (Capacitor.getPlatform() === 'android') {
        await SpeechService.stop();
      } else if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);

      if (audio) {
        audio.play().catch((error) => {
          console.error('Erro ao reproduzir áudio:', error);
          toast({
            title: 'Erro',
            description: 'Não foi possível reproduzir o áudio',
            variant: 'destructive',
          });
          setIsPlaying(false);
        });
        return;
      }

      const audioUrl = await SpeechService.speak({
        text: chapterContent,
        language: language,
        pitch,
        rate: speed
      });

      if (audioUrl) {
        console.log('URL de áudio gerada:', audioUrl);
        audioUrlRef.current = audioUrl;

        const newAudio = new Audio(audioUrl);
        newAudio.onended = () => {
          setIsPlaying(false);
          setProgress(100);
        };

        newAudio.onerror = () => {
          console.error('Erro ao carregar áudio');
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar o áudio',
            variant: 'destructive',
          });
          setIsPlaying(false);
        };

        await newAudio.play();
        setAudio(newAudio);
      }
    } catch (error) {
      console.error('Erro ao sintetizar voz:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível sintetizar a voz',
        variant: 'destructive',
      });
      setIsPlaying(false);
    }
  };

  const handleSkipForward = () => {
    if (audio) {
      audio.currentTime += 10; // Pular 10 segundos para frente
    }
  };

  const handleSkipBack = () => {
    if (audio) {
      audio.currentTime -= 10; // Voltar 10 segundos
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <p className="text-lg text-foreground line-clamp-3">{chapterContent}</p>
      </div>
      
      <div className="waveform-container">
        <div 
          className="waveform-progress"
          style={{ width: `${progress}%` }}
        >
          <div className="flex h-full items-center justify-start gap-1 px-1">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="h-full w-1 bg-primary/20"
                style={{
                  height: `${30 + Math.random() * 70}%`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex h-full items-center justify-start gap-1 px-1">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="h-full w-1 bg-primary/10"
              style={{
                height: `${30 + Math.random() * 70}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="time-display">{currentTime}</span>
        <span className="time-display">{duration}</span>
      </div>
      <div className="audio-controls flex items-center justify-center space-x-4 bg-secondary/10 rounded-full p-2 shadow-sm">
        <button 
          className="control-button p-2 rounded-full hover:bg-secondary/20 transition-all duration-200 ease-in-out" 
          onClick={() => console.log('Shuffle')}
        >
          <Shuffle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
        </button>
        <button 
          className="control-button p-2 rounded-full hover:bg-secondary/20 transition-all duration-200 ease-in-out" 
          onClick={handleSkipBack}
          disabled={!chapterContent || chapterContent.trim() === ''}
        >
          <SkipBack className="w-6 h-6 text-foreground opacity-70 hover:opacity-100 transition-opacity" />
        </button>
        <button 
          className="control-button bg-primary text-primary-foreground hover:bg-primary/90 p-3 rounded-full shadow-md transform active:scale-95 transition-all duration-200 ease-in-out"
          onClick={togglePlay}
          disabled={!chapterContent || chapterContent.trim() === ''}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
        <button 
          className="control-button p-2 rounded-full hover:bg-secondary/20 transition-all duration-200 ease-in-out" 
          onClick={handleSkipForward}
          disabled={!chapterContent || chapterContent.trim() === ''}
        >
          <SkipForward className="w-6 h-6 text-foreground opacity-70 hover:opacity-100 transition-opacity" />
        </button>
        <button 
          className="control-button p-2 rounded-full hover:bg-secondary/20 transition-all duration-200 ease-in-out" 
          onClick={() => console.log('Repeat')}
        >
          <RefreshCw className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
}

export default BibleNarrator;
