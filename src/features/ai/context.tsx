'use client';
import { createContext,useContext,type ReactNode } from 'react';
import type { PublicAiSettings } from './contracts';
const Context=createContext<PublicAiSettings|null>(null);
export function AiSettingsProvider({settings,children}:{settings:PublicAiSettings;children:ReactNode}){return <Context.Provider value={settings}>{children}</Context.Provider>}
export function useAiSettings(){const value=useContext(Context);if(!value)throw new Error('AI disclosure is not available');return value}
