import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { cn } from '@/lib/utils';
import { AyushAdvisor } from '@/components/rag/AyushAdvisor';
import { SidebarContext } from './SidebarContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const isCustomer = userData.role === 'customer';

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}>
            <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden">
                {!isCustomer && (
                    <Sidebar
                        collapsed={isCollapsed}
                        onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                )}

                {/* Mobile Overlay */}
                {isMobileOpen && !isCustomer && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                <main className={cn(
                    "flex-1 h-screen flex flex-col relative transition-all duration-300 w-full",
                    "ml-0", // Default mobile (no margin)
                    !isCustomer && (isCollapsed ? "lg:ml-20" : "lg:ml-64") // Desktop margins only if sidebar exists
                )}>
                    <div className="flex-shrink-0 z-40">
                        <DashboardHeader />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                        <div className="max-w-[1400px] mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            {/* RAG-powered AI Advisor – floats on all dashboard pages */}
            <AyushAdvisor />
        </SidebarContext.Provider>
    );
}
