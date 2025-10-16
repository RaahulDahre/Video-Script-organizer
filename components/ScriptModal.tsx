import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Script, Platform, ContentBlock, MediaBlockData } from '../types';
import { XIcon } from './icons/XIcon';
import { TagIcon } from './icons/TagIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PdfIcon } from './icons/PdfIcon';

type ScriptFormData = Omit<Script, 'id' | 'createdAt' | 'updatedAt' | 'color'>;

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scriptData: ScriptFormData, id?: string) => void;
  scriptToEdit: Script | null;
  platform: Platform;
}

const getInitialState = (platform: Platform): ScriptFormData => ({
  title: '',
  content: [{ id: crypto.randomUUID(), type: 'text', data: '' }],
  description: '',
  tags: [],
  platform: platform,
});

const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose, onSave, scriptToEdit, platform }) => {
    const [scriptData, setScriptData] = useState<ScriptFormData>(getInitialState(platform));
    const [tagInput, setTagInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [aiImagePrompt, setAiImagePrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        if (scriptToEdit) {
            setScriptData({
                title: scriptToEdit.title,
                content: scriptToEdit.content,
                description: scriptToEdit.description || '',
                tags: scriptToEdit.tags,
                platform: scriptToEdit.platform,
            });
        } else {
            setScriptData(getInitialState(platform));
        }
    }, [scriptToEdit, platform, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setScriptData({ ...scriptData, [name]: value });
    };
    
    const handleBlockChange = (id: string, value: string, field: 'text' | 'data' = 'data') => {
        setScriptData(prev => ({
            ...prev,
            content: prev.content.map(block => {
                if (block.id !== id) return block;
                if (block.type === 'text') {
                    return { ...block, data: value };
                }
                if ((block.type === 'image' || block.type === 'pdf') && field === 'text') {
                    return { ...block, data: { ...block.data, text: value } };
                }
                return block;
            })
        }));
    };

    const addBlock = (type: 'text' | 'image' | 'pdf', data: string | MediaBlockData) => {
      let newBlock: ContentBlock;
      const newId = crypto.randomUUID();
      if (type === 'text' && typeof data === 'string') {
        newBlock = { id: newId, type: 'text', data };
      } else if ((type === 'image' || type === 'pdf') && typeof data === 'object') {
        newBlock = { id: newId, type, data };
      } else {
        return; // Invalid arguments
      }
      setScriptData(prev => ({ ...prev, content: [...prev.content, newBlock] }));
    };

    const deleteBlock = (id: string) => {
      setScriptData(prev => ({ ...prev, content: prev.content.filter(block => block.id !== id) }));
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value);
    
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        if (tagInput.trim() === '') return;
        if ('key' in e) {
            if (e.key !== 'Enter' && e.key !== ',') return;
        }
        
        e.preventDefault();
        const newTag = tagInput.trim().toLowerCase();
        if (!scriptData.tags.includes(newTag)) {
            setScriptData({ ...scriptData, tags: [...scriptData.tags, newTag] });
        }
        setTagInput('');
    };
    
    const handleRemoveTag = (tagToRemove: string) => {
        setScriptData({ ...scriptData, tags: scriptData.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scriptData.title.trim()) {
            alert('Title is required.');
            return;
        }
        onSave(scriptData, scriptToEdit?.id);
    };

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
      });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
          let type: 'image' | 'pdf' | null = null;
          if (file.type.startsWith('image/')) type = 'image';
          else if (file.type === 'application/pdf') type = 'pdf';

          if (type) {
              const data = await fileToBase64(file);
              addBlock(type, { src: data, text: '' });
          } else {
              alert(`Unsupported file type: ${file.name}`);
          }
      }
    };
    
    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim() || isGenerating) return;
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a short paragraph for a ${platform} post about: "${aiPrompt}".`,
            });
            const text = response.text;
            addBlock('text', text);
            setAiPrompt('');
        } catch (error) {
            console.error("AI content generation failed:", error);
            alert("Failed to generate content. Please check your API key and try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateImageWithAI = async () => {
        if (!aiImagePrompt.trim() || isGeneratingImage) return;
        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: aiImagePrompt }],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    addBlock('image', { src: imageUrl, text: '' });
                    setAiImagePrompt('');
                    break; 
                }
            }

        } catch (error) {
            console.error("AI image generation failed:", error);
            alert("Failed to generate image. Please check your API key and try again.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleDragEnd = () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }

        const newContent = [...scriptData.content];
        const dragItemContent = newContent.splice(dragItem.current, 1)[0];
        newContent.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setScriptData(prev => ({...prev, content: newContent}));
    };

    if (!isOpen) return null;
    
    const headerColor = scriptToEdit?.color ? colorClassToHex[scriptToEdit.color] : '#6366f1';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
        <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl transform scale-95 transition-transform duration-300 animate-slide-up-fast flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <header className={`flex justify-between items-center p-6 border-b-4`} style={{ borderColor: headerColor }}>
            <h2 className="text-2xl font-bold text-white">{scriptToEdit ? 'Edit Script' : 'Create New Script'}</h2>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full" title="Close modal">
              <XIcon className="w-6 h-6"/>
            </button>
          </header>
          
          <form id="script-form" onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input type="text" name="title" id="title" value={scriptData.title} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md py-2.5 px-4 text-white text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">Content Blocks</label>
              {scriptData.content.map((block, index) => (
                <div 
                  key={block.id} 
                  className="bg-slate-800 p-4 rounded-md border border-slate-700 flex gap-4 items-start"
                  draggable
                  onDragStart={() => dragItem.current = index}
                  onDragEnter={() => dragOverItem.current = index}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex-grow space-y-2">
                    {block.type === 'text' && (
                      <textarea value={block.data} onChange={(e) => handleBlockChange(block.id, e.target.value)} rows={5} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Write something..."/>
                    )}
                    {(block.type === 'image' || block.type === 'pdf') && (
                       <div className="space-y-3">
                        {block.type === 'image' && (
                           <div className="p-2 bg-slate-900 rounded-md"><img src={block.data.src} alt="content" className="max-h-64 mx-auto rounded-md" /></div>
                        )}
                        {block.type === 'pdf' && (
                           <div className="p-4 bg-slate-900 rounded-md flex items-center gap-4 text-slate-300"><PdfIcon className="w-10 h-10 text-red-400"/><span>PDF Content</span></div>
                        )}
                        <textarea 
                           value={block.data.text} 
                           onChange={(e) => handleBlockChange(block.id, e.target.value, 'text')} 
                           rows={3} 
                           className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                           placeholder={block.type === 'image' ? "Describe the scene, add dialogue..." : "Add notes for this PDF..."}
                        />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => deleteBlock(block.id)} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full" title="Delete block">
                      <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2 border border-dashed border-slate-700 rounded-lg justify-center">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*,.pdf" />
              <button type="button" onClick={() => addBlock('text', '')} className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 transition">Add Text</button>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 transition">Add Image/PDF</button>
            </div>
            
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/50 space-y-4">
                <div>
                  <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-300 mb-2">Generate a Text Block with AI</label>
                  <div className="flex space-x-2">
                      <input id="ai-prompt" type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder={`e.g., "A paragraph about space exploration"`} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={isGenerating} />
                      <button type="button" onClick={handleGenerateWithAI} disabled={isGenerating || !aiPrompt.trim()} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition flex items-center justify-center whitespace-nowrap">
                          {isGenerating ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : 'Generate'}
                      </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="ai-image-prompt" className="block text-sm font-medium text-slate-300 mb-2">Generate an Image Block with AI</label>
                  <div className="flex space-x-2">
                      <input id="ai-image-prompt" type="text" value={aiImagePrompt} onChange={(e) => setAiImagePrompt(e.target.value)} placeholder={`e.g., "A robot holding a red skateboard"`} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={isGeneratingImage} />
                      <button type="button" onClick={handleGenerateImageWithAI} disabled={isGeneratingImage || !aiImagePrompt.trim()} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition flex items-center justify-center whitespace-nowrap">
                          {isGeneratingImage ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : 'Generate Image'}
                      </button>
                  </div>
                </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
              <textarea name="description" id="description" value={scriptData.description} onChange={handleInputChange} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="A short description or internal note..."/>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-2">Tags (Optional)</label>
              <div className="flex items-center flex-wrap gap-2 p-2 bg-slate-800 border border-slate-700 rounded-md">
                 <TagIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                {scriptData.tags.map(tag => (
                  <div key={tag} className="flex items-center bg-slate-700 text-slate-300 text-sm font-medium pl-3 pr-1 py-1 rounded-full">
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 p-0.5 rounded-full hover:bg-slate-600"><XIcon className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <input type="text" id="tags" value={tagInput} onChange={handleTagInputChange} onKeyDown={handleAddTag} onBlur={handleAddTag} className="flex-grow bg-transparent text-white outline-none" placeholder="Add a tag..."/>
              </div>
            </div>
          </form>

          <footer className="flex justify-end items-center p-6 border-t border-slate-800 bg-slate-950/50">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition mr-3">Cancel</button>
            <button type="submit" form="script-form" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition flex items-center">
                {!scriptToEdit && <PlusIcon className="w-5 h-5 mr-2" />}
                {scriptToEdit ? 'Save Changes' : 'Create Script'}
            </button>
          </footer>
        </div>
      </div>
    );
};
const colorClassToHex: { [key: string]: string } = {
  'border-red-500': '#ef4444', 'border-orange-500': '#f97316', 'border-amber-500': '#f59e0b', 'border-yellow-400': '#facc15',
  'border-lime-500': '#84cc16', 'border-green-500': '#22c55e', 'border-emerald-500': '#10b981', 'border-teal-500': '#14b8a6', 
  'border-cyan-400': '#22d3ee', 'border-sky-500': '#0ea5e9', 'border-blue-500': '#3b82f6', 'border-indigo-500': '#6366f1', 
  'border-violet-500': '#8b5cf6', 'border-purple-500': '#a855f7', 'border-fuchsia-500': '#d946ef', 'border-pink-500': '#ec4899',
  'border-rose-500': '#f43f5e'
};

export default ScriptModal;