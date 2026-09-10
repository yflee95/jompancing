import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[var(--ocean-light)] text-[var(--ocean)]",
        secondary: "bg-[var(--sand-dark)]/50 text-[var(--ink-muted)]",
        featured: "bg-[var(--ocean-light)] text-[var(--ocean-dark)]",
        verified: "bg-blue-50 text-blue-700",
        outline: "border border-[var(--sand-dark)] text-[var(--ink-muted)]",
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
