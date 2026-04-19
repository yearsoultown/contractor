'use client';

import { Folder } from '@/types';
import { ChevronRight, ChevronDown, FolderIcon, FolderOpen, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: (parentId?: string | null) => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
}

interface FolderNodeProps {
  folder: Folder;
  allFolders: Folder[];
  depth: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (parentId?: string | null) => void;
  onRename: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

function FolderNode({ folder, allFolders, depth, selectedId, onSelect, onCreate, onRename, onDelete }: FolderNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const children = allFolders.filter(f => f.parent_id === folder.id);
  const isSelected = selectedId === folder.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer group text-sm
          ${isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(folder.id)}
      >
        {children.length > 0 ? (
          <button
            className="p-0.5 hover:bg-gray-200 rounded"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {isSelected && expanded ? (
          <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
        ) : (
          <FolderIcon className="w-4 h-4 text-yellow-500 shrink-0" />
        )}

        <span className="truncate flex-1">{folder.name}</span>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 relative">
          <button
            className="p-0.5 hover:bg-gray-200 rounded"
            onClick={(e) => { e.stopPropagation(); onCreate(folder.id); }}
            title="New subfolder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-0.5 hover:bg-gray-200 rounded"
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[130px] py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => { setShowMenu(false); onRename(folder); }}
              >
                <Pencil className="w-3.5 h-3.5" /> Rename
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                onClick={() => { setShowMenu(false); onDelete(folder); }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && children.map(child => (
        <FolderNode
          key={child.id}
          folder={child}
          allFolders={allFolders}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function FolderTree({ folders, selectedFolderId, onSelectFolder, onCreateFolder, onRenameFolder, onDeleteFolder }: FolderTreeProps) {
  const rootFolders = folders.filter(f => !f.parent_id);

  return (
    <div className="space-y-0.5">
      {/* "My Documents" root */}
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm font-medium
          ${!selectedFolderId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
        onClick={() => onSelectFolder(null)}
      >
        <FolderOpen className="w-4 h-4 text-blue-500" />
        <span>My Documents</span>
      </div>

      {rootFolders.map(folder => (
        <FolderNode
          key={folder.id}
          folder={folder}
          allFolders={folders}
          depth={0}
          selectedId={selectedFolderId}
          onSelect={onSelectFolder}
          onCreate={onCreateFolder}
          onRename={onRenameFolder}
          onDelete={onDeleteFolder}
        />
      ))}

      <button
        className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 mt-1"
        onClick={() => onCreateFolder(null)}
      >
        <Plus className="w-4 h-4" />
        New folder
      </button>
    </div>
  );
}