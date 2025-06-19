import { createContext } from 'react';
import type { useCollapse } from './use-collapse';

type ContextType = ReturnType<typeof useCollapse> | null;

export const CollapseContext = createContext<ContextType>(null);
