'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, ChevronDown, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ToolbarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  content: React.ReactNode;
  /** Max width of the floating panel. Defaults to 480px. */
  panelWidth?: number;
}

interface ContractToolbarProps {
  title: string;
  statusBadge: React.ReactNode;
  date: string;
  items: ToolbarItem[];
  /** Extra px to push floating panels down (e.g. height of a format bar below the toolbar). */
  drawerOffset?: number;
}

export function ContractToolbar({ title, statusBadge, date, items, drawerOffset = 0 }: ContractToolbarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [toolbarTop, setToolbarTop] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // drawerTop derived from toolbarTop so it's always in sync after the toolbar repositions
  const TOOLBAR_H = 60; // h-[60px]
  const drawerTop = toolbarTop + TOOLBAR_H + 8 + drawerOffset;

  useEffect(() => {
    function measure() {
      const header = document.getElementById('page-header-strip');
      if (header) setToolbarTop(header.getBoundingClientRect().bottom);
      setIsMobile(window.innerWidth < 768);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const toggle = (id: string) => setActiveId((prev) => (prev === id ? null : id));
  const activeItem = items.find((i) => i.id === activeId);

  return (
    <>
      {/* ── Toolbar strip ──────────────────────────────────────────────────── */}
      <div
        ref={stripRef}
        id="toolbar-strip"
        className="fixed left-0 right-0 z-[19] bg-white border-b border-slate-200"
        style={{ top: toolbarTop }}
      >
        <div className="max-w-[794px] mx-auto px-4 h-[60px] flex items-center gap-2">
          {/* Icon */}
          <div className="w-7 h-7 rounded-xl bg-brand-soft-blue flex items-center justify-center shrink-0">
            <FileText size={14} className="text-brand-blue" />
          </div>

          {/* Title + meta */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-brand-dark truncate">{title}</h1>
            {statusBadge}
            <span className="text-xs text-slate-400 whitespace-nowrap hidden md:block">{date}</span>
          </div>

          {/* Divider */}
          {items.length > 0 && <div className="h-5 w-px bg-slate-200 shrink-0" />}

          {/* Buttons — touch-friendly tap targets */}
          <div className="flex items-center gap-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold transition-all select-none min-h-[36px]',
                    isActive
                      ? 'bg-brand-soft-blue text-brand-blue'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                  )}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none',
                        isActive ? 'bg-brand-blue/15 text-brand-blue' : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={11}
                    className={cn('transition-transform duration-200', isActive && 'rotate-180')}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Floating bento drawer (desktop) / bottom sheet (mobile) ─────────── */}
      <AnimatePresence>
        {activeItem && (
          <>
            {/* Backdrop — click outside to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[24]"
              onClick={() => setActiveId(null)}
            />

            {isMobile ? (
              /* ── Mobile: bottom sheet ──────────────────────────────────── */
              <motion.div
                key={`${activeItem.id}-sheet`}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-0 left-0 right-0 z-[25] bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl shadow-slate-400/20 overflow-hidden"
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-slate-200" />
                </div>

                {/* Sheet header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <activeItem.icon size={15} className="text-slate-500" />
                    <span className="text-sm font-bold text-slate-800">{activeItem.label}</span>
                    {activeItem.badge != null && activeItem.badge > 0 && (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {activeItem.badge}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveId(null)}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Sheet body — safe area aware */}
                <div className="p-5 pb-[max(20px,env(safe-area-inset-bottom))]">
                  {activeItem.content}
                </div>
              </motion.div>
            ) : (
              /* ── Desktop: floating panel ───────────────────────────────── */
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-[25] bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40 overflow-hidden"
                style={{
                  top: drawerTop,
                  left: '50%',
                  width: `min(calc(100vw - 48px), ${activeItem.panelWidth ?? 480}px)`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <activeItem.icon size={15} className="text-slate-500" />
                    <span className="text-sm font-bold text-slate-800">{activeItem.label}</span>
                    {activeItem.badge != null && activeItem.badge > 0 && (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {activeItem.badge}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveId(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
                  >
                    Закрыть
                  </button>
                </div>

                {/* Panel body */}
                <div className="p-5 min-h-[180px]">
                  {activeItem.content}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}