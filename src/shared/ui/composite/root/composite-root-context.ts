import * as React from 'react';

export interface CompositeRootContext {
  activeIndex: number;
  onActiveIndexChange: (index: number, needScroll?: boolean) => void;
  focusItemOnHover: boolean;
}

export const CompositeRootContext = React.createContext<CompositeRootContext | undefined>(
  undefined,
);

export function useCompositeRootContext(optional: true): CompositeRootContext | undefined;
export function useCompositeRootContext(optional?: false): CompositeRootContext;
export function useCompositeRootContext(optional = false) {
  const context = React.useContext(CompositeRootContext);
  
  if (context === undefined && !optional) {
    throw new Error(
      'CompositeRootContext is missing. Composite parts must be placed within <Composite.Root>.',
    );
  }

  return context;
}