
import { useState, useCallback } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/ui-components";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { FilePenLine, Upload, X, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, 
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface ListingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: any) => void;
}

export const ListingForm = ({ isOpen, onClose, onSubmit }: ListingFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [projectType, setProjectType] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [useSuggestedPrice, setUseSuggestedPrice] = useState(true);
  const { toast } = useToast();
  
  // Suggested price based on project type and amount (this would be more sophisticated in a real app)
  const suggestedPrice = projectType ? 
    (projectType === 'Forestation' ? 20 : 
      projectType === 'Solar' ? 18 : 
        projectType === 'Wind' ? 15 : 
          projectType === 'Methane' ? 12 : 16) 
    : 18;
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check file size (max 10MB)
    const validFiles = acceptedFiles.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length < acceptedFiles.length) {
      toast({
        title: "File too large",
        description: "Some files were not added because they exceed the 10MB limit",
        variant: "destructive",
      });
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setProjectType("");
    setAmount("");
    setPrice("");
    setFiles([]);
    setUseSuggestedPrice(true);
  };
  
  const handleSubmit = async () => {
    // Form validation
    if (!title || !description || !location || !projectType || !amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: "Documentation required",
        description: "Please upload at least one document for verification",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (onSubmit) {
      onSubmit({
        title,
        description,
        location,
        projectType,
        amount: parseFloat(amount),
        price: useSuggestedPrice ? suggestedPrice : parseFloat(price),
        files,
      });
    }
    
    // Show success message
    toast({
      title: "Project submitted",
      description: "Your carbon credit project has been submitted for verification",
    });
    
    resetForm();
    setSubmitting(false);
    onClose();
  };
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FilePenLine className="h-4 w-4 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FilePenLine className="h-4 w-4 text-blue-500" />;
      default:
        return <FilePenLine className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">List Carbon Credits</SheetTitle>
          <SheetDescription>
            Submit your project for verification to list carbon credits for sale
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Project Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Amazon Rainforest Conservation"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your project, its impact, and how it reduces CO2 emissions"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input 
                    id="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g., Amazonas, Brazil"
                  />
                </div>
                
                <div>
                  <Label htmlFor="project-type">Project Type <span className="text-red-500">*</span></Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Forestation">Forestation</SelectItem>
                      <SelectItem value="Solar">Solar</SelectItem>
                      <SelectItem value="Wind">Wind Energy</SelectItem>
                      <SelectItem value="Hydro">Hydroelectric</SelectItem>
                      <SelectItem value="Methane">Methane Capture</SelectItem>
                      <SelectItem value="Agriculture">Sustainable Agriculture</SelectItem>
                      <SelectItem value="Geothermal">Geothermal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Credit Details Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Credit Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">CO₂ Offset Amount (tons) <span className="text-red-500">*</span></Label>
                <Input 
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Price per Credit (USD)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Use suggested price</span>
                    <Switch 
                      checked={useSuggestedPrice} 
                      onCheckedChange={setUseSuggestedPrice} 
                    />
                  </div>
                </div>
                
                {useSuggestedPrice ? (
                  <div className="flex items-center border rounded-md p-3 bg-muted/30">
                    <div className="flex-1">
                      <div className="font-medium">${suggestedPrice.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        Based on market rates for {projectType || "similar projects"}
                      </div>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Suggested price is calculated based on current market rates
                            for similar project types and CO₂ amounts
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div>
                    <Input 
                      id="price"
                      type="number"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder={`Suggested: $${suggestedPrice.toFixed(2)}`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Market average for {projectType || "similar projects"} is ${suggestedPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Documentation Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload documents to verify your project (max 10MB per file)
            </p>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                {isDragActive ? (
                  <p>Drop the files here...</p>
                ) : (
                  <>
                    <p className="font-medium">Drag and drop files here, or click to select files</p>
                    <p className="text-sm text-muted-foreground">
                      Supports images and PDFs (max 10MB each)
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Uploaded Files ({files.length})</h4>
                <div className="rounded-md border">
                  {files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Verification Required
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    All projects undergo verification by our team before being listed. This process typically takes 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <LoadingButton 
              isLoading={submitting} 
              onClick={handleSubmit}
              className="min-w-[140px]"
            >
              Submit for Verification
            </LoadingButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
