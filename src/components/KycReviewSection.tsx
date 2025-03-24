
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  CheckCircle, 
  X, 
  Eye, 
  User, 
  CalendarClock, 
  Wallet 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Types for KYC requests
interface KycRequest {
  id: string;
  userId: string;
  walletAddress: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  documents: {
    idDocument: {
      path: string;
    };
    selfie: {
      path: string;
    };
    personalInfo: {
      fullName: string;
      idNumber: string;
      address: string;
    };
  };
  userName?: string;
  userEmail?: string;
}

// Mock data for demonstration
const mockKycRequests: KycRequest[] = [
  {
    id: "1",
    userId: "101",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    status: "pending",
    createdAt: "2023-06-15T10:30:00Z",
    documents: {
      idDocument: {
        path: "/uploads/id-1.jpg",
      },
      selfie: {
        path: "/uploads/selfie-1.jpg",
      },
      personalInfo: {
        fullName: "John Smith",
        idNumber: "AB123456",
        address: "123 Main St, Anytown, USA",
      },
    },
    userName: "johnsmith",
    userEmail: "john.smith@example.com",
  },
  {
    id: "2",
    userId: "102",
    walletAddress: "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99",
    status: "pending",
    createdAt: "2023-06-16T14:45:00Z",
    documents: {
      idDocument: {
        path: "/uploads/id-2.jpg",
      },
      selfie: {
        path: "/uploads/selfie-2.jpg",
      },
      personalInfo: {
        fullName: "Sarah Johnson",
        idNumber: "CD789012",
        address: "456 Oak Ave, Springfield, USA",
      },
    },
    userName: "sarahj",
    userEmail: "sarah.j@example.com",
  },
  {
    id: "3",
    userId: "103",
    walletAddress: "0x3B5d6C13abC987554Fd32a2808B878836A39B1fe",
    status: "pending",
    createdAt: "2023-06-17T09:15:00Z",
    documents: {
      idDocument: {
        path: "/uploads/id-3.jpg",
      },
      selfie: {
        path: "/uploads/selfie-3.jpg",
      },
      personalInfo: {
        fullName: "David Lee",
        idNumber: "EF345678",
        address: "789 Pine St, Liberty City, USA",
      },
    },
    userName: "davidl",
    userEmail: "david.lee@example.com",
  }
];

export const KycReviewSection = () => {
  const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // In a real implementation, this would fetch data from your backend
  const { data: kycRequests, isLoading, refetch } = useQuery({
    queryKey: ["kycRequests"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockKycRequests;
    }
  });
  
  const handleViewDetails = (request: KycRequest) => {
    setSelectedRequest(request);
    setRejectionReason("");
  };
  
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to approve KYC
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "KYC Approved",
        description: `${selectedRequest.documents.personalInfo.fullName}'s verification has been approved.`,
      });
      
      // In a real implementation, this would update the data
      mockKycRequests.find(r => r.id === selectedRequest.id)!.status = "approved";
      setSelectedRequest(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve KYC request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async () => {
    if (!selectedRequest) return;
    
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to reject KYC
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "KYC Rejected",
        description: `${selectedRequest.documents.personalInfo.fullName}'s verification has been rejected.`,
      });
      
      // In a real implementation, this would update the data
      mockKycRequests.find(r => r.id === selectedRequest.id)!.status = "rejected";
      setSelectedRequest(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject KYC request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">KYC Verification Requests</h2>
          <p className="text-muted-foreground">
            Review and manage user identity verification submissions
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md w-[300px]"></div>
            <div className="h-12 bg-muted rounded-md w-[250px]"></div>
            <div className="h-12 bg-muted rounded-md w-[200px]"></div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {selectedRequest ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>KYC Request Details</CardTitle>
                  <CardDescription>
                    Reviewing submission from {selectedRequest.documents.personalInfo.fullName}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedRequest(null)}
                >
                  Back to List
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User size={18} /> User Information
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedRequest.documents.personalInfo.fullName}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ID Number</p>
                      <p className="font-medium">{selectedRequest.documents.personalInfo.idNumber}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium">{selectedRequest.userName}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedRequest.userEmail}</p>
                    </div>
                    
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Wallet Address</p>
                      <p className="font-medium">{selectedRequest.walletAddress}</p>
                    </div>
                    
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Residential Address</p>
                      <p className="font-medium">{selectedRequest.documents.personalInfo.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Document Images */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Eye size={18} /> Verification Documents
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">ID Document</p>
                      <div className="border rounded-md overflow-hidden bg-muted h-64 flex items-center justify-center">
                        {/* In a real implementation, this would display the actual document */}
                        <p className="text-muted-foreground">ID Document Image Placeholder</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selfie Photo</p>
                      <div className="border rounded-md overflow-hidden bg-muted h-64 flex items-center justify-center">
                        {/* In a real implementation, this would display the actual selfie */}
                        <p className="text-muted-foreground">Selfie Image Placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submission Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CalendarClock size={18} /> Submission Details
                  </h3>
                  
                  <div className="text-sm text-muted-foreground">
                    Submitted on {formatDate(selectedRequest.createdAt)}
                  </div>
                </div>
                
                {/* Decision Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Verification Decision</h3>
                  
                  {selectedRequest.status === "pending" ? (
                    <>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Please review the information and documents carefully before making a decision.
                        </p>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Rejection Reason (Required for rejections)
                          </label>
                          <Textarea
                            placeholder="Provide a reason if rejecting this verification..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            onClick={handleApprove}
                            disabled={isProcessing}
                            className="sm:flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve KYC
                          </Button>
                          
                          <Button
                            onClick={handleReject}
                            disabled={isProcessing}
                            variant="destructive"
                            className="sm:flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject KYC
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-muted/50">
                      <p className="font-medium">
                        This KYC request has already been {selectedRequest.status}.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {kycRequests && kycRequests.length > 0 ? (
                <div className="space-y-4">
                  {kycRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold text-lg">
                                {request.documents.personalInfo.fullName}
                              </h3>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium 
                              ${request.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 
                                request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="space-y-1">
                              <p className="text-muted-foreground">User ID</p>
                              <p>{request.userId}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-muted-foreground">Username</p>
                              <p>{request.userName}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-muted-foreground">Email</p>
                              <p>{request.userEmail}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-muted-foreground">Wallet</p>
                              <p className="flex items-center">
                                <Wallet className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                {truncateAddress(request.walletAddress)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Submitted {formatDate(request.createdAt)}
                            </div>
                            
                            <Button
                              onClick={() => handleViewDetails(request)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Pending KYC Requests</h3>
                  <p className="text-muted-foreground">
                    All user verification requests have been processed.
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default KycReviewSection;