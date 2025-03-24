import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  return (
    <div 
      className={cn(
        "group flex flex-col gap-4 p-6 bg-card rounded-xl border border-border transition-all duration-300 card-hover",
        className
      )}
    >
      <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-xl">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
