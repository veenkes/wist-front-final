import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Shield, ShieldAlert, ShieldX, Clock, MapPin, User,
  FileText, Camera, MessageSquare, CheckCircle2, XCircle, Filter,
  ChevronDown, ChevronUp, Eye, Calendar, BookOpen, AlertCircle,
  Paperclip, ThumbsDown, ThumbsUp, Scale, Megaphone, PenLine
} from 'lucide-react';
import { format, subDays, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ViolationsTabProps {
  violations: any[];
}

interface Violation {
  id: string;
  category: string;
  violation_type: string;
  severity: 'minor' | 'low' | 'medium' | 'major' | 'critical';
  description: string;
  detailed_description: string;
  occurred_at: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  corrective_action: string | null;
  location: string;
  reported_by: string;
  reporter_role: string;
  witnesses: string[];
  student_statement: string | null;
  parent_notified: boolean;
  parent_response: string | null;
  attachments: Array<{ type: 'photo' | 'document' | 'video'; name: string; url: string }>;
  related_lesson: { subject: string; teacher: string; time: string; classroom: string } | null;
  follow_up_date: string | null;
  resolution_notes: string | null;
  is_complaint: boolean;
  tags: string[];
}

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  minor: { label: 'C1 — Remark', color: 'text-muted-foreground', bg: 'bg-muted', icon: <MessageSquare className="w-4 h-4" /> },
  low: { label: 'C2 — Minor', color: 'text-blue-600', bg: 'bg-blue-500/10', icon: <AlertCircle className="w-4 h-4" /> },
  medium: { label: 'C3 — Moderate', color: 'text-warning', bg: 'bg-warning/10', icon: <AlertTriangle className="w-4 h-4" /> },
  major: { label: 'C4 — Major', color: 'text-orange-600', bg: 'bg-orange-500/10', icon: <ShieldAlert className="w-4 h-4" /> },
  critical: { label: 'C5 — Critical', color: 'text-destructive', bg: 'bg-destructive/10', icon: <ShieldX className="w-4 h-4" /> },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: 'Open', color: 'bg-destructive/10 text-destructive', icon: <XCircle className="w-3.5 h-3.5" /> },
  under_review: { label: 'Under Review', color: 'bg-warning/10 text-warning', icon: <Clock className="w-3.5 h-3.5" /> },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  dismissed: { label: 'Dismissed', color: 'bg-muted text-muted-foreground', icon: <ThumbsDown className="w-3.5 h-3.5" /> },
};

const now = new Date();

