
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui-components";
import {
  Edit,
  Settings,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    type: string;
    location: string;
    status: 'draft' | 'pending' | 'reviewing' | 'approved' | 'rejected';
    price: number;
    amount: number;
    amountAvailable: number;
    createdAt: string;
    earnings?: number;
    rejectionReason?: string;
  };
  onEdit: (id: string) => void;
  onMint: (id: string) => void;
  onManage: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onMint,
  onManage,
}) => {
  // Helper to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { variant: 'green' as const, label: 'Approved' };
      case 'pending':
        return { variant: 'amber' as const, label: 'Pending Verification' };
      case 'reviewing':
        return { variant: 'blue' as const, label: 'Under Review' };
      case 'rejected':
        return { variant: 'red' as const, label: 'Rejected' };
      case 'draft':
        return { variant: 'default' as const, label: 'Draft' };
      default:
        return { variant: 'default' as const, label: status };
    }
  };
  
  // Get progress percentage for verification progress bar
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'draft':
        return 0;
      case 'pending':
        return 33;
      case 'reviewing':
        return 66;
      case 'approved':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };
  
  const statusInfo = getStatusBadge(project.status);
  const progressPercentage = getProgressPercentage(project.status);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Type:</span> {project.type}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Location:</span> {project.location}
          </div>
        </div>
        
        {/* Verification progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Verification Progress</span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                <span className={project.status === 'pending' || project.status === 'reviewing' || project.status === 'approved' ? "text-primary font-medium" : ""}>Submitted</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className={project.status === 'reviewing' || project.status === 'approved' ? "text-primary font-medium" : ""}>Under Review</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className={project.status === 'approved' ? "text-green-600 font-medium" : project.status === 'rejected' ? "text-destructive font-medium" : ""}>
                  {project.status === 'rejected' ? 'Rejected' : 'Approved'}
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} 
              className={`${project.status === 'rejected' ? 'bg-destructive/30' : ''}`}
            />
          </div>
        </div>
        
        {project.status === 'rejected' && project.rejectionReason && (
          <div className="mb-4 p-3 bg-destructive/10 border-l-4 border-destructive rounded flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Verification rejected</p>
              <p className="text-sm text-muted-foreground">{project.rejectionReason}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Credits Available</p>
            <p className="text-lg font-semibold">{project.amountAvailable.toLocaleString()} / {project.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price per Credit</p>
            <p className="text-lg font-semibold">${project.price.toFixed(2)}</p>
          </div>
        </div>
        
        {project.earnings !== undefined && project.earnings > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-md mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Earnings to date</p>
                <p className="text-lg font-semibold">${project.earnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-4">
          Submitted on {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
        {project.status === 'draft' || project.status === 'rejected' ? (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(project.id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : null}
        
        {project.status === 'approved' && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onMint(project.id)}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Mint Tokens
          </Button>
        )}
        
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onManage(project.id)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
};
