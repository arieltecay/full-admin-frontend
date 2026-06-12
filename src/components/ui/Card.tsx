import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  const baseStyles = 'rounded-3xl border transition-all duration-300';
  const themeStyles = glass
    ? 'bg-white/70 backdrop-blur-md border-slate-100 dark:bg-slate-900/50 dark:backdrop-blur-md dark:border-white/5'
    : 'bg-white border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-white';
  const hoverStyles = hoverEffect 
    ? 'hover:shadow-xl hover:-translate-y-0.5 hover:border-slate-300/50 dark:hover:border-slate-700/50' 
    : 'shadow-sm';

  return (
    <div
      className={`${baseStyles} ${themeStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
