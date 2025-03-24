import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui-components";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  MapPin,
  TreePine, 
  Wind, 
  Waves, 
  Sun, 
  Leaf,
  Info 
} from "lucide-react";

export interface CreditCardProps {
  id?: string;  // Make id optional since it's not used in the component
  title: string;
  description: string;
  type: "forestation" | "renewable" | "ocean" | "solar" | "other";
  location: string;
  price: number;
  amount: number;
  image: string;
  verified?: boolean;
  className?: string;
  onClick?: () => void;

}

const typeIcons = {
  forestation: <TreePine className="h-5 w-5" />,
  renewable: <Wind className="h-5 w-5" />,
  ocean: <Waves className="h-5 w-5" />,
  solar: <Sun className="h-5 w-5" />,
  other: <Leaf className="h-5 w-5" />,
};

export const CreditCard: React.FC<CreditCardProps> = ({
  id,
  title,
  description,
  type,
  location,
  price,
  amount,
  image,
  verified = false,
  className,
  onClick,
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 card-hover",
        className
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="success" size="sm" className="flex gap-1 items-center">
            {typeIcons[type]}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          {verified && (
            <Badge variant="blue" size="sm" className="flex gap-1 items-center">
              <Info className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="text-right">
            <span className="font-semibold text-lg">${price}</span>
            <span className="text-xs text-muted-foreground block">per credit</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="block text-sm text-muted-foreground">Available</span>
            <span className="font-medium">{amount} credits</span>
          </div>

          <Button 
            size="sm" 
            className="group" 
            onClick={onClick}
          >
            View Details
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
