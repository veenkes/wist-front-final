import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, BookOpen, Plus, TrendingUp, Clock, Star, Filter,
  ChevronRight, ChevronDown, FileText, Video, Image as ImageIcon,
  Presentation, Heart, Bookmark, Eye, MessageSquare, Download,
  Trophy, Flame, Target, Award, BarChart3, Users, Layers,
  FolderOpen, GraduationCap, Sparkles, Calendar, Link2
} from 'lucide-react';
import { MaterialDetailModal } from '@/components/library/MaterialDetailModal';
import { AddMaterialModal } from '@/components/library/AddMaterialModal';

// Types
export interface LibraryMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  type: 'pdf' | 'video' | 'presentation' | 'article' | 'worksheet';
  author: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  saves: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  thumbnailColor: string;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  linkedLessonDate?: string;
  fileSize?: string;
}

// Mock data
const SUBJECTS = [
  { name: 'Mathematics', icon: '📐', color: 'bg-blue-500/10 text-blue-600', count: 45 },
  { name: 'Physics', icon: '⚛️', color: 'bg-purple-500/10 text-purple-600', count: 32 },
  { name: 'Chemistry', icon: '🧪', color: 'bg-green-500/10 text-green-600', count: 28 },
  { name: 'Biology', icon: '🧬', color: 'bg-emerald-500/10 text-emerald-600', count: 35 },
  { name: 'English', icon: '📖', color: 'bg-amber-500/10 text-amber-600', count: 52 },
  { name: 'History', icon: '🏛️', color: 'bg-red-500/10 text-red-600', count: 22 },
  { name: 'Geography', icon: '🌍', color: 'bg-cyan-500/10 text-cyan-600', count: 18 },
  { name: 'Computer Science', icon: '💻', color: 'bg-indigo-500/10 text-indigo-600', count: 41 },
];

