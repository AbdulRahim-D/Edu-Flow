import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-5 font-['Poppins',sans-serif] antialiased">
      <div className="relative flex items-center justify-center">
        {/* Background track ring */}
        <div className="w-14 h-14 border-[3px] border-slate-100 rounded-full"></div>
        
        {/* Rotating accent arc ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute w-14 h-14 border-[3px] border-blue-500 border-t-transparent rounded-full"
        ></motion.div>

        {/* Central fading pulse icon instead of dual animation overlap */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute text-blue-500/80"
        >
          <Loader2 size={18} strokeWidth={2.5} />
        </motion.div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-slate-800 font-semibold tracking-wide text-sm">
          Fetching Dashboard Data
        </p>
        <p className="text-slate-400 text-xs font-medium tracking-wide">
          Just a moment...
        </p>
      </div>
    </div>
  );
};

export default Loading;