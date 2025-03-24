
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export const HeroSection = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Subtle parallax effect
      bgRef.current.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 transition-transform duration-500 ease-out"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(21, 255, 183, 0.1), transparent 65%)",
        }}
      />

      {/* Grain overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container px-4 md:px-6 z-10 animate-fade-in-up">
        <div className="flex flex-col items-center text-center space-y-4 pt-8 md:pt-12">
          <div className="space-y-2">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-primary mr-1.5"></span>
                New Carbon Connect platform launched
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-fade-in">
              Connecting Carbon Credits <br />
              <span className="text-primary">For a Sustainable Future</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 animate-fade-in">
              Buy and sell carbon credits seamlessly. Connect directly with verified projects 
              and make a real impact on climate change.
            </p>
          </div>
          <div className="space-x-4 pt-6 animate-fade-in">
            <Link to="/buy-credits">
              <Button size="lg" className="group button-hover">
                Buy Credits
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/sell-credits">
              <Button size="lg" variant="outline" className="button-hover">
                Sell Credits
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-24 animate-fade-in">
          <div className="flex flex-col items-center space-y-2 border-r border-border pr-4 last:border-r-0 last:pr-0">
            <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">120+</span>
            <span className="text-sm md:text-base text-muted-foreground text-center">Verified Projects</span>
          </div>
          <div className="flex flex-col items-center space-y-2 border-r border-border pr-4 last:border-r-0 last:pr-0 md:border-r">
            <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">3.2M+</span>
            <span className="text-sm md:text-base text-muted-foreground text-center">Tonnes CO₂ Offset</span>
          </div>
          <div className="flex flex-col items-center space-y-2 border-r border-border pr-4 last:border-r-0 last:pr-0">
            <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">850+</span>
            <span className="text-sm md:text-base text-muted-foreground text-center">Active Buyers</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">420+</span>
            <span className="text-sm md:text-base text-muted-foreground text-center">Registered Sellers</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <div className="h-6 w-1 rounded-full bg-primary/20">
            <div className="h-3 w-1 rounded-full bg-primary animate-[pulse_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
