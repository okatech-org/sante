-- Drop the existing incorrect policy
DROP POLICY IF EXISTS "Users can reply to messages that allow replies" ON public.messages;

-- Create a corrected policy that properly checks the parent message
CREATE POLICY "Users can reply to messages that allow replies"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id 
  AND parent_message_id IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.messages parent_msg
    WHERE parent_msg.id = parent_message_id
      AND parent_msg.recipient_id = auth.uid()
      AND parent_msg.allow_reply = true
  )
);