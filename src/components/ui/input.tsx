import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border-0 bg-white px-4 text-sm text-[var(--ink)] shadow-sm ring-1 ring-[var(--sand-dark)]/60 outline-none transition placeholder:text-[var(--ink-muted)] focus:ring-2 focus:ring-[var(--ocean)]/30",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm ring-1 ring-[var(--sand-dark)]/60 outline-none transition placeholder:text-[var(--ink-muted)] focus:ring-2 focus:ring-[var(--ocean)]/30",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-[var(--ink)]",
        className,
      )}
      {...props}
    />
  );
}
