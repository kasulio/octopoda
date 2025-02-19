import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const LoadingButton = ({
  loading,
  icon,
  ...props
}: LoadingButtonProps) => {
  const [loadingState, setLoadingState] = React.useState(loading);

  // if no loading is provided, we extract the loading state
  // by whether the onClick function is pending
  const onClick =
    loading === undefined
      ? async (e: React.MouseEvent<HTMLButtonElement>) => {
          setLoadingState(true);
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.onClick?.(e);
          setLoadingState(false);
        }
      : props.onClick;

  loading = loading ?? loadingState;

  return (
    <Button {...props} disabled={loading ?? props.disabled} onClick={onClick}>
      {loading ? <Loader2Icon className="animate-spin" /> : icon}
      {props.children}
    </Button>
  );
};

export { Button, buttonVariants };
