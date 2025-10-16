import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ScriptArea from './components/ScriptArea';
import ScriptModal from './components/ScriptModal';
import ConfirmationModal from './components/ConfirmationModal';
import BatchTagModal from './components/BatchTagModal';
import { Script, Platform, ScriptFormData } from './types';
import { useHistoryState } from './hooks/useHistoryState';

// A function to generate a random color class for new scripts
const colorClasses = [
    'border-red-500', 'border-orange-500', 'border-amber-500', 'border-yellow-400',
    'border-lime-500', 'border-green-500', 'border-emerald-500', 'border-teal-500',
    'border-cyan-400', 'border-sky-500', 'border-blue-500', 'border-indigo-500',
    'border-violet-500', 'border-purple-500', 'border-fuchsia-500', 'border-pink-500',
    'border-rose-500'
];
const getRandomColor = () => colorClasses[Math.floor(Math.random() * colorClasses.length)];

const App: React.FC = () => {
    const { state: scripts, setState: setScripts, undo, redo, canUndo, canRedo } = useHistoryState<Script[]>(
        (() => {
            try {
                const savedScripts = localStorage.getItem('scripts');
                return savedScripts ? JSON.parse(savedScripts) : [];
            } catch (error) {
                console.error("Could not parse scripts from localStorage", error);
                return [];
            }
        })()
    );

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.Instagram);
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
    const [scriptToEdit, setScriptToEdit] = useState<Script | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [scriptsToDelete, setScriptsToDelete] = useState<string[]>([]);
    const [isBatchTagModalOpen, setIsBatchTagModalOpen] = useState(false);
    const [selectedScriptIds, setSelectedScriptIds] = useState<string[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    
    useEffect(() => {
        localStorage.setItem('scripts', JSON.stringify(scripts));
    }, [scripts]);

    const handleAddNew = () => {
        setScriptToEdit(null);
        setIsScriptModalOpen(true);
    };

    const handleEditScript = (scriptId: string) => {
        const script = scripts.find(s => s.id === scriptId);
        if (script) {
            setScriptToEdit(script);
            setIsScriptModalOpen(true);
        }
    };

    const handleSaveScript = (scriptData: ScriptFormData, id?: string) => {
        if (id) {
            // Update existing script
            setScripts(prevScripts =>
                prevScripts.map(s =>
                    s.id === id ? { ...s, ...scriptData, updatedAt: new Date().toISOString() } : s
                )
            );
        } else {
            // Create new script
            const newScript: Script = {
                ...scriptData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                color: getRandomColor(),
            };
            setScripts(prevScripts => [...prevScripts, newScript]);
        }
        setIsScriptModalOpen(false);
        setScriptToEdit(null);
    };
    
    const handleOpenDeleteModal = (ids: string[]) => {
        if (ids.length > 0) {
            setScriptsToDelete(ids);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteScripts = () => {
        if (scriptsToDelete.length > 0) {
            setScripts(prevScripts => prevScripts.filter(s => !scriptsToDelete.includes(s.id)));
            setScriptsToDelete([]);
            setIsDeleteModalOpen(false);
            setSelectedScriptIds([]);
        }
    };

    const handleApplyTags = (scriptIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => {
        setScripts(prevScripts =>
            prevScripts.map(script => {
                if (scriptIds.includes(script.id)) {
                    let newTags = [...script.tags];
                    // Remove tags
                    newTags = newTags.filter(tag => !tagsToRemove.includes(tag));
                    // Add tags
                    tagsToAdd.forEach(tag => {
                        if (!newTags.includes(tag)) {
                            newTags.push(tag);
                        }
                    });
                    return { ...script, tags: newTags, updatedAt: new Date().toISOString() };
                }
                return script;
            })
        );
        setIsBatchTagModalOpen(false);
        setSelectedScriptIds([]);
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
            <Sidebar
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={(platform) => {
                    setSelectedPlatform(platform);
                    setSelectedScriptIds([]);
                }}
                onAddNew={handleAddNew}
                isSidebarVisible={isSidebarVisible}
                onClose={() => setIsSidebarVisible(false)}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <ScriptArea
                    platform={selectedPlatform}
                    scripts={scripts.filter(s => s.platform === selectedPlatform)}
                    onEditScript={handleEditScript}
                    onDeleteScript={(id) => handleOpenDeleteModal([id])}
                    onBatchDelete={() => handleOpenDeleteModal(selectedScriptIds)}
                    onAddNew={handleAddNew}
                    undo={undo}
                    redo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onOpenBatchTagModal={() => setIsBatchTagModalOpen(true)}
                    selectedScriptIds={selectedScriptIds}
                    setSelectedScriptIds={setSelectedScriptIds}
                    allScriptsCount={scripts.length}
                    isSidebarVisible={isSidebarVisible}
                    onOpenSidebar={() => setIsSidebarVisible(true)}
                />
            </main>
            <ScriptModal
                isOpen={isScriptModalOpen}
                onClose={() => setIsScriptModalOpen(false)}
                onSave={handleSaveScript}
                scriptToEdit={scriptToEdit}
                platform={selectedPlatform}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteScripts}
                title={`Delete Script${scriptsToDelete.length > 1 ? 's' : ''}`}
                message={`Are you sure you want to delete ${scriptsToDelete.length} script${scriptsToDelete.length > 1 ? 's' : ''}? This action cannot be undone.`}
            />
             <BatchTagModal
                isOpen={isBatchTagModalOpen}
                onClose={() => setIsBatchTagModalOpen(false)}
                onApplyTags={handleApplyTags}
                selectedScriptIds={selectedScriptIds}
                allScripts={scripts}
            />
        </div>
    );
};

export default App;