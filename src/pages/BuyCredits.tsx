import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container } from "@/components/ui-components";
import { Input } from "@/components/ui-components";
import { Search, FilterX, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui-components";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedCreditCard } from "@/components/EnhancedCreditCard";
import { PurchaseModal } from "@/components/PurchaseModal";
import { DetailsModal } from "@/components/DetailsModal";
import { useWeb3 } from "@/contexts/Web3Context"; // Import useWeb3

// Sample data
const allCredits = [
  {
    id: "1",
    title: "Amazon Rainforest Conservation",
    description: "Protect 5,000 hectares of pristine rainforest and support local communities.",
    type: "Forestation",
    location: "Brazil",
    sellerName: "RainforestGuard Inc.",
    price: 22,
    amount: 5000,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "2",
    title: "Wind Farm Development",
    description: "Support the construction of wind turbines generating clean energy.",
    type: "Renewable",
    location: "Scotland, UK",
    sellerName: "GreenWind Energy",
    price: 18,
    amount: 3000,
      image: "src/image/wind farm.jpg",
    verified: true,
  },
  {
    id: "3",
    title: "Solar Panel Array Installation",
    description: "Fund the installation of solar panels in rural communities.",
    type: "Solar",
    location: "Kenya",
    sellerName: "SolarPower Africa",
    price: 15,
    amount: 2000,
    image: "src/image/solar Technology.jpg",
    verified: false,
  },
  {
    id: "4",
    title: "Mangrove Restoration Project",
    description: "Restore coastal mangrove ecosystems to protect biodiversity.",
    type: "Forestation",
    location: "Indonesia",
    sellerName: "Ocean Guardians",
    price: 25,
    amount: 1800,
    image: "src/image/Mangrove Action Project.jpg",
    verified: true,
  },
  {
    id: "5",
    title: "Hydroelectric Power Plant",
    description: "Support clean energy generation through hydroelectric power.",
    type: "Hydro",
    location: "Norway",
    sellerName: "WaterPower Co.",
    price: 20,
    amount: 4000,
    image: "src/image/Hydroelectric Power Plant.jpg",
    verified: true,
  },
  {
    id: "6",
    title: "Sustainable Agriculture Practices",
    description: "Support farmers transitioning to sustainable agricultural methods.",
    type: "Agriculture",
    location: "United States",
    sellerName: "EcoFarm Alliance",
    price: 17,
    amount: 2500,
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1000&auto=format&fit=crop",
    verified: false,
  },
  {
    id: "7",
    title: "Methane Capture from Landfills",
    description: "Technology to capture and utilize methane emissions from waste sites.",
    type: "Waste",
    location: "Mexico",
    sellerName: "CleanGas Technologies",
    price: 14,
    amount: 3200,
    image: "src/image/methan capture.jpg",
    verified: true,
  },
  {
    id: "8",
    title: "Reforestation of Degraded Land",
    description: "Planting native trees to restore ecosystems in previously deforested areas.",
    type: "Forestation",
    location: "Colombia",
    sellerName: "TreesForFuture",
    price: 19,
    amount: 2800,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "9",
    title: "Geothermal Energy Development",
    description: "Harnessing natural heat from the Earth to generate electricity.",
    type: "Geothermal",
    location: "Iceland",
    sellerName: "GeoEnergy Ltd.",
    price: 23,
    amount: 3500,
    image: "src/image/What Is Geothermal Energy.jpg",
    verified: false,
  },
];

const locations = Array.from(new Set(allCredits.map(credit => credit.location))).sort();
const projectTypes = Array.from(new Set(allCredits.map(credit => credit.type))).sort();

interface Credit {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  sellerName: string;
  price: number;
  amount: number;
  image: string;
  verified: boolean;
}

const BuyCredits = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 50]);
  const [sortOption, setSortOption] = useState("default");
  const [filteredCredits, setFilteredCredits] = useState<Credit[]>(allCredits);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCreditIds, setSelectedCreditIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { toast } = useToast();
  const { account, isConnected, isConnecting, connect } = useWeb3(); // Use Web3 context

  // Filter credits
  useEffect(() => {
    let filtered = allCredits;
    if (searchTerm) {
      filtered = filtered.filter(credit =>
        credit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credit.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType.length > 0) {
      filtered = filtered.filter(credit => selectedType.includes(credit.type));
    }
    if (selectedLocation !== "all") {
      filtered = filtered.filter(credit => credit.location === selectedLocation);
    }
    filtered = filtered.filter(credit =>
      credit.price >= priceRange[0] && credit.price <= priceRange[1]
    );
    if (verifiedOnly) {
      filtered = filtered.filter(credit => credit.verified);
    }
    switch (sortOption) {
      case "price-low-high":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "co2-high-low":
        filtered = [...filtered].sort((a, b) => b.amount - a.amount);
        break;
      case "popular":
        filtered = [...filtered].sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
      default:
        filtered = [...filtered].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
    setFilteredCredits(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedLocation, priceRange, sortOption, verifiedOnly]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType([]);
    setSelectedLocation("all");
    setPriceRange([0, 50]);
    setSortOption("default");
    setVerifiedOnly(false);
  };

  const handleCreditSelection = (id: string) => {
    const credit = allCredits.find(c => c.id === id);
    if (credit) {
      setSelectedCredit(credit);
      setIsPurchaseModalOpen(true);
    }
  };

  const handleViewDetails = (id: string) => {
    const credit = allCredits.find(c => c.id === id);
    if (credit) {
      setSelectedCredit(credit);
      setIsDetailsModalOpen(true);
    }
  };

  const handlePurchaseComplete = () => {
    toast({
      title: "Purchase successful!",
      description: `You've purchased carbon credits and helped the environment!`,
    });
    setSelectedCreditIds([]);
  };

  const toggleCreditSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedCreditIds(prev => [...prev, id]);
    } else {
      setSelectedCreditIds(prev => prev.filter(creditId => creditId !== id));
    }
  };

  const handleBulkPurchase = () => {
    if (selectedCreditIds.length === 0) {
      toast({
        title: "No credits selected",
        description: "Please select at least one carbon credit to purchase",
        variant: "destructive",
      });
      return;
    }
    const selectedCredits = allCredits.filter(c => selectedCreditIds.includes(c.id));
    const totalAmount = selectedCredits.reduce((sum, c) => sum + c.amount, 0);
    const totalCost = selectedCredits.reduce((sum, c) => sum + (c.price * c.amount), 0);
    setSelectedCredit({
      id: "bulk",
      title: `Bulk Purchase (${selectedCreditIds.length} projects)`,
      description: `Purchasing ${selectedCreditIds.length} carbon credit projects`,
      type: "Multiple",
      location: "Various",
      sellerName: "Multiple Sellers",
      price: totalCost / totalAmount,
      amount: totalAmount,
      image: selectedCredits[0].image,
      verified: selectedCredits.every(c => c.verified),
    });
    setIsPurchaseModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCredits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCredits.length / itemsPerPage);

  const handleTypeChange = (type: string) => {
    setSelectedType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-20">
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Buy Carbon Credits</h1>
            <p className="text-lg text-muted-foreground">
              Browse verified carbon credit projects and make a positive impact on the environment.
            </p>
            <div className="mt-4 flex justify-center">
              {!isConnected ? (
                <Button
                  onClick={connect}
                  disabled={isConnecting}
                  className="bg-primary text-white px-6 py-2 rounded-lg"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              ) : (
                <div className="bg-primary text-black px-6 py-2 rounded-lg">
                  <Badge variant="secondary">
                    Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 space-y-6">
                <div className="p-4 border rounded-lg bg-background">
                  <h3 className="font-medium mb-4">Filters</h3>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Project Type</h4>
                      <div className="space-y-2">
                        {projectTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={selectedType.includes(type)}
                              onCheckedChange={() => handleTypeChange(type)}
                            />
                            <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Location</h4>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any location</SelectItem>
                          {locations.map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Price Range ($/ton)</h4>
                        <span className="text-sm">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        value={priceRange}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Verification</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified-only"
                          checked={verifiedOnly}
                          onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                        />
                        <Label htmlFor="verified-only" className="text-sm">Verified only</Label>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full flex items-center gap-2"
                    >
                      <FilterX size={16} className="h-4 w-4" />
                      Clear All Filters
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-background">
                  <h3 className="font-medium mb-2">My Favorites</h3>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="h-4 w-4 text-red-500" />
                    <span className="text-sm">No favorites yet</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click the heart icon on any project to add it to your favorites
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, description, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={<Search size={20} className="h-5 w-5 text-muted-foreground" />}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                        <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                        <SelectItem value="co2-high-low">CO₂: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedCreditIds.length > 0 && (
                      <Button variant="default" onClick={handleBulkPurchase}>
                        Buy Selected ({selectedCreditIds.length})
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">
                    {filteredCredits.length} {filteredCredits.length === 1 ? 'project' : 'projects'} found
                  </p>
                  {selectedCreditIds.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCreditIds([])}
                      className="flex items-center gap-1"
                    >
                      <X size={12} className="h-3 w-3" />
                      Clear selection
                    </Button>
                  )}
                </div>
                {currentItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentItems.map((credit) => (
                      <EnhancedCreditCard
                        key={credit.id}
                        id={credit.id}
                        title={credit.title}
                        description={credit.description}
                        type={credit.type}
                        location={credit.location}
                        sellerName={credit.sellerName}
                        price={credit.price}
                        amount={credit.amount}
                        image={credit.image}
                        verified={credit.verified}
                        onBuy={handleCreditSelection}
                        onViewDetails={handleViewDetails}
                        onSelect={toggleCreditSelection}
                        selected={selectedCreditIds.includes(credit.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border rounded-lg">
                    <p className="text-xl font-medium mb-2">No carbon credits found</p>
                    <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex items-center gap-2"
                    >
                      <FilterX size={16} className="h-4 w-4" />
                      Reset Filters
                    </Button>
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        credit={selectedCredit}
        onPurchaseComplete={handlePurchaseComplete}
      />
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        credit={selectedCredit}
        onBuy={handleCreditSelection}
      />
      <Footer />
    </div>
  );
};

export default BuyCredits;