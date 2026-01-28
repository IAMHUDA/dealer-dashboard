import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300",
    outline: "bg-transparent border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-indigo-400"
  };

  // Convert these manually since I'm using vanilla CSS with utility hooks
  const variantClass = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`btn-${variant} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="loader"></span>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
