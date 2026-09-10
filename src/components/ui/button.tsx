import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)]/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)] hover:bg-[var(--ocean-dark)] active:scale-[0.98]",
        secondary:
          "bg-white text-[var(--ink)] shadow-sm ring-1 ring-[var(--sand-dark)]/60 hover:bg-[var(--sand)]",
        outline:
          "border border-[var(--sand-dark)] bg-transparent text-[var(--ink)] hover:bg-white",
        ghost: "text-[var(--ocean)] hover:bg-[var(--ocean-light)]",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        accent:
          "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)] hover:brightness-105 active:scale-[0.98]",
        coral:
          "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)] hover:brightness-105 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
