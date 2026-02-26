import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ThumbsUp, BookOpen, Heart, Award, Sparkles, FileText, MessageSquare,
  User, Calendar, TrendingUp, TrendingDown, Minus, Star, Target, ChevronRight
} from 'lucide-react';
import { format, subDays, subWeeks } from 'date-fns';

interface ReportsTabProps {
  studentId: string;
  studentName: string;
}

type ReportType = 'praise' | 'recommendation' | 'behavior' | 'achievement';
type OverallTrend = 'improving' | 'stable' | 'declining';

interface DailyReport {
  id: string;
  type: ReportType;
  subject: string;
  title: string;
  content: string;
  date: string;
  author: string;
  term: string;
}

interface FinalReport {
  id: string;
  period: string;
  academicYear: string;
  overallComment: string;
  behaviourComment: string;
  strengthsComment: string;
  areasToImprove: string;
  goalsForNext: string;
  attendanceSummary: string;
  overallTrend: OverallTrend;
  subjects: Array<{ subject: string; grade: string; comment: string }>;
  date: string;
  author: string;
}

const reportTypeConfig: Record<ReportType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  praise: { label: 'Praise', icon: <ThumbsUp className="w-4 h-4" />, color: 'text-success', bgColor: 'bg-success/10 border-success/20' },
  recommendation: { label: 'Recommendation', icon: <BookOpen className="w-4 h-4" />, color: 'text-primary', bgColor: 'bg-primary/10 border-primary/20' },
  behavior: { label: 'Behaviour', icon: <Heart className="w-4 h-4" />, color: 'text-pink-500', bgColor: 'bg-pink-500/10 border-pink-500/20' },
  achievement: { label: 'Achievement', icon: <Award className="w-4 h-4" />, color: 'text-warning', bgColor: 'bg-warning/10 border-warning/20' },
};

const trendConfig: Record<OverallTrend, { label: string; icon: React.ReactNode; color: string }> = {
  improving: { label: 'Improving', icon: <TrendingUp className="w-4 h-4" />, color: 'text-success' },
  stable: { label: 'Stable', icon: <Minus className="w-4 h-4" />, color: 'text-primary' },
  declining: { label: 'Needs Attention', icon: <TrendingDown className="w-4 h-4" />, color: 'text-destructive' },
};

const now = new Date();

const generateMockDailyReports = (): DailyReport[] => [
  { id: 'dr1', type: 'praise', subject: 'Mathematics', title: 'Excellent classwork performance', content: 'Demonstrated outstanding understanding of trigonometry. Solved all advanced problems independently and helped classmates.', date: subDays(now, 2).toISOString(), author: 'Smirnova E.I.', term: 'Term 3' },
  { id: 'dr2', type: 'recommendation', subject: 'Physics', title: 'Improvement needed in lab work', content: 'Good theoretical knowledge but struggles with practical problem-solving. Additional practice sessions for lab work are recommended.', date: subDays(now, 5).toISOString(), author: 'Kuznetsov A.P.', term: 'Term 3' },
  { id: 'dr3', type: 'behavior', subject: 'General', title: 'Positive behaviour trend', content: 'Has significantly improved classroom behaviour. More attentive, no longer distracts classmates, and actively participates in discussions.', date: subDays(now, 8).toISOString(), author: 'Popova M.V.', term: 'Term 3' },
  { id: 'dr4', type: 'achievement', subject: 'English', title: 'Essay competition winner', content: 'Won 1st place in the regional essay competition on "My Future Profession". Demonstrated excellent grammar and rich vocabulary.', date: subDays(now, 12).toISOString(), author: 'Ivanova N.S.', term: 'Term 3' },
  { id: 'dr5', type: 'praise', subject: 'History', title: 'Creative project approach', content: 'Prepared a brilliant presentation on Ancient Egypt. Used additional sources and created a pyramid model.', date: subDays(now, 15).toISOString(), author: 'Lebedev D.A.', term: 'Term 2' },
  { id: 'dr6', type: 'recommendation', subject: 'Chemistry', title: 'Focus on safety procedures', content: 'Needs to pay more attention to laboratory safety protocols. Additional training on chemical handling recommended.', date: subDays(now, 20).toISOString(), author: 'Kuznetsov A.P.', term: 'Term 2' },
];

