
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { cva } from "class-variance-authority";

// Section Component
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ className, children }) => {
  return (
    <section className={cn("py-16 md:py-20", className)}>
      {children}
    </section>
  );
};

// Container Component
interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ className, children }) => {
  return (
    <div className={cn("container mx-auto px-4", className)}>
      {children}
    </div>
  );
};

// Enhanced Input Component
interface InputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [x: string]: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  onChange,
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <div className="flex justify-between">
          <Label htmlFor={props.id}>{label}</Label>
          {props.optional && (
            <span className="text-xs text-muted-foreground">Optional</span>
          )}
        </div>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <ShadcnInput
          className={cn(
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

// Label Component
interface LabelProps {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ htmlFor, className, children }) => {
  return (
    <ShadcnLabel
      htmlFor={htmlFor}
      className={cn("text-sm font-medium", className)}
    >
      {children}
    </ShadcnLabel>
  );
};

// Badge Component
const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
        verified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "info" | "verified" | "blue";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
}) => {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {children}
    </span>
  );
};

// Loading Button Component
interface LoadingButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  [x: string]: any;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = "Loading...",
  onClick,
  className,
  children,
  ...props
}) => {
  return (
    <ShadcnButton
      className={cn("relative", className)}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
      <span className={cn(isLoading && "invisible")}>{children}</span>
    </ShadcnButton>
  );
};
