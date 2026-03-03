'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/store/sidebarStore';
import { useThemeStore } from '@/store/themeStore';
import {
    LayoutDashboard,
    TrendingUp,
    Building2,
    Settings2,
    Users,
    UserCircle,
    Package,
    Percent,
    FileText,
    CreditCard,
    Brain,
    ShoppingBasket,
    Clock,
    FileBarChart,
    ChevronRight,
    ChevronLeft,
    Shield,
    Sun,
    Moon,
} from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    isAI?: boolean;
    dividerBefore?: boolean;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'sales', label: 'تحليل المبيعات', icon: TrendingUp, href: '/sales' },
    { id: 'branches', label: 'أداء الفروع', icon: Building2, href: '/branches' },
    { id: 'operations', label: 'العمليات', icon: Settings2, href: '/operations' },
    { id: 'employees', label: 'الموظفين', icon: Users, href: '/employees' },
    { id: 'customers', label: 'العملاء', icon: UserCircle, href: '/customers' },
    { id: 'products', label: 'المنتجات', icon: Package, href: '/products' },
    { id: 'discounts', label: 'الخصومات', icon: Percent, href: '/discounts' },
    { id: 'agreements', label: 'الاتفاقيات', icon: FileText, href: '/agreements' },
    { id: 'sales-method', label: 'طريقة البيع', icon: CreditCard, href: '/sales-method' },
    { id: 'ai-forecast', label: 'التنبؤ الذكي', icon: Brain, href: '/ai-forecast', isAI: true, dividerBefore: true },
    { id: 'ai-basket', label: 'السلة الذكية', icon: ShoppingBasket, href: '/ai-basket', isAI: true },
    { id: 'time-compare', label: 'المقارنة الزمنية', icon: Clock, href: '/time-compare' },
    { id: 'reports', label: 'مركز التقارير', icon: FileBarChart, href: '/reports', dividerBefore: true },
];

const MD_BREAKPOINT = 768;

export default function Sidebar() {
    const { isCollapsed, toggleSidebar } = useSidebarStore();
    const { mode, toggleMode } = useThemeStore();
    const pathname = usePathname();
    const [isSmallViewport, setIsSmallViewport] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
        const handler = () => setIsSmallViewport(mql.matches);
        handler();
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    const isOverlay = isSmallViewport && !isCollapsed;

    return (
        <motion.aside
            className={`flex flex-col z-40 sidebar-transition overflow-hidden ${
                isOverlay ? 'fixed top-0 right-0 h-screen' : 'sticky top-0 h-screen shrink-0'
            }`}
            style={{
                width: isCollapsed ? 72 : 260,
                background: 'var(--sidebar-bg)',
                borderLeft: '1px solid var(--sidebar-border)',
            }}
        >
            {/* شعار */}
            <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--sidebar-logo-gradient)' }}
                >
                    <Shield size={20} color="#ffffff" strokeWidth={2.5} />
                </div>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <p className="text-xs font-bold tracking-wider" style={{ color: 'var(--sidebar-logo-text)' }}>
                                م.إ.ع
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--sidebar-logo-sub)' }}>
                                منصة البيانات
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* التنقل */}
            <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <React.Fragment key={item.id}>
                            {item.dividerBefore && (
                                <div className="mx-4 my-2 h-px" style={{ background: 'var(--sidebar-divider)' }} />
                            )}
                            <Link href={item.href}>
                                <div
                                    className="relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group"
                                    style={{
                                        background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                                        color: isActive ? 'var(--sidebar-text-active)' : item.isAI ? 'var(--sidebar-ai-text)' : 'var(--sidebar-text)',
                                    }}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full"
                                            style={{ background: 'var(--sidebar-active-bar)' }}
                                        />
                                    )}

                                    <Icon
                                        size={20}
                                        className="shrink-0 transition-colors"
                                    />

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {item.isAI && !isCollapsed && (
                                        <span
                                            className="mr-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                            style={{ background: 'var(--sidebar-ai-bg)', color: 'var(--sidebar-ai-text)', border: '1px solid var(--sidebar-ai-border)' }}
                                        >
                                            AI
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </React.Fragment>
                    );
                })}
            </nav>

            {/* التحكم */}
            <div className="border-t" style={{ borderColor: 'var(--sidebar-toggle-border)' }}>
                {/* زر تبديل الثيم */}
                <button
                    onClick={toggleMode}
                    className="flex items-center justify-center gap-2 w-full py-3 transition-colors"
                    style={{ color: 'var(--sidebar-toggle-text)' }}
                    title={mode === 'dark' ? 'الوضع الفاتح' : 'الوضع المظلم'}
                >
                    {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs">
                                {mode === 'dark' ? 'الوضع الفاتح' : 'الوضع المظلم'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                {/* زر طي الشريط */}
                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center h-11 w-full border-t transition-colors"
                    style={{ borderColor: 'var(--sidebar-toggle-border)', color: 'var(--sidebar-toggle-text)' }}
                >
                    {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>
        </motion.aside>
    );
}
