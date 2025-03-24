
import React, { useState } from "react";
import { Badge } from "@/components/ui-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, Heart, Info, User } from "lucide-react";

export interface CreditCardProps {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  sellerName: string;
  price: number;
  amount: number;
  image: string;
  verified: boolean;
  onBuy: (id: string) => void;
  onViewDetails: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
  selected?: boolean;
}

export const EnhancedCreditCard: React.FC<CreditCardProps> = ({
  id,
  title,
  type,
  description,
  location,
  sellerName,
  price,
  amount,
  image,
  verified,
  onBuy,
  onViewDetails,
  onSelect,
  selected = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Calculate ETH price (simulated conversion)
  const ethValue = (price / 2000).toFixed(6); // Using fixed ETH price for now
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(id, e.target.checked);
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full flex flex-col">
      <div className="relative">
        {onSelect && (
          <div className="absolute top-3 left-3 z-10">
            <input 
              type="checkbox" 
              checked={selected} 
              onChange={handleSelect}
              className="h-5 w-5 rounded border-gray-300"
            />
          </div>
        )}
        
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
        </button>
        
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {verified && (
          <div className="absolute bottom-2 right-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-1 rounded-full">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <Badge variant="blue" size="sm">{type}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5 mr-1" />
              {sellerName}
            </div>
          </div>
          
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Location: <span className="font-medium">{location}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              CO₂: <span className="font-medium">{amount.toLocaleString()} tons</span>
            </div>
          </div>
          
          <div className="mt-1">
            <div className="text-lg font-bold">${price.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              {ethValue} ETH per credit
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 gap-2 flex-wrap">
        <Button 
          variant="default" 
          className="flex-1 min-w-[100px]"
          onClick={() => onBuy(id)}
        >
          Buy Now
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 min-w-[100px]"
          onClick={() => onViewDetails(id)}
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};
