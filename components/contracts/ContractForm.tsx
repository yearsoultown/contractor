'use client';

import { motion } from 'motion/react';
import { ArrowRight, Loader2, Wand2 } from 'lucide-react';
import { Template, UserProfile } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { FormField } from './FormField';
import { getSuggestionForField } from '@/lib/profileMapping';

interface ContractFormProps {
  template: Template;
  title: string;
  onTitleChange: (v: string) => void;
  formData: Record<string, string>;
  onFieldChange: (name: string, value: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  selectedProfile?: UserProfile | null;
  onFillFromProfile?: () => void;
}

export function ContractForm({
  template,
  title,
  onTitleChange,
  formData,
  onFieldChange,
  error,
  loading,
  onSubmit,
  selectedProfile,
  onFillFromProfile,
}: ContractFormProps) {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">{template.name_ru}</h1>
      <p className="text-slate-500 mb-8">{t.newContract.fillSubtitle}</p>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm px-5 py-3 rounded-2xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        {selectedProfile && onFillFromProfile && (
          <button
            type="button"
            onClick={onFillFromProfile}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-soft-blue border border-brand-blue/20 text-brand-blue rounded-2xl text-sm font-medium hover:bg-brand-blue/10 transition-colors"
          >
            <Wand2 size={16} />
            {t.newContract.fillFromProfile} — {selectedProfile.label}
          </button>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t.newContract.titleLabel}</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
          />
        </div>

        {template.fields_schema?.fields?.map((field) => {
          const suggestion = selectedProfile
            ? getSuggestionForField(field.name, selectedProfile.fields, selectedProfile.type)
            : null;

          return (
            <div key={field.name}>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">{t.newContract.required}</span>}
              </label>
              <FormField
                field={field}
                value={formData[field.name] || ''}
                onChange={(v) => onFieldChange(field.name, v)}
                suggestion={suggestion}
              />
            </div>
          );
        })}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {t.newContract.submitting}
            </>
          ) : (
            <>
              {t.newContract.submitBtn}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}