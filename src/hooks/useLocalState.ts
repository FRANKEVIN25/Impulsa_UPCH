import { useState, useEffect } from "react";
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem("impulsa:" + key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      if (Array.isArray(initial))
        return Array.isArray(parsed) ? parsed : initial;
      if (initial !== null && typeof initial === "object")
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? { ...initial, ...parsed }
          : initial;
      return typeof parsed === typeof initial ? parsed : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("impulsa:" + key, JSON.stringify(value));
    } catch {
      /* La sesión sigue funcionando si el navegador impide guardar. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}
