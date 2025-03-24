
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Section, Container } from "@/components/ui-components";
import { FeatureCard } from "@/components/FeatureCard";
import { CreditCard } from "@/components/CreditCard";
import { 
  Users, 
  GanttChart, 
  ShieldCheck, 
  LineChart,
  ArrowRight, 
  TreePine,
  Wind,
  Sun,
  Waves,
  Leaf,
  ChevronDown,
  MousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const featuresData = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Direct Connections",
    description: "Connect directly with verified sellers or buyers without intermediaries.",
  },
  {
    icon: <GanttChart className="h-6 w-6" />,
    title: "Transparent Marketplace",
    description: "Clear pricing, detailed project information, and verified impact metrics.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Verified Projects",
    description: "All listed projects undergo rigorous verification for credibility.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Impact Tracking",
    description: "Track your carbon offset progress and environmental impact over time.",
  }
];

const featuredCredits = [
  {
    id: "1",
    title: "Amazon Rainforest Conservation",
    description: "Protect 5,000 hectares of pristine rainforest and support local communities.",
    type: "forestation",
    location: "Brazil",
    price: 22,
    amount: 5000,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "2",
    title: "Wind Farm Development",
    description: "Support the construction of wind turbines generating clean energy.",
    type: "renewable",
    location: "Scotland, UK",
    price: 18,
    amount: 3000,
    image: "src/image/wind farm.jpg",
    verified: true,
  },
  {
    id: "3",
    title: "Solar Panel Array Installation",
    description: "Fund the installation of solar panels in rural communities.",
    type: "solar",
    location: "Kenya",
    price: 15,
    amount: 2000,
    image: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?q=80&w=1000&auto=format&fit=crop",
    verified: false,
  }
];

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll event to hide scroll indicator once user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Smooth scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Scroll Indicator - Only visible when not scrolled */}
        <div 
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
            isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={scrollToFeatures}
          >
            <div className="text-sm font-medium text-primary mb-2 flex items-center">
              <MousePointer className="h-4 w-4 mr-1" />
              Scroll to explore
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-full p-2 animate-bounce">
              <ChevronDown className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <Section className="bg-secondary/50" id="features-section">
          <Container>
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Platform Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A transparent and efficient marketplace for carbon credit trading.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade-in">
              {featuresData.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </div>
          </Container>
        </Section>
        
        {/* How It Works Section */}
        <Section>
          <Container>
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Simple steps to start trading carbon credits and make a positive impact.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-16 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-primary/20 z-0"></div>
              
              <div className="flex flex-col items-center text-center relative z-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <span className="text-xl font-semibold text-primary">1</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Create an Account</h3>
                <p className="text-muted-foreground">
                  Sign up as a buyer or seller and complete your profile with relevant details.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center relative z-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <span className="text-xl font-semibold text-primary">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Browse or List Credits</h3>
                <p className="text-muted-foreground">
                  Browse available credits if you're a buyer, or list your projects if you're a seller.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center relative z-10 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <span className="text-xl font-semibold text-primary">3</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Make Transactions</h3>
                <p className="text-muted-foreground">
                  Securely buy or sell carbon credits through our verified platform.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-16">
              <Link to="/signup">
                <Button size="lg" className="group button-hover">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
        
        {/* Featured Credits Section */}
        <Section className="bg-secondary/50">
          <Container>
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured Carbon Credits</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore some of our verified carbon credit projects available for purchase.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
              {featuredCredits.map((credit) => (
                <CreditCard 
                  key={credit.id}
                  id={credit.id}
                  title={credit.title}
                  description={credit.description}
                  type={credit.type as any}
                  location={credit.location}
                  price={credit.price}
                  amount={credit.amount}
                  image={credit.image}
                  verified={credit.verified}
                  onClick={() => window.location.href = '/buy-credits'}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-12">
              <Link to="/buy-credits">
                <Button size="lg" variant="outline" className="group button-hover">
                  View All Credits
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
        
        {/* Admin Access Section (Small Banner) */}
        <Section className="py-10">
          <Container>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-4" />
                <div>
                  <h3 className="text-lg font-medium">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground">Access platform management and administrative controls</p>
                </div>
              </div>
              <Link to="/admin">
                <Button size="sm" variant="outline" className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800/50">
                  Access Admin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
        
        {/* CTA Section */}
        <Section>
          <Container>
            <div className="px-6 py-16 md:py-24 bg-primary/5 rounded-3xl border border-primary/20 text-center max-w-5xl mx-auto">
              <Leaf className="h-16 w-16 text-primary mx-auto mb-8" strokeWidth={1.25} />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Join Carbon Connect today and be part of the global movement to combat climate change.
                Every credit counts towards building a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto button-hover">
                    Create Account
                  </Button>
                </Link>
                <Link to="/calculator">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto button-hover">
                    Calculate Your Footprint
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;