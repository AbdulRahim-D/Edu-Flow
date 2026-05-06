import React from 'react';
import { Loader2 } from 'lucide-react'; 

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <Loader2 className="absolute text-blue-600 animate-pulse" size={20} />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-700 animate-pulse tracking-tight">
          Loading Edu-Flow...
        </h2>
        <p className="text-sm text-slate-400 font-medium">Please wait a moment</p>
      </div>

    </div>
  );
}

export default Loading;