import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { DownloadIcon, Calendar, AlertCircle, InfoIcon } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Sample data
const purchaseData = [
  { month: "Jan", credits: 100 },
  { month: "Feb", credits: 150 },
  { month: "Mar", credits: 200 },
  { month: "Apr", credits: 180 },
  { month: "May", credits: 220 },
  { month: "Jun", credits: 250 },
];

const impactData = [
  { name: "Solar", value: 40 },
  { name: "Wind", value: 35 },
  { name: "Reforestation", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("purchases");
  const [dateRange, setDateRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseStats, setPurchaseStats] = useState(purchaseData);
  const [impactStats, setImpactStats] = useState(impactData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { toast } = useToast();

  const totalCO2Offset = purchaseStats.reduce((sum, item) => sum + (item.credits * 0.9), 0).toFixed(1);
  const percentageIncrease = purchaseStats.length > 1 ? (((purchaseStats[purchaseStats.length - 1].credits - purchaseStats[0].credits) / purchaseStats[0].credits) * 100).toFixed(1) : "0";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Placeholder for API: const response = await fetch(`/api/analytics/user?range=${dateRange}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (dateRange === "all") setPurchaseStats([...purchaseData, { month: "Jul", credits: 270 }]);
        else if (dateRange === "6months") setPurchaseStats(purchaseData);
        else setPurchaseStats(purchaseData.slice(3));
        setImpactStats(impactData); // Placeholder for dynamic impact data
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch analytics data.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const handleExportCSV = () => {
    toast({ title: "Export Started", description: "Check your downloads folder.", duration: 3000 });
    console.log("Exporting data as CSV for range:", dateRange);
  };

  const formatLineTooltip = (value: number) => [`${value} credits`, "Purchased"];
  const formatPieTooltip = (value: number) => [`${value}% (${(value * 0.45).toFixed(1)} tons CO₂)`];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg border-border bg-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Your Analytics</CardTitle>
                  <CardDescription className="text-muted-foreground">Track your carbon credit activity and impact</CardDescription>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Select value={dateRange} onValueChange={setDateRange} disabled={isLoading} aria-label="Select date range">
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            {error ? (
              <CardContent>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            ) : (
              <Tabs defaultValue="purchases" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 overflow-x-auto">
                  <TabsList className="w-full sm:w-auto mb-6 grid grid-cols-2 sm:flex">
                    <TabsTrigger value="purchases" aria-label="View purchase history" disabled={isLoading}>Purchases</TabsTrigger>
                    <TabsTrigger value="impact" aria-label="View environmental impact" disabled={isLoading}>Impact</TabsTrigger>
                  </TabsList>
                </div>
                <CardContent>
                  <TabsContent value="purchases" className="mt-0">
                    <div className="text-lg font-medium mb-4 flex items-center justify-between">
                      <span>Credits Purchased Over Time</span>
                      {!isLoading && <div className="text-sm text-muted-foreground">Total CO₂ Offset: <span className="font-medium text-primary">{totalCO2Offset} tons</span></div>}
                    </div>
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="w-full h-[300px] sm:h-[400px] rounded-md" />
                        <Skeleton className="w-full h-20 rounded-md" />
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-[300px] sm:h-[400px]" aria-label="Line chart of credits purchased">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={purchaseStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis dataKey="month" />
                              <YAxis label={{ value: "Credits", angle: -90, position: "insideLeft" }} />
                              <RechartsTooltip formatter={formatLineTooltip} labelFormatter={(label) => `Month: ${label}`} />
                              <Line type="monotone" dataKey="credits" stroke="#0088FE" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-6 bg-secondary/50 rounded-lg p-4">
                          <h3 className="font-medium mb-2 flex items-center"><InfoIcon className="h-4 w-4 mr-2 text-primary" /> Insights</h3>
                          <p className="text-muted-foreground text-sm">
                            Your purchases increased by {percentageIncrease}% since {purchaseStats[0].month}, offsetting {totalCO2Offset} tons of CO₂ ({(Number(totalCO2Offset) * 2.5).toFixed(1)} trees planted).
                          </p>
                        </div>
                      </>
                    )}
                  </TabsContent>
                  <TabsContent value="impact" className="mt-0">
                    <div className="text-lg font-medium mb-4">CO₂ Offset by Project Type</div>
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="w-full h-[300px] sm:h-[400px] rounded-md" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                          <Skeleton className="h-24 rounded-md" /><Skeleton className="h-24 rounded-md" /><Skeleton className="h-24 rounded-md" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-[300px] sm:h-[400px]" aria-label="Pie chart of CO2 offset">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={impactStats}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={120}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {impactStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend />
                              <RechartsTooltip formatter={formatPieTooltip} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {impactStats.map((item, index) => (
                            <div key={index} className="bg-secondary/50 rounded-lg p-4 hover:shadow-md transition-all">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-2xl font-bold" style={{ color: COLORS[index] }}>{item.value}%</div>
                              <div className="text-sm text-muted-foreground">{(item.value * 0.45).toFixed(1)} tons of CO₂</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            )}
            <CardFooter className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground order-2 sm:order-1">Last updated: {lastUpdated.toLocaleString()}</div>
              <Button onClick={handleExportCSV} variant="outline" size="sm" disabled={isLoading || !!error} aria-label="Export as CSV" className="w-full sm:w-auto order-1 sm:order-2">
                <DownloadIcon className="h-4 w-4 mr-2" /> Export as CSV
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;