import { cn } from "@/utils/cn"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    children: React.ReactNode;
}

const variants = {
    primary: "bg-telegram-blue hover:bg-telegram-dark-blue text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hoverbg-gray-600 text-gray-700 dark:text-gray-200",
    ghost: "bg-transparent hover:bg-gray-100 dark:hoverbg-gray-700 text-gray-600 dark:text-gray-300",
}

export default function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn("inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50", variants[variant], className)}>
        {children}
    </button>
  )
}
