import { createContext } from 'react';
import { type usePopover } from './use-popover';

type ContextType = ReturnType<typeof usePopover> | null;

export const PopoverContext = createContext<ContextType>(null);
