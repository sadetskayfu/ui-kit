import React from 'react';
import type { Orientation } from './scroll-area-scrollbar';

export interface ScrollAreaScrollbarContext {
  orientation: Orientation
}

export const ScrollAreaScrollbarContext = React.createContext<
  ScrollAreaScrollbarContext | undefined
>(undefined);

export function useScrollAreaScrollbarContext() {
  const context = React.useContext(ScrollAreaScrollbarContext);

  if (context === undefined) {
    throw new Error(
      'ScrollAreaScrollbarContext is missing. ScrollAreaScrollbar parts must be placed within <ScrollArea.Scrollbar>.',
    );
  }
  return context;
}