import React, { useState, useMemo } from 'react';
import { Script, Platform } from '../types';
import { PLATFORMS } from '../constants';
import ScriptCard from './ScriptCard';
import { SearchIcon } from './icons/SearchIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';
import { TagIcon } from './icons/TagIcon';
import { ImportIcon } from './icons/ImportIcon';
import { ExportIcon } from './icons/ExportIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ScriptAreaProps {
  platform: Platform;
  scripts: Script[];
  onEditScript: (id: string) => void;
  onDeleteScript: (id: string) => void;
  onBatchDelete: () => void;
  onAddNew: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenBatchTagModal: () => void;
  selectedScriptIds: string[];
  setSelectedScriptIds: (ids: string[]) => void;
  allScriptsCount: number;
  isSidebarVisible: boolean;
  onOpenSidebar: () => void;
}

const ScriptArea: React.FC<ScriptAreaProps> = ({
  platform,
  scripts,
  onEditScript,
  onDeleteScript,
  onBatchDelete,
  onAddNew,
  undo,
  redo,
  canUndo,
  canRedo,
  onOpenBatchTagModal,
  selectedScriptIds,
  setSelectedScriptIds,
  allScriptsCount,
  isSidebarVisible,
  onOpenSidebar
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const platformInfo = PLATFORMS.find((p) => p.name === platform);

  const filteredScripts = useMemo(() => {
    return scripts.filter(
      (script) =>
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [scripts, searchTerm]);
  
  const handleSelectScript = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedScriptIds([...selectedScriptIds, id]);
    } else {
      setSelectedScriptIds(selectedScriptIds.filter(scriptId => scriptId !== id));
    }
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedScriptIds(filteredScripts.map(s => s.id));
    } else {
      setSelectedScriptIds([]);
    }
  };

  const isAllSelected = filteredScripts.length > 0 && selectedScriptIds.length === filteredScripts.length;

  const handleExport = () => {
    if (allScriptsCount === 0) {
        alert("No scripts to export.");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('scripts') || '[]');
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `script-io-backup-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedScripts = JSON.parse(event.target?.result as string);
                    if (Array.isArray(importedScripts)) {
                        // A more robust implementation would validate the script structure
                        localStorage.setItem('scripts', JSON.stringify(importedScripts));
                        alert('Import successful! The page will now reload.');
                        window.location.reload();
                    } else {
                        throw new Error("Invalid format");
                    }
                } catch (error) {
                    alert('Import failed: Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/50">
      <header className="flex-shrink-0 bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center">
            {!isSidebarVisible && (
              <button onClick={onOpenSidebar} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white mr-4" title="Expand sidebar">
                <ChevronRightIcon className="w-6 h-6"/>
              </button>
            )}
            {platformInfo && <span className={`${platformInfo.color} mr-4`}>{React.cloneElement(platformInfo.icon, { className: 'w-8 h-8'})}</span>}
            <h1 className="text-3xl font-bold text-white">{platform} Scripts</h1>
            <span className="ml-4 text-sm font-medium bg-slate-700/50 text-slate-300 py-1 px-3 rounded-full">{filteredScripts.length} / {scripts.length}</span>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Undo"><UndoIcon className="w-5 h-5"/></button>
            <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Redo"><RedoIcon className="w-5 h-5"/></button>
            <button onClick={handleImport} className="p-2 rounded-md hover:bg-slate-700" title="Import Scripts"><ImportIcon className="w-5 h-5"/></button>
            <button onClick={handleExport} className="p-2 rounded-md hover:bg-slate-700" title="Export All Scripts"><ExportIcon className="w-5 h-5"/></button>
        </div>
      </header>
      
      {selectedScriptIds.length > 0 ? (
        <div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-slate-700 bg-slate-800/50 animate-fade-in-fast">
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="select-all-contextual"
                    className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                />
                <label htmlFor="select-all-contextual" className="ml-3 text-sm font-semibold text-slate-200">
                    {selectedScriptIds.length} item{selectedScriptIds.length > 1 ? 's' : ''} selected
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={onOpenBatchTagModal}
                    className="flex items-center justify-center px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 transition"
                    title="Edit tags for selected scripts"
                >
                    <TagIcon className="w-5 h-5 mr-2" /> Edit Tags
                </button>
                <button
                    onClick={onBatchDelete}
                    className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition"
                    title="Delete selected scripts"
                >
                    <TrashIcon className="w-5 h-5 mr-2" /> Delete
                </button>
            </div>
        </div>
        ) : (
        <div className="flex-shrink-0 p-6 flex items-center justify-between border-b border-slate-800">
            <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder={`Search ${platform} scripts...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={onAddNew} className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-500 transition">
                    <PlusIcon className="w-5 h-5 mr-2" /> New Script
                </button>
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {filteredScripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={onEditScript}
                onDelete={onDeleteScript}
                isSelected={selectedScriptIds.includes(script.id)}
                onSelect={handleSelectScript}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
            <div className="w-48 h-48 opacity-20">
              {platformInfo?.placeholder}
            </div>
            <h2 className="text-2xl font-semibold mt-6 text-slate-400">No scripts found</h2>
            <p className="mt-2 max-w-md">
              {searchTerm 
                ? `No scripts match your search term "${searchTerm}". Try another search.`
                : `There are no scripts for ${platform} yet. Click 'New Script' to get started!`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptArea;