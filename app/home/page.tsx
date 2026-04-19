'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Grid, List, ChevronRight } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { listRootContents, listFolderContents, createFolder, renameFolder, deleteFolder } from '@/lib/api';
import { Folder, Document, FolderContents } from '@/types';
import DocumentGrid from '@/components/home/DocumentGrid';
import FolderTree from '@/components/home/FolderTree';
import NewDocumentModal from '@/components/home/NewDocumentModal';

export default function HomePage() {
  const router = useRouter();
  const [contents, setContents] = useState<FolderContents>({ folder: null, folders: [], documents: [] });
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [crumbs, setCrumbs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const loadContents = useCallback(async (folderId: string | null) => {
    setLoading(true);
    try {
      const res = folderId
        ? await listFolderContents(folderId)
        : await listRootContents();
      setContents(res.data);
      // Collect all folders for the sidebar tree
      if (!folderId) {
        setAllFolders(res.data.folders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContents(selectedFolderId);
  }, [selectedFolderId, loadContents]);

  const handleSelectFolder = (id: string | null) => {
    setSelectedFolderId(id);
    if (id === null) {
      setCrumbs([]);
    } else {
      const folder = allFolders.find(f => f.id === id);
      if (folder) {
        setCrumbs([{ id: folder.id, name: folder.name }]);
      }
    }
  };

  const handleCreateFolder = async (parentId?: string | null) => {
    const name = window.prompt('Folder name:');
    if (!name?.trim()) return;
    try {
      await createFolder(name.trim(), parentId);
      await loadContents(selectedFolderId);
      // Refresh sidebar
      const root = await listRootContents();
      setAllFolders(root.data.folders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameFolder = async (folder: Folder) => {
    const name = window.prompt('New name:', folder.name);
    if (!name?.trim() || name === folder.name) return;
    try {
      await renameFolder(folder.id, name.trim());
      await loadContents(selectedFolderId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (!window.confirm(`Delete folder "${folder.name}" and all its contents?`)) return;
    try {
      await deleteFolder(folder.id);
      if (selectedFolderId === folder.id) setSelectedFolderId(null);
      await loadContents(null);
      const root = await listRootContents();
      setAllFolders(root.data.folders);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocuments = searchQuery
    ? contents.documents.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contents.documents;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">AIDOGOVOR</h1>
          <p className="text-xs text-gray-500 mt-0.5">Legal Documents</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <FolderTree
            folders={allFolders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={handleSelectFolder}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Settings
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm text-gray-600 flex-1">
            <button
              onClick={() => handleSelectFolder(null)}
              className="hover:text-blue-600 font-medium"
            >
              My Documents
            </button>
            {crumbs.map((crumb, i) => (
              <span key={crumb.id} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() => handleSelectFolder(crumb.id)}
                  className={i === crumbs.length - 1 ? 'font-medium text-gray-900' : 'hover:text-blue-600'}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Subfolder list */}
              {contents.folders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Folders</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {contents.folders.map(folder => (
                      <button
                        key={folder.id}
                        className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                        onClick={() => handleSelectFolder(folder.id)}
                      >
                        <span className="text-2xl">📁</span>
                        <span className="text-sm font-medium text-gray-700 truncate">{folder.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  Documents {filteredDocuments.length > 0 && `(${filteredDocuments.length})`}
                </h3>
                <DocumentGrid documents={filteredDocuments} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* New document modal */}
      <NewDocumentModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        folderId={selectedFolderId}
      />
    </div>
  );
}