const generateMockViolations = (): Violation[] => [
  {
    id: 'v1', category: 'complaint', violation_type: 'Property damage', severity: 'major',
    description: 'Damaged desk in chemistry lab — carved inscriptions on the surface',
    detailed_description: 'During chemistry class, the student was observed carving inscriptions on desk #7 using a compass. Damage covers approximately 15x10 cm. The desk requires surface replacement. Repair cost estimated at 200,000 UZS.',
    occurred_at: subDays(now, 3).toISOString(), status: 'under_review',
    corrective_action: 'Parents called in to discuss damage compensation. Temporary suspension from lab work.',
    location: 'Chemistry Lab (Room 305)', reported_by: 'Abdullaeva Nigora R.', reporter_role: 'Chemistry Teacher',
    witnesses: ['Petrova Maria (8A)', 'Sidorov Dmitry (8A)'],
    student_statement: 'I accidentally scratched the desk while drawing. I didn\'t mean to damage it.',
    parent_notified: true, parent_response: 'Parents agreed to compensate. Will have a talk at home.',
    attachments: [
      { type: 'photo', name: 'Desk damage photo.jpg', url: '#' },
      { type: 'photo', name: 'Desk overview.jpg', url: '#' },
      { type: 'document', name: 'Property damage report.pdf', url: '#' },
    ],
    related_lesson: { subject: 'Chemistry', teacher: 'Abdullaeva N.R.', time: '10:30 – 11:15', classroom: 'Room 305' },
    follow_up_date: subDays(now, -4).toISOString(), resolution_notes: null, is_complaint: true,
    tags: ['property', 'compensation', 'lab'],
  },
  {
    id: 'v2', category: 'complaint', violation_type: 'Physical aggression', severity: 'critical',
    description: 'Fight with classmate during break — pushed student who fell and got bruised',
    detailed_description: 'During the main break in the 2nd floor corridor, a conflict occurred between students. According to witnesses, the conflict started from a dispute on the sports ground. The student pushed Novikov Andrew, who fell and hit his elbow on the wall. The nurse recorded a soft tissue bruise on the left elbow. Both students were brought to the principal.',
    occurred_at: subWeeks(now, 1).toISOString(), status: 'resolved',
    corrective_action: 'Temporary suspension for 3 days. Mandatory school psychologist sessions (3). Written apology to the injured student.',
    location: '2nd floor corridor', reported_by: 'Karimov Bakhtiyor O.', reporter_role: 'Duty Teacher',
    witnesses: ['Morozova Elena (8A)', 'Vasiliev Nikita (8A)', 'Pavlova Sofia (5B)'],
    student_statement: 'He started calling me names first. I didn\'t mean to push him hard, I just got angry.',
    parent_notified: true, parent_response: 'Parents had a serious talk. Student wrote an apology letter. Agreed to psychologist sessions.',
    attachments: [
      { type: 'photo', name: 'Incident location photo.jpg', url: '#' },
      { type: 'document', name: 'Medical report — Novikov.pdf', url: '#' },
      { type: 'document', name: 'Student explanation letter.pdf', url: '#' },
      { type: 'document', name: 'Disciplinary committee minutes.pdf', url: '#' },
    ],
    related_lesson: null, follow_up_date: null,
    resolution_notes: 'Conflict resolved. Student completed 3 psychologist sessions. Wrote an apology letter. No repeat incidents recorded. Case closed 10.01.2025.',
    is_complaint: true, tags: ['aggression', 'fight', 'injury', 'psychologist'],
  },
  {
    id: 'v3', category: 'remark', violation_type: 'Systematic tardiness', severity: 'low',
    description: 'Late for first lesson 4 times in the last 2 weeks',
    detailed_description: 'Student is systematically late for the first lesson (8:30). Recorded tardiness: 15.01 — 12 min, 17.01 — 8 min, 22.01 — 15 min, 24.01 — 5 min. Student says the reason is "traffic". Class tutor held a meeting.',
    occurred_at: subDays(now, 5).toISOString(), status: 'open',
    corrective_action: null, location: 'School entrance / Room 201',
    reported_by: 'Tashmatova Gulnora Sh.', reporter_role: 'Class Tutor',
    witnesses: [], student_statement: 'We live far away, there\'s always traffic in the morning. Mum can\'t leave earlier because of work.',
    parent_notified: true, parent_response: null,
    attachments: [{ type: 'document', name: 'Tardiness log extract.pdf', url: '#' }],
    related_lesson: { subject: 'Mathematics', teacher: 'Tashmatova G.Sh.', time: '08:30 – 09:15', classroom: 'Room 201' },
    follow_up_date: subDays(now, -2).toISOString(), resolution_notes: null, is_complaint: false,
    tags: ['tardiness', 'systematic'],
  },
  {
    id: 'v4', category: 'remark', violation_type: 'Phone usage', severity: 'minor',
    description: 'Playing on phone during history lesson',
    detailed_description: 'Student was caught using mobile phone during history class. Was playing a game and not participating in discussion. Phone confiscated until end of school day and given to class tutor.',
    occurred_at: subDays(now, 10).toISOString(), status: 'resolved',
    corrective_action: 'Verbal warning. Phone returned at end of day.',
    location: 'Room 408 (History)', reported_by: 'Rakhimov Alisher F.', reporter_role: 'History Teacher',
    witnesses: [], student_statement: null, parent_notified: false, parent_response: null, attachments: [],
    related_lesson: { subject: 'History', teacher: 'Rakhimov A.F.', time: '11:30 – 12:15', classroom: 'Room 408' },
    follow_up_date: null, resolution_notes: 'Remark logged. No repeat incidents.',
    is_complaint: false, tags: ['phone', 'discipline'],
  },
  {
    id: 'v5', category: 'complaint', violation_type: 'Dress code violation', severity: 'medium',
    description: 'Repeated uniform violations — 3 warnings issued',
    detailed_description: 'Student systematically violates school dress code. 1) 10.01 — jeans instead of school trousers. 2) 15.01 — bright non-regulation hoodie. 3) 20.01 — trainers instead of formal shoes. After three warnings, case referred to class tutor for official parent notification.',
    occurred_at: subDays(now, 8).toISOString(), status: 'under_review',
    corrective_action: 'Written notice to parents. Meeting with class tutor scheduled for next week.',
    location: 'School grounds', reported_by: 'Tashmatova Gulnora Sh.', reporter_role: 'Class Tutor',
    witnesses: ['Gate duty staff'], student_statement: 'My uniform tore, mum hasn\'t bought a new one yet.',
    parent_notified: true, parent_response: 'Mother promised to purchase new uniform by end of the week.',
    attachments: [
      { type: 'photo', name: 'Violation 10.01.jpg', url: '#' },
      { type: 'photo', name: 'Violation 15.01.jpg', url: '#' },
      { type: 'photo', name: 'Violation 20.01.jpg', url: '#' },
    ],
    related_lesson: null, follow_up_date: subDays(now, -1).toISOString(), resolution_notes: null,
    is_complaint: true, tags: ['dress code', 'uniform', 'appearance'],
  },
  {
    id: 'v6', category: 'remark', violation_type: 'Classroom disruption', severity: 'low',
    description: 'Talking and disrupting mathematics lesson',
    detailed_description: 'During maths class, student was talking loudly with desk neighbour, laughing and distracting other students. After two verbal warnings, continued to disrupt. Was moved to a separate desk.',
    occurred_at: subDays(now, 14).toISOString(), status: 'resolved',
    corrective_action: 'Moved to separate desk. Verbal warning.',
    location: 'Room 201 (Mathematics)', reported_by: 'Tashmatova Gulnora Sh.', reporter_role: 'Mathematics Teacher',
    witnesses: [], student_statement: null, parent_notified: false, parent_response: null, attachments: [],
    related_lesson: { subject: 'Mathematics', teacher: 'Tashmatova G.Sh.', time: '09:25 – 10:10', classroom: 'Room 201' },
    follow_up_date: null, resolution_notes: 'Behaviour improved after desk change.',
    is_complaint: false, tags: ['discipline', 'lesson'],
  },
];

