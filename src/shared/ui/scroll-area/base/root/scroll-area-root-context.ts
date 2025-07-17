import React from 'react';
import type { HiddenState, ScrollPosition, Size } from './scroll-area-root';

export interface ScrollAreaRootContext {
  thumbSize: Size;
  hovering: boolean;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
  scrollingX: boolean;
  setScrollingX: React.Dispatch<React.SetStateAction<boolean>>;
  scrollingY: boolean;
  setScrollingY: React.Dispatch<React.SetStateAction<boolean>>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  scrollbarYRef: React.RefObject<HTMLDivElement | null>;
  thumbYRef: React.RefObject<HTMLDivElement | null>;
  scrollbarXRef: React.RefObject<HTMLDivElement | null>;
  thumbXRef: React.RefObject<HTMLDivElement | null>;
  cornerRef: React.RefObject<HTMLDivElement | null>;
  handlePointerDown: (event: React.PointerEvent) => void;
  handlePointerMove: (event: React.PointerEvent) => void;
  handlePointerUp: (event: React.PointerEvent) => void;
  handleScroll: (scrollPosition: ScrollPosition) => void;
  computeThumbPosition: () => void
  hiddenState: HiddenState;
}

export const ScrollAreaRootContext = React.createContext<ScrollAreaRootContext | undefined>(
  undefined,
);

export function useScrollAreaRootContext() {
  const context = React.useContext(ScrollAreaRootContext);
  if (context === undefined) {
    throw new Error(
      'ScrollAreaRootContext is missing. ScrollArea parts must be placed within <ScrollArea.Root>.',
    );
  }
  return context;
}