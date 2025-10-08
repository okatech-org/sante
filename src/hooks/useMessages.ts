import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  category: string;
  senderId: string | null;
}

export const useMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    unread: 0,
    today: 0,
    starred: 0,
    archived: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch messages where user is recipient
        const { data, error: msgError } = await supabase
          .from("messages")
          .select("*")
          .eq("recipient_id", user.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false });

        if (msgError) throw msgError;

        const formattedMessages: Message[] = (data || []).map((msg: any) => ({
          id: msg.id,
          from: msg.sender_name,
          subject: msg.subject,
          preview: msg.content.substring(0, 100) + "...",
          content: msg.content,
          date: msg.created_at,
          isRead: msg.is_read,
          isStarred: msg.is_starred,
          category: msg.category || "general",
          senderId: msg.sender_id,
        }));

        setMessages(formattedMessages);

        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const unread = formattedMessages.filter((m) => !m.isRead).length;
        const todayMessages = formattedMessages.filter(
          (m) => new Date(m.date) >= today
        ).length;
        const starred = formattedMessages.filter((m) => m.isStarred).length;

        setStats({
          unread,
          today: todayMessages,
          starred,
          archived: 0, // Archived functionality not yet implemented
        });
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("messages_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const toggleStar = async (messageId: string) => {
    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;

      const { error } = await supabase
        .from("messages")
        .update({ is_starred: !message.isStarred })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m))
      );
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return { messages, stats, loading, error, markAsRead, toggleStar, deleteMessage };
};