const generateMockFinalReports = (): FinalReport[] => [
  {
    id: 'fr1', period: 'Term 2', academicYear: '2024-2025',
    overallComment: 'Strong academic performance across most subjects. Shows particular talent in mathematics and history. Consistent effort throughout the term with notable improvement in English writing skills.',
    behaviourComment: 'Excellent classroom behaviour. Respectful to teachers and peers. Shows leadership qualities during group activities and is always willing to help classmates.',
    strengthsComment: 'Mathematical reasoning, creative thinking, strong work ethic, leadership in group projects',
    areasToImprove: 'Laboratory work in physics and chemistry, time management during exams, more consistent homework submission in biology',
    goalsForNext: 'Achieve A grade in Physics lab work, participate in the Science Fair, maintain current GPA while improving weaker subjects',
    attendanceSummary: '96% attendance, 2 excused absences (medical)',
    overallTrend: 'improving',
    subjects: [
      { subject: 'Mathematics', grade: 'A', comment: 'Outstanding problem-solving skills' },
      { subject: 'English', grade: 'B', comment: 'Good improvement in writing' },
      { subject: 'Physics', grade: 'B', comment: 'Strong theory, needs lab practice' },
      { subject: 'History', grade: 'A', comment: 'Excellent research projects' },
      { subject: 'Chemistry', grade: 'C', comment: 'Must improve lab safety awareness' },
    ],
    date: subWeeks(now, 6).toISOString(), author: 'Class Tutor — Popova M.V.',
  },
  {
    id: 'fr2', period: 'Term 1', academicYear: '2024-2025',
    overallComment: 'Good start to the academic year. Adapting well to the new curriculum. Shows enthusiasm for learning but needs to develop more consistent study habits.',
    behaviourComment: 'Generally good behaviour with occasional distractions. Responds well to feedback and has shown improvement over the term.',
    strengthsComment: 'Enthusiasm for learning, strong participation in class discussions, creative approach to projects',
    areasToImprove: 'Consistent homework completion, focus during independent work, time management skills',
    goalsForNext: 'Submit all homework on time, improve physics practical skills, read one additional book per month',
    attendanceSummary: '92% attendance, 4 absences (2 medical, 1 family, 1 unexcused)',
    overallTrend: 'stable',
    subjects: [
      { subject: 'Mathematics', grade: 'A', comment: 'Natural aptitude for numbers' },
      { subject: 'English', grade: 'C', comment: 'Needs more reading practice' },
      { subject: 'Physics', grade: 'B', comment: 'Good understanding of concepts' },
      { subject: 'History', grade: 'B', comment: 'Engaged in class discussions' },
      { subject: 'Chemistry', grade: 'C', comment: 'Average performance, needs effort' },
    ],
    date: subWeeks(now, 18).toISOString(), author: 'Class Tutor — Popova M.V.',
  },
];

