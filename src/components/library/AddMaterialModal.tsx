import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Upload, Plus, X, CheckCircle, FileText, Video, Presentation,
  BookOpen, Layers, Eye, Link2, Calendar, GraduationCap,
  Sparkles, AlertCircle, Image as ImageIcon, File, Trash2,
  ChevronLeft, ChevronRight, Settings, ClipboardList, Tag,
  PenTool, Globe, Lock, Clock, Bell, HelpCircle, Lightbulb,
  MessageSquare, Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  subjects: string[];
  topicsMap: Record<string, string[]>;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-500 bg-red-500/10' },
  { value: 'video', label: 'Video', icon: Video, color: 'text-purple-500 bg-purple-500/10' },
  { value: 'presentation', label: 'Presentation', icon: Presentation, color: 'text-orange-500 bg-orange-500/10' },
  { value: 'article', label: 'Article', icon: BookOpen, color: 'text-blue-500 bg-blue-500/10' },
  { value: 'worksheet', label: 'Worksheet', icon: Layers, color: 'text-green-500 bg-green-500/10' },
];

const GRADE_LEVELS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'];

const STEPS = [
  { id: 1, label: 'Basic Info', icon: PenTool },
  { id: 2, label: 'Content', icon: FileText },
  { id: 3, label: 'Quiz', icon: ClipboardList },
  { id: 4, label: 'Settings', icon: Settings },
  { id: 5, label: 'Preview', icon: Eye },
];

