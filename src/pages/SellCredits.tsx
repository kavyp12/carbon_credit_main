
// D:\carbon-connectivity\src\pages\SellCredits.tsx
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container } from "@/components/ui-components";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, FileCheck, Clock, CheckCircle, AlertTriangle, Info, Book, ChevronRight, 
  ArrowUpRight, ChevronDown, Star, BarChart 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui-components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingForm } from "@/components/ListingForm";
import { ProjectCard } from "@/components/ProjectCard";
import { MintTokensModal } from "@/components/MintTokensModal";
import { ManageProjectModal } from "@/components/ManageProjectModal";
import { Web3Provider } from "@/contexts/Web3Context";
import axios, { AxiosError } from "axios";

interface Project {
  id: string;
  title: string;
  type: string;
  location: string;
  status: "pending" | "reviewing" | "approved" | "draft" | "rejected";
  price: number;
  amount: number;
  amountAvailable: number;
  createdAt: string;
  earnings?: number;
  adminNotes?: string;
}

const resourceArticles = []; // Assuming unchanged

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SellCredits = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const createAxiosInstance = useCallback(() => {
    const token = getToken();
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [getToken]);

  const fetchProjects = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast({ title: "Error", description: "Please log in to view your projects", variant: "destructive" });
      setProjects([]);
      return;
    }

    setIsLoading(true);
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.get("/projects/user");
      setProjects(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching projects:", axiosError);
      toast({ 
        title: "Error", 
        description: axiosError.response?.status === 401 
          ? "Session expired. Please log in again." 
          : "Failed to fetch projects.",
        variant: "destructive" 
      });
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getToken, toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getFilteredProjects = () => {
    switch (activeTab) {
      case "active": 
        return projects.filter(p => p.status === "approved");
      case "pending": 
        return projects.filter(p => p.status === "pending" || p.status === "reviewing");
      case "drafts": 
        return projects.filter(p => p.status === "draft" || p.status === "rejected"); // Ensure "rejected" is here
      default: 
        return projects;
    }
  };

  const filteredProjects = getFilteredProjects();
  const totalEarnings = projects.reduce((sum, project) => sum + (project.earnings || 0), 0);
  const totalAvailableCredits = projects.reduce((sum, project) => 
    project.status === "approved" ? sum + project.amountAvailable : sum, 0);

  const handleProjectSubmit = async (projectData: any) => {
    const token = getToken();
    if (!token) {
      toast({ title: "Error", description: "Please log in to submit a project", variant: "destructive" });
      return;
    }
  
    console.log("Project data being sent:", projectData);
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("type", projectData.projectType); // Rename to type
    formData.append("location", projectData.location);
    formData.append("price", projectData.price.toString());
    formData.append("amount", projectData.amount.toString());
    formData.append("description", projectData.description || "");
    projectData.files.forEach((file: File, index: number) => {
      console.log(`Appending file ${index}:`, file.name, file.size, file.type);
      formData.append("files", file);
    });
  
    // Log FormData contents
    for (let pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1] instanceof File ? `File: ${pair[1].name}, ${pair[1].size} bytes` : pair[1]);
    }
  
    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProjects([response.data, ...projects]);
      setIsSubmissionSuccessful(true);
      setIsListingModalOpen(false);
      toast({ title: "Success", description: "Project submitted for verification" });
      setTimeout(() => setIsSubmissionSuccessful(false), 5000);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error submitting project:", axiosError);
      console.log("Backend response:", axiosError.response?.data);
      toast({ 
        title: "Error", 
        description: axiosError.response?.status === 401 
          ? "Session expired. Please log in again." 
          : (axiosError.response?.data as { message?: string })?.message || "Failed to submit project",
        variant: "destructive" 
      });
    }
  };

  const handleEditProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setIsListingModalOpen(true);
    }
  };

  const handleMintTokens = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setIsMintModalOpen(true);
    }
  };

  const handleManageProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
      setIsManageModalOpen(true);
    }
  };

  const handleMintComplete = async (projectId: string, amount: number) => {
    const token = getToken();
    if (!token) {
      toast({ title: "Error", description: "Please log in to mint tokens", variant: "destructive" });
      return;
    }

    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.patch(`/projects/${projectId}/mint`, { amount });
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, amountAvailable: project.amountAvailable - amount } : project
      ));
      toast({ title: "Tokens Minted", description: `Successfully minted ${amount} tokens` });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error minting tokens:", axiosError);
      toast({ 
        title: "Error", 
        description: axiosError.response?.status === 401 
          ? "Session expired. Please log in again." 
          : "Failed to mint tokens",
        variant: "destructive" 
      });
    }
  };

  const handleProjectUpdate = async (projectId: string, updatedData: any) => {
    const token = getToken();
    if (!token) {
      toast({ title: "Error matching token", description: "Please log in to update projects", variant: "destructive" });
      return;
    }

    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.patch(`/projects/${projectId}`, updatedData);
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, ...response.data } : project
      ));
      toast({ title: "Project Updated", description: `Project #${projectId} updated successfully` });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error updating project:", axiosError);
      toast({ 
        title: "Error", 
        description: axiosError.response?.status === 401 
          ? "Session expired. Please log in again." 
          : "Failed to update project",
        variant: "destructive" 
      });
    }
  };

  return (
    <Web3Provider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20">
          <Section>
            <Container>
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Sell Carbon Credits</h1>
                <p className="text-lg text-muted-foreground">
                  List your carbon reduction projects, get verified, and sell credits on the marketplace.
                </p>
                <Button className="mt-6" onClick={() => { setSelectedProject(null); setIsListingModalOpen(true); }}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Listing
                </Button>
              </div>

              {isSubmissionSuccessful && (
                <div className="max-w-4xl mx-auto mb-8 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-md animate-fade-in">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Project Submitted Successfully</h3>
                      <p className="text-sm text-muted-foreground">
                        Your project has been submitted for verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
                        <div className="text-3xl font-bold">${totalEarnings.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-green-600 font-medium">+24.5%</span>
                          <span>from last month</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Available Credits</h3>
                        <div className="text-3xl font-bold">{totalAvailableCredits.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Ready to sell or mint as tokens</div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Project Status</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="success">{projects.filter(p => p.status === "approved").length} Approved</Badge>
                          <Badge variant="warning">{projects.filter(p => p.status === "pending" || p.status === "reviewing").length} Pending</Badge>
                          <Badge variant="danger">{projects.filter(p => p.status === "rejected").length} Rejected</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {projects.filter(p => p.status === "draft").length} draft{projects.filter(p => p.status === "draft").length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <TabsList>
                      <TabsTrigger value="active" className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Active
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Pending
                      </TabsTrigger>
                      <TabsTrigger value="drafts" className="flex items-center gap-1">
                        <FileCheck className="h-4 w-4" />
                        Drafts
                      </TabsTrigger>
                    </TabsList>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedProject(null); setIsListingModalOpen(true); }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Project
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12">Loading projects...</div>
                  ) : (
                    <>
                      <TabsContent value="active">
                        {filteredProjects.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProjects.map(project => (
                              <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={handleEditProject}
                                onMint={handleMintTokens}
                                onManage={handleManageProject}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 border rounded-lg">
                            <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No active projects yet</h3>
                            <p className="text-muted-foreground mb-6">Submit a project for verification to get started</p>
                            <Button onClick={() => { setSelectedProject(null); setIsListingModalOpen(true); }}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create New Project
                            </Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="pending">
                        {filteredProjects.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProjects.map(project => (
                              <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={handleEditProject}
                                onMint={handleMintTokens}
                                onManage={handleManageProject}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 border rounded-lg">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No pending projects</h3>
                            <p className="text-muted-foreground mb-6">All your submitted projects have been processed</p>
                            <Button onClick={() => { setSelectedProject(null); setIsListingModalOpen(true); }}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create New Project
                            </Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="drafts">
                        {filteredProjects.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProjects.map(project => (
                              <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={handleEditProject}
                                onMint={handleMintTokens}
                                onManage={handleManageProject}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 border rounded-lg">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No draft projects</h3>
                            <p className="text-muted-foreground mb-6">You don’t have any draft or rejected projects</p>
                            <Button onClick={() => { setSelectedProject(null); setIsListingModalOpen(true); }}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create New Project
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                    </>
                  )}
                </Tabs>

                <div className="mt-16">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Seller Resources</h2>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      Browse all <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resourceArticles.map((article: any) => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="blue" size="sm">{article.category}</Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                            <a href={article.url}>
                              <Book className="h-4 w-4" />
                              Read Article
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Market Trends</h2>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      View Full Dashboard
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Average Credit Prices by Type</h3>
                          <p className="text-sm text-muted-foreground">Last 30 days market data</p>
                        </div>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Info className="h-4 w-4" /> Price Factors
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium">Project Type</span>
                          <span className="font-medium">Price (USD)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Forestation</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">$22.40</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Renewable Energy</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">$18.75</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span>Solar</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">$15.20</span>
                            <ChevronDown className="h-3.5 w-3.5 text-red-500" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>Agriculture</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">$17.90</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Container>
          </Section>
        </main>

        <ListingForm
          isOpen={isListingModalOpen}
          onClose={() => setIsListingModalOpen(false)}
          onSubmit={handleProjectSubmit}
        />
        <MintTokensModal
          isOpen={isMintModalOpen}
          onClose={() => setIsMintModalOpen(false)}
          project={selectedProject}
          onMintComplete={handleMintComplete}
        />
        <ManageProjectModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          project={selectedProject}
          onUpdate={handleProjectUpdate}
        />
        <Footer />
      </div>
    </Web3Provider>
  );
};

export default SellCredits;