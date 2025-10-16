
import React, { useState, useEffect, useMemo } from 'react';
import { Script } from '../types';
import { XIcon } from './icons/XIcon';
import { TagIcon } from './icons/TagIcon';

interface BatchTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTags: (scriptIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => void;
  selectedScriptIds: string[];
  allScripts: Script[];
}

const BatchTagModal: React.FC<BatchTagModalProps> = ({
  isOpen,
  onClose,
  onApplyTags,
  selectedScriptIds,
  allScripts,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);

  const selectedScripts = useMemo(() => {
    return allScripts.filter(s => selectedScriptIds.includes(s.id));
  }, [allScripts, selectedScriptIds]);

  const commonTags = useMemo(() => {
    if (selectedScripts.length === 0) return [];
    const firstScriptTags = new Set(selectedScripts[0].tags);
    for (let i = 1; i < selectedScripts.length; i++) {
        const currentScriptTags = new Set(selectedScripts[i].tags);
        for (const tag of Array.from(firstScriptTags)) {
            if (!currentScriptTags.has(tag)) {
                firstScriptTags.delete(tag);
            }
        }
    }
    return Array.from(firstScriptTags);
  }, [selectedScripts]);

  useEffect(() => {
    if (!isOpen) {
      setTagInput('');
      setTagsToAdd([]);
      setTagsToRemove([]);
    }
  }, [isOpen]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key !== 'Enter' && e.key !== ',') || !tagInput.trim()) return;
    e.preventDefault();
    const newTag = tagInput.trim().toLowerCase();
    if (!tagsToAdd.includes(newTag) && !commonTags.includes(newTag)) {
      setTagsToAdd(prev => [...prev, newTag]);
    }
    setTagInput('');
  };

  const handleToggleRemoveTag = (tag: string) => {
    setTagsToRemove(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  
  const handleRemoveNewTag = (tag: string) => {
    setTagsToAdd(prev => prev.filter(t => t !== tag));
  };
  
  const handleApply = () => {
    onApplyTags(selectedScriptIds, tagsToAdd, tagsToRemove);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-lg transform scale-95 transition-transform duration-300 animate-slide-up-fast" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Edit Tags for {selectedScriptIds.length} Scripts</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full" title="Close modal">
            <XIcon className="w-6 h-6"/>
          </button>
        </header>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Common Tags</label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-800 border border-slate-700 rounded-md min-h-[44px]">
              {commonTags.length > 0 ? commonTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => handleToggleRemoveTag(tag)}
                  className={`flex items-center text-sm font-medium pl-3 pr-1 py-1 rounded-full transition-colors duration-200 ${tagsToRemove.includes(tag) ? 'bg-red-800 text-red-200 line-through' : 'bg-slate-700 text-slate-300 hover:bg-red-800'}`}
                  title={tagsToRemove.includes(tag) ? `Keep '${tag}'` : `Remove '${tag}'`}
                >
                  <span>{tag}</span>
                  <XIcon className="w-3.5 h-3.5 ml-1.5" />
                </button>
              )) : <span className="text-slate-500 text-sm p-1">No common tags found.</span>}
            </div>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-2">Add New Tags</label>
            <div className="flex items-center flex-wrap gap-2 p-2 bg-slate-800 border border-slate-700 rounded-md">
               <TagIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
              {tagsToAdd.map(tag => (
                <div key={tag} className="flex items-center bg-indigo-800 text-indigo-200 text-sm font-medium pl-3 pr-1 py-1 rounded-full">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveNewTag(tag)} className="ml-1.5 p-0.5 rounded-full hover:bg-indigo-700"><XIcon className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <input type="text" id="tags" value={tagInput} onChange={handleTagInputChange} onKeyDown={handleAddTag} className="flex-grow bg-transparent text-white outline-none" placeholder="Add a tag..."/>
            </div>
          </div>
        </div>

        <footer className="flex justify-end items-center p-6 border-t border-slate-800 bg-slate-950/50">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition mr-3">Cancel</button>
          <button type="button" onClick={handleApply} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition">Apply Tags</button>
        </footer>
      </div>
    </div>
  );
};

export default BatchTagModal;
