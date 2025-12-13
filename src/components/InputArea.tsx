import React, { useState } from 'react';
import { Upload, FileText, Search, Loader2 } from 'lucide-react';
import { extractCPFsFromText } from '../services/gemini';

interface InputAreaProps {
  onProcess: (cpfs: string[]) => void;
  isProcessing: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onProcess, isProcessing }) => {
  const [text, setText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleTextProcess = async () => {
    if (!text.trim()) return;
    
    // We use Gemini to smart-extract, but for simple lists, we split by newline/comma first locally to be fast,
    // then send to parent. The parent might decide to use Gemini if the text is messy.
    // For this implementation, we will pass the raw text to the extraction service handled by the parent
    // or call the service here. Let's call the service here.
    
    try {
      const extracted = await extractCPFsFromText(text);
      onProcess(extracted);
      setText('');
    } catch (e) {
      console.error(e);
      alert("Erro ao processar texto.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      setText(content); // Load into text area for review
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-indigo-600" />
        Entrada de Dados
      </h2>
      
      <div className="flex flex-col gap-4">
        <div 
          className={`relative rounded-lg border-2 border-dashed transition-colors p-6 flex flex-col items-center justify-center text-center
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".txt,.csv,.json"
          />
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Arraste um arquivo .txt/.csv ou clique para upload
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Lista de CPFs (um por linha ou separado por vírgula)
          </p>
        </div>

        <div className="relative">
          <textarea
            className="w-full h-32 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-700 placeholder:text-slate-400 resize-y"
            placeholder="Ou cole sua lista de CPFs aqui (pode conter texto misturado, a IA irá filtrar)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute bottom-3 right-3">
             <button
              onClick={handleTextProcess}
              disabled={isProcessing || !text.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Validar CPFs
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};