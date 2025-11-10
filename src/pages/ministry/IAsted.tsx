import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Bot, MessageSquare, History, Settings } from 'lucide-react';
import { IAstedVoiceButton } from '@/components/ministry/iasted/IAstedVoiceButton';
import { IAstedChat } from '@/components/ministry/iasted/IAstedChat';
import { VoiceSettings } from '@/components/ministry/iasted/VoiceSettings';
import { FocusSessionsPanel } from '@/components/ministry/iasted/FocusSessionsPanel';

const IAsted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-zinc-900 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">iAsted</h1>
              <p className="text-zinc-600">Assistant Vocal Intelligent</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="conversation" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voice Interaction */}
              <Card className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                      Interaction Vocale
                    </h2>
                    <p className="text-sm text-zinc-600">
                      Cliquez sur le bouton pour commencer une conversation vocale
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <IAstedVoiceButton />
                  </div>
                </div>
              </Card>

              {/* Text Chat */}
              <Card className="h-[600px]">
                <IAstedChat />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Focus Sessions */}
              <FocusSessionsPanel />

              {/* Recent Conversations (placeholder) */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                  Conversations Récentes
                </h3>
                <p className="text-sm text-zinc-500">
                  Fonctionnalité à venir...
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-2xl">
              <VoiceSettings />

              {/* Additional Settings (placeholder) */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                  Autres Paramètres
                </h3>
                <p className="text-sm text-zinc-500">
                  Fonctionnalité à venir...
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IAsted;