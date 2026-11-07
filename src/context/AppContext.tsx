import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useLocalState } from "../hooks/useLocalState";
import {
  initialProfile,
  initialPosts,
  initialEvents,
  initialExperiences,
} from "../data/demo";
function useAppState() {
  const [profile, setProfile] = useLocalState("profile", initialProfile);
  const [posts, setPosts] = useLocalState("posts", initialPosts);
  const [events, setEvents] = useLocalState("events", initialEvents);
  const [experiences, setExperiences] = useLocalState(
    "experiences",
    initialExperiences,
  );
  const [saved, setSaved] = useLocalState<number[]>("saved", []);
  const [applications, setApplications] = useLocalState<number[]>(
    "applications",
    [],
  );
  const [settings, setSettings] = useLocalState("settings", {
    offers: true,
    email: false,
    interviews: true,
    visible: true,
  });
  const [toast, setToast] = useState("");
  function notify(message: string) {
    setToast(message);
  }
  return {
    profile,
    setProfile,
    posts,
    setPosts,
    events,
    setEvents,
    experiences,
    setExperiences,
    saved,
    setSaved,
    applications,
    setApplications,
    settings,
    setSettings,
    toast,
    setToast,
    notify,
  };
}
const AppContext = createContext<ReturnType<typeof useAppState> | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const c = useContext(AppContext);
  if (!c) throw Error("AppProvider missing");
  return c;
}
