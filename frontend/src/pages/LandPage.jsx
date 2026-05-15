import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { API } from "../../API";

function LandPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center selection:bg-blue-100 font-['Poppins',sans-serif]">
      
      {/* 🎓 Icon Badge */}
      <div className="mb-8 p-5 bg-white border border-slate-100 rounded-[2rem] text-blue-500 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative group hover:scale-105 transition-transform duration-300">
        <GraduationCap size={44} strokeWidth={1.5} />
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
          <Sparkles size={12} fill="currentColor" />
        </div>
      </div>

      {/* 🏷️ Hero Header */}
      <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.15]">
        Master your <br />
        <span className="relative inline-block text-blue-500 font-extrabold">
          Edu-Flow
          <span className="absolute bottom-2 left-0 w-full h-[6px] bg-blue-500/10 rounded-full -z-10"></span>
        </span>
      </h1>

      {/* 📖 Description */}
      <p className="text-slate-500 text-base md:text-lg max-w-lg mb-12 leading-relaxed font-medium tracking-wide">
        The ultimate workspace to manage your assignments, classes, and 
        academic progress <span className="text-slate-900 font-semibold underline decoration-blue-500/20 decoration-2 underline-offset-8 text-nowrap">Seamlessly.</span>
      </p>

      {/* ⚡ Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
        <Link
          to="/signup"
          className="group flex items-center justify-center gap-2 bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-blue-100 active:scale-95 w-full sm:w-auto tracking-wide"
        >
          <span>Get Started</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        <Link
          to="/login"
          className="flex items-center justify-center bg-white text-slate-600 border border-slate-200/80 px-10 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 w-full sm:w-auto tracking-wide shadow-sm"
        >
          Login
        </Link>
      </div>

      {/* 🏆 Trust Badge */}
      <div className="mt-24 py-2.5 px-6 bg-white rounded-full border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.25em]">
          Trusted by 1000+ students & faculty
        </p>
      </div>
      
    </div>
  );
}

export default LandPage;