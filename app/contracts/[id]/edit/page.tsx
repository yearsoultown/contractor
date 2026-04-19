'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { Image as ImageExt } from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { FontFamily } from '@tiptap/extension-font-family'
import { Link } from '@tiptap/extension-link'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import {
	Loader2, Save, History, Link2, Share2, Plus, Copy, Check, Trash2, GitCompare, ChevronLeft, SlidersHorizontal
} from 'lucide-react'
import api, { patchContractContent } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { ContractDetail, ContractVersion } from '@/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/contexts/LanguageContext'
import { PageHeader } from '@/components/contracts/PageHeader'
import { ContractToolbar, ToolbarItem } from '@/components/contracts/ContractToolbar'
import { ShareModal } from '@/components/contracts/ShareModal'
import { extractBodyContent, reconstructHTML, scopeHeadStyles } from '@/lib/htmlEditor'
import EditorToolbar from '@/components/editor/EditorToolbar'
import PageView from '@/components/editor/PageView'
import VariablesPanel from '@/components/editor/VariablesPanel'
import { VariableNode } from '@/lib/tiptap/VariableNode'
import { PageBreakNode } from '@/lib/tiptap/PageBreakNode'
import { IndentExtension } from '@/lib/tiptap/IndentExtension'

interface ShareLink {
	share_id: string
	token: string
	expires_at: string
	created_at: string
}

type SaveStatus = 'saved' | 'saving' | 'unsaved'

const EDITOR_SCOPE = '.contract-editor-content'

