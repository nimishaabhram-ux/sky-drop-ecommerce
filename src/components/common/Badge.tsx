import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'drone';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    drone: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };

  const classes = [
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
    variants[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
