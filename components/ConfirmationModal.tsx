import React from 'react';
import { XIcon } from './icons/XIcon';
import { WarningIcon } from './icons/WarningIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-md transform scale-95 transition-transform duration-300 animate-slide-up-fast" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
            <div className="flex items-start">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:h-10 sm:w-10">
                    <WarningIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-slate-300 text-base">{message}</p>
                </div>
            </div>
        </div>
        <div className="flex justify-end space-x-4 p-6 bg-slate-800/50 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition" title="Cancel deletion">Cancel</button>
          <button type="button" onClick={onConfirm} className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition" title="Confirm deletion (this action is permanent)">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;