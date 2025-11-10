import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FocusSession {
  id: string;
  focus_topic: string;
  focus_depth: number;
  focus_started_at: string;
  updated_at: string;
}

export const FocusSessionsPanel = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('focus_mode', true)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading focus sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const resumeSession = (sessionId: string) => {
    // This would be handled by the parent component or hook
    console.log('Resume session:', sessionId);
  };

  if (loading) {
    return <div className="text-sm text-zinc-500">Chargement...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            Sessions Focus Actives
          </h3>
          <p className="text-sm text-zinc-600">
            Reprenez vos conversations approfondies là où vous les avez laissées
          </p>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune session focus active</p>
              </div>
            ) : (
              sessions.map((session) => (
                <Card key={session.id} className="p-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-zinc-900 line-clamp-2">
                        {session.focus_topic}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Niveau {session.focus_depth}/7
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(session.updated_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </div>
                      </div>

                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        En cours
                      </Badge>
                    </div>

                    <Button
                      onClick={() => resumeSession(session.id)}
                      size="sm"
                      variant="outline"
                      className="ml-4"
                    >
                      Reprendre
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};