export const ViolationsTab: React.FC<ViolationsTabProps> = ({ violations: propViolations }) => {
  const navigate = useNavigate();
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const mockViolations = useMemo(() => generateMockViolations(), []);
  const allViolations = mockViolations;

  const filtered = useMemo(() => {
    return allViolations.filter(v => {
      if (filterSeverity !== 'all' && v.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && v.status !== filterStatus) return false;
      if (filterType !== 'all' && v.category !== filterType) return false;
      return true;
    });
  }, [allViolations, filterSeverity, filterStatus, filterType]);

  const stats = useMemo(() => {
    const total = allViolations.length;
    const open = allViolations.filter(v => v.status === 'open' || v.status === 'under_review').length;
    const resolved = allViolations.filter(v => v.status === 'resolved').length;
    const complaints = allViolations.filter(v => v.is_complaint).length;
    const remarks = total - complaints;
    const bySeverity = Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => ({
      key, label: cfg.label, count: allViolations.filter(v => v.severity === key).length, ...cfg,
    }));
    return { total, open, resolved, complaints, remarks, bySeverity };
  }, [allViolations]);

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4 text-center border-l-4 border-l-destructive/60">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-warning/60">
          <p className="text-2xl font-bold text-warning">{stats.open}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-success/60">
          <p className="text-2xl font-bold text-success">{stats.resolved}</p>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-orange-400">
          <p className="text-2xl font-bold">{stats.complaints}</p>
          <p className="text-xs text-muted-foreground">Complaints</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-blue-400">
          <p className="text-2xl font-bold">{stats.remarks}</p>
          <p className="text-xs text-muted-foreground">Remarks</p>
        </Card>
      </div>

      {/* Severity breakdown */}
      <Card className="p-4">
        <p className="text-sm font-medium mb-3">Incident Categories</p>
        <div className="flex flex-wrap gap-2">
          {stats.bySeverity.map(s => (
            <button
              key={s.key}
              onClick={() => setFilterSeverity(filterSeverity === s.key ? 'all' : s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterSeverity === s.key ? `${s.bg} ${s.color} ring-2 ring-offset-1 ring-current` : `${s.bg} ${s.color} hover:ring-1 hover:ring-current`
              }`}
            >
              {s.icon}
              {s.label}: {s.count}
            </button>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          Filters
          {showFilters ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
        </Button>

        <Tabs value={filterType} onValueChange={setFilterType} className="ml-auto">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-3 h-7">All</TabsTrigger>
            <TabsTrigger value="complaint" className="text-xs px-3 h-7">
              <Megaphone className="w-3 h-3 mr-1" /> Complaints
            </TabsTrigger>
            <TabsTrigger value="remark" className="text-xs px-3 h-7">
              <PenLine className="w-3 h-3 mr-1" /> Remarks
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Status</p>
              <div className="flex gap-1.5">
                {['all', ...Object.keys(STATUS_CONFIG)].map(key => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      filterStatus === key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {key === 'all' ? 'All' : STATUS_CONFIG[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Violations List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <Shield className="w-12 h-12 text-success mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">No incidents found</h3>
            <p className="text-sm text-muted-foreground">No results match the selected filters</p>
          </Card>
        ) : (
          filtered.map(v => {
            const sev = SEVERITY_CONFIG[v.severity];
            const stat = STATUS_CONFIG[v.status];
            const expanded = expandedCards.has(v.id);

            return (
              <Card key={v.id} className={`overflow-hidden border-l-4 ${
                v.severity === 'critical' ? 'border-l-destructive' :
                v.severity === 'major' ? 'border-l-orange-500' :
                v.severity === 'medium' ? 'border-l-warning' :
                v.severity === 'low' ? 'border-l-blue-500' :
                'border-l-muted-foreground/30'
              }`}>
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${sev.bg}`}>
                        <span className={sev.color}>{sev.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm">{v.violation_type}</h4>
                          <Badge variant="outline" className={`text-[10px] ${sev.color}`}>{sev.label}</Badge>
                          {v.is_complaint && (
                          <Badge className="bg-orange-500/10 text-orange-600 text-[10px]">
                              <Megaphone className="w-2.5 h-2.5 mr-1" /> Complaint
                          </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`${stat.color} text-[10px] flex items-center gap-1`}>
                        {stat.icon} {stat.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(v.occurred_at), 'dd MMM yyyy, HH:mm')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {v.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {v.reported_by}
                    </span>
                    {v.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        {v.attachments.length} file(s)
                      </span>
                    )}
                    {v.parent_notified && (
                      <Badge variant="outline" className="text-[10px] text-success border-success/30">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Parents notified
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  {v.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {v.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-muted rounded-full text-[10px] text-muted-foreground">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Expand / Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleExpand(v.id)}>
                      {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                      {expanded ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSelectedViolation(v)}>
                      <Eye className="w-3 h-3 mr-1" /> Details
                    </Button>
                    {v.related_lesson && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={() => navigate('/schedule')}>
                        <BookOpen className="w-3 h-3 mr-1" /> Schedule
                      </Button>
                    )}
                  </div>

                  {/* Expanded content */}
                  {expanded && (
                    <div className="mt-3 pt-3 border-t space-y-3">
                      {v.corrective_action && (
                        <div className="p-3 bg-warning/5 rounded-lg border border-warning/10">
                          <p className="text-xs font-semibold flex items-center gap-1.5 text-warning mb-1">
                             <Scale className="w-3.5 h-3.5" /> Corrective Actions
                          </p>
                          <p className="text-xs text-muted-foreground">{v.corrective_action}</p>
                        </div>
                      )}
                      {v.student_statement && (
                        <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <p className="text-xs font-semibold flex items-center gap-1.5 text-blue-600 mb-1">
                             <MessageSquare className="w-3.5 h-3.5" /> Student Statement
                          </p>
                          <p className="text-xs text-muted-foreground italic">"{v.student_statement}"</p>
                        </div>
                      )}
                      {v.attachments.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                            <Paperclip className="w-3.5 h-3.5" /> Evidence ({v.attachments.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {v.attachments.map((att, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-xs">
                                {att.type === 'photo' ? <Camera className="w-3.5 h-3.5 text-primary" /> : <FileText className="w-3.5 h-3.5 text-primary" />}
                                <span className="truncate max-w-[180px]">{att.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              Incident Details
            </DialogTitle>
          </DialogHeader>
          {selectedViolation && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <DetailContent violation={selectedViolation} navigate={navigate} />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DetailContent: React.FC<{ violation: Violation; navigate: any }> = ({ violation: v, navigate }) => {
  const sev = SEVERITY_CONFIG[v.severity];
  const stat = STATUS_CONFIG[v.status];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge className={`${sev.bg} ${sev.color} text-xs`}>{sev.label}</Badge>
        <Badge className={`${stat.color} text-xs flex items-center gap-1`}>{stat.icon} {stat.label}</Badge>
        {v.is_complaint && <Badge className="bg-orange-500/10 text-orange-600 text-xs"><Megaphone className="w-3 h-3 mr-1" /> Complaint</Badge>}
      </div>

      <div>
        <h3 className="font-bold text-lg">{v.violation_type}</h3>
        <p className="text-sm text-muted-foreground mt-1">{v.detailed_description}</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
         <InfoBlock icon={<Calendar className="w-4 h-4" />} label="Date & Time" value={format(new Date(v.occurred_at), 'dd MMMM yyyy, HH:mm')} />
         <InfoBlock icon={<MapPin className="w-4 h-4" />} label="Location" value={v.location} />
         <InfoBlock icon={<User className="w-4 h-4" />} label="Reported by" value={`${v.reported_by} (${v.reporter_role})`} />
         {v.follow_up_date && <InfoBlock icon={<Clock className="w-4 h-4" />} label="Follow-up by" value={format(new Date(v.follow_up_date), 'dd.MM.yyyy')} />}
      </div>

      {/* Related lesson */}
      {v.related_lesson && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
             <BookOpen className="w-3.5 h-3.5 text-primary" /> Related Lesson
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span><strong>Subject:</strong> {v.related_lesson.subject}</span>
            <span><strong>Teacher:</strong> {v.related_lesson.teacher}</span>
            <span><strong>Time:</strong> {v.related_lesson.time}</span>
            <span><strong>Room:</strong> {v.related_lesson.classroom}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs mt-2" onClick={() => navigate('/schedule')}>
            <BookOpen className="w-3 h-3 mr-1" /> Open in Schedule
          </Button>
        </div>
      )}

      {/* Witnesses */}
      {v.witnesses.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Witnesses ({v.witnesses.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {v.witnesses.map((w, i) => (
              <Badge key={i} variant="outline" className="text-xs">{w}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Student statement */}
      {v.student_statement && (
        <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
          <p className="text-xs font-semibold flex items-center gap-1.5 text-blue-600 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Student Statement
          </p>
          <p className="text-sm italic text-muted-foreground">"{v.student_statement}"</p>
        </div>
      )}

      {/* Corrective action */}
      {v.corrective_action && (
        <div className="p-3 bg-warning/5 rounded-lg border border-warning/10">
          <p className="text-xs font-semibold flex items-center gap-1.5 text-warning mb-1.5">
            <Scale className="w-3.5 h-3.5" /> Corrective Actions
          </p>
          <p className="text-sm text-muted-foreground">{v.corrective_action}</p>
        </div>
      )}

      {/* Parent notification */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs font-semibold flex items-center gap-1.5 mb-1.5">
           {v.parent_notified ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-destructive" />}
           Parent Notification
        </p>
        <p className="text-sm text-muted-foreground">
           {v.parent_notified ? 'Parents have been notified' : 'Parents have not been notified'}
        </p>
        {v.parent_response && (
          <div className="mt-2 p-2 bg-background rounded border">
            <p className="text-xs font-medium mb-0.5">Parent response:</p>
            <p className="text-xs text-muted-foreground">{v.parent_response}</p>
          </div>
        )}
      </div>

      {/* Attachments */}
      {v.attachments.length > 0 && (
        <div>
          <p className="text-xs font-semibold flex items-center gap-1.5 mb-2">
            <Paperclip className="w-3.5 h-3.5" /> Evidence & Files ({v.attachments.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {v.attachments.map((att, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="p-2 bg-background rounded-lg">
                  {att.type === 'photo' ? <Camera className="w-4 h-4 text-primary" /> : att.type === 'video' ? <Eye className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{att.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{att.type === 'photo' ? 'Photo' : att.type === 'video' ? 'Video' : 'Document'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution */}
      {v.resolution_notes && (
        <div className="p-3 bg-success/5 rounded-lg border border-success/10">
          <p className="text-xs font-semibold flex items-center gap-1.5 text-success mb-1.5">
            <ThumbsUp className="w-3.5 h-3.5" /> Resolution
          </p>
          <p className="text-sm text-muted-foreground">{v.resolution_notes}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        {v.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-muted rounded-full text-[10px] text-muted-foreground">#{tag}</span>
        ))}
      </div>
    </div>
  );
};

const InfoBlock: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
    <span className="text-muted-foreground mt-0.5">{icon}</span>
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-medium">{value}</p>
    </div>
  </div>
);
