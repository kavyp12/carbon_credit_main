import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Changed to shadcn/ui default
import { useToast } from "@/hooks/use-toast";
import { Section, Container } from "@/components/ui-components"; // Use these
import { User, Mail, Building, Phone, Save, LogOut } from "lucide-react";

interface UserData {
  userId: string;
  fullName: string;
  email: string;
  companyName: string;
  userType: "Buyer" | "Seller" | "";
  bio: string;
  phone: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    userId: "",
    fullName: "",
    email: "",
    companyName: "",
    userType: "",
    bio: "",
    phone: "",
  });
  const [initialFormData, setInitialFormData] = useState<UserData | null>(null); // Null until fetched
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData.userId) {
      navigate("/login");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      userId: userData.userId || "",
      fullName: userData.fullName || "",
    }));

    fetchUserData(userData.userId);
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();

      const updatedData = {
        userId,
        fullName: userData.fullName || formData.fullName, // Preserve localStorage fullName if not returned
        email: userData.email || "",
        companyName: userData.companyName || "",
        userType: userData.userType || "",
        bio: userData.bio || "",
        phone: userData.phone || "",
      };

      setFormData(updatedData);
      setInitialFormData(updatedData); // Set initial data after fetch
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user data. Some fields may be unavailable.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10-15 digits";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!initialFormData) {
      toast({
        title: "Error",
        description: "Please wait for data to load before saving.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const changedData: Partial<UserData> = {};
    Object.keys(formData).forEach((key) => {
      const formKey = key as keyof UserData;
      if (formData[formKey] !== initialFormData[formKey]) {
        // Type assertion to ensure type safety
        if (formKey === 'userType') {
          changedData[formKey] = formData[formKey] as UserData['userType'];
        } else {
          changedData[formKey] = formData[formKey];
        }
      }
    });

    if (Object.keys(changedData).length === 0) {
      setLoading(false);
      toast({ title: "No Changes", description: "No changes were made to your profile." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${formData.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      if (changedData.fullName) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.fullName = changedData.fullName;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      setInitialFormData({ ...formData });
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <Section className="py-12">
          <Container className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
              <p className="text-muted-foreground mt-2">View and update your account information</p>
            </div>
            <Card className="bg-card rounded-xl border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details and preferences</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`pl-10 ${errors.fullName ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.fullName && <p className="text-destructive text-xs">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          readOnly
                          className="pl-10 bg-muted cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                          placeholder="Ex: 1234567890"
                        />
                      </div>
                      {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>User Type</Label>
                    <Badge variant={formData.userType === "Buyer" ? "default" : "secondary"}>
                      {formData.userType || "Not specified"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us a bit about yourself or your organization..."
                      className="max-w-full"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                  <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto button-hover">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                  <Button type="submit" disabled={loading || !initialFormData} className="w-full sm:w-auto button-hover">
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;