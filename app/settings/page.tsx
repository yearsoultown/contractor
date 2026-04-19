'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated, getUser, saveAuth } from '@/lib/auth';
import type { User, UserProfile, ProfileFields } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Save, Lock, User as UserIcon, Sparkles, Plus, Pencil, Trash2, X, Building2, UserRound } from 'lucide-react';

type ProfileFormState = {
  label: string;
  type: 'individual' | 'legal_entity';
  fields: ProfileFields;
};

const EMPTY_PROFILE_FORM: ProfileFormState = {
  label: '',
  type: 'individual',
  fields: {},
};

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Smart profiles
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const currentUser = getUser();
    setUser(currentUser);
    setFullName(currentUser?.full_name || '');
    loadProfiles();
  }, [router]);

  const loadProfiles = async () => {
    try {
      const res = await api.get<UserProfile[]>('/profiles');
      setProfiles(res.data ?? []);
    } catch {
      // ignore
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const res = await api.put<User>('/auth/me', { full_name: fullName });
      const updatedUser = res.data;

      const token = localStorage.getItem('token');
      if (token && updatedUser) {
        saveAuth(token, updatedUser);
        setUser(updatedUser);
      }

      toast.success(t.settings.profileSuccess);
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                       'Failed to update profile';
      toast.error(t.toast?.error || 'Ошибка', errorMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      await api.put('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(t.settings.passwordSuccess);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                       'Failed to change password';
      toast.error(t.toast?.error || 'Ошибка', errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const openNewProfileForm = () => {
    setEditingId(null);
    setProfileForm(EMPTY_PROFILE_FORM);
    setShowProfileForm(true);
  };

  const openEditProfileForm = (p: UserProfile) => {
    setEditingId(p.id);
    setProfileForm({ label: p.label, type: p.type, fields: { ...p.fields } });
    setShowProfileForm(true);
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      if (editingId) {
        await api.put(`/profiles/${editingId}`, profileForm);
        toast.success(t.settings.profiles.updateSuccess);
      } else {
        await api.post('/profiles', profileForm);
        toast.success(t.settings.profiles.createSuccess);
      }
      setShowProfileForm(false);
      setEditingId(null);
      await loadProfiles();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error';
      toast.error(t.toast?.error || 'Ошибка', errorMsg);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm(t.settings.profiles.deleteConfirm)) return;
    try {
      await api.delete(`/profiles/${id}`);
      toast.success(t.settings.profiles.deleteSuccess);
      await loadProfiles();
    } catch {
      toast.error(t.toast?.error || 'Ошибка', 'Failed to delete profile');
    }
  };

  const setField = (key: keyof ProfileFields, value: string) => {
    setProfileForm((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
  };

  const isIndividual = profileForm.type === 'individual';

  if (!user) {
    return null;
  }

  return (
    <DashboardShell
      user={user}
      contractCount={0}
      activePage="settings"
      search=""
      onSearchChange={() => {}}
      onNewContract={() => {}}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-brand-dark mb-2">
            {t.settings.pageTitle}
          </h1>
          <p className="text-brand-dark">
            {t.settings.pageSubtitle}
          </p>
        </div>

        <div className="space-y-8">
          {/* Smart Fill Profiles Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 rounded-xl">
                  <Sparkles size={20} className="text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold text-brand-dark">
                    {t.settings.profiles.sectionTitle}
                  </h2>
                  <p className="text-sm text-brand-dark/50">
                    {t.settings.profiles.sectionDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={openNewProfileForm}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium"
              >
                <Plus size={16} />
                {t.settings.profiles.addProfile}
              </button>
            </div>

            {/* Profile list */}
            {profiles.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                {t.settings.profiles.noProfiles}
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-5 py-4 border border-slate-200 rounded-2xl hover:border-brand-blue/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {p.type === 'individual' ? (
                        <UserRound size={18} className="text-slate-500" />
                      ) : (
                        <Building2 size={18} className="text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-dark text-sm">{p.label}</p>
                      <p className="text-xs text-slate-400">
                        {p.type === 'individual' ? t.settings.profiles.typeIndividual : t.settings.profiles.typeLegal}
                        {p.fields.full_name && ` · ${p.fields.full_name}`}
                        {p.fields.company_name && ` · ${p.fields.company_name}`}
                        {p.fields.iin && ` · ИИН ${p.fields.iin}`}
                        {p.fields.bin && ` · БИН ${p.fields.bin}`}
                      </p>
                    </div>
                    <button
                      onClick={() => openEditProfileForm(p)}
                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-soft-blue rounded-xl transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(p.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-soft-blue rounded-xl">
                <UserIcon size={20} className="text-brand-blue" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-brand-dark">
                  {t.settings.profileSection}
                </h2>
                <p className="text-sm text-brand-dark/50">
                  {t.settings.profileDesc}
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  {t.settings.nameLabel}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.settings.namePlaceholder}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  {t.settings.emailLabel}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-brand-dark/80 cursor-not-allowed"
                />
                <p className="text-xs text-brand-dark/50 mt-1">
                  {t.settings.emailDisabled}
                </p>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Save size={18} />
                {profileLoading ? t.settings.savingProfile : t.settings.saveProfile}
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Lock size={20} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-brand-dark">
                  {t.settings.securitySection}
                </h2>
                <p className="text-sm text-brand-dark/50">
                  {t.settings.securityDesc}
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  {t.settings.currentPasswordLabel}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t.settings.currentPasswordPlaceholder}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  {t.settings.newPasswordLabel}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.settings.newPasswordPlaceholder}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Lock size={18} />
                {passwordLoading ? t.settings.changingPassword : t.settings.changePassword}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Profile form modal */}
      {showProfileForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-slate-100">
              <h3 className="font-display font-semibold text-brand-dark text-xl">
                {editingId ? t.settings.profiles.editProfile : t.settings.profiles.addProfile}
              </h3>
              <button
                onClick={() => setShowProfileForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="px-8 py-6 space-y-5">
              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  {t.settings.profiles.labelLabel}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.label}
                  onChange={(e) => setProfileForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder={t.settings.profiles.labelPlaceholder}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition text-sm"
                />
              </div>

              {/* Type toggle */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  {t.settings.profiles.typeLabel}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileForm((p) => ({ ...p, type: 'individual' }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      profileForm.type === 'individual'
                        ? 'bg-brand-blue text-white border-brand-blue'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-brand-blue/40'
                    }`}
                  >
                    <UserRound size={16} />
                    {t.settings.profiles.typeIndividual}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileForm((p) => ({ ...p, type: 'legal_entity' }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      profileForm.type === 'legal_entity'
                        ? 'bg-brand-blue text-white border-brand-blue'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-brand-blue/40'
                    }`}
                  >
                    <Building2 size={16} />
                    {t.settings.profiles.typeLegal}
                  </button>
                </div>
              </div>

              {/* Individual fields */}
              {isIndividual && (
                <>
                  <ProfileInput label={t.settings.profiles.fieldFullName} value={profileForm.fields.full_name || ''} onChange={(v) => setField('full_name', v)} />
                  <ProfileInput label={t.settings.profiles.fieldIIN} value={profileForm.fields.iin || ''} onChange={(v) => setField('iin', v)} />
                </>
              )}

              {/* Legal entity fields */}
              {!isIndividual && (
                <>
                  <ProfileInput label={t.settings.profiles.fieldCompanyName} value={profileForm.fields.company_name || ''} onChange={(v) => setField('company_name', v)} />
                  <ProfileInput label={t.settings.profiles.fieldBIN} value={profileForm.fields.bin || ''} onChange={(v) => setField('bin', v)} />
                  <ProfileInput label={t.settings.profiles.fieldLegalAddress} value={profileForm.fields.legal_address || ''} onChange={(v) => setField('legal_address', v)} />
                  <ProfileInput label={t.settings.profiles.fieldActualAddress} value={profileForm.fields.actual_address || ''} onChange={(v) => setField('actual_address', v)} />
                </>
              )}

              {/* Shared fields */}
              <ProfileInput label={t.settings.profiles.fieldPhone} value={profileForm.fields.phone || ''} onChange={(v) => setField('phone', v)} type="tel" />
              <ProfileInput label={t.settings.profiles.fieldEmail} value={profileForm.fields.email || ''} onChange={(v) => setField('email', v)} type="email" />
              <ProfileInput label={t.settings.profiles.fieldIBAN} value={profileForm.fields.iban || ''} onChange={(v) => setField('iban', v)} />
              <ProfileInput label={t.settings.profiles.fieldBIK} value={profileForm.fields.bik || ''} onChange={(v) => setField('bik', v)} />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex-1 bg-brand-blue text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {profileSaving ? '...' : t.settings.profiles.saveBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-medium text-sm hover:bg-slate-200 transition"
                >
                  {t.settings.profiles.cancelBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition text-sm"
      />
    </div>
  );
}