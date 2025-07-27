import * as React from 'react';
import { useToast } from '../use-toast';

export interface ToastRootContext {
  toast: useToast.Toast;
  rootRef: React.RefObject<HTMLElement | null>;
  titleId: string | undefined;
  setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>;
  descriptionId: string | undefined;
  setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  swipeDirection: 'up' | 'down' | 'left' | 'right' | undefined;
}

export const ToastRootContext = React.createContext<ToastRootContext | undefined>(undefined);

export function useToastRootContext(): ToastRootContext {
  const context = React.useContext(ToastRootContext);
  if (!context) {
    throw new Error(
      'ToastRootContext is missing. Toast parts must be used within <Toast.Root>.',
    );
  }
  return context as ToastRootContext;
}