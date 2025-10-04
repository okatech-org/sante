import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function DebugContext() {
  // Hook calls must be at the top-level
  let authOk = true;
  let langOk = true;
  let details: string[] = [];

  try {
    const auth = useAuth();
    if (!auth) authOk = false;
  } catch (e) {
    authOk = false;
    details.push(`Auth error: ${String(e)}`);
  }

  try {
    const lang = useLanguage();
    if (!lang) langOk = false;
  } catch (e) {
    langOk = false;
    details.push(`Language error: ${String(e)}`);
  }

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}>
      <div className="rounded-md bg-background/90 border px-3 py-2 text-xs shadow">
        <div className="font-semibold mb-1">Context status</div>
        <div>Auth: {authOk ? "OK" : "FAIL"}</div>
        <div>Language: {langOk ? "OK" : "FAIL"}</div>
        {details.length > 0 && (
          <ul className="mt-1 list-disc list-inside">
            {details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
