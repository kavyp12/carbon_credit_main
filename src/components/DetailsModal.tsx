
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui-components";
import {
  CheckCircle,
  FileText,
  leaf,
  MapPin,
  User,
  Download,
  ExternalLink
} from "lucide-react";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: any | null;
  onBuy: (id: string) => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  credit,
  onBuy,
}) => {
  if (!credit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {credit.title}
            {credit.verified && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this carbon credit project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative rounded-lg overflow-hidden h-64">
            <img
              src={credit.image}
              alt={credit.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Badge variant="blue" size="sm">{credit.type}</Badge>
              </div>
              <div className="text-lg font-semibold">{credit.amount.toLocaleString()} tons CO₂</div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </div>
              <div className="text-lg font-semibold">{credit.location}</div>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span>Seller</span>
              </div>
              <div className="text-lg font-semibold">{credit.sellerName}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Project Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {credit.description}
              {!credit.description.includes("Lorem ipsum") && 
                "\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas feugiat mauris vel diam faucibus, in faucibus tortor egestas. Sed tincidunt, purus id efficitur scelerisque, velit tellus lacinia arcu, et pellentesque est hendrerit in lorem. Sed sit amet enim vel urna tincidunt sollicitudin. Aenean non est sem."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Verification Details</h3>
            <div className="border rounded-lg p-4">
              {credit.verified ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Verified by Carbon Registry International</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This project has been independently verified to ensure it meets international standards for carbon offset projects. Verification includes validation of carbon reduction methods, monitoring protocols, and community impact.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>View Certificate</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <FileText className="h-5 w-5" />
                  <span>Verification pending</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Project Impact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Environmental Benefits</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Carbon sequestration: {credit.amount.toLocaleString()} tons CO₂</li>
                  <li>Biodiversity protection: 25+ species</li>
                  <li>Watershed protection: 1,200 hectares</li>
                  <li>Soil erosion prevention</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Social Benefits</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Local employment: 45 jobs created</li>
                  <li>Community development programs</li>
                  <li>Educational opportunities</li>
                  <li>Sustainable livelihood training</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Additional Resources</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <leaf className="h-4 w-4" />
                <span>Project Website</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Methodology</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location Map</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onClose();
              onBuy(credit.id);
            }}
          >
            Buy Carbon Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
