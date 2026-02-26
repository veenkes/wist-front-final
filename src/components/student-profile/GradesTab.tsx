import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, TrendingUp, BookOpen, FileText, FlaskConical, PenLine, Calendar, Clock, User, MessageSquare, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface GradesTabProps {
  studentId: string;
}

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'History', 'Biology', 'Geography', 'Literature'];
const QUARTERS = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
const GRADE_TYPES = ['all', 'lesson', 'test', 'homework', 'lab'] as const;
type GradeType = typeof GRADE_TYPES[number];

const TEACHERS: Record<string, string> = {
  'Mathematics': 'Akhmedov Rustam',
  'English': 'Nazarova Dilnoza',
  'Physics': 'Khamidov Bobur',
  'Chemistry': 'Yuldashev Anvar',
  'History': 'Toshmatov Ulugbek',
  'Biology': 'Rahimova Gulshan',
  'Geography': 'Karimov Sardor',
  'Literature': 'Karimova Nilufar',
};

const TOPICS: Record<string, string[]> = {
  'Mathematics': ['Quadratic equations', 'Linear systems', 'Functions & graphs', 'Pythagorean theorem', 'Fractions & ratios', 'Area of shapes', 'Trigonometry', 'Probability'],
  'English': ['Present Perfect', 'Conditional sentences', 'Passive Voice', 'Reported Speech', 'Modal Verbs', 'Essay Writing'],
  'Physics': ["Ohm's law", 'Mechanical energy', 'Wave optics', 'Electromagnetic induction', 'Kinematics', 'Dynamics'],
  'Chemistry': ['Acids & bases', 'Organic chemistry', 'Chemical reactions', 'Periodic table', 'Solutions'],
  'History': ['Great Reforms', 'World War I', 'Middle Ages', 'Renaissance', 'Industrial Revolution'],
  'Biology': ['Cell structure', 'Genetics', 'Evolution', 'Ecosystems', 'Photosynthesis', 'Nervous system'],
  'Geography': ['Climate zones', 'World population', 'Natural resources', 'Map skills'],
  'Literature': ['War and Peace', 'Eugene Onegin', 'Crime and Punishment', 'Master and Margarita', 'Silver Age poetry'],
};

const COMMENTS: Record<string, Record<number, string[]>> = {
  lesson: {
    5: ['Excellent classwork', 'Actively participated in discussion', 'Outstanding answer at the board'],
    4: ['Good work, minor inaccuracies', 'Well prepared for the lesson', 'Active participation'],
    3: ['Material partially understood', 'Needs more practice', 'Incomplete answer, review the topic'],
    2: ['Not prepared for the lesson', 'Material not understood', 'Additional work required'],
  },
  test: {
    5: ['Test completed flawlessly', 'All tasks solved correctly'],
    4: ['Minor formatting errors', 'Good result, 1-2 mistakes'],
    3: ['Significant errors made', 'Only basic part completed'],
    2: ['Test not submitted', 'Multiple errors, retake needed'],
  },
  homework: {
    5: ['Homework completed fully and neatly', 'Excellent home assignment'],
    4: ['Homework done, minor issues', 'Good work at home'],
    3: ['Homework incomplete', 'Some tasks missing'],
    2: ['Homework not done', 'Home assignment missing'],
  },
  lab: {
    5: ['Lab completed excellently, correct conclusions', 'Accurate measurements and calculations'],
    4: ['Good lab work, minor discrepancies', 'Conclusions generally correct'],
    3: ['Lab completed with errors', 'Inaccurate measurements'],
    2: ['Lab not completed', 'Incorrect results'],
  },
};

interface Grade {
  subject: string;
  type: string;
  value: number;
  date: string;
  quarter: string;
  topic: string;
  teacher: string;
  comment: string;
  time: string;
  classroom: string;
}

