'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { AnalysisResult, AIIssue } from '@/types/ai_analysis';

interface AIAnalysisPanelProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
  error: string | null;
}

function cleanSummary(summary: string): string {
  if (summary.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(summary);
      if (parsed.summary) return parsed.summary;
    } catch {
      // fall through
    }
  }
  return summary;
}

export function AIAnalysisPanel({ analysis, loading, onAnalyze, error }: AIAnalysisPanelProps) {
  const { t } = useTranslation();
  const [expandedIssues, setExpandedIssues] = useState<Record<number, boolean>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const analysisSteps = [
    t.aiAnalysis.steps.reading,
    t.aiAnalysis.steps.checkingNorms,
    t.aiAnalysis.steps.identifyingRisks,
    t.aiAnalysis.steps.generatingReport,
  ];

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      return;
    }
    intervalRef.current = setInterval(() => {
      setStepIndex(prev => {
        const next = prev + 1;
        if (next >= analysisSteps.length - 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return analysisSteps.length - 1;
        }
        return next;
      });
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading, analysisSteps.length]);

  const toggleIssue = (idx: number) => {
    setExpandedIssues(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'critical': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Info className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <Zap className="w-4 h-4 fill-current" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{t.aiAnalysis.title}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Local LLM • RAG</p>
          </div>
        </div>

        {!analysis && !loading && !error && (
          <button
            onClick={onAnalyze}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-brand-blue/20"
          >
            <Sparkles className="w-4 h-4" />
            {t.aiAnalysis.btnAnalyze}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Loading: thinking animation + progress bar */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 space-y-8">
            {/* Pulsing dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-brand-blue"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </div>

            {/* Progress bar + step label */}
            <div className="w-full space-y-3">
              {/* Step indicators */}
              <div className="flex justify-between mb-1">
                {analysisSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors duration-500 ${
                      i < stepIndex
                        ? 'bg-brand-blue border-brand-blue text-white'
                        : i === stepIndex
                        ? 'border-brand-blue text-brand-blue bg-brand-blue/10'
                        : 'border-slate-200 text-slate-300 bg-white'
                    }`}
                    animate={i === stepIndex ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, repeat: i === stepIndex ? Infinity : 0, ease: 'easeInOut' }}
                  >
                    {i < stepIndex ? '✓' : i + 1}
                  </motion.div>
                ))}
              </div>

              {/* Track */}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                {/* Filled portion */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-brand-blue rounded-full"
                  animate={{ width: `${((stepIndex + 1) / analysisSteps.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-6rem', '520px'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.3 }}
                />
              </div>

              {/* Current step label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm font-medium text-slate-600 text-center"
                >
                  {analysisSteps[stepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">{t.aiAnalysis.error}</p>
              <p className="text-sm text-slate-500 max-w-[220px]">{error}</p>
            </div>
            <button
              onClick={onAnalyze}
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-brand-blue/20"
            >
              <Sparkles className="w-4 h-4" />
              {t.aiAnalysis.retry}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!analysis && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{t.aiAnalysis.btnAnalyze}</p>
              <p className="text-sm text-slate-500 max-w-[200px] mt-1">
                {t.aiAnalysis.analyzing}
              </p>
            </div>
          </div>
        )}

        {analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Risk Dashboard */}
            <div className="grid grid-cols-2 gap-3">
              <div className={cn(
                "p-4 rounded-2xl border flex flex-col items-center text-center",
                getRiskColor(analysis.risk_level)
              )}>
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-1">
                  {t.aiAnalysis.riskLevel}
                </span>
                <span className="text-lg font-bold">
                  {t.aiAnalysis.riskLevels[analysis.risk_level] || analysis.risk_level}
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                  {t.aiAnalysis.healthScore}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-2xl font-black",
                    analysis.health_score > 80 ? "text-emerald-600" :
                    analysis.health_score > 50 ? "text-amber-600" : "text-red-600"
                  )}>
                    {analysis.health_score}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {t.aiAnalysis.summary}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {cleanSummary(analysis.summary)}
              </p>
            </div>

            {/* Issues */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
                <span>{t.aiAnalysis.issues} ({analysis.issues.length})</span>
                {analysis.issues.length === 0 && (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.aiAnalysis.noIssues}
                  </span>
                )}
              </h4>

              <div className="space-y-2">
                <AnimatePresence>
                  {analysis.issues.map((issue, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      className="border border-slate-100 rounded-xl overflow-hidden bg-white hover:border-slate-200 transition-colors"
                    >
                      <button
                        onClick={() => toggleIssue(idx)}
                        className="w-full p-3 flex items-start gap-3 text-left"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          getRiskColor(issue.severity)
                        )}>
                          {getSeverityIcon(issue.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-none mb-1">
                            {t.aiAnalysis.categories[issue.category] || issue.category}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                            {issue.explanation}
                          </p>
                        </div>
                        <div className="pt-1 text-slate-400">
                          {expandedIssues[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedIssues[idx] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-3 pb-3 pt-1 border-t border-slate-50"
                          >
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                              {issue.explanation}
                            </p>
                            {issue.clause && (
                                <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-slate-300">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Фрагмент из документа:</p>
                                    <p className="text-xs italic text-slate-500 font-medium">"{issue.clause}"</p>
                                </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  {t.aiAnalysis.recommendations}
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-700 font-medium bg-brand-soft-blue/30 p-3 rounded-xl border border-brand-blue/5">
                      <Zap className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer / Re-analyze */}
      {analysis && !loading && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={onAnalyze}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-blue" />
            {t.aiAnalysis.btnAnalyze}
          </button>
        </div>
      )}
    </div>
  );
}