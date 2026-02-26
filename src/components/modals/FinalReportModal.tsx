import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText, Plus, Star, TrendingUp, TrendingDown, Minus, User, BookOpen, Heart,
  Award, Target, MessageSquare, Trophy, Users, Lightbulb, Shield, Smile, Brain,
  CheckCircle, Trash2, GraduationCap, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const MOCK_STUDENTS = [
  { id: '1', name: 'Ivanov Alex', group: 'Group 8A' },
  { id: '2', name: 'Petrova Maria', group: 'Group 8A' },
  { id: '3', name: 'Sidorov Dmitry', group: 'Group 8A' },
  { id: '4', name: 'Kozlova Anna', group: 'Group 8A' },
  { id: '5', name: 'Novikov Andrew', group: 'Group 5B' },
  { id: '6', name: 'Morozova Elena', group: 'Group 5B' },
  { id: '7', name: 'Volkov Sergey', group: 'Group 5B' },
  { id: '8', name: 'Sokolova Olga', group: 'Group 5B' },
];

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'History', 'Biology', 'Geography', 'Literature'];

type OverallTrend = 'improving' | 'stable' | 'declining';

interface SubjectEntry {
  subject: string;
  grade: string;
  effort: string;
  comment: string;
}

interface FinalReportData {
  studentId: string;
  period: string;
  academicYear: string;
  overallComment: string;
  behaviourComment: string;
  strengthsComment: string;
  areasToImprove: string;
  goalsForNext: string;
  attendanceSummary: string;
  overallTrend: OverallTrend;
  subjects: SubjectEntry[];
  // Extended fields
  extracurriculars: string;
  socialEmotional: string;
  teacherRecommendations: string;
  parentGuidance: string;
  leadershipComment: string;
  homeworkConsistency: string;
  readingLevel: string;
  examReadiness: string;
  specialAchievements: string;
}

const trendConfig: Record<OverallTrend, { label: string; icon: React.ReactNode; color: string }> = {
  improving: { label: 'Improving', icon: <TrendingUp className="w-4 h-4" />, color: 'text-success' },
  stable: { label: 'Stable', icon: <Minus className="w-4 h-4" />, color: 'text-primary' },
  declining: { label: 'Needs Attention', icon: <TrendingDown className="w-4 h-4" />, color: 'text-destructive' },
};

const effortOptions = [
  { value: 'outstanding', label: 'Outstanding', color: 'text-success' },
  { value: 'good', label: 'Good', color: 'text-primary' },
  { value: 'satisfactory', label: 'Satisfactory', color: 'text-warning' },
  { value: 'needs_improvement', label: 'Needs Improvement', color: 'text-destructive' },
];

const emptyReport: FinalReportData = {
  studentId: '', period: '', academicYear: '2024-2025',
  overallComment: '', behaviourComment: '', strengthsComment: '',
  areasToImprove: '', goalsForNext: '', attendanceSummary: '',
  overallTrend: 'stable', subjects: [],
  extracurriculars: '', socialEmotional: '', teacherRecommendations: '',
  parentGuidance: '', leadershipComment: '', homeworkConsistency: '',
  readingLevel: '', examReadiness: '', specialAchievements: '',
};

