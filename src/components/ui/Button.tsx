import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    let baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    let variants = {
      default: "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-900/50 hover:shadow-purple-900/80 active:scale-95",
      outline: "border border-input bg-transparent hover:bg-white/5",
      ghost: "hover:bg-white/10 hover:text-white",
    };

    let sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-xl px-8 text-lg",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`;

    return (
      <button
        ref={ref}
        className={combinedClasses}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
