export type Highlight = {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number;
  highlighted_text: string;
  color: string;
  is_favorite: boolean;
  created_at: string;
};
export type HighlightInsert = Omit<Highlight, 'id' | 'created_at'>;

export type BibleVersion = {
  id: string;
  name: string;
};

export type BibleBook = {
  id: string;
  name: string;
  nameLong: string;
  abbreviation: string;
};

export type BibleChapter = {
  id: string;
  number: string;
  reference: string;
};

export type BibleVerse = {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  text: string;
};

export type SearchResult = {
  id: string;
  reference: string;
  text: string;
};
