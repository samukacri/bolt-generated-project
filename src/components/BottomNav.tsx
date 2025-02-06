import { Home, Book, Heart, Bell, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className={`flex flex-col items-center ${isActive("/") ? "text-primary" : "text-gray-600"}`}>
          <Home size={24} />
          <span className="text-xs mt-1">{t('home')}</span>
        </Link>
        <Link to="/bible" className={`flex flex-col items-center ${isActive("/bible") ? "text-primary" : "text-gray-600"}`}>
          <Book size={24} />
          <span className="text-xs mt-1">{t('bible')}</span>
        </Link>
        <Link to="/favorites" className={`flex flex-col items-center ${isActive("/favorites") ? "text-primary" : "text-gray-600"}`}>
          <Heart size={24} />
          <span className="text-xs mt-1">{t('favorites')}</span>
        </Link>
        <Link to="/alerts" className={`flex flex-col items-center ${isActive("/alerts") ? "text-primary" : "text-gray-600"}`}>
          <Bell size={24} />
          <span className="text-xs mt-1">{t('alerts')}</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className={`flex flex-col items-center ${isActive("/settings") || isActive("/profile") ? "text-primary" : "text-gray-600"}`}>
            <Settings size={24} />
            <span className="text-xs mt-1">{t('more')}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 w-full p-3">
                <Settings size={16} />
                {t('settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2 w-full p-3">
                <User size={16} />
                {t('profile')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