export const AddMaterialModal: React.FC<Props> = ({ open, onClose, subjects, topicsMap }) => {
  const [step, setStep] = useState(1);
  
  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevels, setGradeLevels] = useState<string[]>([]);
  const [type, setType] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailColor, setThumbnailColor] = useState('from-blue-500 to-blue-600');

  // Step 2: Content
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [articleContent, setArticleContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState<{ label: string; url: string }[]>([]);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Step 3: Quiz
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizPassScore, setQuizPassScore] = useState('70');

  // Step 4: Settings
  const [visibility, setVisibility] = useState<'public' | 'class' | 'private'>('public');
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [downloadEnabled, setDownloadEnabled] = useState(true);
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [linkedLesson, setLinkedLesson] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [publishNow, setPublishNow] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const GRADIENT_OPTIONS = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-red-500 to-red-600',
    'from-amber-500 to-amber-600',
    'from-cyan-500 to-teal-500',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-rose-500',
    'from-emerald-400 to-green-600',
    'from-orange-500 to-red-500',
  ];

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const toggleGrade = (grade: string) => {
    setGradeLevels(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const handleFileSelect = () => {
    // Simulate file selection
    const mockFile: AttachedFile = {
      id: Date.now().toString(),
      name: `document_${files.length + 1}.pdf`,
      size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      type: 'application/pdf',
    };
    setFiles([...files, mockFile]);
    toast.success('File attached');
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const addLink = () => {
    if (linkLabel.trim() && linkUrl.trim()) {
      setAdditionalLinks([...additionalLinks, { label: linkLabel.trim(), url: linkUrl.trim() }]);
      setLinkLabel('');
      setLinkUrl('');
    }
  };

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuizQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qId: string, optIndex: number, value: string) => {
    setQuizQuestions(prev =>
      prev.map(q =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) }
          : q
      )
    );
  };

  const removeQuestion = (id: string) => {
    setQuizQuestions(prev => prev.filter(q => q.id !== id));
  };

  const validateStep = (s: number): boolean => {
    switch (s) {
      case 1:
        return !!(title && subject && type && gradeLevels.length > 0);
      case 2:
        return type === 'article' ? !!articleContent : type === 'video' ? !!videoUrl : files.length > 0;
      case 3:
        if (!quizEnabled) return true;
        return quizQuestions.length > 0 && quizQuestions.every(q =>
          q.question && q.options.every(o => o) && q.explanation
        );
      case 4:
        return true;
      default:
        return true;
    }
  };

  const canProceed = validateStep(step);

  const handleSubmit = () => {
    if (!validateStep(1)) {
      toast.error('Please fill in all required fields in Basic Info');
      setStep(1);
      return;
    }
    toast.success('Material published successfully!');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setTitle(''); setDescription(''); setSubject(''); setTopic('');
    setGradeLevels([]); setType(''); setTags([]); setTagInput('');
    setFiles([]); setArticleContent(''); setVideoUrl('');
    setAdditionalLinks([]); setQuizEnabled(false); setQuizQuestions([]);
    setVisibility('public'); setCommentsEnabled(true); setDownloadEnabled(true);
    setNotifyStudents(true); setLinkedLesson(''); setScheduledDate('');
    setPublishNow(true);
  };

  return (
    <Dialog open={open} onOpenChange={() => { resetForm(); onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Create New Material
          </DialogTitle>
          {/* Step Indicator */}
          <div className="flex items-center gap-1 mt-3">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => { if (s.id < step || canProceed) setStep(s.id); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    step === s.id
                      ? 'bg-primary text-primary-foreground'
                      : s.id < step
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-4 rounded ${s.id < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-5">
            {/* ===== STEP 1: BASIC INFO ===== */}
            {step === 1 && (
              <>
                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Title <span className="text-destructive">*</span></Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Quadratic Equations"
                    maxLength={120}
                    className="text-base"
                  />
                  <p className="text-[10px] text-muted-foreground text-right">{title.length}/120</p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What will students learn from this material?"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-[10px] text-muted-foreground text-right">{description.length}/500</p>
                </div>

                {/* Material Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Material Type <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-5 gap-2">
                    {MATERIAL_TYPES.map(mt => (
                      <button
                        key={mt.value}
                        onClick={() => setType(mt.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                          type === mt.value
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/30 bg-card'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${mt.color}`}>
                          <mt.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium">{mt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject & Topic */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Subject <span className="text-destructive">*</span></Label>
                    <Select value={subject} onValueChange={v => { setSubject(v); setTopic(''); }}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Topic</Label>
                    <Select value={topic} onValueChange={setTopic} disabled={!subject}>
                      <SelectTrigger><SelectValue placeholder={subject ? 'Select topic' : 'Select subject first'} /></SelectTrigger>
                      <SelectContent>
                        {(topicsMap[subject] || []).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Grade Levels (multi-select) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Grade Levels <span className="text-destructive">*</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_LEVELS.map(g => (
                      <button
                        key={g}
                        onClick={() => toggleGrade(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          gradeLevels.includes(g)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border hover:border-primary/30 text-muted-foreground'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags <span className="text-muted-foreground text-xs">(max 10)</span></Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="Add a tag and press Enter..."
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      maxLength={30}
                    />
                    <Button variant="outline" size="icon" onClick={addTag} disabled={!tagInput.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(t => (
                        <Badge key={t} variant="secondary" className="gap-1 cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => setTags(tags.filter(x => x !== t))}>
                          <Tag className="w-3 h-3" /> {t} <X className="w-3 h-3" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Card Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {GRADIENT_OPTIONS.map(g => (
                      <button
                        key={g}
                        onClick={() => setThumbnailColor(g)}
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-all ${
                          thumbnailColor === g ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===== STEP 2: CONTENT ===== */}
            {step === 2 && (
              <>
                {/* File Upload */}
                {type !== 'article' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Upload Files <span className="text-destructive">*</span></Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">Drag & drop files here</p>
                      <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                      <p className="text-[10px] text-muted-foreground mt-2">PDF, DOCX, PPTX, MP4, JPG, PNG — up to 100MB</p>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} multiple accept=".pdf,.docx,.pptx,.mp4,.jpg,.png,.gif,.xlsx" />
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map(f => (
                          <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                            <File className="w-5 h-5 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{f.name}</p>
                              <p className="text-[10px] text-muted-foreground">{f.size}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeFile(f.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Video URL */}
                {type === 'video' && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Video URL <span className="text-muted-foreground text-xs">(YouTube, Vimeo, etc.)</span></Label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                )}

                {/* Article Content (rich text placeholder) */}
                {type === 'article' && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Article Content <span className="text-destructive">*</span></Label>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-1 p-2 bg-secondary/50 border-b border-border">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold">B</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs italic">I</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs underline">U</Button>
                        <div className="h-4 w-px bg-border mx-1" />
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">H1</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">H2</Button>
                        <div className="h-4 w-px bg-border mx-1" />
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">• List</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">1. List</Button>
                        <div className="h-4 w-px bg-border mx-1" />
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">🔗</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">📷</Button>
                      </div>
                      <Textarea
                        value={articleContent}
                        onChange={e => setArticleContent(e.target.value)}
                        placeholder="Write your article content here... You can use markdown formatting."
                        rows={12}
                        className="border-0 rounded-none focus-visible:ring-0"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{articleContent.length} characters</p>
                  </div>
                )}

                {/* Additional Links */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Additional Resources</Label>
                  <div className="flex gap-2">
                    <Input
                      value={linkLabel}
                      onChange={e => setLinkLabel(e.target.value)}
                      placeholder="Label"
                      className="w-1/3"
                    />
                    <Input
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={addLink} disabled={!linkLabel.trim() || !linkUrl.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {additionalLinks.length > 0 && (
                    <div className="space-y-1.5">
                      {additionalLinks.map((l, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 text-sm">
                          <Link2 className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium">{l.label}</span>
                          <span className="text-muted-foreground truncate text-xs">{l.url}</span>
                          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setAdditionalLinks(additionalLinks.filter((_, j) => j !== i))}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ===== STEP 3: QUIZ ===== */}
            {step === 3 && (
              <>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Attach a Quiz</p>
                      <p className="text-xs text-muted-foreground">Students will answer after reading the material</p>
                    </div>
                  </div>
                  <Switch checked={quizEnabled} onCheckedChange={setQuizEnabled} />
                </div>

                {quizEnabled && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Pass Score (%)</Label>
                      <Input
                        type="number"
                        value={quizPassScore}
                        onChange={e => setQuizPassScore(e.target.value)}
                        min={0}
                        max={100}
                        className="w-32"
                      />
                    </div>

                    <div className="space-y-4">
                      {quizQuestions.map((q, qi) => (
                        <Card key={q.id} className="border-border">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-primary">Question {qi + 1}</span>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeQuestion(q.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Input
                              value={q.question}
                              onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                              placeholder="Enter your question..."
                            />
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Answer Options (select the correct one)</Label>
                              {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateQuestion(q.id, 'correctAnswer', oi)}
                                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                                      q.correctAnswer === oi
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-border text-muted-foreground hover:border-primary'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oi)}
                                  </button>
                                  <Input
                                    value={opt}
                                    onChange={e => updateOption(q.id, oi, e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                    className="flex-1"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" /> Explanation (shown after answering)
                              </Label>
                              <Textarea
                                value={q.explanation}
                                onChange={e => updateQuestion(q.id, 'explanation', e.target.value)}
                                placeholder="Explain why this answer is correct..."
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button variant="outline" onClick={addQuizQuestion} className="w-full gap-2 border-dashed">
                      <Plus className="w-4 h-4" /> Add Question
                    </Button>
                  </>
                )}

                {!quizEnabled && (
                  <div className="text-center py-8">
                    <HelpCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Enable the quiz toggle above to add questions</p>
                    <p className="text-xs text-muted-foreground mt-1">Quizzes help assess understanding and boost engagement</p>
                  </div>
                )}
              </>
            )}

            {/* ===== STEP 4: SETTINGS ===== */}
            {step === 4 && (
              <>
                {/* Visibility */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Visibility</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'public' as const, label: 'All Students', icon: Globe, desc: 'Anyone can view' },
                      { value: 'class' as const, label: 'My Classes', icon: GraduationCap, desc: 'Assigned classes only' },
                      { value: 'private' as const, label: 'Draft', icon: Lock, desc: 'Only you can see' },
                    ].map(v => (
                      <button
                        key={v.value}
                        onClick={() => setVisibility(v.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                          visibility === v.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30 bg-card'
                        }`}
                      >
                        <v.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{v.label}</span>
                        <span className="text-[10px] text-muted-foreground">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Allow Comments</p>
                        <p className="text-[10px] text-muted-foreground">Students can leave comments</p>
                      </div>
                    </div>
                    <Switch checked={commentsEnabled} onCheckedChange={setCommentsEnabled} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Allow Downloads</p>
                        <p className="text-[10px] text-muted-foreground">Students can download files</p>
                      </div>
                    </div>
                    <Switch checked={downloadEnabled} onCheckedChange={setDownloadEnabled} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Notify Students</p>
                        <p className="text-[10px] text-muted-foreground">Send push notification on publish</p>
                      </div>
                    </div>
                    <Switch checked={notifyStudents} onCheckedChange={setNotifyStudents} />
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Publishing</Label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPublishNow(true)}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        publishNow ? 'border-primary bg-primary/5' : 'border-border bg-card'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Publish Now</span>
                    </button>
                    <button
                      onClick={() => setPublishNow(false)}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        !publishNow ? 'border-primary bg-primary/5' : 'border-border bg-card'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Schedule</span>
                    </button>
                  </div>
                  {!publishNow && (
                    <Input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={e => setScheduledDate(e.target.value)}
                    />
                  )}
                </div>

                {/* Link to Lesson */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Link to Lesson
                  </Label>
                  <Select value={linkedLesson} onValueChange={setLinkedLesson}>
                    <SelectTrigger><SelectValue placeholder="Select a lesson (optional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No link</SelectItem>
                      <SelectItem value="math-monday">Mathematics – Monday 9:00</SelectItem>
                      <SelectItem value="physics-tuesday">Physics – Tuesday 11:00</SelectItem>
                      <SelectItem value="cs-wednesday">Computer Science – Wednesday 14:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* ===== STEP 5: PREVIEW ===== */}
            {step === 5 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Review your material before publishing:</p>

                {/* Preview Card */}
                <Card className="overflow-hidden">
                  <div className={`h-36 bg-gradient-to-br ${thumbnailColor} flex items-center justify-center relative`}>
                    <div className="text-white/90 flex flex-col items-center gap-1">
                      {MATERIAL_TYPES.find(m => m.value === type)?.icon && (
                        React.createElement(MATERIAL_TYPES.find(m => m.value === type)!.icon, { className: 'w-8 h-8' })
                      )}
                      <span className="text-sm font-medium uppercase">{type || 'N/A'}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {gradeLevels.map(g => (
                        <Badge key={g} className="bg-black/40 text-white border-0 text-[10px]">{g}</Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg">{title || 'Untitled Material'}</h3>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}

                    <div className="flex gap-2 flex-wrap">
                      {subject && <Badge variant="outline">{subject}</Badge>}
                      {topic && <Badge variant="outline">{topic}</Badge>}
                      {tags.map(t => <Badge key={t} variant="secondary" className="text-xs"><Tag className="w-3 h-3 mr-1" />{t}</Badge>)}
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Files: {files.length}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> Links: {additionalLinks.length}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ClipboardList className="w-3 h-3" /> Quiz: {quizEnabled ? `${quizQuestions.length} questions` : 'None'}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {visibility === 'public' ? <Globe className="w-3 h-3" /> : visibility === 'class' ? <GraduationCap className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {visibility === 'public' ? 'All Students' : visibility === 'class' ? 'My Classes' : 'Draft'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Comments: {commentsEnabled ? 'On' : 'Off'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Download className="w-3 h-3" /> Downloads: {downloadEnabled ? 'On' : 'Off'}
                        </p>
                      </div>
                    </div>

                    {!publishNow && scheduledDate && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-600 text-xs">
                        <Clock className="w-4 h-4" />
                        Scheduled for: {new Date(scheduledDate).toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Validation Warnings */}
                {!validateStep(1) && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Missing required fields in Basic Info
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={() => step === 1 ? (resetForm(), onClose()) : setStep(step - 1)}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <div className="text-xs text-muted-foreground">Step {step} of {STEPS.length}</div>
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-1 bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-4 h-4" /> {publishNow ? 'Publish' : 'Schedule'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
