import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Profile = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.name) {
        setName(user.user_metadata.name);
      }
    };
    getUser();
  }, []);

  const isPasswordAuthUser = user?.app_metadata?.provider === 'email';

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('changesApplied'),
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating name:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('changesApplied'),
      });
      setNewPassword("");
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {t('profile')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <UserIcon className="h-4 w-4" />
              {t('name')}
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterName')}
                />
                <Button 
                  onClick={handleUpdateName}
                  disabled={loading}
                >
                  {t('save')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  {t('cancel')}
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{user.user_metadata?.name || t('noName')}</span>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  {t('edit')}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              {t('email')}
            </label>
            <Input
              value={user.email}
              disabled
              className="bg-gray-50"
            />
          </div>

          {isPasswordAuthUser && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" />
                {t('password')}
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('enterNewPassword')}
                />
                <Button
                  onClick={handleUpdatePassword}
                  disabled={loading || !newPassword}
                >
                  {t('update')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
