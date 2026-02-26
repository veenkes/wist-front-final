import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Heart, Bookmark, Eye, Star, MessageSquare, Download, Share2,
  FileText, Video, Presentation, BookOpen, Layers, Send, User,
  Calendar, Link2, CheckCircle, StickyNote, Brain, Clock
} from 'lucide-react';
import type { LibraryMaterial } from '@/pages/Library';

interface Props {
  material: LibraryMaterial | null;
  open: boolean;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  isTeacher: boolean;
}

const typeIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="w-5 h-5" />;
    case 'video': return <Video className="w-5 h-5" />;
    case 'presentation': return <Presentation className="w-5 h-5" />;
    case 'article': return <BookOpen className="w-5 h-5" />;
    case 'worksheet': return <Layers className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
};

const MOCK_COMMENTS = [
  { id: '1', user: 'Ali K.', text: 'This was really helpful for exam prep!', date: '2026-02-15', rating: 5 },
  { id: '2', user: 'Sara M.', text: 'Great examples, could use more practice problems.', date: '2026-02-14', rating: 4 },
  { id: '3', user: 'Timur R.', text: 'The video explanations made it so much easier to understand.', date: '2026-02-13', rating: 5 },
];

const MOCK_QUIZ = [
  { q: 'What is the standard form of a quadratic equation?', options: ['ax² + bx + c = 0', 'ax + b = 0', 'a/x + b = 0', 'ax³ + bx = 0'], correct: 0 },
  { q: 'How many solutions can a quadratic equation have?', options: ['Only 1', 'Exactly 2', '0, 1, or 2', 'Infinite'], correct: 2 },
  { q: 'What is the discriminant used for?', options: ['Finding slope', 'Determining nature of roots', 'Calculating area', 'None of the above'], correct: 1 },
];

