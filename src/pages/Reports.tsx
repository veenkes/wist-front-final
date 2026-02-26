import React, { useState, useMemo } from 'react';
import { Plus, Search, User, BookOpen, MessageSquare, ThumbsUp, Award, Heart, Sparkles, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FinalReportModal } from '@/components/modals/FinalReportModal';

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

type ReportType = 'praise' | 'recommendation' | 'behavior' | 'achievement';

interface Report {
  id: string;
  studentId: string;
  studentName: string;
  studentGroup: string;
  type: ReportType;
  subject: string;
  title: string;
  content: string;
  date: string;
  author: string;
  term: string;
}

const reportTypeConfig: Record<ReportType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  praise: { label: 'Praise', icon: <ThumbsUp className="w-4 h-4" />, color: 'text-success', bgColor: 'bg-success/10 border-success/20' },
  recommendation: { label: 'Recommendation', icon: <BookOpen className="w-4 h-4" />, color: 'text-primary', bgColor: 'bg-primary/10 border-primary/20' },
  behavior: { label: 'Behaviour', icon: <Heart className="w-4 h-4" />, color: 'text-pink-500', bgColor: 'bg-pink-500/10 border-pink-500/20' },
  achievement: { label: 'Achievement', icon: <Award className="w-4 h-4" />, color: 'text-warning', bgColor: 'bg-warning/10 border-warning/20' },
};

