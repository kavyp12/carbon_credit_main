
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container, Badge } from "@/components/ui-components";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Search,
  PlayCircle,
  Leaf,
  Lightbulb,
  Building,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";

const Education = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <Section>
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Carbon Credit Education</h1>
              <p className="text-lg text-muted-foreground">
                Learn about carbon credits, climate change, and how you can make a difference.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search articles, guides, and resources..." 
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Featured Resources */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeaturedCard
                  title="Carbon Credits 101"
                  description="Learn the basics of carbon credits and how they work."
                  icon={<BookOpen className="h-6 w-6" />}
                  type="guide"
                  time="10 min read"
                />
                
                <FeaturedCard
                  title="How Verification Works"
                  description="Understand the verification process for carbon credit projects."
                  icon={<FileText className="h-6 w-6" />}
                  type="article"
                  time="15 min read"
                />
                
                <FeaturedCard
                  title="Carbon Markets Explained"
                  description="An in-depth look at voluntary and compliance carbon markets."
                  icon={<GraduationCap className="h-6 w-6" />}
                  type="course"
                  time="5 lessons"
                />
              </div>
            </div>
            
            {/* Content Tabs */}
            <Tabs defaultValue="articles" className="mb-16">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="articles">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article, index) => (
                    <ArticleCard
                      key={index}
                      title={article.title}
                      description={article.description}
                      category={article.category}
                      time={article.time}
                      image={article.image}
                    />
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button variant="outline">
                    Load More Articles
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="guides">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guides.map((guide, index) => (
                    <ArticleCard
                      key={index}
                      title={guide.title}
                      description={guide.description}
                      category={guide.category}
                      time={guide.time}
                      image={guide.image}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <VideoCard
                      key={index}
                      title={video.title}
                      duration={video.duration}
                      thumbnail={video.thumbnail}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="courses">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course, index) => (
                    <CourseCard
                      key={index}
                      title={course.title}
                      lessons={course.lessons}
                      level={course.level}
                      image={course.image}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Resource Categories */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <CategoryCard 
                  title="Climate Science" 
                  count={12}
                  icon={<Leaf className="h-6 w-6 text-blue-500" />}
                />
                <CategoryCard 
                  title="Carbon Markets" 
                  count={8}
                  icon={<CreditCard className="h-6 w-6 text-green-500" />}
                />
                <CategoryCard 
                  title="Project Development" 
                  count={15}
                  icon={<Lightbulb className="h-6 w-6 text-amber-500" />}
                />
                <CategoryCard 
                  title="Corporate Strategies" 
                  count={10}
                  icon={<Building className="h-6 w-6 text-purple-500" />}
                />
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Subscribe to our newsletter to receive educational content, market updates, and tips for reducing your carbon footprint.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Enter your email" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

// Featured Card Component
interface FeaturedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "guide" | "article" | "course" | "video";
  time: string;
}

const FeaturedCard = ({ title, description, icon, type, time }: FeaturedCardProps) => {
  return (
    <Card className="h-full transition-transform hover:scale-[1.02]">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <Badge
          variant={
            type === "guide" ? "blue" : 
            type === "article" ? "success" : 
            type === "course" ? "warning" : "danger"
          }
          size="sm"
          className="mb-3 w-fit"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{time}</span>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Article Card Component
interface ArticleCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  image: string;
}

const ArticleCard = ({ title, description, category, time, image }: ArticleCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="blue" size="sm">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          Read Article
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Video Card Component
interface VideoCardProps {
  title: string;
  duration: string;
  thumbnail: string;
}

const VideoCard = ({ title, duration, thumbnail }: VideoCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
          {duration}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          Watch Video
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Course Card Component
interface CourseCardProps {
  title: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
}

const CourseCard = ({ title, lessons, level, image }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-3">
          <Badge
            variant={
              level === "Beginner" ? "success" : 
              level === "Intermediate" ? "warning" : "danger"
            }
            size="sm"
          >
            {level}
          </Badge>
          <span className="text-xs text-muted-foreground">{lessons} lessons</span>
        </div>
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        <Button>
          Start Course
        </Button>
      </CardContent>
    </Card>
  );
};

// Category Card Component
interface CategoryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const CategoryCard = ({ title, count, icon }: CategoryCardProps) => {
  return (
    <Card className="transition-colors hover:bg-secondary cursor-pointer">
      <CardContent className="p-5 flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{count} resources</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample Data
const articles = [
  {
    title: "Understanding Carbon Sequestration",
    description: "How natural and artificial processes can capture and store carbon dioxide.",
    category: "Climate Science",
    time: "8 min read",
    image: "src/image/The carbon footprint of beef production.jpg"
  },
  {
    title: "The Difference Between Carbon Credits and Offsets",
    description: "Learn the key differences between carbon credits and carbon offsets in the market.",
    category: "Carbon Markets",
    time: "6 min read",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Corporate Carbon Strategies",
    description: "How companies are integrating carbon reduction into their business models.",
    category: "Business",
    time: "12 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "The Rise of Voluntary Carbon Markets",
    description: "Exploring the growth and evolution of voluntary carbon trading.",
    category: "Markets",
    time: "10 min read",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=500&auto=format&fit=crop"
  },
];

const guides = [
  {
    title: "How to Calculate Your Carbon Footprint",
    description: "A step-by-step guide to measuring your personal or business carbon emissions.",
    category: "Practical",
    time: "15 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Developing a Carbon Credit Project",
    description: "Learn the essentials of creating and registering a carbon credit project.",
    category: "Project Development",
    time: "20 min read",
    image: "https://images.unsplash.com/photo-1416339698674-4f118dd3388b?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Navigating Carbon Credit Verification",
    description: "Understanding the verification process and standards for carbon projects.",
    category: "Standards",
    time: "12 min read",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Investing in Carbon Credits",
    description: "A guide for individuals and businesses looking to invest in carbon markets.",
    category: "Finance",
    time: "18 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format&fit=crop"
  },
];

const videos = [
  {
    title: "Climate Change: The Science Explained",
    duration: "15:24",
    thumbnail: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "How Carbon Credits Work",
    duration: "08:15",
    thumbnail: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Inside a Carbon Offset Project",
    duration: "12:50",
    thumbnail: "https://images.unsplash.com/photo-1629571191630-2bc39bc751d2?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Corporate Sustainability Strategies",
    duration: "18:30",
    thumbnail: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=500&auto=format&fit=crop"
  },
];

const courses = [
  {
    title: "Carbon Markets 101",
    lessons: 5,
    level: "Beginner" as const,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Project Development Masterclass",
    lessons: 8,
    level: "Intermediate" as const,
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Advanced Carbon Trading Strategies",
    lessons: 6,
    level: "Advanced" as const,
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500&auto=format&fit=crop"
  },
  {
    title: "Corporate Carbon Management",
    lessons: 7,
    level: "Intermediate" as const,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop"
  },
];

export default Education;
