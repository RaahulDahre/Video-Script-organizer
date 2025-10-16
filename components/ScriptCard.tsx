import React from 'react';
import { Script } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { TagIcon } from './icons/TagIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ScriptCardProps {
  script: Script;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, isSelected: boolean) => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, onEdit, onDelete, isSelected, onSelect }) => {
  
  const formattedDate = new Date(script.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
        className={`group relative bg-slate-900 rounded-xl shadow-lg border-2 transition-all duration-300 flex flex-col h-full hover:shadow-indigo-500/20 hover:-translate-y-1 ${isSelected ? `shadow-indigo-500/40 ${script.color}` : 'border-slate-800 hover:border-indigo-500'}`}
    >
        <div 
          className={`absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? '!opacity-100' : ''}`}
          onClick={stopPropagation}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(script.id, e.target.checked)}
                aria-label={`Select script titled ${script.title}`}
                className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
        </div>
      <div className="p-6 pt-12 flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 truncate" title={script.title}>{script.title}</h3>
        <p className="text-slate-400 text-sm mb-4 h-10 overflow-hidden line-clamp-2">
          {script.description || 'No description provided.'}
        </p>
        <div className="flex items-center text-xs text-slate-500 mb-4">
            <CalendarIcon className="w-4 h-4 mr-2"/>
            <span>Created on {formattedDate}</span>
        </div>
        {script.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            <TagIcon className="w-4 h-4 text-slate-500 mt-1" />
            {script.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-slate-700/50 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {script.tags.length > 3 && <span className="text-slate-500 text-xs py-1">+ {script.tags.length - 3} more</span>}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end p-4 bg-slate-950/50 border-t border-slate-800 rounded-b-xl" onClick={stopPropagation}>
        <button
          onClick={() => onEdit(script.id)}
          title={`Edit "${script.title}"`}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(script.id)}
          title={`Delete "${script.title}"`}
          className="p-2 ml-2 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;