import React from 'react';

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'compact';
  hoverEffect?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = true,
  ...props
}) => {
  const baseClasses = 'bg-card border border-card-border flex flex-col justify-between backdrop-blur-2xl';
  const radiusClasses = variant === 'compact'
    ? 'rounded-[1.8rem] sm:rounded-[2.2rem] p-6 sm:p-8'
    : 'rounded-[2.2rem] md:rounded-[2.8rem] p-8 md:p-12';
  const hoverClasses = hoverEffect ? 'transition-all duration-300 hover:border-card-hover-border' : '';

  return (
    <div
      className={`${baseClasses} ${radiusClasses} ${hoverClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default BentoCard;
