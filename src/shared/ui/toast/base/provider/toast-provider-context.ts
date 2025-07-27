import * as React from 'react'
import { useToast } from '../use-toast';

export interface ToastProviderContext {
    toasts: useToast.Toast[];
    setToasts: React.Dispatch<React.SetStateAction<useToast.Toast[]>>;
    hovering: boolean;
    setHovering: React.Dispatch<React.SetStateAction<boolean>>;
    focused: boolean;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
    add: (options: useToast.AddOptions) => string;
    update: (id: string, options: useToast.UpdateOptions) => void;
    close: (id: string) => void;
    remove: (id: string) => void;
    pauseTimers: () => void;
    resumeTimers: () => void;
    prevFocusElement: HTMLElement | null;
    setPrevFocusElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    viewportRef: React.RefObject<HTMLElement | null>;
    windowFocusedRef: React.RefObject<boolean>;
    scheduleTimer: (id: string, delay: number, callback: () => void) => void;
    hasDifferingHeights: boolean;
}

export const ToastProviderContext = React.createContext<ToastProviderContext | undefined>(undefined)

export function useToastProviderContext() {
    const context = React.useContext(ToastProviderContext);

    if (!context) {
      throw new Error('useToast must be used within <Toast.Provider>.');
    }
    
    return context;
}