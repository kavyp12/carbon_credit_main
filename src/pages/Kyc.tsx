import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container, LoadingButton, Badge } from "@/components/ui-components";
import { Upload, FileText, Camera, CheckCircle2, AlertTriangle, Shield, User } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const kycFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  idNumber: z.string().min(1, "ID number is required"),
  address: z.string().min(1, "Address is required"),
  idDocument: z.any().refine((file) => file && file.length > 0, "ID document is required"),
  selfie: z.any().refine((file) => file && file.length > 0, "Selfie photo is required"),
  additionalInfo: z.string().optional(),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

const Kyc = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { account, isConnected, isConnecting, connect } = useWeb3();
  const { toast } = useToast();

  // Get userId from location.state, no fallback to "user123"
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId || isNaN(Number(userId))) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to proceed with KYC verification.",
        variant: "destructive",
      });
      navigate("/signup"); // Redirect to signup if userId is missing or invalid
    }
  }, [userId, navigate, toast]);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      address: "",
      additionalInfo: "",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    field: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: KycFormValues) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit KYC.",
        variant: "destructive",
      });
      return;
    }

    if (!userId || isNaN(Number(userId))) {
      toast({
        title: "Invalid User ID",
        description: "User ID must be a valid number. Please sign up or log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("userId", String(userId)); // Convert to string for FormData, backend will parse as integer
    formData.append("wallet", account || "");
    formData.append("fullName", data.fullName);
    formData.append("idNumber", data.idNumber);
    formData.append("address", data.address);
    formData.append("idDocument", data.idDocument[0]);
    formData.append("selfie", data.selfie[0]);
    if (data.additionalInfo) formData.append("additionalInfo", data.additionalInfo);

    try {
      const response = await axios.post("http://localhost:5000/api/kyc/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "KYC Submitted Successfully",
        description: response.data.message,
      });
      navigate("/login");
    } catch (error) {
      console.error("KYC submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your KYC information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Connecting your wallet is recommended for KYC verification.",
        variant: "destructive",
      });
    }
  }, [account, toast]);

  if (!userId || isNaN(Number(userId))) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <Section>
          <Container className="max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">
                Complete KYC Verification
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Verify your identity to unlock full access to our carbon credit marketplace. 
                Your information is securely processed and protected.
              </p>
              <div className="mt-4">
                {!isConnected ? (
                  <Button onClick={connect} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                ) : (
                  <Badge variant="secondary">
                    Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Verification Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Submit Your Information</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete the form with your personal details
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Upload Documents</h3>
                        <p className="text-sm text-muted-foreground">
                          Provide your ID document and a selfie photo
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Verification Review</h3>
                        <p className="text-sm text-muted-foreground">
                          Our team will review your submission
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Get Verified</h3>
                        <p className="text-sm text-muted-foreground">
                          Once approved, you'll have full access to the platform
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Important Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• All documents must be valid and not expired</p>
                    <p>• Make sure images are clear and all information is legible</p>
                    <p>• Verification typically takes 1-2 business days</p>
                    <p>• Your data is encrypted and securely stored</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Verification Details</CardTitle>
                  <CardDescription>Please complete all required fields for identity verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Personal Information</h3>
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Legal Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input placeholder="Enter your full name as it appears on your ID" {...field} className="pl-9" />
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="idNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID/Passport Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input placeholder="Enter your ID or passport number" {...field} className="pl-9" />
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Residential Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter your full residential address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">Document Uploads</h3>
                        <FormField control={form.control} name="idDocument" render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Document</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Input type="file" accept="image/*" className="hidden" id="id-upload"
                                  onChange={(e) => handleFileChange(e, setIdPreview, field)} />
                                <label htmlFor="id-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer border-muted-foreground/25 hover:bg-muted/50 transition-colors">
                                  {idPreview ? (
                                    <div className="relative w-full h-full">
                                      <img src={idPreview} alt="ID Preview" className="object-contain w-full h-full p-2" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-medium">Change Image</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                      <Upload className="w-8 h-8 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">Upload passport, ID card, or driver's license</span>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="selfie" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selfie Photo</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Input type="file" accept="image/*" className="hidden" id="selfie-upload"
                                  onChange={(e) => handleFileChange(e, setSelfiePreview, field)} />
                                <label htmlFor="selfie-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer border-muted-foreground/25 hover:bg-muted/50 transition-colors">
                                  {selfiePreview ? (
                                    <div className="relative w-full h-full">
                                      <img src={selfiePreview} alt="Selfie Preview" className="object-contain w-full h-full p-2" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-medium">Change Image</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                      <Camera className="w-8 h-8 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">Upload a clear photo of your face</span>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Any additional information you'd like to provide" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="pt-2">
                        <LoadingButton type="submit" loading={isSubmitting} className="w-full" loadingText="Submitting verification...">
                          Submit Verification
                        </LoadingButton>
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                  <p className="text-sm text-center text-muted-foreground">
                    By submitting this form, you consent to our 
                    <Button variant="link" className="px-1.5 h-auto">Privacy Policy</Button>
                    and 
                    <Button variant="link" className="px-1.5 h-auto">Terms of Service</Button>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Kyc;