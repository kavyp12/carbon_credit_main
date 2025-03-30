import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input, LoadingButton } from "@/components/ui-components";
import { Section, Container } from "@/components/ui-components";
import { Leaf, Lock, Mail } from "lucide-react";
import { API_URLS } from "@/config/apiConfig";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const successMessage = location.state?.successMessage;

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
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
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
      const response = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login successful:", data);

      if (!response.ok) {
        setErrors(data.errors || { general: data.message });
        setIsLoading(false);
        return;
      }

      // Store token and user data in localStorage
      localStorage.setItem("token", data.token); // Add this line
      const userData = {
        userId: data.userId,
        fullName: data.fullName || "User",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.fullName}!`,
      });

      // Navigate to SellCredits instead of home
      navigate("/", { state: { user: userData } });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Network error, please try again" });
      toast({
        title: "Network Error",
        description: "Failed to connect to the server.",
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
          <Container className="max-w-md">
            <div className="flex flex-col items-center mb-8">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Leaf className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-center">Welcome back</h1>
              <p className="text-muted-foreground mt-2 text-center">
                Log in to your Carbon Connect account
              </p>
              {successMessage && (
                <p className="text-green-600 mt-2 text-center">{successMessage}</p>
              )}
            </div>
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                    icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                    fullWidth
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                    Remember me for 30 days
                  </label>
                </div>
                <LoadingButton type="submit" loading={isLoading} className="w-full button-hover">
                  Log in
                </LoadingButton>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;