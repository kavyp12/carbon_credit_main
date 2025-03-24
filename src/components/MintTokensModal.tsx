import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui-components";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context"; // Add Web3Context import

// Example of how the component might look
interface MintTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onMintComplete: (projectId: string, amount: number) => void;
}

export const MintTokensModal = ({ isOpen, onClose, project }: MintTokensModalProps) => {
  const [tokensToMint, setTokensToMint] = useState<number>(project?.amount || 0);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const { toast } = useToast();

  // Use Web3Context for wallet connection
  const { account, isConnected, isConnecting, connect } = useWeb3();

  if (!project) return null;

  const handleMint = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (tokensToMint <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of tokens to mint",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);

    // Simulate minting process with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setMintingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsMinting(false);
          toast({
            title: "Tokens Minted Successfully!",
            description: `${tokensToMint} carbon credit tokens have been minted for ${project.title}`,
          });
          onClose();
        }, 500);
      }
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mint Carbon Credit Tokens</DialogTitle>
          <DialogDescription>
            Create blockchain tokens representing verified carbon credits for your project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">{project.title}</h3>
            <div className="text-sm text-muted-foreground mt-1">{project.location}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Verified Credits</div>
                <div className="font-medium">{project.amount?.toLocaleString()} tons CO₂</div>
              </div>
              <div>
                <div className="text-muted-foreground">Token Equivalent</div>
                <div className="font-medium">{project.amount?.toLocaleString()} CC</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokens">Tokens to Mint</Label>
            <Input
              id="tokens"
              type="number"
              value={tokensToMint}
              onChange={(e) => setTokensToMint(Number(e.target.value))}
              max={project.amount}
              min={0}
              disabled={isMinting}
            />
            <p className="text-xs text-muted-foreground">
              Each token represents 1 ton of verified CO₂ offset
            </p>
          </div>

          {!isConnected ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Connect Wallet</h4>
              <p className="text-sm text-muted-foreground">
                Connect your Web3 wallet to mint tokens on the blockchain
              </p>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border p-3 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Wallet Connected</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </div>
            </div>
          )}

          {isMinting && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Minting in progress...</span>
                <span>{mintingProgress}%</span>
              </div>
              <Progress value={mintingProgress} />
              <p className="text-xs text-muted-foreground">
                Please keep this window open until the process completes
              </p>
            </div>
          )}

          <div className="rounded-md border p-3 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-400">
                <p className="font-medium">Gas Fees Apply</p>
                <p className="text-xs mt-0.5">
                  Minting tokens requires blockchain transaction fees (gas).
                  Current estimated gas: ~0.005 ETH
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isMinting}>
            Cancel
          </Button>
          <LoadingButton
            isLoading={isMinting}
            onClick={handleMint}
            disabled={!isConnected || isMinting || tokensToMint <= 0}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Mint Tokens
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};