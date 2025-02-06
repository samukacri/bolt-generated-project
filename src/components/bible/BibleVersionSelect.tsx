import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { BIBLE_VERSIONS } from "@/config/bibleVersions";
import { setBibleVersion } from "@/services/bibleApi";

interface BibleVersionSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const BibleVersionSelect = ({ value, onValueChange }: BibleVersionSelectProps) => {
  const { t } = useLanguage();

  const handleVersionChange = (newValue: string) => {
    setBibleVersion(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleVersionChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('selectBibleVersion')} />
      </SelectTrigger>
      <SelectContent>
        {BIBLE_VERSIONS.map((version) => (
          <SelectItem key={version.id} value={version.id}>
            {version.abbreviation} - {version.name} ({version.language})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
