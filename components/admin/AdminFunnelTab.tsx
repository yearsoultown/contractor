'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import type { FunnelResponse, FunnelUser } from '@/types';
import { cn } from '@/lib/utils';
import {
  Globe,
  UserCheck,
  FileSignature,
  Sparkles,
  Zap,
  Trophy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

// ─── Stage config ─────────────────────────────────────────────────────────────

const STAGES = [
  {
    key: 'visits' as const,
    label: 'Посетили сайт',
    icon: Globe,
    color: 'bg-slate-100 text-slate-500',
    dot: 'bg-slate-400',
  },
  {
    key: 'registered' as const,
    label: 'Зарегистрировались',
    icon: UserCheck,
    color: 'bg-blue-50 text-brand-blue',
    dot: 'bg-brand-blue',
  },
  {
    key: 'agreement' as const,
    label: 'Создали договор',
    icon: FileSignature,
    color: 'bg-indigo-50 text-indigo-600',
    dot: 'bg-indigo-500',
  },
  {
    key: 'prefill_add' as const,
    label: 'Добавили профиль',
    icon: Sparkles,
    color: 'bg-violet-50 text-violet-600',
    dot: 'bg-violet-500',
  },
  {
    key: 'prefill_used' as const,
    label: 'Использовали профиль',
    icon: Zap,
    color: 'bg-amber-50 text-amber-600',
    dot: 'bg-amber-500',
  },
  {
    key: 'agreement_5' as const,
    label: '5+ договоров',
    icon: Trophy,
    color: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
  },
] as const;

type StageSummaryKey = 'visits' | 'registered' | 'agreement' | 'prefill_add' | 'prefill_used' | 'agreement_5';

const STAGE_BADGE_MAP: Record<string, { label: string; className: string }> = {
  registered:    { label: 'Зарег.',          className: 'bg-blue-50 text-brand-blue border-blue-200' },
  agreement:     { label: 'Договор',         className: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  prefill_add:   { label: 'Профиль +',       className: 'bg-violet-50 text-violet-600 border-violet-200' },
  prefill_used:  { label: 'Профиль исп.',    className: 'bg-amber-50 text-amber-600 border-amber-200' },
  agreement_5:   { label: '5+ договоров',    className: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
};

function pctStr(n: number) {
  return n.toFixed(1) + '%';
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── StepDot ─────────────────────────────────────────────────────────────────

function StepDot({
  done,
  label,
  date,
  color,
}: {
  done: boolean;
  label: string;
  date: string | null;
  color: string;
}) {
  return (
    <div
      className={cn(
        'relative group flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border',
        done
          ? 'bg-white text-slate-700 border-slate-200'
          : 'bg-slate-50 text-slate-300 border-slate-100',
      )}
      title={done && date ? `${label}: ${fmt(date)}` : label}
    >
      <span
        className={cn('w-2 h-2 rounded-full shrink-0', done ? color : 'bg-slate-200')}
      />
      <span>{label}</span>
      {done && date && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {fmt(date)}
        </span>
      )}
    </div>
  );
}

// ─── AdminFunnelTab ───────────────────────────────────────────────────────────

type DatePreset = '7d' | '30d' | 'custom';

export function AdminFunnelTab() {
  const [data, setData] = useState<FunnelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [preset, setPreset] = useState<DatePreset>('30d');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [stageFilter, setStageFilter] = useState<StageSummaryKey | 'all'>('all');
  const [sortAsc, setSortAsc] = useState(false);

  const buildQuery = useCallback(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const isoDate = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (preset === '7d') {
      const f = new Date(now);
      f.setDate(f.getDate() - 7);
      return `?from=${isoDate(f)}&to=${isoDate(now)}`;
    }
    if (preset === '30d') {
      const f = new Date(now);
      f.setDate(f.getDate() - 30);
      return `?from=${isoDate(f)}&to=${isoDate(now)}`;
    }
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    return params.toString() ? `?${params}` : '';
  }, [preset, from, to]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<FunnelResponse>(`/admin/funnel${buildQuery()}`);
      setData(res.data);
    } catch {
      setError('Не удалось загрузить данные воронки');
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => { load(); }, [load]);

  const STAGE_ORDER: StageSummaryKey[] = [
    'visits', 'registered', 'agreement', 'prefill_add', 'prefill_used', 'agreement_5',
  ];

  const filteredUsers = data
    ? [...data.users]
        .filter(u => {
          if (stageFilter === 'all') return true;
          if (stageFilter === 'visits') return true;
          if (stageFilter === 'registered') return true;
          if (stageFilter === 'agreement') return !!u.first_agree_at;
          if (stageFilter === 'prefill_add') return !!u.prefill_add_at;
          if (stageFilter === 'prefill_used') return !!u.prefill_used_at;
          if (stageFilter === 'agreement_5') return !!u.agree5_at;
          return true;
        })
        .sort((a, b) => {
          const order = STAGE_ORDER.indexOf(a.funnel_stage) - STAGE_ORDER.indexOf(b.funnel_stage);
          return sortAsc ? order : -order;
        })
    : [];

  const conversionPairs: { label: string; value: number }[] = data
    ? [
        { label: 'Посетили → Зарег.', value: data.conversion.visit_to_register },
        { label: 'Зарег. → Договор', value: data.conversion.register_to_agreement },
        { label: 'Договор → Профиль', value: data.conversion.agreement_to_prefill },
        { label: 'Профиль → Исп.', value: data.conversion.prefill_to_used },
        { label: 'Исп. → 5+ договоров', value: data.conversion.prefill_used_to_agree5 },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        {(['7d', '30d', 'custom'] as DatePreset[]).map(p => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition',
              preset === p
                ? 'bg-brand-blue text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : 'Свой период'}
          </button>
        ))}
        {preset === 'custom' && (
          <>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
            />
            <span className="text-slate-400">—</span>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
            />
          </>
        )}
        <button
          onClick={load}
          className="px-3 py-1.5 rounded-lg text-sm bg-brand-blue text-white hover:bg-blue-600 transition"
        >
          Применить
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-slate-400 text-sm py-8 text-center">Загрузка...</div>
      )}

      {!loading && data && (
        <>
          {/* ── Stage summary cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STAGES.map((stage, i) => {
              const count = data.summary[stage.key as StageSummaryKey];
              const conv = conversionPairs[i - 1];
              const Icon = stage.icon;
              return (
                <div
                  key={stage.key}
                  className={cn(
                    'relative p-4 rounded-2xl border cursor-pointer transition',
                    stageFilter === stage.key
                      ? 'border-brand-blue ring-1 ring-brand-blue'
                      : 'border-slate-100 hover:border-slate-200',
                    stage.color,
                  )}
                  onClick={() =>
                    setStageFilter(prev =>
                      prev === stage.key ? 'all' : (stage.key as StageSummaryKey),
                    )
                  }
                >
                  {i > 0 && conv && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                      <ArrowRight className="w-3 h-3" />
                      <span>{pctStr(conv.value)}</span>
                    </div>
                  )}
                  <Icon className="w-5 h-5 mb-2 opacity-70" />
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs mt-0.5 opacity-70">{stage.label}</div>
                </div>
              );
            })}
          </div>

          {/* ── Conversion row ── */}
          <div className="flex flex-wrap gap-2">
            {conversionPairs.map(cp => (
              <span
                key={cp.label}
                className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600"
              >
                {cp.label}: <strong>{pctStr(cp.value)}</strong>
              </span>
            ))}
          </div>

          {/* ── Users table ── */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-700">
                Пользователи ({filteredUsers.length})
              </span>
              <button
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition"
                onClick={() => setSortAsc(p => !p)}
              >
                Стадия {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="text-left px-4 py-2 font-medium">Email</th>
                    <th className="text-left px-4 py-2 font-medium">Имя</th>
                    <th className="text-left px-4 py-2 font-medium">Дата рег.</th>
                    <th className="text-left px-4 py-2 font-medium">Прогресс</th>
                    <th className="text-right px-4 py-2 font-medium">Договоров</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u.user_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 text-slate-700">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">{u.full_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {fmt(u.registered_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {STAGES.slice(1).map(stage => {
                            const badge = STAGE_BADGE_MAP[stage.key];
                            const dateMap: Record<string, string | null> = {
                              registered: u.registered_at,
                              agreement: u.first_agree_at,
                              prefill_add: u.prefill_add_at,
                              prefill_used: u.prefill_used_at,
                              agreement_5: u.agree5_at,
                            };
                            return (
                              <StepDot
                                key={stage.key}
                                done={!!dateMap[stage.key]}
                                label={badge.label}
                                date={dateMap[stage.key]}
                                color={stage.dot}
                              />
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 font-medium">
                        {u.total_agreements}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}