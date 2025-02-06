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
    const response = await api.get(`/bibles/${currentBibleVersion}/books`);
    console.log('Books response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getChapters = async (bookId: string): Promise<BibleChapter[]> => {
  try {
    console.log('Fetching chapters for book:', bookId);
    const response = await api.get(`/bibles/${currentBibleVersion}/books/${bookId}/chapters`);
    console.log('Chapters response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
};

export const getVerses = async (chapterId: string): Promise<BibleVerse[]> => {
  try {
    console.log('Fetching verses for chapter:', chapterId);
    const response = await api.get(`/bibles/${currentBibleVersion}/chapters/${chapterId}/verses`);
    console.log('Verses response raw:', response.data);
    console.log('Verses data array:', response.data.data);
    console.log('First verse example:', response.data.data[0]);
    
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      console.error('Invalid response format:', response.data);
      return [];
    }

    return response.data.data.map((verse: any) => {
      // Extract the text content - the API might return it in different formats
      let verseText = '';
      if (typeof verse.text === 'string') {
        verseText = verse.text;
      } else if (verse.content && typeof verse.content === 'string') {
        verseText = verse.content;
      } else if (verse.items && Array.isArray(verse.items)) {
        verseText = verse.items.map((item: any) => item.text || '').join(' ');
      }

      // Clean up the text
      verseText = verseText.trim();
      
      // Log if we couldn't get valid text
      if (!verseText) {
        console.warn('No valid text found for verse:', verse);
      }

      return {
        id: verse.id || '',
        orgId: verse.orgId || '',
        bookId: verse.bookId || '',
        chapterId: verse.chapterId || '',
        reference: verse.reference || '',
        text: verseText
      };
    }).filter(verse => verse.text); // Only return verses that have text
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

export { 
  Highlight, 
  HighlightInsert, 
  BibleBook, 
  BibleChapter, 
  BibleVerse, 
  SearchResult 
};
