"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { PersonaId } from "@/lib/personas/types";

export type ChatInitialContext = {
  source?: "homepage_supplements" | "client_portal" | "memberships";
  topics?: string[];
  fulfillment?: "fullscript";
  clicked_supplement?: string;
};

type ChatOpenState = {
  isOpen: boolean;
  selectedMascot: PersonaId | null;
  initialContext: ChatInitialContext | null;
};

type ChatOpenContextValue = ChatOpenState & {
  openChat: (personaId: PersonaId, context?: ChatInitialContext) => void;
  closeChat: () => void;
  toggleOpen: () => void;
  backToPicker: () => void;
  clearInitialContext: () => void;
};

const defaultState: ChatOpenState = {
  isOpen: false,
  selectedMascot: null,
  initialContext: null,
};

const ChatOpenContext = createContext<ChatOpenContextValue | null>(null);

export function ChatOpenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatOpenState>(defaultState);

  const openChat = useCallback((personaId: PersonaId, context?: ChatInitialContext) => {
    setState({
      isOpen: true,
      selectedMascot: personaId,
      initialContext: context ?? null,
    });
  }, []);

  const closeChat = useCallback(() => {
    setState({
      isOpen: false,
      selectedMascot: null,
      initialContext: null,
    });
  }, []);

  const toggleOpen = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      ...(prev.isOpen ? { selectedMascot: null, initialContext: null } : {}),
    }));
  }, []);

  const backToPicker = useCallback(() => {
    setState((prev) => ({ ...prev, selectedMascot: null, initialContext: null }));
  }, []);

  const clearInitialContext = useCallback(() => {
    setState((prev) => (prev.initialContext ? { ...prev, initialContext: null } : prev));
  }, []);

  const value = useMemo<ChatOpenContextValue>(
    () => ({
      ...state,
      openChat,
      closeChat,
      toggleOpen,
      backToPicker,
      clearInitialContext,
    }),
    [state.isOpen, state.selectedMascot, state.initialContext, openChat, closeChat, toggleOpen, backToPicker, clearInitialContext]
  );

  return (
    <ChatOpenContext.Provider value={value}>
      {children}
    </ChatOpenContext.Provider>
  );
}

export function useChatOpen() {
  const ctx = useContext(ChatOpenContext);
  if (!ctx) {
    throw new Error("useChatOpen must be used within ChatOpenProvider");
  }
  return ctx;
}
