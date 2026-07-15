import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** White panel with the app's black border + hard offset shadow. */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl bg-surface ink-border ink-shadow", className)}
      {...props}
    >
      {children}
    </div>
  );
}
