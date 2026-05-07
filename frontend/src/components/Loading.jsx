import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 rounded-full"></div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute text-blue-500"
        >
          <Loader2 size={20} className="animate-spin" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-slate-500 font-medium tracking-wide text-sm">
          Fetching Dashboard Data...
        </p>
        <p className="text-slate-400 text-xs mt-1 italic">
          Just a moment
        </p>
      </motion.div>
    </div>
  );
};

export default Loading;