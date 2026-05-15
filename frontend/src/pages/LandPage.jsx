import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react"; // Icons kosam
import { API } from "../../API";

function LandPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 p-4 bg-blue-50 rounded-full text-blue-600 shadow-sm">
        <GraduationCap size={48} strokeWidth={2.5} />
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
        Welcome to <span className="text-blue-600 italic">Edu-Flow</span>
      </h1>

      <p className="text-lg md:text-xl text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
        The ultimate workspace to manage your assignments, classes, and academic progress <span className="text-blue-500 font-bold text-nowrap text-lg">Seamlessly.</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Link 
          to="/signup" 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Get Started <ArrowRight size={20} />
        </Link>
        
        <Link 
          to="/login" 
          className="flex items-center justify-center bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:border-blue-300 transition-all active:scale-95"
        >
          Login
        </Link>
      </div>

      <div className="mt-16 text-slate-400 text-sm font-medium">
        Trusted by 1000+ students and educators.
      </div>
    </div>
  );
}

export default LandPage;