interface FinalReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [report, setReport] = useState<FinalReportData>({ ...emptyReport });
  const [currentSubject, setCurrentSubject] = useState({ subject: '', grade: '', effort: 'good', comment: '' });

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === report.studentId);
  const totalSteps = 5;

  const addSubject = () => {
    if (!currentSubject.subject || !currentSubject.grade) { toast.error('Select a subject and grade'); return; }
    if (report.subjects.find(s => s.subject === currentSubject.subject)) { toast.error('Subject already added'); return; }
    setReport(prev => ({ ...prev, subjects: [...prev.subjects, { ...currentSubject }] }));
    setCurrentSubject({ subject: '', grade: '', effort: 'good', comment: '' });
  };

  const removeSubject = (subject: string) => {
    setReport(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.subject !== subject) }));
  };

  const handleSubmit = () => {
    if (!report.studentId || !report.period || !report.overallComment) { toast.error('Please fill in all required fields'); return; }
    toast.success('Final report created successfully');
    setReport({ ...emptyReport });
    setStep(1);
    onOpenChange(false);
  };

  const reset = () => { setReport({ ...emptyReport }); setStep(1); };

  const StudentBanner = () => selectedStudent ? (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm">
      <User className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium">{selectedStudent.name}</span>
      <Badge variant="outline" className="text-[10px]">{selectedStudent.group}</Badge>
      <Badge variant="outline" className="text-[10px]">{report.period}</Badge>
      {report.subjects.length > 0 && <Badge variant="outline" className="text-[10px]">{report.subjects.length} subjects</Badge>}
    </div>
  ) : null;

  const stepLabels = ['Student & Period', 'Subject Grades', 'Academic Assessment', 'Development & Skills', 'Review & Submit'];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            New Final Report
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="px-6 pt-3 space-y-1">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }, (_, i) => (
              <button key={i} onClick={() => setStep((i + 1) as any)}
                className={`flex-1 h-1.5 rounded-full transition-colors cursor-pointer ${step >= i + 1 ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}: {stepLabels[step - 1]}</p>
        </div>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-4 pt-2 pr-2">

            {/* Step 1 — Student & Period */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Student *</Label>
                  <Select value={report.studentId} onValueChange={v => setReport(prev => ({ ...prev, studentId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{MOCK_STUDENTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — {s.group}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Report Period *</Label>
                    <Select value={report.period} onValueChange={v => setReport(prev => ({ ...prev, period: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Term 1">Term 1 (Autumn)</SelectItem>
                        <SelectItem value="Term 2">Term 2 (Spring)</SelectItem>
                        <SelectItem value="Term 3">Term 3 (Summer)</SelectItem>
                        <SelectItem value="Semester 1">Semester 1</SelectItem>
                        <SelectItem value="Semester 2">Semester 2</SelectItem>
                        <SelectItem value="Annual">Annual Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Academic Year</Label>
                    <Select value={report.academicYear} onValueChange={v => setReport(prev => ({ ...prev, academicYear: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall Trend</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(trendConfig) as OverallTrend[]).map(trend => {
                      const config = trendConfig[trend];
                      return (
                        <button key={trend} onClick={() => setReport(prev => ({ ...prev, overallTrend: trend }))}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                            report.overallTrend === trend ? `bg-primary/10 border-primary ${config.color} font-medium ring-2 ring-primary/20` : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                          }`}>
                          {config.icon}<span>{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Target className="w-3 h-3 inline mr-1" />Attendance Summary
                  </Label>
                  <Input value={report.attendanceSummary} onChange={e => setReport(prev => ({ ...prev, attendanceSummary: e.target.value }))}
                    placeholder="e.g. 95% attendance, 3 absences (all justified)" />
                </div>
                <Button onClick={() => setStep(2)} className="w-full" disabled={!report.studentId || !report.period}>
                  Next: Subject Grades →
                </Button>
              </div>
            )}

            {/* Step 2 — Subject Grades */}
            {step === 2 && (
              <div className="space-y-4">
                <StudentBanner />
                <div className="p-4 border border-dashed border-border rounded-xl space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add Subject Grade</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Select value={currentSubject.subject} onValueChange={v => setCurrentSubject(prev => ({ ...prev, subject: v }))}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Subject" /></SelectTrigger>
                      <SelectContent>{SUBJECTS.filter(s => !report.subjects.find(rs => rs.subject === s)).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={currentSubject.grade} onValueChange={v => setCurrentSubject(prev => ({ ...prev, grade: v }))}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Grade" /></SelectTrigger>
                      <SelectContent>
                        {['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'U'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        {[1, 2, 3, 4, 5, 6].map(g => <SelectItem key={g} value={String(g)}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={currentSubject.effort} onValueChange={v => setCurrentSubject(prev => ({ ...prev, effort: v }))}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Effort" /></SelectTrigger>
                      <SelectContent>{effortOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button size="sm" onClick={addSubject} className="h-9 gap-1"><Plus className="w-3 h-3" />Add</Button>
                  </div>
                  <Input value={currentSubject.comment} onChange={e => setCurrentSubject(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Teacher comment for this subject (optional)" className="h-9" />
                </div>

                {report.subjects.length > 0 && (
                  <div className="space-y-1.5">
                    {report.subjects.map(s => {
                      const effort = effortOptions.find(o => o.value === s.effort);
                      return (
                        <Card key={s.subject} className="border">
                          <CardContent className="p-3 flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium">{s.subject}</span>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{s.grade}</Badge>
                                {effort && <Badge variant="outline" className={`text-[9px] ${effort.color}`}>{effort.label}</Badge>}
                              </div>
                              {s.comment && <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.comment}</p>}
                            </div>
                            <button onClick={() => removeSubject(s.subject)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Button>
                  <Button onClick={() => setStep(3)} className="flex-1">Next: Assessment →</Button>
                </div>
              </div>
            )}

            {/* Step 3 — Academic Assessment */}
            {step === 3 && (
              <div className="space-y-4">
                <StudentBanner />
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageSquare className="w-3 h-3 inline mr-1" />Overall Academic Comment *
                  </Label>
                  <Textarea value={report.overallComment} onChange={e => setReport(prev => ({ ...prev, overallComment: e.target.value }))}
                    placeholder="Summarise the student's academic performance across all subjects this term..." rows={3} className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Heart className="w-3 h-3 inline mr-1" />Behaviour & Attitude
                  </Label>
                  <Textarea value={report.behaviourComment} onChange={e => setReport(prev => ({ ...prev, behaviourComment: e.target.value }))}
                    placeholder="Comment on classroom behaviour, respect, participation, teamwork..." rows={2} className="resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Star className="w-3 h-3 inline mr-1" />Key Strengths
                    </Label>
                    <Textarea value={report.strengthsComment} onChange={e => setReport(prev => ({ ...prev, strengthsComment: e.target.value }))}
                      placeholder="Student's strongest areas..." rows={3} className="resize-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Target className="w-3 h-3 inline mr-1" />Areas to Improve
                    </Label>
                    <Textarea value={report.areasToImprove} onChange={e => setReport(prev => ({ ...prev, areasToImprove: e.target.value }))}
                      placeholder="Areas needing improvement..." rows={3} className="resize-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Award className="w-3 h-3 inline mr-1" />Goals for Next Period
                  </Label>
                  <Textarea value={report.goalsForNext} onChange={e => setReport(prev => ({ ...prev, goalsForNext: e.target.value }))}
                    placeholder="Specific goals and targets for the next term/semester..." rows={2} className="resize-none" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Back</Button>
                  <Button onClick={() => setStep(4)} className="flex-1">Next: Development →</Button>
                </div>
              </div>
            )}

            {/* Step 4 — Development & Skills */}
            {step === 4 && (
              <div className="space-y-4">
                <StudentBanner />
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Trophy className="w-3 h-3 inline mr-1" />Special Achievements & Awards
                  </Label>
                  <Textarea value={report.specialAchievements} onChange={e => setReport(prev => ({ ...prev, specialAchievements: e.target.value }))}
                    placeholder="Olympiad results, competition wins, certificates, notable projects..." rows={2} className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Users className="w-3 h-3 inline mr-1" />Extracurricular Activities
                  </Label>
                  <Textarea value={report.extracurriculars} onChange={e => setReport(prev => ({ ...prev, extracurriculars: e.target.value }))}
                    placeholder="Clubs, sports teams, school events, volunteer work..." rows={2} className="resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Smile className="w-3 h-3 inline mr-1" />Social & Emotional Development
                    </Label>
                    <Textarea value={report.socialEmotional} onChange={e => setReport(prev => ({ ...prev, socialEmotional: e.target.value }))}
                      placeholder="Peer relationships, emotional maturity, confidence..." rows={3} className="resize-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Shield className="w-3 h-3 inline mr-1" />Leadership & Responsibility
                    </Label>
                    <Textarea value={report.leadershipComment} onChange={e => setReport(prev => ({ ...prev, leadershipComment: e.target.value }))}
                      placeholder="Initiative, class duties, mentoring, reliability..." rows={3} className="resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Brain className="w-3 h-3 inline mr-1" />Homework Consistency
                    </Label>
                    <Select value={report.homeworkConsistency} onValueChange={v => setReport(prev => ({ ...prev, homeworkConsistency: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent — always on time</SelectItem>
                        <SelectItem value="good">Good — mostly on time</SelectItem>
                        <SelectItem value="inconsistent">Inconsistent — needs reminders</SelectItem>
                        <SelectItem value="poor">Poor — frequently missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <GraduationCap className="w-3 h-3 inline mr-1" />Exam Readiness
                    </Label>
                    <Select value={report.examReadiness} onValueChange={v => setReport(prev => ({ ...prev, examReadiness: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="well_prepared">Well Prepared</SelectItem>
                        <SelectItem value="on_track">On Track</SelectItem>
                        <SelectItem value="needs_support">Needs Support</SelectItem>
                        <SelectItem value="at_risk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Lightbulb className="w-3 h-3 inline mr-1" />Teacher Recommendations
                  </Label>
                  <Textarea value={report.teacherRecommendations} onChange={e => setReport(prev => ({ ...prev, teacherRecommendations: e.target.value }))}
                    placeholder="Personalised suggestions: tutoring, enrichment, study strategies, course selection advice..." rows={2} className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Users className="w-3 h-3 inline mr-1" />Guidance for Parents
                  </Label>
                  <Textarea value={report.parentGuidance} onChange={e => setReport(prev => ({ ...prev, parentGuidance: e.target.value }))}
                    placeholder="How parents can support at home: study habits, reading, emotional support..." rows={2} className="resize-none" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">← Back</Button>
                  <Button onClick={() => setStep(5)} className="flex-1">Next: Review →</Button>
                </div>
              </div>
            )}

            {/* Step 5 — Review & Submit */}
            {step === 5 && (
              <div className="space-y-4">
                <StudentBanner />

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="w-4 h-4 text-primary" /> Report Summary
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-background rounded-lg p-2.5 text-center border">
                        <p className="text-lg font-bold text-primary">{report.subjects.length}</p>
                        <p className="text-muted-foreground">Subjects</p>
                      </div>
                      <div className="bg-background rounded-lg p-2.5 text-center border">
                        <div className={`flex items-center justify-center gap-1 text-sm font-bold ${trendConfig[report.overallTrend].color}`}>
                          {trendConfig[report.overallTrend].icon}
                          {trendConfig[report.overallTrend].label}
                        </div>
                        <p className="text-muted-foreground">Trend</p>
                      </div>
                      <div className="bg-background rounded-lg p-2.5 text-center border">
                        <p className="text-sm font-bold">{report.period}</p>
                        <p className="text-muted-foreground">{report.academicYear}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {report.subjects.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      <BookOpen className="w-3 h-3 inline mr-1" />Subject Grades
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {report.subjects.map(s => (
                        <div key={s.subject} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border text-xs">
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">{s.grade}</Badge>
                          <span className="font-medium">{s.subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filled sections summary */}
                <div className="space-y-2">
                  {[
                    { label: 'Academic Comment', value: report.overallComment, icon: <MessageSquare className="w-3 h-3" /> },
                    { label: 'Behaviour', value: report.behaviourComment, icon: <Heart className="w-3 h-3" /> },
                    { label: 'Strengths', value: report.strengthsComment, icon: <Star className="w-3 h-3" /> },
                    { label: 'Areas to Improve', value: report.areasToImprove, icon: <Target className="w-3 h-3" /> },
                    { label: 'Goals', value: report.goalsForNext, icon: <Award className="w-3 h-3" /> },
                    { label: 'Achievements', value: report.specialAchievements, icon: <Trophy className="w-3 h-3" /> },
                    { label: 'Extracurriculars', value: report.extracurriculars, icon: <Users className="w-3 h-3" /> },
                    { label: 'Social-Emotional', value: report.socialEmotional, icon: <Smile className="w-3 h-3" /> },
                    { label: 'Recommendations', value: report.teacherRecommendations, icon: <Lightbulb className="w-3 h-3" /> },
                    { label: 'Parent Guidance', value: report.parentGuidance, icon: <Users className="w-3 h-3" /> },
                  ].filter(s => s.value).map(section => (
                    <div key={section.label} className="p-2.5 rounded-lg border bg-muted/20">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1 mb-1">
                        {section.icon} {section.label}
                      </p>
                      <p className="text-xs text-foreground line-clamp-2">{section.value}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </ScrollArea>

        {/* Fixed bottom buttons for step 5 */}
        {step === 5 && (
          <div className="px-6 pb-6 pt-2 border-t flex gap-2">
            <Button variant="outline" onClick={() => setStep(4)} className="flex-1">← Back</Button>
            <Button onClick={handleSubmit} className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold gap-2">
              <CheckCircle className="w-4 h-4" />Submit Final Report
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
