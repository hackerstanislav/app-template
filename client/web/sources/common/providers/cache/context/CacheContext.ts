import { createContext } from "react";

import { ContextType } from "../types";

export const CacheContext = createContext<ContextType | null>(null);