const mockReports: Report[] = [
  { id: '1', studentId: '1', studentName: 'Ivanov Alex', studentGroup: 'Group 8A', type: 'praise', subject: 'Mathematics', title: 'Excellent classwork performance',
    content: 'Alex demonstrated outstanding understanding of trigonometry. Solved all advanced problems independently and helped classmates. Recommended for the maths olympiad.',
    date: '2025-01-15', author: 'Smirnova E.I.', term: 'Term 3' },
  { id: '2', studentId: '2', studentName: 'Petrova Maria', studentGroup: 'Group 8A', type: 'recommendation', subject: 'Physics', title: 'Improvement recommendations',
    content: 'Maria absorbs theoretical material well but struggles with practical problem-solving. Additional practice sessions for lab work and calculations are recommended.',
    date: '2025-01-14', author: 'Kuznetsov A.P.', term: 'Term 3' },
  { id: '3', studentId: '3', studentName: 'Sidorov Dmitry', studentGroup: 'Group 8A', type: 'behavior', subject: 'General', title: 'Positive behaviour trend',
    content: 'Dmitry has significantly improved his classroom behaviour. He is more attentive, no longer distracts classmates, and actively participates in discussions. Shows leadership qualities.',
    date: '2025-01-13', author: 'Popova M.V.', term: 'Term 3' },
  { id: '4', studentId: '4', studentName: 'Kozlova Anna', studentGroup: 'Group 8A', type: 'achievement', subject: 'English', title: 'Essay competition winner',
    content: 'Anna won 1st place in the regional essay competition on the topic "My Future Profession". Demonstrated excellent grammar and rich vocabulary.',
    date: '2025-01-12', author: 'Ivanova N.S.', term: 'Term 3' },
  { id: '5', studentId: '5', studentName: 'Novikov Andrew', studentGroup: 'Group 5B', type: 'praise', subject: 'History', title: 'Creative project approach',
    content: 'Andrew prepared a brilliant presentation on Ancient Egypt. Used additional sources and created a pyramid model. The work deserves the highest mark.',
    date: '2025-01-11', author: 'Lebedev D.A.', term: 'Term 3' },
  { id: '6', studentId: '6', studentName: 'Morozova Elena', studentGroup: 'Group 5B', type: 'recommendation', subject: 'Mathematics', title: 'Working on mistakes',
    content: 'Elena makes typical errors when working with fractions. Additional practice with visual materials is recommended. Conceptual understanding is good, needs more practice.',
    date: '2025-01-10', author: 'Smirnova E.I.', term: 'Term 3' },
  { id: '7', studentId: '1', studentName: 'Ivanov Alex', studentGroup: 'Group 8A', type: 'achievement', subject: 'Physics', title: 'Science conference participation',
    content: 'Alex successfully presented at the school science conference with a project on renewable energy. Received a diploma for best presentation.',
    date: '2025-01-09', author: 'Kuznetsov A.P.', term: 'Term 3' },
];

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState({ studentId: '', type: 'praise' as ReportType, subject: '', title: '', content: '' });
  const [isFinalReportOpen, setIsFinalReportOpen] = useState(false);

  const groups = ['Group 8A', 'Group 5B', 'Group 10A'];

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = groupFilter === 'all' || r.studentGroup === groupFilter;
      const matchesSubject = subjectFilter === 'all' || r.subject === subjectFilter;
      const matchesTab = activeTab === 'all' || r.type === activeTab;
      return matchesSearch && matchesGroup && matchesSubject && matchesTab;
    });
  }, [reports, searchQuery, groupFilter, subjectFilter, activeTab]);

  const stats = useMemo(() => ({
    total: reports.length,
    praise: reports.filter(r => r.type === 'praise').length,
    recommendation: reports.filter(r => r.type === 'recommendation').length,
    behavior: reports.filter(r => r.type === 'behavior').length,
    achievement: reports.filter(r => r.type === 'achievement').length,
  }), [reports]);

  const handleAddReport = () => {
    if (!newReport.studentId || !newReport.title || !newReport.content || !newReport.subject) { toast.error('Please fill in all required fields'); return; }
    const student = MOCK_STUDENTS.find(s => s.id === newReport.studentId);
    if (!student) return;
    const report: Report = {
      id: Date.now().toString(), studentId: newReport.studentId, studentName: student.name, studentGroup: student.group,
      type: newReport.type, subject: newReport.subject, title: newReport.title, content: newReport.content,
      date: new Date().toISOString().split('T')[0], author: 'Current Teacher', term: 'Term 3',
    };
    setReports(prev => [report, ...prev]);
    setNewReport({ studentId: '', type: 'praise', subject: '', title: '', content: '' });
    setIsAddDialogOpen(false);
    toast.success('Report added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-success to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-success" />
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">Praise, recommendations, achievements & behaviour tracking</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsFinalReportOpen(true)} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10 shadow-sm">
            <FileText className="w-4 h-4" />Final Reports
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-success hover:bg-success/90 text-success-foreground gap-2 shadow-md">
            <Plus className="w-4 h-4" />New Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="border-l-4 border-l-foreground">
          <CardContent className="p-3"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold mt-0.5">{stats.total}</p></CardContent>
        </Card>
        {(Object.keys(reportTypeConfig) as ReportType[]).map(type => {
          const config = reportTypeConfig[type];
          const borderColor = type === 'praise' ? 'border-l-success' : type === 'recommendation' ? 'border-l-primary' : type === 'behavior' ? 'border-l-pink-500' : 'border-l-warning';
          return (
            <Card key={type} className={`border-l-4 ${borderColor}`}>
              <CardContent className="p-3"><p className="text-xs text-muted-foreground">{config.label}</p><p className={`text-2xl font-bold mt-0.5 ${config.color}`}>{stats[type]}</p></CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="praise" className="text-xs gap-1"><ThumbsUp className="w-3 h-3" />Praise</TabsTrigger>
          <TabsTrigger value="recommendation" className="text-xs gap-1"><BookOpen className="w-3 h-3" />Advice</TabsTrigger>
          <TabsTrigger value="behavior" className="text-xs gap-1"><Heart className="w-3 h-3" />Behaviour</TabsTrigger>
          <TabsTrigger value="achievement" className="text-xs gap-1"><Award className="w-3 h-3" />Achievements</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by student, topic..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Group" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Groups</SelectItem>{groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="General">General</SelectItem>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <Card><CardContent className="p-12 text-center"><Sparkles className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No reports found</p></CardContent></Card>
            ) : filteredReports.map(report => {
              const config = reportTypeConfig[report.type];
              return (
                <Card key={report.id} className={`border cursor-pointer hover:shadow-md transition-all duration-200 ${config.bgColor}`} onClick={() => setSelectedReport(report)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor} ${config.color}`}>{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] ${config.color} border-current/20`}>{config.label}</Badge>
                          <Badge variant="outline" className="text-[10px]">{report.subject}</Badge>
                          <span className="text-[10px] text-muted-foreground ml-auto">{format(new Date(report.date), 'dd MMM yyyy')}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{report.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{report.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{report.studentName}</span>
                          <span>{report.studentGroup}</span>
                          <span className="ml-auto">By: {report.author}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => { if (!open) setSelectedReport(null); }}>
        <DialogContent className="max-w-lg">
          {selectedReport && (() => {
            const config = reportTypeConfig[selectedReport.type];
            return (<>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgColor} ${config.color}`}>{config.icon}</div>
                  {selectedReport.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${config.bgColor} ${config.color} border`}>{config.label}</Badge>
                  <Badge variant="outline">{selectedReport.subject}</Badge>
                  <Badge variant="outline">{selectedReport.term}</Badge>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Student</span><span className="font-semibold">{selectedReport.studentName}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Group</span><span>{selectedReport.studentGroup}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Date</span><span>{format(new Date(selectedReport.date), 'dd MMM yyyy')}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Author</span><span>{selectedReport.author}</span></div>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block"><MessageSquare className="w-3 h-3 inline mr-1" />Content</Label>
                  <p className="text-sm leading-relaxed">{selectedReport.content}</p>
                </div>
              </div>
            </>);
          })()}
        </DialogContent>
      </Dialog>

      {/* Add Report Modal */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center"><Plus className="w-4 h-4 text-success" /></div>
              New Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Report Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(reportTypeConfig) as ReportType[]).map(type => {
                  const config = reportTypeConfig[type];
                  return (
                    <button key={type} onClick={() => setNewReport(prev => ({ ...prev, type }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        newReport.type === type ? `${config.bgColor} ${config.color} font-medium ring-2 ring-current/20` : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                      }`}>{config.icon}<span>{config.label}</span></button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Student *</Label>
              <Select value={newReport.studentId} onValueChange={v => setNewReport(prev => ({ ...prev, studentId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{MOCK_STUDENTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — {s.group}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={newReport.subject} onValueChange={v => setNewReport(prev => ({ ...prev, subject: v }))}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent><SelectItem value="General">General</SelectItem>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={newReport.title} onChange={e => setNewReport(prev => ({ ...prev, title: e.target.value }))} placeholder="Brief description..." />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea value={newReport.content} onChange={e => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                placeholder={newReport.type === 'praise' ? 'Describe what the student did well...' : newReport.type === 'recommendation' ? 'Write subject recommendations...' : newReport.type === 'behavior' ? "Describe the student's behaviour..." : "Describe the student's achievement..."}
                rows={4} className="resize-none" />
            </div>
            <Button onClick={handleAddReport} className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold h-11">
              <Plus className="w-4 h-4 mr-2" />Add Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FinalReportModal open={isFinalReportOpen} onOpenChange={setIsFinalReportOpen} />
    </div>
  );
};

export default Reports;
