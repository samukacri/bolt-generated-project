export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export const BIBLE_VERSIONS: BibleVersion[] = [
  // Portuguese Versions
  {
    id: "a757e43537d6b8bc-01",
    name: "Almeida Revista e Atualizada",
    abbreviation: "ARA",
    language: "Portuguese"
  },
  {
    id: "b32b9d1b64b4ef29-01",
    name: "Tradução Fiel da Trindade de Portugal",
    abbreviation: "TfTP",
    language: "Portuguese"
  },
  // English Versions
  {
    id: "de4e12af7f28f599-01",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English"
  },
  {
    id: "06125adad2d5898a-01",
    name: "English Standard Version",
    abbreviation: "ESV",
    language: "English"
  }
];

export const DEFAULT_BIBLE_VERSION = "a757e43537d6b8bc-01"; // ARA
