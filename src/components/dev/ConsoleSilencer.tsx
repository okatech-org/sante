import { useEffect } from "react";

/**
 * ConsoleSilencer filters out noisy non-app warnings/errors that originate
 * from the preview sandbox and analytics. Active only in development.
 */
export default function ConsoleSilencer() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const originalWarn = console.warn;
    const originalError = console.error;
    const originalLog = console.log;

    const shouldIgnore = (msg?: any) => {
      if (typeof msg !== "string") return false;
      return (
        msg.includes("Unrecognized feature:") ||
        msg.includes("allow-scripts and allow-same-origin") ||
        msg.includes("/_sandbox/dev-server") ||
        msg.includes("The deferred DOM Node could not be resolved") ||
        msg.includes("We're hiring!") ||
        msg.includes("lovable.dev/careers") ||
        msg.includes("lovable-api.com") ||
        msg.includes("firestore.googleapis.com") ||
        msg.includes("ERR_INTERNET_DISCONNECTED") ||
        msg.includes("ERR_NETWORK_IO_SUSPENDED") ||
        msg.includes("ERR_NETWORK_CHANGED") ||
        msg.includes("ERR_QUIC_PROTOCOL_ERROR") ||
        msg.includes("Initializing RudderStack Analytics") ||
        msg.includes("Cookies accepted:") ||
        msg.includes("lovableproject.com")
      );
    };

    console.warn = (...args: any[]) => {
      if (shouldIgnore(args[0])) return;
      originalWarn(...args);
    };

    console.log = (...args: any[]) => {
      if (shouldIgnore(args[0])) return;
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      if (shouldIgnore(args[0])) return;
      originalError(...args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
      console.log = originalLog;
    };
  }, []);

  return null;
}
