import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer";
    
    const variants = {
      default: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/50 hover:shadow-purple-900/60 border border-purple-400/20",
      gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-950/60 border border-white/15",
      outline: "border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-purple-500/30 text-slate-200",
      ghost: "hover:bg-white/10 text-slate-300 hover:text-white",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-xs sm:text-sm",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-2xl px-6 text-sm sm:text-base",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`;

    return (
      <button
        ref={ref}
        className={combinedClasses}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
