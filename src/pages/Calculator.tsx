
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container, LoadingButton, Badge } from "@/components/ui-components";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { 
  ArrowRight, 
  Car, 
  Home, 
  Plane, 
  ShoppingBag, 
  Info, 
  Download, 
  Share2, 
  Leaf,
  AlertTriangle,
  TreePine,
  CloudSun,
  Bike
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Transportation emissions based on different transportation types
const transportationOptions = [
  { id: 'car_petrol', label: 'Petrol/Gasoline Car', co2PerMile: 0.39 },
  { id: 'car_diesel', label: 'Diesel Car', co2PerMile: 0.35 },
  { id: 'car_electric', label: 'Electric Car', co2PerMile: 0.1 },
  { id: 'car_hybrid', label: 'Hybrid Car', co2PerMile: 0.18 },
  { id: 'bus', label: 'Bus', co2PerMile: 0.18 },
  { id: 'train', label: 'Train', co2PerMile: 0.08 },
  { id: 'plane_short', label: 'Short Flight (<500 miles)', co2PerMile: 0.55 },
  { id: 'plane_long', label: 'Long Flight (>500 miles)', co2PerMile: 0.39 }
];

// Diet emissions based on diet types
const dietOptions = [
  { id: 'meat_heavy', label: 'Heavy Meat Eater', co2PerYear: 3.3 },
  { id: 'meat_medium', label: 'Medium Meat Eater', co2PerYear: 2.5 },
  { id: 'meat_low', label: 'Low Meat Eater', co2PerYear: 1.9 },
  { id: 'pescatarian', label: 'Pescatarian', co2PerYear: 1.7 },
  { id: 'vegetarian', label: 'Vegetarian', co2PerYear: 1.5 },
  { id: 'vegan', label: 'Vegan', co2PerYear: 1.1 }
];

// Reduction strategies for different emission sources
const reductionStrategies = {
  transportation: [
    { strategy: "Use public transportation more often", reduction: "Up to 30%" },
    { strategy: "Switch to an electric or hybrid vehicle", reduction: "Up to 70%" },
    { strategy: "Carpool with colleagues or friends", reduction: "Up to 50%" },
    { strategy: "Work from home when possible", reduction: "Variable" },
    { strategy: "Use a bicycle for short trips", reduction: "100% for those trips" }
  ],
  energy: [
    { strategy: "Switch to renewable energy provider", reduction: "Up to 100%" },
    { strategy: "Install solar panels", reduction: "Up to 80%" },
    { strategy: "Improve home insulation", reduction: "15-30%" },
    { strategy: "Use energy-efficient appliances", reduction: "10-50%" },
    { strategy: "Reduce thermostat by 1-2 degrees", reduction: "5-10%" }
  ],
  diet: [
    { strategy: "Reduce meat consumption (esp. beef)", reduction: "Up to 50%" },
    { strategy: "Switch to a vegetarian diet", reduction: "Up to 55%" },
    { strategy: "Switch to a vegan diet", reduction: "Up to 70%" },
    { strategy: "Buy local and seasonal food", reduction: "5-10%" },
    { strategy: "Reduce food waste", reduction: "5-15%" }
  ],
  shopping: [
    { strategy: "Buy fewer new items", reduction: "Variable" },
    { strategy: "Choose second-hand items", reduction: "Up to 90%" },
    { strategy: "Select items with less packaging", reduction: "5-10%" },
    { strategy: "Buy more durable products", reduction: "Variable" },
    { strategy: "Repair rather than replace", reduction: "Variable" }
  ]
};

const Calculator = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTransportType, setActiveTransportType] = useState("car_petrol");
  const [activeDietType, setActiveDietType] = useState("meat_medium");
  const { toast } = useToast();
  
  // Personal calculator fields
  const [transportationMiles, setTransportationMiles] = useState(10000);
  const [homeEnergy, setHomeEnergy] = useState(4);
  const [dietType, setDietType] = useState(2.5); // Default to medium meat eater
  const [shopping, setShopping] = useState(2);
  
  // Business calculator fields
  const [employees, setEmployees] = useState(10);
  const [officeSpace, setOfficeSpace] = useState(1000);
  const [businessTravel, setBusinessTravel] = useState(5000);
  const [productionEmissions, setProductionEmissions] = useState(10000);
  
  // Historical data for comparison (for the bar chart)
  const [historicalData, setHistoricalData] = useState([
    { name: '2021', value: 14.2 },
    { name: '2022', value: 12.8 },
    { name: 'Current', value: 0 }, // Will be updated with calculation
  ]);
  
  const calculateEmissions = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      
      // Update historical data with current calculation
      const totalEmissions = activeTab === "personal" 
        ? getTotalPersonalEmissions() 
        : getTotalBusinessEmissions();
      
      setHistoricalData((prev) => [
        ...prev.slice(0, -1),
        { name: 'Current', value: parseFloat(totalEmissions.toFixed(1)) }
      ]);
      
      toast({
        title: "Calculation Complete",
        description: "Your carbon footprint has been calculated.",
      });
    }, 1500);
  };
  
  // Calculate personal emissions based on user inputs and selected options
  const getTotalPersonalEmissions = () => {
    const selectedTransport = transportationOptions.find(t => t.id === activeTransportType);
    const transportEmissions = selectedTransport 
      ? selectedTransport.co2PerMile * transportationMiles / 1000 
      : transportationMiles * 0.39 / 1000;
    
    const totalEmissions = transportEmissions + homeEnergy + dietType + shopping;
    return totalEmissions;
  };
  
  const getTotalBusinessEmissions = () => {
    const employeeEmissions = employees * 2; // tons per employee per year
    const officeEmissions = officeSpace * 0.01; // tons per sq ft per year
    const travelEmissions = businessTravel * 0.001; // tons per mile
    const productionEmissionsValue = productionEmissions * 0.0005; // conversion factor
    
    return employeeEmissions + officeEmissions + travelEmissions + productionEmissionsValue;
  };
  
  const personalEmissionsData = [
    { 
      name: "Transportation", 
      value: transportationOptions.find(t => t.id === activeTransportType)?.co2PerMile * transportationMiles / 1000 || 5, 
      color: "#0ea5e9" 
    },
    { name: "Home Energy", value: homeEnergy, color: "#10b981" },
    { 
      name: "Diet", 
      value: dietOptions.find(d => d.id === activeDietType)?.co2PerYear || dietType, 
      color: "#f59e0b" 
    },
    { name: "Shopping", value: shopping, color: "#8b5cf6" }
  ];
  
  const businessEmissionsData = [
    { name: "Employee Commute", value: employees * 2, color: "#0ea5e9" },
    { name: "Facilities", value: officeSpace * 0.01, color: "#10b981" },
    { name: "Business Travel", value: businessTravel * 0.001, color: "#f59e0b" },
    { name: "Production", value: productionEmissions * 0.0005, color: "#8b5cf6" }
  ];
  
  const totalPersonalEmissions = getTotalPersonalEmissions();
  const totalBusinessEmissions = getTotalBusinessEmissions();
  
  const carbonCreditCost = activeTab === "personal" 
    ? (totalPersonalEmissions * 15).toFixed(2)
    : (totalBusinessEmissions * 12).toFixed(2);
  
  const treesNeeded = activeTab === "personal"
    ? Math.round(totalPersonalEmissions * 0.5)
    : Math.round(totalBusinessEmissions * 0.4);

  // Determine footprint category
  const getFootprintCategory = (emissions: number) => {
    if (emissions < 6) return { label: "Low", color: "green" };
    if (emissions < 12) return { label: "Average", color: "amber" };
    if (emissions < 18) return { label: "High", color: "red" };
    return { label: "Very High", color: "red" };
  };

  const personalFootprint = getFootprintCategory(totalPersonalEmissions);
  const businessFootprint = getFootprintCategory(totalBusinessEmissions);

  // Handle transportation type change
  const handleTransportTypeChange = (type: string) => {
    setActiveTransportType(type);
    const selectedOption = transportationOptions.find(t => t.id === type);
    if (selectedOption) {
      // Recalculate emissions based on selected transport type
      // In a real app, we might update other values as well
    }
  };
  
  // Handle diet type change
  const handleDietTypeChange = (type: string) => {
    setActiveDietType(type);
    const selectedOption = dietOptions.find(d => d.id === type);
    if (selectedOption) {
      setDietType(selectedOption.co2PerYear);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <Section>
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Carbon Footprint Calculator</h1>
              <p className="text-lg text-muted-foreground">
                Estimate your carbon emissions and learn how to offset your impact with personalized advice.
              </p>
            </div>
            
            <Tabs 
              defaultValue="personal" 
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setShowResults(false);
              }}
              className="mb-12"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="personal">Personal Calculator</TabsTrigger>
                <TabsTrigger value="business">Business Calculator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-xl font-semibold mb-6">Your Lifestyle</h2>
                        
                        <div className="space-y-8">
                          {/* Transportation */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="transportation" className="flex items-center gap-2 text-base">
                                <Car className="h-4 w-4 text-primary" />
                                Transportation
                              </Label>
                              <Badge variant={transportationMiles > 15000 ? "danger" : transportationMiles > 7500 ? "warning" : "success"}>
                                {(transportationOptions.find(t => t.id === activeTransportType)?.co2PerMile * transportationMiles / 1000).toFixed(1)} tons/year
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <Label htmlFor="transportation-type" className="text-sm text-muted-foreground">
                                Primary transportation method
                              </Label>
                              <Select value={activeTransportType} onValueChange={handleTransportTypeChange}>
                                <SelectTrigger id="transportation-type">
                                  <SelectValue placeholder="Select transportation type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Road</SelectLabel>
                                    {transportationOptions.slice(0, 5).map(option => (
                                      <SelectItem key={option.id} value={option.id}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                  <SelectGroup>
                                    <SelectLabel>Rail</SelectLabel>
                                    <SelectItem value="train">Train</SelectItem>
                                  </SelectGroup>
                                  <SelectGroup>
                                    <SelectLabel>Air</SelectLabel>
                                    {transportationOptions.slice(6).map(option => (
                                      <SelectItem key={option.id} value={option.id}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <Label htmlFor="transportation-miles" className="text-sm text-muted-foreground">
                                  Annual distance traveled (miles)
                                </Label>
                                <span className="text-sm font-medium">{transportationMiles.toLocaleString()} miles/year</span>
                              </div>
                              <Slider
                                id="transportation-miles"
                                value={[transportationMiles]}
                                min={0}
                                max={30000}
                                step={100}
                                onValueChange={(value) => setTransportationMiles(value[0])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0</span>
                                <span>15,000</span>
                                <span>30,000</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Home Energy */}
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="homeEnergy" className="flex items-center gap-2">
                                <Home className="h-4 w-4 text-primary" />
                                Home Energy
                              </Label>
                              <Badge variant={homeEnergy > 8 ? "danger" : homeEnergy > 5 ? "warning" : "success"}>
                                {homeEnergy} tons/year
                              </Badge>
                            </div>
                            <Slider
                              id="homeEnergy"
                              value={[homeEnergy]}
                              min={0}
                              max={15}
                              step={0.5}
                              onValueChange={(value) => setHomeEnergy(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Low (0)</span>
                              <span>Average (7.5)</span>
                              <span>High (15)</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Electricity, heating, cooling, water usage
                            </p>
                          </div>
                          
                          {/* Diet */}
                          <div className="space-y-4">
                            <Label htmlFor="diet-type" className="flex items-center gap-2">
                              Diet
                            </Label>
                            
                            <div className="space-y-3">
                              <Select value={activeDietType} onValueChange={handleDietTypeChange}>
                                <SelectTrigger id="diet-type">
                                  <SelectValue placeholder="Select diet type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dietOptions.map(option => (
                                    <SelectItem key={option.id} value={option.id}>
                                      {option.label} ({option.co2PerYear} tons/year)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <p className="text-xs text-muted-foreground">
                                Diet has a significant impact on your carbon footprint. Reducing meat consumption, 
                                especially beef, can substantially lower your emissions.
                              </p>
                            </div>
                          </div>
                          
                          {/* Shopping */}
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="shopping" className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-primary" />
                                Shopping
                              </Label>
                              <Badge variant={shopping > 5 ? "danger" : shopping > 3 ? "warning" : "success"}>
                                {shopping} tons/year
                              </Badge>
                            </div>
                            <Slider
                              id="shopping"
                              value={[shopping]}
                              min={0}
                              max={10}
                              step={0.5}
                              onValueChange={(value) => setShopping(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Minimal (0)</span>
                              <span>Average (5)</span>
                              <span>High (10)</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Clothes, electronics, other consumer goods
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-4 border-t">
                          <p className="text-sm mb-4">
                            <span className="flex items-center text-amber-500 mb-2">
                              <Info className="h-4 w-4 mr-2" /> Preliminary Estimate
                            </span>
                            Based on your inputs, your estimated carbon footprint is:
                          </p>
                          <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-md">
                            <span className="font-medium">{totalPersonalEmissions.toFixed(1)} tons CO₂e/year</span>
                            <Badge variant={personalFootprint.color === "green" ? "success" : personalFootprint.color === "amber" ? "warning" : "danger"}>
                              {personalFootprint.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            The global average is approximately 4 tons CO₂e per person per year.
                            For context, to meet climate goals, we need to aim for 2 tons per person by 2050.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <h2 className="text-xl font-semibold mb-6">Emissions Breakdown</h2>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={personalEmissionsData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {personalEmissionsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} tons CO₂e`, 'Emissions']} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-auto w-full flex justify-center">
                          <LoadingButton 
                            loading={loading} 
                            onClick={calculateEmissions}
                            className="mt-6"
                          >
                            Calculate My Full Footprint
                          </LoadingButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="business">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-xl font-semibold mb-6">Business Operations</h2>
                        
                        <div className="space-y-6">
                          {/* Number of Employees */}
                          <div className="space-y-2">
                            <Label htmlFor="employees">Number of Employees</Label>
                            <Input
                              id="employees"
                              type="number"
                              value={employees}
                              onChange={(e) => setEmployees(Number(e.target.value))}
                              min={1}
                            />
                            <p className="text-xs text-muted-foreground">
                              Employee commuting and workplace activities
                            </p>
                          </div>
                          
                          {/* Office Space */}
                          <div className="space-y-2">
                            <Label htmlFor="officeSpace">Office Space (sq ft)</Label>
                            <Input
                              id="officeSpace"
                              type="number"
                              value={officeSpace}
                              onChange={(e) => setOfficeSpace(Number(e.target.value))}
                              min={0}
                            />
                            <p className="text-xs text-muted-foreground">
                              Energy usage for heating, cooling, and power
                            </p>
                          </div>
                          
                          {/* Business Travel */}
                          <div className="space-y-2">
                            <Label htmlFor="businessTravel">Annual Business Travel (miles)</Label>
                            <Input
                              id="businessTravel"
                              type="number"
                              value={businessTravel}
                              onChange={(e) => setBusinessTravel(Number(e.target.value))}
                              min={0}
                            />
                            <p className="text-xs text-muted-foreground">
                              Air travel, car rentals, etc.
                            </p>
                          </div>
                          
                          {/* Production Emissions */}
                          <div className="space-y-2">
                            <Label htmlFor="productionEmissions">Production/Manufacturing (kg CO₂)</Label>
                            <Input
                              id="productionEmissions"
                              type="number"
                              value={productionEmissions}
                              onChange={(e) => setProductionEmissions(Number(e.target.value))}
                              min={0}
                            />
                            <p className="text-xs text-muted-foreground">
                              Emissions from your production processes
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-4 border-t">
                          <p className="text-sm mb-4">
                            <span className="flex items-center text-amber-500 mb-2">
                              <Info className="h-4 w-4 mr-2" /> Preliminary Estimate
                            </span>
                            Based on your inputs, your estimated business carbon footprint is:
                          </p>
                          <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-md">
                            <span className="font-medium">{totalBusinessEmissions.toFixed(1)} tons CO₂e/year</span>
                            <Badge variant={businessFootprint.color === "green" ? "success" : businessFootprint.color === "amber" ? "warning" : "danger"}>
                              {businessFootprint.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <h2 className="text-xl font-semibold mb-6">Emissions Breakdown</h2>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={businessEmissionsData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {businessEmissionsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} tons CO₂e`, 'Emissions']} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-auto w-full flex justify-center">
                          <LoadingButton 
                            loading={loading} 
                            onClick={calculateEmissions}
                            className="mt-6"
                          >
                            Calculate Business Footprint
                          </LoadingButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Results Section */}
            {showResults && (
              <div className="mt-6 animate-fade-in space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold">Your Carbon Footprint Results</h2>
                      <Badge variant={activeTab === "personal" 
                        ? personalFootprint.color === "green" ? "success" : 
                          personalFootprint.color === "amber" ? "warning" : "danger"
                        : businessFootprint.color === "green" ? "success" : 
                          businessFootprint.color === "amber" ? "warning" : "danger"
                      } size="lg">
                        {activeTab === "personal" ? personalFootprint.label : businessFootprint.label}
                      </Badge>
                    </div>
                    
                    {/* Results Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h3 className="text-lg font-medium mb-2">Annual Emissions</h3>
                        <p className="text-3xl font-bold text-primary">
                          {activeTab === "personal" 
                            ? totalPersonalEmissions.toFixed(1) 
                            : totalBusinessEmissions.toFixed(1)}
                          <span className="text-base font-normal ml-1">tons CO₂</span>
                        </p>
                      </div>
                      
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h3 className="text-lg font-medium mb-2">Offset Cost</h3>
                        <p className="text-3xl font-bold text-primary">
                          ${carbonCreditCost}
                          <span className="text-base font-normal ml-1">USD</span>
                        </p>
                      </div>
                      
                      <div className="p-4 bg-background rounded-lg border border-border">
                        <h3 className="text-lg font-medium mb-2">Trees Equivalent</h3>
                        <p className="text-3xl font-bold text-primary">
                          {treesNeeded}
                          <span className="text-base font-normal ml-1">trees</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Historical Comparison */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Comparison Over Time</h3>
                      <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Tons CO₂e', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#10b981" name="Carbon Footprint" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Reduction Strategies */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Reduction Strategies</h3>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="transportation">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              <span>Transportation</span>
                              {activeTab === "personal" && 
                                personalEmissionsData[0].value > 3 && 
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                              }
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {reductionStrategies.transportation.map((strategy, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{strategy.strategy}</span>
                                  <Badge variant="blue">{strategy.reduction}</Badge>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="energy">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              <span>Home Energy</span>
                              {activeTab === "personal" && 
                                homeEnergy > 5 && 
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                              }
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {reductionStrategies.energy.map((strategy, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{strategy.strategy}</span>
                                  <Badge variant="blue">{strategy.reduction}</Badge>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="diet">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <span>Diet</span>
                              {activeTab === "personal" && 
                                activeDietType.includes('meat') && 
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                              }
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {reductionStrategies.diet.map((strategy, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{strategy.strategy}</span>
                                  <Badge variant="blue">{strategy.reduction}</Badge>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="shopping">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4" />
                              <span>Shopping & Consumption</span>
                              {activeTab === "personal" && 
                                shopping > 4 && 
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                              }
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {reductionStrategies.shopping.map((strategy, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{strategy.strategy}</span>
                                  <Badge variant="blue">{strategy.reduction}</Badge>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Results
                      </Button>
                      <Link to="/buy-credits">
                        <Button className="flex items-center gap-2">
                          <Leaf className="h-4 w-4" />
                          Offset Your Footprint
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Climate Impact and Goal Setting */}
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-4">Set Your Climate Goals</h3>
                    <p className="text-muted-foreground mb-6">
                      Based on your current footprint, here are suggested reduction goals and the positive impact they would have.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-secondary/30 p-5 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Bike className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium">Near-term Goal</h4>
                        </div>
                        <p className="text-2xl font-bold mb-2">
                          {activeTab === "personal" 
                            ? Math.max(1, (totalPersonalEmissions * 0.85)).toFixed(1)
                            : Math.max(1, (totalBusinessEmissions * 0.85)).toFixed(1)
                          } tons
                        </p>
                        <p className="text-sm text-muted-foreground">
                          15% reduction within 1 year through small lifestyle changes
                        </p>
                      </div>
                      
                      <div className="bg-secondary/30 p-5 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <TreePine className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium">Mid-term Goal</h4>
                        </div>
                        <p className="text-2xl font-bold mb-2">
                          {activeTab === "personal" 
                            ? Math.max(1, (totalPersonalEmissions * 0.65)).toFixed(1)
                            : Math.max(1, (totalBusinessEmissions * 0.65)).toFixed(1)
                          } tons
                        </p>
                        <p className="text-sm text-muted-foreground">
                          35% reduction within 3 years with more significant changes
                        </p>
                      </div>
                      
                      <div className="bg-secondary/30 p-5 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <CloudSun className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium">Long-term Goal</h4>
                        </div>
                        <p className="text-2xl font-bold mb-2">
                          {activeTab === "personal" ? "2.0" : "Net Zero"} tons
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activeTab === "personal" 
                            ? "Aligned with climate targets for 2050" 
                            : "Through radical transformation and offsets by 2050"
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <Link to="/education">
                        <Button className="flex items-center gap-2">
                          Learn More About Climate Action
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Container>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calculator;