import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container, Badge } from "@/components/ui-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertTriangle, CheckCircle, FileCheck, Search, Settings, ShieldAlert, Users, XCircle } from "lucide-react";
import { Input } from "@/components/ui-components";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Dummy data remains unchanged
const pendingVerifications = [
  { id: "v1", projectName: "Solar Farm Project", seller: "GreenTech Solutions", submittedDate: "2023-10-15", creditAmount: 3000, status: "pending" },
  { id: "v2", projectName: "Mangrove Restoration", seller: "Ocean Guardians", submittedDate: "2023-10-10", creditAmount: 1500, status: "pending" },
];

const recentTransactions = [
  { id: "t1", date: "2023-10-18", buyer: "EcoFriendly Corp", seller: "Amazon Conservation", credits: 500, amount: 11000, status: "completed" },
  { id: "t2", date: "2023-10-17", buyer: "Green Ventures", seller: "GreenTech Solutions", credits: 200, amount: 3600, status: "completed" },
];

const userReports = [
  { id: "r1", date: "2023-10-14", reporter: "John Smith", reportedUser: "Questionable Credits LLC", reason: "Suspicious project claims", status: "open" },
];

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { toast } = useToast();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Axios instance with token in headers
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  useEffect(() => {
    if (token) {
      fetchKycRequests();
      fetchPendingProjects();
    } else {
      toast({ title: "Error", description: "Please log in to access admin dashboard", variant: "destructive" });
      setProjects(pendingVerifications); // Fallback to dummy data
    }
  }, [token]);

  const fetchKycRequests = async () => {
    try {
      const response = await axiosInstance.get("/kyc/pending");
      setKycRequests(response.data);
    } catch (error) {
      console.error("Error fetching KYC requests:", error);
      toast({ title: "Error", description: "Failed to fetch KYC requests", variant: "destructive" });
    }
  };

  const fetchPendingProjects = async () => {
    try {
      const response = await axiosInstance.get("/projects/pending");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({ title: "Error", description: "Failed to fetch pending projects. Using demo data.", variant: "destructive" });
      setProjects(pendingVerifications); // Fallback to dummy data
    }
  };

  const handleKycAction = async (id: string, status: "approved" | "rejected") => {
    if (!token) {
      toast({ title: "Error", description: "Please log in to perform this action", variant: "destructive" });
      return;
    }

    try {
      await axiosInstance.patch(`/kyc/${id}`, { status });
      toast({ title: `KYC ${status}`, description: `KYC request #${id} has been ${status}` });
      fetchKycRequests();
      setSelectedKyc(null);
    } catch (error) {
      console.error("Error updating KYC status:", error);
      toast({ title: "Error", description: "Failed to update KYC status", variant: "destructive" });
    }
  };

  const handleProjectAction = async (id: string, status: "approved" | "rejected") => {
    if (!token) {
      toast({ title: "Error", description: "Please log in to perform this action", variant: "destructive" });
      return;
    }

    try {
      await axiosInstance.patch(`/projects/${id}`, { status });
      toast({ title: `Project ${status}`, description: `Project #${id} has been ${status}` });
      fetchPendingProjects();
      setSelectedProject(null);
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({ title: "Error", description: "Failed to update project status", variant: "destructive" });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <Section className="py-8">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage verifications, users, and platform operations</p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Input
                  placeholder="Search projects, users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={<Search className="h-5 w-5 text-muted-foreground" />}
                  className="w-full md:w-64"
                />
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Credits" value="125,430" description="Carbon credits in circulation" trend="+12.5%" trendUp={true} icon={<Activity className="h-5 w-5" />} />
              <StatsCard title="Active Users" value="1,258" description="Buyers and sellers on platform" trend="+5.3%" trendUp={true} icon={<Users className="h-5 w-5" />} />
              <StatsCard title="Pending Verifications" value="17" description="Projects awaiting review" trend="-2.1%" trendUp={false} icon={<FileCheck className="h-5 w-5" />} />
              <StatsCard title="Open Reports" value="5" description="Issues requiring attention" trend="+1" trendUp={false} icon={<AlertTriangle className="h-5 w-5" />} urgent />
            </div>

            <Tabs defaultValue="verifications" className="space-y-6">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="verifications">Verifications</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="reports">User Reports</TabsTrigger>
                <TabsTrigger value="kyc">KYC Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="verifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Verifications</CardTitle>
                    <CardDescription>Review and approve carbon credit project submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title || project.projectName}</TableCell>
                            <TableCell>{project.seller || "N/A"}</TableCell>
                            <TableCell>{new Date(project.createdAt || project.submittedDate).toLocaleDateString()}</TableCell>
                            <TableCell>{(project.amount || project.creditAmount).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={project.status === "pending" ? "warning" : "blue"}>{project.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>View</Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Project Details - {project.title || project.projectName}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                      <div>
                                        <h3 className="font-medium">Project Information</h3>
                                        <p><strong>ID:</strong> {project.id}</p>
                                        <p><strong>Title:</strong> {project.title || project.projectName}</p>
                                        <p><strong>Type:</strong> {project.type || "N/A"}</p>
                                        <p><strong>Location:</strong> {project.location || "N/A"}</p>
                                        <p><strong>Amount:</strong> {project.amount || project.creditAmount}</p>
                                        <p><strong>Price:</strong> ${project.price || "N/A"}</p>
                                        <p><strong>Status:</strong> {project.status}</p>
                                        <p><strong>Admin Notes:</strong> {project.adminNotes || "None"}</p>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button variant="default" onClick={() => handleProjectAction(project.id, "approved")}>Approve</Button>
                                        <Button variant="destructive" onClick={() => handleProjectAction(project.id, "rejected")}>Reject</Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="default" size="sm" onClick={() => handleProjectAction(project.id, "approved")}>Approve</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleProjectAction(project.id, "rejected")}>Reject</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Showing {projects.length} pending projects</p>
                    <Button variant="outline" size="sm" onClick={fetchPendingProjects}>Refresh</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Monitor and manage credit transactions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className="font-medium">{transaction.buyer}</TableCell>
                            <TableCell>{transaction.seller}</TableCell>
                            <TableCell>{transaction.credits.toLocaleString()}</TableCell>
                            <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={transaction.status === "completed" ? "success" : "blue"}>{transaction.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Showing recent transactions</p>
                    <Button variant="outline" size="sm">View All Transactions</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>User Reports</CardTitle>
                    <CardDescription>Address reported issues and maintain platform integrity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Reporter</TableHead>
                          <TableHead>Reported User</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>{report.reporter}</TableCell>
                            <TableCell className="font-medium">{report.reportedUser}</TableCell>
                            <TableCell>{report.reason}</TableCell>
                            <TableCell>
                              <Badge variant={report.status === "open" ? "danger" : "warning"}>{report.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="default" size="sm">Resolve</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Showing {userReports.length} reports</p>
                    <Button variant="outline" size="sm">View All Reports</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="kyc">
                <Card>
                  <CardHeader>
                    <CardTitle>KYC Verification Requests</CardTitle>
                    <CardDescription>Review and approve user KYC submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Wallet</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>ID Number</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kycRequests.map((kyc) => (
                          <TableRow key={kyc.id}>
                            <TableCell>{kyc.userId}</TableCell>
                            <TableCell>{kyc.walletAddress.slice(0, 6)}...{kyc.walletAddress.slice(-4)}</TableCell>
                            <TableCell>{kyc.fullName}</TableCell>
                            <TableCell>{kyc.idNumber}</TableCell>
                            <TableCell>
                              <Badge variant={kyc.status === "pending" ? "warning" : "success"}>{kyc.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedKyc(kyc)}>View</Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>KYC Details - {kyc.fullName}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                      <div>
                                        <h3 className="font-medium">User Information</h3>
                                        <p><strong>User ID:</strong> {kyc.userId}</p>
                                        <p><strong>Wallet Address:</strong> {kyc.walletAddress}</p>
                                        <p><strong>Full Name:</strong> {kyc.fullName}</p>
                                        <p><strong>ID Number:</strong> {kyc.idNumber}</p>
                                        <p><strong>Address:</strong> {kyc.address}</p>
                                        <p><strong>Additional Info:</strong> {kyc.additionalInfo || "None"}</p>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-medium">ID Document</h3>
                                          <img
                                            src={`http://localhost:5000${kyc.idDocument}`}
                                            alt="ID Document"
                                            className="w-full h-auto max-h-64 object-contain rounded-md"
                                            onError={() => toast({ title: "Error", description: "Failed to load ID document", variant: "destructive" })}
                                          />
                                        </div>
                                        <div>
                                          <h3 className="font-medium">Selfie</h3>
                                          <img
                                            src={`http://localhost:5000${kyc.selfie}`}
                                            alt="Selfie"
                                            className="w-full h-auto max-h-64 object-contain rounded-md"
                                            onError={() => toast({ title: "Error", description: "Failed to load selfie", variant: "destructive" })}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button variant="default" onClick={() => handleKycAction(kyc.id, "approved")}>Approve</Button>
                                        <Button variant="destructive" onClick={() => handleKycAction(kyc.id, "rejected")}>Reject</Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="default" size="sm" onClick={() => handleKycAction(kyc.id, "approved")}>Approve</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleKycAction(kyc.id, "rejected")}>Reject</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Showing {kycRequests.length} pending KYC requests</p>
                    <Button variant="outline" size="sm" onClick={fetchKycRequests}>Refresh</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  urgent?: boolean;
}

const StatsCard = ({ title, value, description, trend, trendUp, icon, urgent = false }: StatsCardProps) => {
  return (
    <Card className={urgent ? "border-red-200 bg-red-50/30 dark:bg-red-900/10" : ""}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`p-2 rounded-full ${urgent ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-secondary text-primary"}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className={`text-xs font-medium flex items-center ${trendUp ? "text-green-600" : urgent ? "text-red-600" : "text-amber-600"}`}>
            {trendUp ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;