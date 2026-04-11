import { createContext, useContext } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (v: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
