-- Add fields to messages table for reply functionality
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS allow_reply boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS parent_message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE;

-- Create index for better performance on parent_message_id queries
CREATE INDEX IF NOT EXISTS idx_messages_parent_id ON public.messages(parent_message_id);

-- Update RLS policies to allow users to reply to messages
CREATE POLICY "Users can reply to messages that allow replies"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.messages pm
    WHERE pm.id = parent_message_id
    AND pm.recipient_id = auth.uid()
    AND pm.allow_reply = true
  )
);

-- Add comment for clarity
COMMENT ON COLUMN public.messages.allow_reply IS 'Indicates whether recipients can reply to this message';
COMMENT ON COLUMN public.messages.parent_message_id IS 'Reference to the parent message if this is a reply';