-- Add deleted_at column to messages table for soft deletes
ALTER TABLE public.messages 
ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;

-- Add index for better query performance on deleted messages
CREATE INDEX idx_messages_deleted_at ON public.messages(deleted_at);

-- Add comment
COMMENT ON COLUMN public.messages.deleted_at IS 'Timestamp when the message was deleted (soft delete)';