export const MaterialDetailModal: React.FC<Props> = ({ material, open, onClose, onToggleLike, onToggleSave, isTeacher }) => {
  const [comment, setComment] = useState('');
  const [note, setNote] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userRating, setUserRating] = useState(0);

  if (!material) return null;

  const handleSubmitQuiz = () => setQuizSubmitted(true);
  const quizScore = Object.entries(quizAnswers).filter(([i, a]) => MOCK_QUIZ[Number(i)]?.correct === a).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Hero */}
        <div className={`h-40 bg-gradient-to-br ${material.thumbnailColor} flex items-center justify-center relative`}>
          <div className="text-white text-center">
            {typeIcon(material.type)}
            <p className="text-sm font-medium mt-1 uppercase">{material.type}</p>
          </div>
          <Badge className="absolute top-3 right-3 bg-black/40 text-white border-0">{material.gradeLevel}</Badge>
          {material.fileSize && <span className="absolute bottom-3 right-3 text-xs text-white/70">{material.fileSize}</span>}
        </div>

        <ScrollArea className="max-h-[calc(90vh-10rem)]">
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl">{material.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">{material.description}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{material.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{material.createdAt}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{material.views} views</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" />{material.rating} ({material.ratingCount})</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline">{material.subject}</Badge>
              <Badge variant="outline">{material.topic}</Badge>
              {material.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onToggleLike(material.id)} className={material.isLiked ? 'text-red-500 border-red-200' : ''}>
                <Heart className={`w-4 h-4 mr-1 ${material.isLiked ? 'fill-current' : ''}`} /> {material.likes}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onToggleSave(material.id)} className={material.isSaved ? 'text-primary border-primary/30' : ''}>
                <Bookmark className={`w-4 h-4 mr-1 ${material.isSaved ? 'fill-current' : ''}`} /> Save
              </Button>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
              <Button variant="outline" size="sm"><Link2 className="w-4 h-4 mr-1" /> Link to Lesson</Button>
            </div>

            {/* Rate */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rate:</span>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setUserRating(s)} className="transition-transform hover:scale-110">
                  <Star className={`w-5 h-5 ${s <= userRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                </button>
              ))}
              {userRating > 0 && <span className="text-xs text-muted-foreground">You rated {userRating}/5</span>}
            </div>

            <Separator />

            {/* Content Tabs */}
            <Tabs defaultValue="comments">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="comments" className="gap-1"><MessageSquare className="w-3.5 h-3.5" />Comments</TabsTrigger>
                <TabsTrigger value="notes" className="gap-1"><StickyNote className="w-3.5 h-3.5" />My Notes</TabsTrigger>
                <TabsTrigger value="quiz" className="gap-1"><Brain className="w-3.5 h-3.5" />Quiz</TabsTrigger>
                {isTeacher && <TabsTrigger value="stats" className="gap-1"><Eye className="w-3.5 h-3.5" />Stats</TabsTrigger>}
              </TabsList>

              {/* Comments */}
              <TabsContent value="comments" className="space-y-3 mt-3">
                {MOCK_COMMENTS.map(c => (
                  <Card key={c.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{c.user}</span>
                        <span className="text-[10px] text-muted-foreground">{c.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.text}</p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: c.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} className="flex-1" />
                  <Button size="sm" disabled={!comment.trim()}><Send className="w-4 h-4" /></Button>
                </div>
              </TabsContent>

              {/* Notes */}
              <TabsContent value="notes" className="mt-3 space-y-3">
                <Textarea placeholder="Write your study notes, mini-summary, or key takeaways..." value={note} onChange={e => setNote(e.target.value)} rows={6} />
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">{note.length} characters</p>
                  <Button size="sm" disabled={!note.trim()}><CheckCircle className="w-4 h-4 mr-1" /> Save Notes</Button>
                </div>
              </TabsContent>

              {/* Quiz */}
              <TabsContent value="quiz" className="mt-3 space-y-4">
                <p className="text-sm text-muted-foreground">Test your understanding of this material</p>
                {MOCK_QUIZ.map((q, qi) => (
                  <Card key={qi}>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm font-medium">{qi + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => {
                          const selected = quizAnswers[qi] === oi;
                          const isCorrect = quizSubmitted && q.correct === oi;
                          const isWrong = quizSubmitted && selected && q.correct !== oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                              className={`text-left p-2.5 rounded-lg border text-sm transition-all ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700' : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700' : selected ? 'border-primary bg-primary/5' : 'hover:bg-secondary'}`}
                              disabled={quizSubmitted}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!quizSubmitted ? (
                  <Button onClick={handleSubmitQuiz} disabled={Object.keys(quizAnswers).length < MOCK_QUIZ.length}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Submit Quiz
                  </Button>
                ) : (
                  <Card className={quizScore === MOCK_QUIZ.length ? 'border-green-500' : 'border-amber-500'}>
                    <CardContent className="p-4 text-center">
                      <p className="text-lg font-bold">{quizScore}/{MOCK_QUIZ.length} correct</p>
                      <p className="text-sm text-muted-foreground">
                        {quizScore === MOCK_QUIZ.length ? '🎉 Perfect score!' : quizScore >= 2 ? '👍 Good job!' : '📚 Keep studying!'}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}>
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Teacher Stats */}
              {isTeacher && (
                <TabsContent value="stats" className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Views', value: material.views, icon: Eye },
                      { label: 'Likes', value: material.likes, icon: Heart },
                      { label: 'Saves', value: material.saves, icon: Bookmark },
                      { label: 'Comments', value: material.comments, icon: MessageSquare },
                    ].map(s => (
                      <Card key={s.label}>
                        <CardContent className="p-3 text-center">
                          <s.icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                          <p className="text-lg font-bold">{s.value}</p>
                          <p className="text-[10px] text-muted-foreground">{s.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2"><Clock className="w-4 h-4" /> Version History</h4>
                      <div className="space-y-1.5">
                        {[
                          { ver: 'v2.0', date: material.updatedAt, note: 'Added practice problems' },
                          { ver: 'v1.0', date: material.createdAt, note: 'Initial upload' },
                        ].map(v => (
                          <div key={v.ver} className="flex items-center gap-3 text-sm">
                            <Badge variant="outline" className="text-[10px]">{v.ver}</Badge>
                            <span className="text-muted-foreground">{v.date}</span>
                            <span className="text-muted-foreground">— {v.note}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
