'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated, getUser, saveAuth } from '@/lib/auth';
import { Template, UserProfile } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { PageHeader } from '@/components/contracts/PageHeader';
import { StepIndicator } from '@/components/contracts/StepIndicator';
import { TemplateSelector } from '@/components/contracts/TemplateSelector';
import { ContractForm } from '@/components/contracts/ContractForm';
import { ContractPreview } from '@/components/contracts/ContractPreview';
import { ContractSuccess } from '@/components/contracts/ContractSuccess';
import { fillFromProfile } from '@/lib/profileMapping';
import { Sparkles, X, Settings } from 'lucide-react';
import Link from 'next/link';

type Step = 'select' | 'fill' | 'done';

export default function NewContractPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const [step, setStep] = useState<Step>('select');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState('');
  const [usedPrefill, setUsedPrefill] = useState(false);

  // Profiles
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // Hint popup
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }

    const user = getUser();
    if (user && !user.hint_seen) {
      setShowHint(true);
    }

    api.get<Template[]>('/templates').then((res) => setTemplates(res.data ?? []));
    api.get<UserProfile[]>('/profiles').then((res) => {
      const list = res.data ?? [];
      setProfiles(list);
      if (list.length > 0) setSelectedProfile(list[0]);
    }).catch(() => {});
  }, [router]);

  const handleDismissHint = async () => {
    setShowHint(false);
    try {
      await api.patch('/auth/hint-seen');
      const user = getUser();
      const token = localStorage.getItem('token');
      if (user && token) {
        saveAuth(token, { ...user, hint_seen: true });
      }
    } catch {
      // non-critical
    }
  };

  const handleSelect = (tmpl: Template) => {
    setSelected(tmpl);
    setFormData({});
    setTitle(tmpl.name_ru);
    setStep('fill');
  };

  const handleFillFromProfile = () => {
    if (!selectedProfile || !selected) return;
    const fieldNames = selected.fields_schema?.fields?.map((f) => f.name) ?? [];
    const filled = fillFromProfile(selectedProfile.fields, selectedProfile.type, fieldNames);
    setFormData((prev) => ({ ...prev, ...filled }));
    setUsedPrefill(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.post<{ id: string }>('/contracts', {
        template_type: selected.type,
        title,
        form_data: formData,
        used_prefill: usedPrefill,
      });
      setCreatedId(res.data.id);
      setStep('done');
      toast.success(t.toast?.contractCreated || 'Договор создан!', t.toast?.contractCreatedDesc || 'PDF готов для скачивания');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error';
      setError(errorMsg);
      toast.error(t.toast?.error || 'Ошибка', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const steps: { key: string; label: string }[] = [
    { key: 'select', label: t.newContract.step1Label },
    { key: 'fill', label: t.newContract.step2Label },
    { key: 'done', label: t.newContract.step3Label },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        onBack={() => (step === 'fill' ? setStep('select') : router.push('/dashboard'))}
        backLabel={step === 'fill' ? t.newContract.back : t.newContract.backDashboard}
        title={t.newContract.pageTitle}
      >
        <StepIndicator steps={steps} current={step} />
      </PageHeader>

      {/* Select step */}
      {step === 'select' && (
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
          <TemplateSelector templates={templates} onSelect={handleSelect} />
        </div>
      )}

      {/* Fill step */}
      {step === 'fill' && selected && (
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
          {/* Profile selector bar */}
          <div className="mb-6 bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3 shadow-sm">
            <Sparkles size={18} className="text-brand-blue shrink-0" />
            <span className="text-sm font-medium text-slate-700 shrink-0">{t.newContract.profileSelector}:</span>
            {profiles.length === 0 ? (
              <span className="text-sm text-slate-400 flex-1">{t.newContract.noProfiles}</span>
            ) : (
              <select
                value={selectedProfile?.id ?? ''}
                onChange={(e) => {
                  const p = profiles.find((p) => p.id === e.target.value) ?? null;
                  setSelectedProfile(p);
                }}
                className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all bg-white"
              >
                <option value="">{t.newContract.profileSelectorPlaceholder}</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            )}
            <Link
              href="/settings"
              className="text-xs text-brand-blue hover:underline shrink-0 flex items-center gap-1"
            >
              <Settings size={13} />
              {t.newContract.manageProfiles}
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <ContractForm
                template={selected}
                title={title}
                formData={formData}
                loading={loading}
                error={error}
                onTitleChange={setTitle}
                onFieldChange={(name, value) => setFormData((p) => ({ ...p, [name]: value }))}
                onSubmit={handleSubmit}
                selectedProfile={selectedProfile}
                onFillFromProfile={selectedProfile ? handleFillFromProfile : undefined}
              />
            </div>
            <div className="lg:sticky lg:top-24">
              <ContractPreview htmlBody={selected.html_body} formData={formData} />
            </div>
          </div>
        </div>
      )}

      {/* Done step */}
      {step === 'done' && (
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
          <ContractSuccess
            onView={() => router.push(`/contracts/${createdId}`)}
            onDashboard={() => router.push('/dashboard')}
            onCreateMore={() => { setStep('select'); setSelected(null); setFormData({}); }}
          />
        </div>
      )}

      {/* First-document hint popup */}
      {showHint && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={handleDismissHint}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-soft-blue rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles size={20} className="text-brand-blue" />
              </div>
              <h3 className="font-display font-semibold text-brand-dark text-lg">{t.newContract.hintTitle}</h3>
            </div>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">{t.newContract.hintMessage}</p>
            <div className="flex gap-3">
              <Link
                href="/settings"
                onClick={handleDismissHint}
                className="flex-1 bg-brand-blue text-white text-sm font-medium py-2.5 rounded-xl text-center hover:bg-blue-700 transition-colors"
              >
                {t.newContract.hintGoSettings}
              </Link>
              <button
                onClick={handleDismissHint}
                className="flex-1 bg-slate-100 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {t.newContract.hintDismiss}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}