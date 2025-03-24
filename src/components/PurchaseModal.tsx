import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui-components";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui-components";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Minus, Plus, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context"; // Import useWeb3

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: any;
  onPurchaseComplete?: () => void;
}

export const PurchaseModal = ({ isOpen, onClose, credit, onPurchaseComplete }: PurchaseModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentTab, setPaymentTab] = useState("web3");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  // Card payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  
  // Use Web3 context
  const { account, isConnected, isConnecting, connect } = useWeb3();

  if (!credit) return null;
  
  const totalPrice = credit.price * quantity;
  const ethPrice = (totalPrice / 2000).toFixed(6); // Mock ETH conversion
  
  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };
  
  const handlePurchase = async () => {
    if (paymentTab === "web3" && !isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentTab === "card") {
      // Validate card details
      if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
        toast({
          title: "Missing Card Details",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return;
      }
    }
    
    setProcessing(true);
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSuccess(true);
    setProcessing(false);
    
    toast({
      title: "Purchase Successful",
      description: `You've purchased ${quantity} carbon credits!`,
    });
    
    setTimeout(() => {
      setSuccess(false);
      if (onPurchaseComplete) onPurchaseComplete();
      onClose();
    }, 2000);
  };
  
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + " ";
    }
    return formatted.trim();
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted.substring(0, 19)); // 16 digits + 3 spaces
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setCardExpiry(value);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase Carbon Credits</DialogTitle>
          <DialogDescription>
            Complete your purchase of carbon credits from this project
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Purchase Successful!</h3>
            <p className="text-muted-foreground">
              You've offset {quantity * credit.amount} tons of CO₂
            </p>
            <Button 
              className="mt-6" 
              onClick={() => {
                if (onPurchaseComplete) onPurchaseComplete();
                onClose();
              }}
            >
              View My Credits
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-24 w-24 rounded overflow-hidden">
                  <img 
                    src={credit.image} 
                    alt={credit.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Badge variant="blue" size="sm" className="mb-1">{credit.type}</Badge>
                  <h3 className="font-semibold text-lg">{credit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {credit.amount.toLocaleString()} tons CO₂ offset
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="text-lg font-bold">${credit.price.toFixed(2)}</div>
                    <span className="text-sm text-muted-foreground ml-1">per credit</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <Label htmlFor="quantity" className="font-medium">Quantity</Label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(credit.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <div className="text-right">
                      <div>${totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{ethPrice} ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="web3" value={paymentTab} onValueChange={setPaymentTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="web3">
                  <Wallet className="h-4 w-4 mr-2" />
                  Web3 Wallet
                </TabsTrigger>
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Card
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="web3">
                <div className="space-y-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to pay with ETH or approved tokens.
                  </p>
                  
                  {!isConnected ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={connect}
                      disabled={isConnecting || processing}
                    >
                      {isConnecting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Connecting...
                        </>
                      ) : (
                        <>Connect Wallet</>
                      )}
                    </Button>
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Wallet Connected</span>
                        <Badge variant="success" size="sm">Connected</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="card">
                <div className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").substring(0, 3))}
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={processing}>
                Cancel
              </Button>
              <LoadingButton 
                isLoading={processing} 
                onClick={handlePurchase}
                disabled={processing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Purchase
              </LoadingButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};