const statusMap: Record<string, { label: string; className: string }> = {
	generated: { label: 'Создан', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
	draft: { label: 'Черновик', className: 'bg-slate-50 text-slate-600 border-slate-100' },
	failed: { label: 'Ошибка', className: 'bg-red-50 text-red-600 border-red-100' }
}

export default function ContractEditorPage() {
	const router = useRouter()
	const { id } = useParams<{ id: string }>()
	const { t } = useTranslation()

	const [contract, setContract] = useState<ContractDetail | null>(null)
	const [versions, setVersions] = useState<ContractVersion[]>([])
	const [shares, setShares] = useState<ShareLink[]>([])
	const [loading, setLoading] = useState(true)
	const [sharing, setSharing] = useState(false)
	const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [revokingId, setRevokingId] = useState<string | null>(null)
	const [showVariables, setShowVariables] = useState(false)

	const headRef = useRef('')
	const titleRef = useRef('')
	const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	const [pendingContent, setPendingContent] = useState<string | Record<string, unknown> | null>(null)
	const initDone = useRef(false)

	// ── Inject scoped <head> CSS ───────────────────────────────────────────────
	useEffect(() => {
		if (pendingContent === null || typeof pendingContent !== 'string') return
		const css = scopeHeadStyles(headRef.current, EDITOR_SCOPE)
		if (!css.trim()) return
		const el = document.createElement('style')
		el.id = 'contract-editor-head-styles'
		el.textContent = css
		document.head.appendChild(el)
		return () => { document.getElementById('contract-editor-head-styles')?.remove() }
	}, [pendingContent])

	// ── Tiptap editor with all Phase 2 extensions ─────────────────────────────
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			Typography,
			// Phase 2: Tables
			Table.configure({ resizable: true }),
			TableRow,
			TableCell,
			TableHeader,
			// Phase 2: Images
			ImageExt.configure({ inline: false, allowBase64: true }),
			// Phase 2: Color & Styling
			TextStyle,
			Color,
			Highlight.configure({ multicolor: true }),
			FontFamily,
			// Phase 2: Link
			Link.configure({ openOnClick: false, autolink: true }),
			// Phase 2: Typography additions
			Superscript,
			Subscript,
			TaskList,
			TaskItem.configure({ nested: true }),
			// Phase 2: Custom extensions
			PageBreakNode,
			IndentExtension,
			// Phase 4: Variable chips
			VariableNode,
		],
		content: '',
		editorProps: {
			attributes: { class: 'outline-none min-h-[900px] focus:outline-none' }
		},
		onUpdate: () => {
			setSaveStatus('unsaved')
		}
	})

	// ── Fetch contract ─────────────────────────────────────────────────────────
	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/login')
			return
		}
		api
			.get<ContractDetail>(`/contracts/${id}`)
			.then(res => {
				const c = res.data
				setContract(c)
				titleRef.current = c.title
				if (c.content_json) {
					setPendingContent(c.content_json as Record<string, unknown>)
				} else {
					const { head: h, body } = extractBodyContent(c.rendered_html || '')
					headRef.current = h
					setPendingContent(body)
				}
				// Touch last_opened_at
				api.patch(`/documents/${id}/move`, {}).catch(() => {})
			})
			.catch(() => router.push('/dashboard'))
			.finally(() => setLoading(false))
	}, [id, router])

	// ── Fetch versions + shares ───────────────────────────────────────────────
	useEffect(() => {
		api.get<ContractVersion[]>(`/contracts/${id}/versions`).then(r => setVersions(r.data ?? []))
		api.get<ShareLink[]>(`/contracts/${id}/share`).then(r => setShares(r.data ?? []))
	}, [id])

	// ── Load content once ─────────────────────────────────────────────────────
	useEffect(() => {
		if (!editor || initDone.current || pendingContent === null) return
		editor.commands.setContent(pendingContent as any, { emitUpdate: false })
		initDone.current = true
	}, [editor, pendingContent])

	// ── Save ──────────────────────────────────────────────────────────────────
	const handleSave = useCallback(
		async (navigate = true) => {
			if (!editor) return
			setSaveStatus('saving')
			try {
				const contentJson = editor.getJSON()
				const renderedHtml = reconstructHTML(headRef.current, editor.getHTML())
				await patchContractContent(id, titleRef.current, contentJson, renderedHtml)
				setSaveStatus('saved')
				if (navigate) router.push(`/contracts/${id}`)
			} catch {
				setSaveStatus('unsaved')
			}
		},
		[editor, id, router]
	)

	const handleSaveRef = useRef(handleSave)
	useEffect(() => { handleSaveRef.current = handleSave }, [handleSave])

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === 's') {
				e.preventDefault()
				handleSaveRef.current(false)
			}
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [])

	useEffect(() => () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }, [])

	// ── Share actions ─────────────────────────────────────────────────────────
	async function handleCopy(share: ShareLink) {
		await navigator.clipboard.writeText(`${window.location.origin}/share/${share.token}`)
		setCopiedId(share.share_id)
		setTimeout(() => setCopiedId(null), 2000)
	}

	async function handleRevoke(share: ShareLink) {
		setRevokingId(share.share_id)
		try {
			await api.delete(`/contracts/${id}/share/${share.share_id}`)
			setShares(prev => prev.filter(s => s.share_id !== share.share_id))
		} finally {
			setRevokingId(null)
		}
	}

	const isExpired = (exp: string) => new Date(exp) < new Date()

	// ── Toolbar drawers ────────────────────────────────────────────────────────
	const versionsDrawer = (
		<div className='space-y-2 max-h-[220px] overflow-y-auto pr-1'>
			{versions.length === 0 ? (
				<p className='text-sm text-slate-400 text-center py-2'>Нет сохранённых версий</p>
			) : (
				versions.map((v, i) => {
					const isLatest = i === 0
					const compareTarget = isLatest ? null : versions[i - 1]
					return (
						<div key={v.version_number} className='flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5'>
							<div className='w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0'>
								<span className='text-[11px] font-bold text-slate-500'>{v.version_number}</span>
							</div>
							<div className='flex-1 min-w-0'>
								<span className='text-xs font-semibold text-slate-700'>
									{v.version_name ? v.version_name : `Версия ${v.version_number}`}
								</span>
								<span className='text-xs text-slate-400 ml-2'>
									{new Date(v.created_at).toLocaleString('ru-RU', {
										day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
									})}
								</span>
							</div>
							<button
								onClick={() => router.push(
									isLatest
										? `/contracts/${id}/versions/diff?v1=${v.version_number}&v2=current`
										: `/contracts/${id}/versions/diff?v1=${v.version_number}&v2=${compareTarget!.version_number}`
								)}
								className='flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50 shrink-0 min-h-[32px]'
							>
								<GitCompare size={13} />
								<span className='hidden sm:inline'>
									{isLatest ? 'Сравнить с текущим' : `Сравнить с v${compareTarget!.version_number}`}
								</span>
							</button>
						</div>
					)
				})
			)}
		</div>
	)

	const sharesDrawer = (
		<div>
			{shares.length === 0 ? (
				<div className='text-center py-3'>
					<p className='text-sm text-slate-400 mb-3'>Нет активных ссылок.</p>
					<button onClick={() => setSharing(true)} className='inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors'>
						<Plus size={13} /> Создать ссылку
					</button>
				</div>
			) : (
				<div>
					<div className='flex justify-end mb-2'>
						<button onClick={() => setSharing(true)} className='flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors'>
							<Plus size={13} /> Новая ссылка
						</button>
					</div>
					<div className='space-y-2 max-h-[220px] overflow-y-auto pr-1'>
						{shares.map(share => {
							const expired = isExpired(share.expires_at)
							const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${share.token}`
							return (
								<div key={share.share_id} className={cn('flex items-center gap-2 rounded-xl border px-3 py-2.5', expired ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-slate-50 border-slate-200')}>
									<span className='flex-1 text-xs font-mono text-slate-500 truncate min-w-0'>{url}</span>
									<span className={cn('text-xs whitespace-nowrap shrink-0', expired ? 'text-red-400' : 'text-slate-400')}>
										{expired ? 'Истекла ' : 'До '}
										{new Date(share.expires_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
									</span>
									{!expired && (
										<button onClick={() => handleCopy(share)} className='p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors shrink-0 min-h-[32px]'>
											{copiedId === share.share_id ? <Check size={14} className='text-emerald-500' /> : <Copy size={14} />}
										</button>
									)}
									<button onClick={() => handleRevoke(share)} disabled={revokingId === share.share_id} className='p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-40 min-h-[32px]'>
										{revokingId === share.share_id ? <Loader2 size={14} className='animate-spin' /> : <Trash2 size={14} />}
									</button>
								</div>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)

	const toolbarItems: ToolbarItem[] = [
		...(versions.length > 0 ? [{ id: 'versions', icon: History, label: 'История', badge: versions.length, content: versionsDrawer }] : []),
		...(contract?.status === 'generated' ? [{ id: 'sharing', icon: Link2, label: 'Доступ', badge: shares.length, content: sharesDrawer }] : [])
	]

	const statusBadge = contract ? (
		<span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0', statusMap[contract.status]?.className || 'bg-slate-50 text-slate-600 border-slate-100')}>
			{statusMap[contract.status]?.label || contract.status}
		</span>
	) : null

	const formattedDate = contract
		? new Date(contract.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
		: ''

	const saveLabel = saveStatus === 'saving' ? 'Сохранение...' : saveStatus === 'saved' ? 'Сохранено' : null

	return (
		<div className='min-h-screen bg-gray-200 flex flex-col'>
			{/* ── PageHeader ── */}
			<PageHeader onBack={() => router.push(`/contracts/${id}`)} backLabel={t.contractDetail.back} title='Редактирование'>
				{saveLabel && (
					<span className={cn('text-xs font-medium whitespace-nowrap', saveStatus === 'saving' ? 'text-slate-400' : 'text-emerald-600')}>
						{saveLabel}
					</span>
				)}
				{saveStatus === 'unsaved' && <span className='w-2 h-2 rounded-full bg-amber-400 shrink-0' title='Несохранённые изменения' />}
				<button
					onClick={() => setShowVariables(!showVariables)}
					className={cn(
						'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all',
						showVariables ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
					)}
					title="Variable panel"
				>
					<SlidersHorizontal size={15} />
					<span className='hidden sm:inline'>Variables</span>
				</button>
				{contract?.status === 'generated' && (
					<button onClick={() => setSharing(true)} className='w-full md:w-auto flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all'>
						<Share2 size={15} /> Поделиться
					</button>
				)}
				<button
					onClick={() => handleSave(true)}
					disabled={saveStatus === 'saving'}
					className='w-full md:w-auto bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-brand-blue/10 disabled:opacity-60'
				>
					{saveStatus === 'saving' ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
					Сохранить
				</button>
			</PageHeader>

			{/* ── ContractToolbar ── */}
			{contract && (
				<ContractToolbar title={contract.title} statusBadge={statusBadge} date={formattedDate} items={toolbarItems} drawerOffset={56} />
			)}

			{/* ── Formatting toolbar (Phase 2) — fixed, centered pill ── */}
			<div className='fixed top-[120px] left-0 right-0 z-20 flex justify-center pt-6'>
				<EditorToolbar
					editor={editor}
					onImageUpload={async (file) => {
						// Inline base64 for now — replace with upload endpoint in Phase 2
						return new Promise((resolve, reject) => {
							const reader = new FileReader()
							reader.onload = (e) => resolve(e.target?.result as string)
							reader.onerror = reject
							reader.readAsDataURL(file)
						})
					}}
				/>
			</div>

			{/* ── Editor area — padded to clear the fixed toolbar ── */}
			<div className="flex-1 pt-[196px]">
				{loading ? (
					<div className='flex items-center justify-center py-24 text-slate-400'>
						<Loader2 size={32} className='animate-spin' />
					</div>
				) : (
					<PageView editor={editor} />
				)}
			</div>

			{/* ── Variables panel (Phase 4) ── */}
			<VariablesPanel editor={editor} open={showVariables} onClose={() => setShowVariables(false)} />

			{sharing && contract && (
				<ShareModal
					contractId={contract.id}
					contractTitle={contract.title}
					onClose={() => setSharing(false)}
					onCreated={share => setShares(prev => [share as ShareLink, ...prev])}
				/>
			)}
		</div>
	)
}