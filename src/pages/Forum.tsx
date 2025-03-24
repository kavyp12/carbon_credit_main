
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Section, Container, Badge } from "@/components/ui-components";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  ThumbsUp, 
  MessageCircle,
  Calendar,
  User,
  Clock,
  Filter
} from "lucide-react";

const Forum = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <Section>
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Carbon Connect Forum</h1>
              <p className="text-lg text-muted-foreground">
                Join the conversation about carbon credits, climate action, and sustainability.
              </p>
            </div>
            
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search topics..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full md:w-auto"
                onClick={() => setShowNewTopicForm(!showNewTopicForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
            
            {/* New Topic Form */}
            {showNewTopicForm && (
              <Card className="mb-8 animate-slide-down">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Create New Topic</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Topic Title</label>
                      <Input placeholder="Enter a descriptive title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Select a category</option>
                        <option value="carbon-markets">Carbon Markets</option>
                        <option value="project-development">Project Development</option>
                        <option value="climate-policy">Climate Policy</option>
                        <option value="corporate-strategy">Corporate Strategy</option>
                        <option value="general-discussion">General Discussion</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content</label>
                      <Textarea 
                        placeholder="Share your thoughts, questions, or insights..." 
                        className="min-h-[150px]" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowNewTopicForm(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Post Topic
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Forum Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <TabsList>
                  <TabsTrigger value="all">All Topics</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="most-replies">Most Replies</option>
                    <option value="most-views">Most Views</option>
                  </select>
                </div>
              </div>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {forumTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="popular">
                <div className="space-y-4">
                  {forumTopics
                    .filter(topic => topic.likes > 5)
                    .map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="space-y-4">
                  {forumTopics
                    .filter(topic => {
                      const date = new Date(topic.date);
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - date.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    })
                    .map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="unanswered">
                <div className="space-y-4">
                  {forumTopics
                    .filter(topic => topic.replies === 0)
                    .map((topic) => (
                      <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary/10">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <span className="px-2">...</span>
                <Button variant="outline" size="sm">
                  12
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
            
            {/* Forum Categories */}
            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6">Forum Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CategoryCard 
                  title="Carbon Markets" 
                  description="Discussions about voluntary and compliance markets."
                  topics={24}
                  posts={87}
                />
                <CategoryCard 
                  title="Project Development" 
                  description="Share experiences developing carbon projects."
                  topics={18}
                  posts={64}
                />
                <CategoryCard 
                  title="Climate Policy" 
                  description="Discussions on policies affecting carbon markets."
                  topics={15}
                  posts={52}
                />
                <CategoryCard 
                  title="Corporate Strategy" 
                  description="Corporate approaches to carbon management."
                  topics={12}
                  posts={41}
                />
                <CategoryCard 
                  title="Verification Standards" 
                  description="Discussions about different verification standards."
                  topics={9}
                  posts={37}
                />
                <CategoryCard 
                  title="General Discussion" 
                  description="General topics related to carbon and climate."
                  topics={32}
                  posts={128}
                />
              </div>
            </div>
            
            {/* Community Stats */}
            <div className="mt-16 p-6 bg-secondary/50 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Community Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">152</p>
                  <p className="text-sm text-muted-foreground">Topics</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">573</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">1,245</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">87</p>
                  <p className="text-sm text-muted-foreground">Online Now</p>
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

// Topic Card Component
interface TopicProps {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: string;
  date: string;
  replies: number;
  views: number;
  likes: number;
  isFeatured?: boolean;
  isSticky?: boolean;
  isSolved?: boolean;
}

const TopicCard = ({ topic }: { topic: TopicProps }) => {
  const date = new Date(topic.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card className={`transition-colors hover:bg-secondary/30 ${topic.isSticky ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:block">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={topic.authorAvatar} 
                alt={topic.author}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {topic.isFeatured && (
                <Badge variant="success" size="sm">Featured</Badge>
              )}
              {topic.isSticky && (
                <Badge variant="warning" size="sm">Pinned</Badge>
              )}
              {topic.isSolved && (
                <Badge variant="blue" size="sm">Solved</Badge>
              )}
              <Badge size="sm">{topic.category}</Badge>
            </div>
            
            <h3 className="text-lg font-medium mb-2 hover:text-primary cursor-pointer">
              {topic.title}
            </h3>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{topic.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{topic.replies} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{topic.likes} likes</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center text-center min-w-[80px]">
            <div className="text-2xl font-semibold text-primary">{topic.replies}</div>
            <div className="text-xs text-muted-foreground">Replies</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Category Card Component
interface CategoryCardProps {
  title: string;
  description: string;
  topics: number;
  posts: number;
}

const CategoryCard = ({ title, description, topics, posts }: CategoryCardProps) => {
  return (
    <Card className="transition-colors hover:bg-secondary/30 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-2">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div>{topics} topics</div>
              <div>{posts} posts</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample Forum Topics Data
const forumTopics: TopicProps[] = [
  {
    id: "1",
    title: "What's the current price trend for forest conservation credits?",
    author: "Jane Smith",
    authorAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
    category: "Carbon Markets",
    date: "2025-03-10T12:00:00Z",
    replies: 8,
    views: 126,
    likes: 12,
    isFeatured: true,
    isSticky: true
  },
  {
    id: "2",
    title: "Best practices for verifying small-scale carbon projects",
    author: "Michael Chen",
    authorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    category: "Project Development",
    date: "2025-03-12T09:30:00Z",
    replies: 5,
    views: 84,
    likes: 7,
    isSolved: true
  },
  {
    id: "3",
    title: "How will the EU's CBAM affect voluntary carbon markets?",
    author: "Sarah Johnson",
    authorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    category: "Climate Policy",
    date: "2025-03-14T15:45:00Z",
    replies: 12,
    views: 198,
    likes: 15
  },
  {
    id: "4",
    title: "Seeking partners for mangrove restoration project in SE Asia",
    author: "David Wilson",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "Project Development",
    date: "2025-03-15T08:15:00Z",
    replies: 3,
    views: 56,
    likes: 4
  },
  {
    id: "5",
    title: "Comparing Verra vs Gold Standard for agricultural projects",
    author: "Elena Rodriguez",
    authorAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    category: "Verification Standards",
    date: "2025-03-16T11:20:00Z",
    replies: 6,
    views: 112,
    likes: 9
  },
  {
    id: "6",
    title: "How to calculate emissions for a small manufacturing business?",
    author: "Robert Kim",
    authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    category: "Corporate Strategy",
    date: "2025-03-17T14:10:00Z",
    replies: 0,
    views: 45,
    likes: 2
  },
  {
    id: "7",
    title: "New report on carbon credit quality - discussion",
    author: "Amanda Taylor",
    authorAvatar: "https://randomuser.me/api/portraits/women/42.jpg",
    category: "General Discussion",
    date: "2025-03-18T10:30:00Z",
    replies: 9,
    views: 132,
    likes: 11,
    isFeatured: true
  },
  {
    id: "8",
    title: "Challenges in implementing REDD+ projects in Africa",
    author: "Jamal Ibrahim",
    authorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    category: "Project Development",
    date: "2025-03-18T16:45:00Z",
    replies: 4,
    views: 78,
    likes: 6
  }
];

export default Forum;
