'use client';

import { useState, useEffect } from 'react';

interface Collaborator {
  clientId: number;
  name: string;
  color: string;
}

interface CollaboratorAvatarsProps {
  awareness: any; // Yjs Awareness object
}

export default function CollaboratorAvatars({ awareness }: CollaboratorAvatarsProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    if (!awareness) return;

    const update = () => {
      const states = Array.from(awareness.getStates().entries()) as [number, any][];
      const collab = states
        .filter(([clientId]) => clientId !== awareness.clientID)
        .map(([clientId, state]) => ({
          clientId,
          name: state.user?.name || 'Anonymous',
          color: state.user?.color || '#6B7280',
        }));
      setCollaborators(collab);
    };

    awareness.on('change', update);
    update();
    return () => awareness.off('change', update);
  }, [awareness]);

  if (collaborators.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {collaborators.slice(0, 5).map((c) => (
        <div
          key={c.clientId}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
          style={{ backgroundColor: c.color }}
          title={c.name}
        >
          {c.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {collaborators.length > 5 && (
        <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
          +{collaborators.length - 5}
        </div>
      )}
    </div>
  );
}