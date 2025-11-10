import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IAstedVoiceButton } from './IAstedVoiceButton';

export const IAstedFloatingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg z-40"
      >
        <Bot className="w-8 h-8" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <div className="relative">
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="py-8">
              <h2 className="text-2xl font-bold text-center text-zinc-900 mb-8">
                iAsted - Assistant Vocal
              </h2>
              <IAstedVoiceButton />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};