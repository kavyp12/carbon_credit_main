import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input, LoadingButton } from "@/components/ui-components";
import { Section, Container } from "@/components/ui-components";
import { CheckCircle2, Lock, Mail, User, Building, Leaf } from "lucide-react";
import { API_URLS } from "@/config/apiConfig";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    userType: "buyer",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company or project name is required";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URLS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || { general: data.message });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Sign-up Successful",
        description: "Your account has been created. Please complete KYC verification.",
      });

      // Fix: Ensure we're navigating with the correct userId and adding console logs
      console.log("Navigating to KYC with userId:", data.userId);
      // Use a slight delay to ensure the navigation happens after the state is updated
      setTimeout(() => {
        navigate("/kyc", { 
          state: { userId: data.userId },
          replace: true // Use replace to prevent going back to signup
        });
      }, 100);
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "Network error, please try again" });
      toast({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 page-transition pt-20">
        <Section className="py-12">
          <Container className="max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 hidden md:block">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Leaf className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Join the Carbon Connect community
                </h1>
                <p className="text-muted-foreground">
                  Create an account to start buying or selling carbon credits and make a positive impact on our planet's future.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Verified projects</h3>
                      <p className="text-sm text-muted-foreground">All listings undergo thorough verification</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Secure transactions</h3>
                      <p className="text-sm text-muted-foreground">All purchases and sales are fully secure</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Transparent impact</h3>
                      <p className="text-sm text-muted-foreground">Track your environmental contribution</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2 text-center md:hidden">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                      Enter your information to get started
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      error={errors.fullName}
                      icon={<User className="h-4 w-4 text-muted-foreground" />}
                      fullWidth
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      error={errors.email}
                      icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                      fullWidth
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        error={errors.password}
                        icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                        fullWidth
                      />
                      <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        error={errors.confirmPassword}
                        fullWidth
                      />
                    </div>
                    <Input
                      label="Company or Project Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter company or project name"
                      error={errors.companyName}
                      icon={<Building className="h-4 w-4 text-muted-foreground" />}
                      fullWidth
                    />
                    <fieldset className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        I want to register as
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="userType"
                            value="buyer"
                            checked={formData.userType === "buyer"}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary"
                          />
                          <span>Buyer</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="userType"
                            value="seller"
                            checked={formData.userType === "seller"}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary"
                          />
                          <span>Seller</span>
                        </label>
                      </div>
                    </fieldset>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="h-4 w-4 mt-1 text-primary rounded"
                        />
                        <span className="text-sm">
                          I agree to the{" "}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms and Conditions
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <p className="text-destructive text-sm">{errors.agreeTerms}</p>
                      )}
                    </div>
                    <LoadingButton
                      type="submit"
                      loading={isLoading}
                      className="w-full button-hover"
                    >
                      Create Account
                    </LoadingButton>
                  </form>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary hover:underline font-medium">
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;