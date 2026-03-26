import { cn } from "@/utils/cn";
import { getAvatarColor, getInitials } from "@/utils/avatar-color";

interface AvatarProps {
    name: string;
    size?: "xs" | "sm" | "md" | "lg";
    online?: boolean;
    className?: string;
}

const sizes ={
    xs: "w-7 h-7 text-xs",
    sm: "w-9 h-9 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-14 h-14 text-lg",
}

const dotSizes = {
    xs: "w-2 h-2 border",
    sm: "w-2.5 h-2.5 border",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
};
 export function Avatar({name, size = "md", online, className }: AvatarProps){
    return(
        <div className={cn("relative shrink-0", className)}>
        <div className={cn("rounded-full flex items-center justify-center font-semibold text-white", sizes[size], getAvatarColor(name))}>
            {getInitials(name)}
        </div>
        {online !== undefined && (
            <span className={cn("absolute bottom-0 right-0 rounded-full border-white", dotSizes, online ? "bg-green-500": "bg-gray-400")} />
        )}
        </div>
    );
 }