const TOPICS_MAP: Record<string, string[]> = {
  'Mathematics': ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
  'Physics': ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism', 'Quantum'],
  'Chemistry': ['Organic', 'Inorganic', 'Physical Chemistry', 'Biochemistry'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Anatomy', 'Evolution'],
  'English': ['Grammar', 'Literature', 'Writing', 'Vocabulary', 'Reading'],
  'History': ['Ancient', 'Medieval', 'Modern', 'World Wars', 'Central Asia'],
  'Geography': ['Physical', 'Human', 'Climate', 'Maps & GIS'],
  'Computer Science': ['Programming', 'Algorithms', 'Web Dev', 'AI & ML', 'Databases'],
};

const MOCK_MATERIALS: LibraryMaterial[] = [
  { id: '1', title: 'Introduction to Quadratic Equations', description: 'Complete guide to solving quadratic equations with examples and practice problems', subject: 'Mathematics', topic: 'Algebra', gradeLevel: 'Year 9', type: 'pdf', author: 'Ms. Johnson', createdAt: '2026-02-15', updatedAt: '2026-02-15', views: 342, likes: 87, saves: 45, rating: 4.8, ratingCount: 23, tags: ['equations', 'algebra', 'practice'], thumbnailColor: 'from-blue-500 to-blue-600', comments: 12, fileSize: '2.4 MB' },
  { id: '2', title: 'Newton\'s Laws of Motion - Video Lecture', description: 'Animated explanation of all three laws with real-world demonstrations', subject: 'Physics', topic: 'Mechanics', gradeLevel: 'Year 10', type: 'video', author: 'Mr. Smith', createdAt: '2026-02-14', updatedAt: '2026-02-14', views: 521, likes: 134, saves: 89, rating: 4.9, ratingCount: 45, tags: ['newton', 'forces', 'motion'], thumbnailColor: 'from-purple-500 to-purple-600', comments: 28, fileSize: '156 MB' },
  { id: '3', title: 'Periodic Table Interactive Guide', description: 'Interactive periodic table with element properties and chemical reactions', subject: 'Chemistry', topic: 'Inorganic', gradeLevel: 'Year 8', type: 'presentation', author: 'Dr. Lee', createdAt: '2026-02-13', updatedAt: '2026-02-14', views: 298, likes: 76, saves: 52, rating: 4.6, ratingCount: 18, tags: ['elements', 'periodic table', 'reactions'], thumbnailColor: 'from-green-500 to-green-600', comments: 8, fileSize: '8.1 MB' },
  { id: '4', title: 'Shakespeare\'s Sonnets Analysis', description: 'Deep dive into the themes and literary devices in Shakespeare\'s most famous sonnets', subject: 'English', topic: 'Literature', gradeLevel: 'Year 11', type: 'article', author: 'Ms. Williams', createdAt: '2026-02-12', updatedAt: '2026-02-12', views: 189, likes: 45, saves: 33, rating: 4.5, ratingCount: 12, tags: ['shakespeare', 'poetry', 'analysis'], thumbnailColor: 'from-amber-500 to-amber-600', comments: 15, fileSize: '1.2 MB' },
  { id: '5', title: 'DNA Structure & Replication', description: 'Detailed worksheet on DNA double helix structure and replication process', subject: 'Biology', topic: 'Genetics', gradeLevel: 'Year 10', type: 'worksheet', author: 'Dr. Chen', createdAt: '2026-02-11', updatedAt: '2026-02-13', views: 267, likes: 63, saves: 41, rating: 4.7, ratingCount: 20, tags: ['dna', 'genetics', 'molecular'], thumbnailColor: 'from-emerald-500 to-emerald-600', comments: 6, fileSize: '3.5 MB' },
  { id: '6', title: 'Python Programming Basics', description: 'Step-by-step introduction to Python: variables, loops, functions, and data structures', subject: 'Computer Science', topic: 'Programming', gradeLevel: 'Year 9', type: 'pdf', author: 'Mr. Kumar', createdAt: '2026-02-10', updatedAt: '2026-02-15', views: 456, likes: 112, saves: 78, rating: 4.9, ratingCount: 35, tags: ['python', 'coding', 'beginner'], thumbnailColor: 'from-indigo-500 to-indigo-600', comments: 22, fileSize: '4.8 MB' },
  { id: '7', title: 'World War II Timeline & Key Events', description: 'Comprehensive timeline with maps, photos, and analysis of turning points', subject: 'History', topic: 'World Wars', gradeLevel: 'Year 11', type: 'presentation', author: 'Mr. Brown', createdAt: '2026-02-09', updatedAt: '2026-02-09', views: 178, likes: 41, saves: 29, rating: 4.4, ratingCount: 14, tags: ['wwii', 'timeline', 'europe'], thumbnailColor: 'from-red-500 to-red-600', comments: 9, fileSize: '12.3 MB' },
  { id: '8', title: 'Trigonometry Formulas Cheat Sheet', description: 'All essential trig formulas, identities, and unit circle reference', subject: 'Mathematics', topic: 'Trigonometry', gradeLevel: 'Year 10', type: 'worksheet', author: 'Ms. Johnson', createdAt: '2026-02-08', updatedAt: '2026-02-08', views: 612, likes: 156, saves: 201, rating: 5.0, ratingCount: 52, tags: ['trigonometry', 'formulas', 'reference'], thumbnailColor: 'from-blue-500 to-cyan-500', comments: 4, fileSize: '890 KB' },
  { id: '9', title: 'Climate Change & Global Warming', description: 'Interactive lesson on causes, effects, and solutions to climate change', subject: 'Geography', topic: 'Climate', gradeLevel: 'Year 9', type: 'video', author: 'Ms. Patel', createdAt: '2026-02-07', updatedAt: '2026-02-10', views: 334, likes: 89, saves: 56, rating: 4.7, ratingCount: 27, tags: ['climate', 'environment', 'global'], thumbnailColor: 'from-cyan-500 to-teal-500', comments: 18, fileSize: '98 MB' },
  { id: '10', title: 'Cell Division: Mitosis & Meiosis', description: 'Visual guide comparing mitosis and meiosis with animations and quiz', subject: 'Biology', topic: 'Cell Biology', gradeLevel: 'Year 9', type: 'presentation', author: 'Dr. Chen', createdAt: '2026-02-06', updatedAt: '2026-02-12', views: 287, likes: 72, saves: 48, rating: 4.6, ratingCount: 19, tags: ['cells', 'mitosis', 'meiosis'], thumbnailColor: 'from-emerald-400 to-green-600', comments: 11, fileSize: '6.2 MB' },
];

const GAMIFICATION_BADGES = [
  { name: 'Bookworm', icon: '📚', description: 'Read 50 materials', progress: 72, color: 'text-blue-500' },
  { name: 'Quiz Master', icon: '🧠', description: 'Complete 20 quizzes', progress: 45, color: 'text-purple-500' },
  { name: 'Explorer', icon: '🗺️', description: 'Browse all subjects', progress: 88, color: 'text-green-500' },
  { name: 'Contributor', icon: '✍️', description: 'Leave 30 comments', progress: 60, color: 'text-amber-500' },
  { name: 'Top Saver', icon: '⭐', description: 'Save 25 materials', progress: 36, color: 'text-red-500' },
];

const CLASS_RANKINGS = [
  { name: 'Year 10-A', points: 2450, trend: '+12%' },
  { name: 'Year 9-B', points: 2180, trend: '+8%' },
  { name: 'Year 11-A', points: 1920, trend: '+15%' },
  { name: 'Year 10-B', points: 1780, trend: '+5%' },
  { name: 'Year 9-A', points: 1650, trend: '+3%' },
];

const typeIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="w-4 h-4" />;
    case 'video': return <Video className="w-4 h-4" />;
    case 'presentation': return <Presentation className="w-4 h-4" />;
    case 'article': return <BookOpen className="w-4 h-4" />;
    case 'worksheet': return <Layers className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

export const Library: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'ceo' || user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedMaterial, setSelectedMaterial] = useState<LibraryMaterial | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [activeTab, setActiveTab] = useState('browse');

  const toggleSubject = (name: string) => {
    setExpandedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const filteredMaterials = useMemo(() => {
    let result = [...materials];
    if (search) result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.tags.some(t => t.includes(search.toLowerCase())));
    if (selectedSubject) result = result.filter(m => m.subject === selectedSubject);
    if (selectedTopic) result = result.filter(m => m.topic === selectedTopic);
    if (selectedType !== 'all') result = result.filter(m => m.type === selectedType);
    if (selectedGrade !== 'all') result = result.filter(m => m.gradeLevel === selectedGrade);
    switch (sortBy) {
      case 'popular': result.sort((a, b) => b.views - a.views); break;
      case 'top-rated': result.sort((a, b) => b.rating - a.rating); break;
      case 'most-liked': result.sort((a, b) => b.likes - a.likes); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [materials, search, selectedSubject, selectedTopic, selectedType, selectedGrade, sortBy]);

  const toggleLike = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isLiked: !m.isLiked, likes: m.isLiked ? m.likes - 1 : m.likes + 1 } : m));
  };

  const toggleSave = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isSaved: !m.isSaved, saves: m.isSaved ? m.saves - 1 : m.saves + 1 } : m));
  };

  const popularMaterials = [...materials].sort((a, b) => b.views - a.views).slice(0, 4);
  const newMaterials = [...materials].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" /> Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {materials.length} materials across {SUBJECTS.length} subjects
          </p>
        </div>
        {isTeacher && (
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Material
          </Button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Materials', value: '273', icon: BookOpen, color: 'text-blue-500' },
          { label: 'This Week', value: '+12', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Your Saves', value: '23', icon: Bookmark, color: 'text-amber-500' },
          { label: 'Your Points', value: '1,240', icon: Trophy, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label} className="bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="browse" className="gap-1.5"><FolderOpen className="w-4 h-4" />Browse</TabsTrigger>
          <TabsTrigger value="popular" className="gap-1.5"><Flame className="w-4 h-4" />Popular</TabsTrigger>
          <TabsTrigger value="saved" className="gap-1.5"><Bookmark className="w-4 h-4" />Saved</TabsTrigger>
          <TabsTrigger value="gamification" className="gap-1.5"><Trophy className="w-4 h-4" />Achievements</TabsTrigger>
          {isTeacher && <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="w-4 h-4" />Analytics</TabsTrigger>}
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="mt-4">
          <div className="flex gap-4">
            {/* Tree Navigation Sidebar */}
            <Card className="w-64 shrink-0 hidden lg:block">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedSubject ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'}`}
                    >
                      All Subjects
                    </button>
                    {SUBJECTS.map(sub => (
                      <div key={sub.name}>
                        <button
                          onClick={() => {
                            setSelectedSubject(sub.name);
                            setSelectedTopic(null);
                            toggleSubject(sub.name);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedSubject === sub.name ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'}`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{sub.icon}</span> {sub.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{sub.count}</span>
                            {expandedSubjects.includes(sub.name) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                        </button>
                        {expandedSubjects.includes(sub.name) && TOPICS_MAP[sub.name] && (
                          <div className="ml-6 space-y-0.5 mt-0.5">
                            {TOPICS_MAP[sub.name].map(topic => (
                              <button
                                key={topic}
                                onClick={() => { setSelectedSubject(sub.name); setSelectedTopic(topic); }}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${selectedTopic === topic ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground'}`}
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search materials, topics, tags..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px]"><Filter className="w-4 h-4 mr-1" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="presentation">Slides</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="worksheet">Worksheet</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-[130px]"><GraduationCap className="w-4 h-4 mr-1" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {['Year 7','Year 8','Year 9','Year 10','Year 11','Year 12'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Viewed</SelectItem>
                    <SelectItem value="top-rated">Top Rated</SelectItem>
                    <SelectItem value="most-liked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(selectedSubject || selectedTopic) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Active:</span>
                  {selectedSubject && (
                    <Badge variant="secondary" className="cursor-pointer gap-1" onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }}>
                      {selectedSubject} ×
                    </Badge>
                  )}
                  {selectedTopic && (
                    <Badge variant="secondary" className="cursor-pointer gap-1" onClick={() => setSelectedTopic(null)}>
                      {selectedTopic} ×
                    </Badge>
                  )}
                </div>
              )}

              {/* Results count */}
              <p className="text-sm text-muted-foreground">{filteredMaterials.length} materials found</p>

              {/* Material Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMaterials.map(material => (
                  <Card key={material.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden" onClick={() => setSelectedMaterial(material)}>
                    {/* Thumbnail */}
                    <div className={`h-32 bg-gradient-to-br ${material.thumbnailColor} relative flex items-center justify-center`}>
                      <div className="text-white/90 flex flex-col items-center gap-1">
                        {typeIcon(material.type)}
                        <span className="text-xs font-medium uppercase">{material.type}</span>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/40 text-white border-0 text-[10px]">
                        {material.gradeLevel}
                      </Badge>
                      {material.fileSize && (
                        <span className="absolute bottom-2 right-2 text-[10px] text-white/70">{material.fileSize}</span>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {material.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{material.description}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{material.subject}</Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{material.topic}</Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{material.views}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{material.rating}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{material.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={e => { e.stopPropagation(); toggleLike(material.id); }} className={`p-1 rounded hover:bg-secondary transition-colors ${material.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <Heart className={`w-3.5 h-3.5 ${material.isLiked ? 'fill-current' : ''}`} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); toggleSave(material.id); }} className={`p-1 rounded hover:bg-secondary transition-colors ${material.isSaved ? 'text-primary' : 'text-muted-foreground'}`}>
                            <Bookmark className={`w-3.5 h-3.5 ${material.isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">by {material.author} · {material.createdAt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMaterials.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No materials found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Popular Tab */}
        <TabsContent value="popular" className="mt-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /> Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularMaterials.map((m, i) => (
                <Card key={m.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedMaterial(m)}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.thumbnailColor} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{m.title}</h3>
                      <p className="text-xs text-muted-foreground">{m.subject} · {m.topic}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{m.views}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{m.likes}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{m.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500" /> Recently Added</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newMaterials.map(m => (
                <Card key={m.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedMaterial(m)}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.thumbnailColor} flex items-center justify-center text-white`}>
                      {typeIcon(m.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{m.title}</h3>
                      <p className="text-xs text-muted-foreground">{m.author} · {m.createdAt}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{m.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Recommendations</h2>
              <p className="text-xs text-muted-foreground mb-3">Based on your browsing history and weak topics</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {materials.slice(5, 8).map(m => (
                  <Card key={m.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedMaterial(m)}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.thumbnailColor} flex items-center justify-center text-white`}>
                          {typeIcon(m.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-xs line-clamp-1">{m.title}</h4>
                          <p className="text-[10px] text-muted-foreground">{m.subject}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">Recommended for you</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Tab */}
        <TabsContent value="saved" className="mt-4">
          {materials.filter(m => m.isSaved).length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No saved materials yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click the bookmark icon on any material to save it</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {materials.filter(m => m.isSaved).map(m => (
                <Card key={m.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedMaterial(m)}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{m.subject} · {m.topic}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Your Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {GAMIFICATION_BADGES.map(badge => (
                  <div key={badge.name} className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{badge.name}</span>
                        <span className="text-xs text-muted-foreground">{badge.progress}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                      <div className="w-full h-1.5 bg-secondary rounded-full mt-1">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${badge.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Class Rankings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Class Rankings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {CLASS_RANKINGS.map((cls, i) => (
                  <div key={cls.name} className={`flex items-center gap-3 p-2.5 rounded-lg ${i === 0 ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20' : 'bg-secondary/50'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-gray-400 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-secondary text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{cls.name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{cls.points.toLocaleString()} pts</span>
                    <Badge variant="secondary" className="text-[10px] text-green-600">{cls.trend}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity Streak */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-base font-semibold flex items-center gap-2 mb-3"><Flame className="w-5 h-5 text-orange-500" /> Activity Streak</h3>
              <div className="flex items-center gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex-1 text-center">
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${i < 4 ? 'bg-primary text-primary-foreground' : i === 4 ? 'bg-primary/40 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      {i < 4 ? '✓' : ''}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{day}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-center mt-3 text-muted-foreground">🔥 4-day streak! Keep going!</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teacher Analytics Tab */}
        {isTeacher && (
          <TabsContent value="analytics" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Views', value: '3,842', change: '+18%', icon: Eye },
                { label: 'Avg Rating', value: '4.7', change: '+0.2', icon: Star },
                { label: 'Total Downloads', value: '892', change: '+24%', icon: Download },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-green-600 text-xs">{s.change}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Your Materials Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materials.filter(m => m.author === 'Ms. Johnson' || m.author === 'Mr. Smith').map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.thumbnailColor} flex items-center justify-center text-white`}>
                        {typeIcon(m.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{m.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{m.subject} · {m.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{m.views}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{m.likes}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{m.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Modals */}
      <MaterialDetailModal
        material={selectedMaterial}
        open={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
        isTeacher={isTeacher}
      />
      <AddMaterialModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        subjects={SUBJECTS.map(s => s.name)}
        topicsMap={TOPICS_MAP}
      />
    </div>
  );
};
