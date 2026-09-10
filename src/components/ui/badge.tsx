import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200",
        secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        featured: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
        verified: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
        outline: "border border-teal-200 text-teal-700 dark:border-teal-700 dark:text-teal-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