const seeded = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateGrades = (): Grade[] => {
  const grades: Grade[] = [];
  let seed = 42;
  const types = ['lesson', 'lesson', 'lesson', 'test', 'homework', 'lab'];
  const times = ['08:30', '09:30', '10:30', '12:00', '13:30', '14:30'];
  const rooms = ['101', '102', '103', '201', '202', '301'];

  SUBJECTS.forEach((subject) => {
    QUARTERS.forEach((quarter, qi) => {
      const numGrades = 6 + Math.floor(seeded(seed++) * 4);
      for (let i = 0; i < numGrades; i++) {
        const type = types[Math.floor(seeded(seed++) * types.length)];
        const day = 1 + Math.floor(seeded(seed++) * 25);
        const month = qi * 3 + 1 + Math.floor(seeded(seed++) * 3);
        const value = Math.floor(seeded(seed++) * 3) + 3;
        const topics = TOPICS[subject] || ['Lesson topic'];
        const topic = topics[Math.floor(seeded(seed++) * topics.length)];
        const comments = COMMENTS[type]?.[value] || [''];
        const comment = comments[Math.floor(seeded(seed++) * comments.length)];

        grades.push({
          subject,
          value,
          type,
          date: `2025-${String(Math.min(month, 12)).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          quarter,
          topic,
          teacher: TEACHERS[subject] || 'Teacher',
          comment,
          time: times[Math.floor(seeded(seed++) * times.length)],
          classroom: rooms[Math.floor(seeded(seed++) * rooms.length)],
        });
      }
    });
  });
  return grades;
};

const typeLabel = (t: string) => {
  switch (t) {
    case 'lesson': return 'Lesson';
    case 'test': return 'Test';
    case 'homework': return 'Homework';
    case 'lab': return 'Lab Work';
    default: return t;
  }
};

const typeLabelShort = (t: string) => {
  switch (t) {
    case 'lesson': return 'Lesson';
    case 'test': return 'Test';
    case 'homework': return 'HW';
    case 'lab': return 'Lab';
    default: return t;
  }
};

const typeIcon = (t: string) => {
  switch (t) {
    case 'lesson': return <BookOpen className="w-3 h-3" />;
    case 'test': return <FileText className="w-3 h-3" />;
    case 'homework': return <PenLine className="w-3 h-3" />;
    case 'lab': return <FlaskConical className="w-3 h-3" />;
    default: return null;
  }
};

const typeIconLg = (t: string) => {
  switch (t) {
    case 'lesson': return <BookOpen className="w-5 h-5" />;
    case 'test': return <FileText className="w-5 h-5" />;
    case 'homework': return <PenLine className="w-5 h-5" />;
    case 'lab': return <FlaskConical className="w-5 h-5" />;
    default: return null;
  }
};

export const GradesTab: React.FC<GradesTabProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState('Term 1');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState<GradeType>('all');
  const [viewMode, setViewMode] = useState<'journal' | 'chart'>('journal');
  const [grades] = useState<Grade[]>(generateGrades);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const filtered = useMemo(() => {
    let g = grades.filter(g => g.quarter === selectedQuarter);
    if (selectedSubject !== 'all') g = g.filter(g => g.subject === selectedSubject);
    if (selectedType !== 'all') g = g.filter(g => g.type === selectedType);
    return g.sort((a, b) => a.date.localeCompare(b.date));
  }, [grades, selectedQuarter, selectedSubject, selectedType]);

  const journalData = useMemo(() => {
    const bySubject: Record<string, Grade[]> = {};
    const source = selectedSubject !== 'all'
      ? filtered
      : grades.filter(g => g.quarter === selectedQuarter && (selectedType === 'all' || g.type === selectedType));
    
    source.forEach(g => {
      if (!bySubject[g.subject]) bySubject[g.subject] = [];
      bySubject[g.subject].push(g);
    });

    return Object.entries(bySubject).map(([subject, subjectGrades]) => {
      const sorted = [...subjectGrades].sort((a, b) => a.date.localeCompare(b.date));
      const avg = sorted.reduce((s, g) => s + g.value, 0) / sorted.length;
      return { subject, grades: sorted, avg: Math.round(avg * 10) / 10 };
    });
  }, [grades, filtered, selectedQuarter, selectedSubject, selectedType]);

  const subjectAverages = useMemo(() => {
    return SUBJECTS.map(subject => {
      const subjectGrades = grades.filter(g => g.quarter === selectedQuarter && g.subject === subject);
      const avg = subjectGrades.length > 0 ? subjectGrades.reduce((s, g) => s + g.value, 0) / subjectGrades.length : 0;
      return { subject: subject.slice(0, 6), avg: Math.round(avg * 10) / 10, full: subject };
    });
  }, [grades, selectedQuarter]);

  const overallGPA = useMemo(() => {
    const all = grades.filter(g => g.quarter === selectedQuarter);
    return all.length > 0 ? (all.reduce((s, g) => s + g.value, 0) / all.length).toFixed(2) : '0';
  }, [grades, selectedQuarter]);

  const getGradeBg = (value: number) => {
    if (value >= 5) return 'bg-emerald-500 text-white';
    if (value >= 4) return 'bg-blue-500 text-white';
    if (value >= 3) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getGradeBgSoft = (value: number) => {
    if (value >= 5) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (value >= 4) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    if (value >= 3) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  };

  const getAvgColor = (avg: number) => {
    if (avg >= 4.5) return 'text-emerald-600 dark:text-emerald-400';
    if (avg >= 3.5) return 'text-blue-600 dark:text-blue-400';
    if (avg >= 2.5) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {QUARTERS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="All subjects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as GradeType)}>
          <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="lesson">Lesson</SelectItem>
            <SelectItem value="test">Test</SelectItem>
            <SelectItem value="homework">Homework</SelectItem>
            <SelectItem value="lab">Lab Work</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'journal' | 'chart')}>
            <TabsList className="h-8">
              <TabsTrigger value="journal" className="text-xs px-3 h-6">Journal</TabsTrigger>
              <TabsTrigger value="chart" className="text-xs px-3 h-6">Charts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-xl font-bold">{overallGPA}</p>
          <p className="text-[10px] text-muted-foreground">Average Grade</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{filtered.filter(g => g.value >= 4).length}</p>
          <p className="text-[10px] text-muted-foreground">Good (4-5)</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{filtered.filter(g => g.value === 3).length}</p>
          <p className="text-[10px] text-muted-foreground">Satisfactory (3)</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{filtered.filter(g => g.value <= 2).length}</p>
          <p className="text-[10px] text-muted-foreground">Unsatisfactory (≤2)</p>
        </Card>
      </div>

      {viewMode === 'journal' ? (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Gradebook — {selectedQuarter}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-2 font-semibold sticky left-0 bg-background min-w-[140px]">Subject</th>
                  <th className="text-center p-2 font-semibold min-w-[180px]" colSpan={1}>Grades</th>
                  <th className="text-center p-2 font-semibold w-[60px]">Avg</th>
                </tr>
              </thead>
              <tbody>
                {journalData.map(({ subject, grades: subGrades, avg }) => (
                  <tr key={subject} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-2 font-medium sticky left-0 bg-background text-xs">
                      {subject}
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {subGrades.map((g, i) => (
                          <div key={i} className="relative group">
                            <button
                              onClick={() => setSelectedGrade(g)}
                              className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-primary/50 hover:shadow-md ${getGradeBg(g.value)}`}
                            >
                              {g.value}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 pointer-events-none">
                              <div className="bg-popover text-popover-foreground border rounded-md px-2 py-1 text-[10px] whitespace-nowrap shadow-lg">
                                <div className="flex items-center gap-1">{typeIcon(g.type)} {typeLabelShort(g.type)}</div>
                                <div className="text-muted-foreground">{g.date}</div>
                                <div className="text-muted-foreground truncate max-w-[120px]">{g.topic}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <span className={`text-sm font-bold ${getAvgColor(avg)}`}>{avg}</span>
                    </td>
                  </tr>
                ))}
                {journalData.length === 0 && (
                  <tr><td colSpan={3} className="text-center p-8 text-muted-foreground">No grades</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Average Grade by Subject — {selectedQuarter}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }}
                  labelFormatter={(_, p) => p[0]?.payload?.full || ''}
                />
                <Bar dataKey="avg" name="Average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjectAverages.map(sa => (
              <Card key={sa.full} className="p-3">
                <p className="text-xs text-muted-foreground truncate">{sa.full}</p>
                <p className={`text-lg font-bold ${getAvgColor(sa.avg)}`}>{sa.avg}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${(sa.avg / 5) * 100}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Grade Detail Modal */}
      <Dialog open={!!selectedGrade} onOpenChange={(open) => !open && setSelectedGrade(null)}>
        <DialogContent className="max-w-md">
          {selectedGrade && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  {typeIconLg(selectedGrade.type)}
                  {selectedGrade.subject}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${getGradeBg(selectedGrade.value)}`}>
                    {selectedGrade.value}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{typeLabel(selectedGrade.type)}</p>
                    <Badge variant="outline" className={`text-[10px] mt-1 ${getGradeBgSoft(selectedGrade.value)}`}>
                      {selectedGrade.value >= 5 ? 'Excellent' : selectedGrade.value >= 4 ? 'Good' : selectedGrade.value >= 3 ? 'Satisfactory' : 'Unsatisfactory'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                    <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Lesson Topic</p>
                      <p className="text-xs font-medium">{selectedGrade.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Date</p>
                      <p className="text-xs font-medium">{selectedGrade.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Teacher</p>
                      <p className="text-xs font-medium">{selectedGrade.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Time / Room</p>
                      <p className="text-xs font-medium">{selectedGrade.time} · Room {selectedGrade.classroom}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <p className="text-xs font-semibold">Teacher Comment</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedGrade.comment}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 text-xs"
                  onClick={() => {
                    setSelectedGrade(null);
                    navigate('/schedule');
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Schedule
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
