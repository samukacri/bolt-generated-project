import axios from 'axios';
import type {
  Highlight,
  HighlightInsert,
  BibleBook,
  BibleChapter,
  BibleVerse,
  SearchResult
} from '../types';
import { supabase } from '../integrations/supabase/client';

const BIBLE_API_BASE_URL = 'https://api.scripture.api.bible/v1';
const BIBLE_API_KEY = '77c5ffa3c5c750658be2f8c0c615af6e';

let currentBibleVersion = localStorage.getItem('bible_version') || 'a757e43537d6b8bc-01';

export const setBibleVersion = (version: string) => {
  currentBibleVersion = version;
  localStorage.setItem('bible_version', version);
};

export const getBibleVersion = () => currentBibleVersion;

const api = axios.create({
  baseURL: BIBLE_API_BASE_URL,
  headers: {
    'api-key': BIBLE_API_KEY
  }
});

export const getBooks = async (): Promise<BibleBook[]> => {
  try {
    console.log('Fetching books for version:', currentBibleVersion);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_books?select=*`;
    console.log('getBooks URL:', url); // Log the URL
    console.log('API Key:', import.meta.env.VITE_SUPABASE_KEY);

     const response = await fetch(url, {
        method: 'GET',
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`
        }
      });

      if (!response.ok) {
        console.error('getBooks HTTP Error:', response.status, response.statusText);
        const text = await response.text();
        console.error('getBooks Response Body:', text); // Log the response body
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    const data = await response.json();
    console.log('Books response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getChapters = async (bookId: string): Promise<BibleChapter[]> => {
  try {
    console.log('Fetching chapters for book:', bookId);
     const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_chapters?select=*,bible_verses(*)&book_id=eq.${bookId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`
        }
      });
      if (!response.ok) {
        console.error('getChapters HTTP Error:', response.status, response.statusText);
        const text = await response.text();
        console.error('getChapters Response Body:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    const data = await response.json();
    console.log('Chapters response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
};

export const getVerses = async (chapterId: string): Promise<BibleVerse[]> => {
  try {
    console.log('Fetching verses for chapter:', chapterId);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bible_verses?select=*&chapter_id=eq.${chapterId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`
        }
      });

      if (!response.ok) {
        console.error('getVerses HTTP Error:', response.status, response.statusText);
        const text = await response.text();
        console.error('getVerses Response Body:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    const data = await response.json();
    console.log('Verses response raw:', data);
    return data;
  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
};

export const getChapterContent = async (chapterId: string): Promise<string> => {
  try {
    console.log('Fetching chapter content:', chapterId);
    const response = await api.get(`/bibles/${currentBibleVersion}/chapters/${chapterId}`, {
      params: {
        'content-type': 'text',
        'include-notes': false,
        'include-titles': false,
        'include-chapter-numbers': false,
        'include-verse-numbers': true,
        'include-verse-spans': false
      }
    });
    console.log('Chapter content response:', response.data);
    return response.data.data.content;
  } catch (error) {
    console.error('Error fetching chapter content:', error);
    return '';
  }
};

export const searchVerses = async (query: string): Promise<SearchResult[]> => {
  try {
    console.log('Searching verses with query:', query);
    const response = await api.get(`/bibles/${currentBibleVersion}/search`, {
      params: {
        query,
        limit: 20
      }
    });
    console.log('Search response:', response.data);
    return response.data.data.verses;
  } catch (error) {
    console.error('Error searching verses:', error);
    return [];
  }
};

export const getHighlights = async (userId: string, book: string, chapter: number): Promise<Highlight[]> => {
  const { data, error } = await supabase
    .from('user_highlights')
    .select('*')
    .eq('user_id', userId)
    .eq('book', book)
    .eq('chapter', chapter);

  if (error) throw error;
  return data as Highlight[];
};

export const saveHighlight = async (highlight: HighlightInsert): Promise<Highlight> => {
  const { data, error } = await supabase
    .from('user_highlights')
    .insert([highlight])
    .select();

  if (error) throw error;
  return data[0] as Highlight;
};

export const deleteHighlight = async (highlightId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_highlights')
    .delete()
    .eq('id', highlightId);

  if (error) throw error;
};
