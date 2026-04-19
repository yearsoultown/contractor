'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';

interface AuthDecorPanelProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthDecorPanel({ title, subtitle, children }: AuthDecorPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-brand-dark flex-col justify-between p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-blue/20">
            {t.common.appInitial}
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">{t.common.appName}</span>
        </div>
        <LanguageSwitcher variant="light" />
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-display font-bold text-white mb-6 leading-tight">{title}</h2>
        <p className="text-slate-400 text-lg leading-relaxed">{subtitle}</p>
        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}