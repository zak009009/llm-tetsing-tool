import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-all duration-300 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-primary/20",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
        success:
          "border-green-500/50 text-green-700 dark:text-green-400 dark:border-green-500/30 [&>svg]:text-green-500 bg-green-50 dark:bg-green-950/30",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 dark:border-yellow-500/30 [&>svg]:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
        info: "border-blue-500/50 text-blue-700 dark:text-blue-400 dark:border-blue-500/30 [&>svg]:text-blue-500 bg-blue-50 dark:bg-blue-950/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    // Default icons based on variant
    const getDefaultIcon = () => {
      if (!icon) {
        switch (variant) {
          case "destructive":
            return <XCircle className="h-4 w-4" />;
          case "success":
            return <CheckCircle className="h-4 w-4" />;
          case "warning":
            return <AlertTriangle className="h-4 w-4" />;
          case "info":
            return <Info className="h-4 w-4" />;
          default:
            return <AlertCircle className="h-4 w-4" />;
        }
      }
      return icon;
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {getDefaultIcon()}
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