export const ReportsTab: React.FC<ReportsTabProps> = ({ studentId, studentName }) => {
  const [activeView, setActiveView] = useState<'daily' | 'final'>('daily');
  const [selectedDailyReport, setSelectedDailyReport] = useState<DailyReport | null>(null);
  const [selectedFinalReport, setSelectedFinalReport] = useState<FinalReport | null>(null);
  const [dailyReports] = useState(generateMockDailyReports);
  const [finalReports] = useState(generateMockFinalReports);

  const dailyStats = useMemo(() => ({
    total: dailyReports.length,
    praise: dailyReports.filter(r => r.type === 'praise').length,
    recommendation: dailyReports.filter(r => r.type === 'recommendation').length,
    behavior: dailyReports.filter(r => r.type === 'behavior').length,
    achievement: dailyReports.filter(r => r.type === 'achievement').length,
  }), [dailyReports]);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <Tabs value={activeView} onValueChange={v => setActiveView(v as 'daily' | 'final')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily" className="gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5" />Daily Reports ({dailyReports.length})
          </TabsTrigger>
          <TabsTrigger value="final" className="gap-2 text-xs">
            <FileText className="w-3.5 h-3.5" />Final Reports ({finalReports.length})
          </TabsTrigger>
        </TabsList>

        {/* Daily Reports */}
        <TabsContent value="daily" className="mt-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-5 gap-2">
            <Card className="p-2.5 text-center">
              <p className="text-lg font-bold">{dailyStats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </Card>
            {(Object.keys(reportTypeConfig) as ReportType[]).map(type => {
              const config = reportTypeConfig[type];
              return (
                <Card key={type} className="p-2.5 text-center">
                  <p className={`text-lg font-bold ${config.color}`}>{dailyStats[type]}</p>
                  <p className="text-[10px] text-muted-foreground">{config.label}</p>
                </Card>
              );
            })}
          </div>

          {/* List */}
          <div className="space-y-2">
            {dailyReports.map(report => {
              const config = reportTypeConfig[report.type];
              return (
                <Card key={report.id} className={`border cursor-pointer hover:shadow-md transition-all ${config.bgColor}`} onClick={() => setSelectedDailyReport(report)}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bgColor} ${config.color}`}>{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <Badge variant="outline" className={`text-[9px] ${config.color} border-current/20`}>{config.label}</Badge>
                          <Badge variant="outline" className="text-[9px]">{report.subject}</Badge>
                          <span className="text-[9px] text-muted-foreground ml-auto">{format(new Date(report.date), 'dd MMM yyyy')}</span>
                        </div>
                        <h4 className="font-semibold text-xs mb-0.5">{report.title}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{report.content}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">By: {report.author} • {report.term}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Final Reports */}
        <TabsContent value="final" className="mt-4 space-y-4">
          {finalReports.map(report => {
            const trend = trendConfig[report.overallTrend];
            return (
              <Card key={report.id} className="border cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedFinalReport(report)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{report.period} — {report.academicYear}</h4>
                        <p className="text-[10px] text-muted-foreground">{format(new Date(report.date), 'dd MMM yyyy')} • {report.author}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend.color}`}>
                      {trend.icon}{trend.label}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{report.overallComment}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {report.subjects.map(s => (
                      <Badge key={s.subject} variant="outline" className="text-[9px] gap-1">
                        {s.subject}: <span className="font-bold">{s.grade}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {finalReports.length === 0 && (
            <Card><CardContent className="p-12 text-center"><FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No final reports yet</p></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Daily Report Detail Modal */}
      <Dialog open={!!selectedDailyReport} onOpenChange={open => { if (!open) setSelectedDailyReport(null); }}>
        <DialogContent className="max-w-md">
          {selectedDailyReport && (() => {
            const config = reportTypeConfig[selectedDailyReport.type];
            return (<>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgColor} ${config.color}`}>{config.icon}</div>
                  {selectedDailyReport.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${config.bgColor} ${config.color} border`}>{config.label}</Badge>
                  <Badge variant="outline">{selectedDailyReport.subject}</Badge>
                  <Badge variant="outline">{selectedDailyReport.term}</Badge>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{format(new Date(selectedDailyReport.date), 'dd MMM yyyy')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Author</span><span className="font-medium">{selectedDailyReport.author}</span></div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"><MessageSquare className="w-3 h-3 inline mr-1" />Content</p>
                  <p className="text-sm leading-relaxed">{selectedDailyReport.content}</p>
                </div>
              </div>
            </>);
          })()}
        </DialogContent>
      </Dialog>

      {/* Final Report Detail Modal */}
      <Dialog open={!!selectedFinalReport} onOpenChange={open => { if (!open) setSelectedFinalReport(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedFinalReport && (() => {
            const trend = trendConfig[selectedFinalReport.overallTrend];
            return (<>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  Final Report — {selectedFinalReport.period}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{selectedFinalReport.academicYear}</Badge>
                  <Badge variant="outline">{selectedFinalReport.period}</Badge>
                  <div className={`flex items-center gap-1 text-xs font-medium ml-auto ${trend.color}`}>
                    {trend.icon}{trend.label}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{format(new Date(selectedFinalReport.date), 'dd MMM yyyy')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Author</span><span>{selectedFinalReport.author}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Attendance</span><span>{selectedFinalReport.attendanceSummary}</span></div>
                </div>

                {/* Subject grades */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2"><BookOpen className="w-3 h-3 inline mr-1" />Subject Grades</p>
                  <div className="space-y-1.5">
                    {selectedFinalReport.subjects.map(s => (
                      <div key={s.subject} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">{s.grade}</Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{s.subject}</p>
                          {s.comment && <p className="text-[10px] text-muted-foreground">{s.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"><MessageSquare className="w-3 h-3 inline mr-1" />Overall Comment</p>
                  <p className="text-sm leading-relaxed">{selectedFinalReport.overallComment}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"><Heart className="w-3 h-3 inline mr-1" />Behaviour & Attitude</p>
                  <p className="text-sm leading-relaxed">{selectedFinalReport.behaviourComment}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"><Star className="w-3 h-3 inline mr-1" />Key Strengths</p>
                    <p className="text-sm leading-relaxed">{selectedFinalReport.strengthsComment}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"><Target className="w-3 h-3 inline mr-1" />Areas to Improve</p>
                    <p className="text-sm leading-relaxed">{selectedFinalReport.areasToImprove}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5"><Award className="w-3 h-3 inline mr-1" />Goals for Next Period</p>
                  <p className="text-sm leading-relaxed">{selectedFinalReport.goalsForNext}</p>
                </div>
              </div>
            </>);
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
