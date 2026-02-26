import React, { useState, useMemo } from 'react';
import { Award, Users, BookOpen, Calendar, TrendingUp, CheckCircle, Save, X, BarChart3, ClipboardList, AlertTriangle, Target, Plus, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart } from 'recharts';

// ── Grading Systems ──
// Numeric: 1-6 for Year Groups 1-10
// Letter: A*-U for Year Groups 11-13 (IGCSE/A-Level style)

const NUMERIC_GRADES = [6, 5, 4, 3, 2, 1];
const NUMERIC_LABELS: Record<number, string> = {
  6: 'Outstanding', 5: 'Excellent', 4: 'Good', 3: 'Satisfactory', 2: 'Poor', 1: 'Failing',
};
const NUMERIC_COLORS: Record<number, string> = {
  6: 'bg-success/10 text-success border-success/30',
  5: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  4: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
  3: 'bg-warning/10 text-warning border-warning/30',
  2: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  1: 'bg-destructive/10 text-destructive border-destructive/30',
};

const LETTER_GRADES = ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'U'];
const LETTER_LABELS: Record<string, string> = {
  'A*': 'Exceptional', 'A': 'Excellent', 'B': 'Very Good', 'C': 'Good',
  'D': 'Satisfactory', 'E': 'Sufficient', 'F': 'Weak', 'U': 'Ungraded',
};
const LETTER_COLORS: Record<string, string> = {
  'A*': 'bg-success/10 text-success border-success/30',
  'A': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  'B': 'bg-sky-500/10 text-sky-600 border-sky-500/30',
  'C': 'bg-primary/10 text-primary border-primary/30',
  'D': 'bg-warning/10 text-warning border-warning/30',
  'E': 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  'F': 'bg-destructive/10 text-destructive border-destructive/30',
  'U': 'bg-destructive/20 text-destructive border-destructive/40',
};

// Letter grade to numeric value for averaging
const LETTER_TO_NUM: Record<string, number> = { 'A*': 8, 'A': 7, 'B': 6, 'C': 5, 'D': 4, 'E': 3, 'F': 2, 'U': 1 };
const NUM_TO_LETTER = (avg: number): string => {
  if (avg >= 7.5) return 'A*'; if (avg >= 6.5) return 'A'; if (avg >= 5.5) return 'B';
  if (avg >= 4.5) return 'C'; if (avg >= 3.5) return 'D'; if (avg >= 2.5) return 'E';
  if (avg >= 1.5) return 'F'; return 'U';
};

type GradingSystem = 'numeric' | 'letter';

const MOCK_STUDENTS = [
  { id: '1', name: 'Ivanov Alex', group: 'Group 8A', yearGroup: 8 },
  { id: '2', name: 'Petrova Maria', group: 'Group 8A', yearGroup: 8 },
  { id: '3', name: 'Sidorov Dmitry', group: 'Group 8A', yearGroup: 8 },
  { id: '4', name: 'Kozlova Anna', group: 'Group 8A', yearGroup: 8 },
  { id: '5', name: 'Novikov Andrew', group: 'Group 5B', yearGroup: 5 },
  { id: '6', name: 'Morozova Elena', group: 'Group 5B', yearGroup: 5 },
  { id: '7', name: 'Volkov Sergey', group: 'Group 5B', yearGroup: 5 },
  { id: '8', name: 'Sokolova Olga', group: 'Group 5B', yearGroup: 5 },
  { id: '9', name: 'Lebedev Max', group: 'Group 11A', yearGroup: 11 },
  { id: '10', name: 'Egorova Daria', group: 'Group 11A', yearGroup: 11 },
  { id: '11', name: 'Vasiliev Nikita', group: 'Group 12B', yearGroup: 12 },
  { id: '12', name: 'Pavlova Sophia', group: 'Group 12B', yearGroup: 12 },
];

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'History', 'Biology', 'Geography', 'Literature'];
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
const GRADE_TYPES = [
  { value: 'lesson', label: 'Classwork', icon: '📖' },
  { value: 'test', label: 'Test/Exam', icon: '📝' },
  { value: 'lab', label: 'Lab Work', icon: '🔬' },
  { value: 'homework', label: 'Homework', icon: '📚' },
];

interface Grade {
  studentId: string;
  subject: string;
  value: string; // "6", "A*", etc.
  numericValue: number; // for averaging
  type: string;
  date: string;
  term: string;
  comment?: string;
}

const getGradingSystem = (yearGroup: number): GradingSystem => yearGroup >= 11 ? 'letter' : 'numeric';

const generateMockGrades = (): Grade[] => {
  const grades: Grade[] = [];
  MOCK_STUDENTS.forEach(student => {
    const system = getGradingSystem(student.yearGroup);
    SUBJECTS.forEach(subject => {
      TERMS.forEach(term => {
        for (let i = 0; i < 4; i++) {
          if (system === 'numeric') {
            const val = Math.floor(Math.random() * 4) + 3; // 3-6
            grades.push({
              studentId: student.id, subject, value: String(val), numericValue: val,
              type: 'lesson', date: `2025-0${TERMS.indexOf(term) + 1}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`, term,
            });
          } else {
            const idx = Math.floor(Math.random() * 5); // A*-D
            const letter = LETTER_GRADES[idx];
            grades.push({
              studentId: student.id, subject, value: letter, numericValue: LETTER_TO_NUM[letter],
              type: 'lesson', date: `2025-0${TERMS.indexOf(term) + 1}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`, term,
            });
          }
        }
        // 1 test
        if (system === 'numeric') {
          const val = Math.floor(Math.random() * 4) + 3;
          grades.push({ studentId: student.id, subject, value: String(val), numericValue: val, type: 'test', date: `2025-0${TERMS.indexOf(term) + 1}-15`, term });
        } else {
          const idx = Math.floor(Math.random() * 5);
          const letter = LETTER_GRADES[idx];
          grades.push({ studentId: student.id, subject, value: letter, numericValue: LETTER_TO_NUM[letter], type: 'test', date: `2025-0${TERMS.indexOf(term) + 1}-15`, term });
        }
      });
    });
  });
  return grades;
};

// ── Add Grade Modal ──
const AddGradeModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  yearGroup: number;
  subject: string;
  term: string;
  onSubmit: (value: string, numericValue: number, type: string, comment: string) => void;
}> = ({ open, onOpenChange, studentName, yearGroup, subject, term, onSubmit }) => {
  const system = getGradingSystem(yearGroup);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('lesson');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!selectedGrade) { toast.error('Please select a grade'); return; }
    const numVal = system === 'numeric' ? parseInt(selectedGrade) : LETTER_TO_NUM[selectedGrade] || 0;
    onSubmit(selectedGrade, numVal, selectedType, comment);
    setSelectedGrade(null); setSelectedType('lesson'); setComment('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-warning" />
            </div>
            New Grade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="bg-muted/50 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Student</span>
              <span className="text-sm font-semibold">{studentName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Subject</span>
              <span className="text-sm font-medium">{subject}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Term</span>
              <span className="text-sm">{term}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">System</span>
              <Badge variant="outline" className="text-[10px]">
                {system === 'numeric' ? `Numeric (1-6) · Year ${yearGroup}` : `Letter (A*-U) · Year ${yearGroup}`}
              </Badge>
            </div>
          </div>

          {/* Grade selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grade</Label>
            {system === 'numeric' ? (
              <div className="grid grid-cols-6 gap-2">
                {NUMERIC_GRADES.map(grade => (
                  <button key={grade} onClick={() => setSelectedGrade(String(grade))}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedGrade === String(grade)
                        ? `${NUMERIC_COLORS[grade]} ring-2 ring-offset-2 ring-current scale-105`
                        : `border-border ${NUMERIC_COLORS[grade]}`
                    }`}>
                    <span className="text-xl font-bold">{grade}</span>
                    <span className="text-[8px] font-medium leading-tight text-center">{NUMERIC_LABELS[grade].slice(0, 5)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {LETTER_GRADES.map(grade => (
                  <button key={grade} onClick={() => setSelectedGrade(grade)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedGrade === grade
                        ? `${LETTER_COLORS[grade]} ring-2 ring-offset-2 ring-current scale-105`
                        : `border-border ${LETTER_COLORS[grade]}`
                    }`}>
                    <span className="text-lg font-bold">{grade}</span>
                    <span className="text-[8px] font-medium leading-tight text-center">{LETTER_LABELS[grade]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grade type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {GRADE_TYPES.map(type => (
                <button key={type.value} onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all cursor-pointer ${
                    selectedType === type.value ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                  }`}>
                  <span>{type.icon}</span><span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <MessageSquare className="w-3 h-3 inline mr-1" />Comment (optional)
            </Label>
            <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." rows={2} className="resize-none" />
          </div>

          <Button onClick={handleSubmit} disabled={!selectedGrade} className="w-full bg-warning hover:bg-warning/90 text-warning-foreground font-semibold h-11">
            <Plus className="w-4 h-4 mr-2" />
            Submit Grade {selectedGrade || ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Main Component ──
export const Grades: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [activeTab, setActiveTab] = useState('journal');
  const [grades, setGrades] = useState<Grade[]>(generateMockGrades);
  const [editingCell, setEditingCell] = useState<{ studentId: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [termGrades, setTermGrades] = useState<Record<string, Record<string, string>>>({});
  const [yearGrades, setYearGrades] = useState<Record<string, Record<string, string>>>({});
  const [addGradeModal, setAddGradeModal] = useState<{ open: boolean; studentId: string; studentName: string; yearGroup: number } | null>(null);

  const groups = [...new Set(MOCK_STUDENTS.map(s => s.group))];

  const filteredStudents = useMemo(() => {
    if (selectedGroup === 'all') return MOCK_STUDENTS;
    return MOCK_STUDENTS.filter(s => s.group === selectedGroup);
  }, [selectedGroup]);

  // Determine dominant grading system in current view
  const currentSystem: GradingSystem = useMemo(() => {
    const systems = filteredStudents.map(s => getGradingSystem(s.yearGroup));
    return systems.filter(s => s === 'letter').length > systems.length / 2 ? 'letter' : 'numeric';
  }, [filteredStudents]);

  const studentGradesFiltered = useMemo(() => {
    return grades.filter(g =>
      g.subject === selectedSubject &&
      g.term === selectedTerm &&
      (selectedGroup === 'all' || MOCK_STUDENTS.find(s => s.id === g.studentId)?.group === selectedGroup)
    );
  }, [grades, selectedSubject, selectedTerm, selectedGroup]);

  const getStudentGradesByType = (studentId: string, type: string) =>
    studentGradesFiltered.filter(g => g.studentId === studentId && g.type === type);

  const getStudentAverage = (studentId: string) => {
    const sg = studentGradesFiltered.filter(g => g.studentId === studentId);
    if (sg.length === 0) return 0;
    return +(sg.reduce((sum, g) => sum + g.numericValue, 0) / sg.length).toFixed(1);
  };

  const formatAverage = (avg: number, yearGroup: number) => {
    if (getGradingSystem(yearGroup) === 'letter') return NUM_TO_LETTER(avg);
    return avg.toFixed(1);
  };

  const handleAddGradeFromModal = (studentId: string, value: string, numericValue: number, type: string, comment: string) => {
    const newGrade: Grade = {
      studentId, subject: selectedSubject, value, numericValue, type, comment,
      date: new Date().toISOString().split('T')[0], term: selectedTerm,
    };
    setGrades(prev => [...prev, newGrade]);
    toast.success(`Grade ${value} submitted${comment ? ' with comment' : ''}`);
  };

  const handleSetTermGrade = (studentId: string) => {
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student) return;
    const system = getGradingSystem(student.yearGroup);
    const val = editValue.trim();
    
    if (system === 'numeric') {
      const num = parseInt(val);
      if (isNaN(num) || num < 1 || num > 6) { toast.error('Grade must be 1-6'); return; }
    } else {
      if (!LETTER_GRADES.includes(val.toUpperCase())) { toast.error('Invalid letter grade'); return; }
    }
    setTermGrades(prev => ({
      ...prev, [studentId]: { ...prev[studentId], [`${selectedSubject}-${selectedTerm}`]: val }
    }));
    setEditingCell(null); setEditValue('');
    toast.success(`Term grade ${val} submitted`);
  };

  const handleSetYearGrade = (studentId: string) => {
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student) return;
    const system = getGradingSystem(student.yearGroup);
    const val = editValue.trim();
    
    if (system === 'numeric') {
      const num = parseInt(val);
      if (isNaN(num) || num < 1 || num > 6) { toast.error('Grade must be 1-6'); return; }
    } else {
      if (!LETTER_GRADES.includes(val.toUpperCase())) { toast.error('Invalid letter grade'); return; }
    }
    setYearGrades(prev => ({
      ...prev, [studentId]: { ...prev[studentId], [selectedSubject]: val }
    }));
    setEditingCell(null); setEditValue('');
    toast.success(`Year grade ${val} submitted`);
  };

  const renderGradeCell = (value: string, yearGroup: number) => {
    const system = getGradingSystem(yearGroup);
    let colorClass = 'bg-muted';
    if (system === 'numeric') {
      colorClass = NUMERIC_COLORS[parseInt(value)] || 'bg-muted';
    } else {
      colorClass = LETTER_COLORS[value] || 'bg-muted';
    }
    return (
      <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-1 rounded-md text-xs font-bold border ${colorClass}`}>
        {value}
      </span>
    );
  };

  const gradeDistribution = useMemo(() => {
    if (currentSystem === 'numeric') {
      const counts: Record<number, number> = { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      studentGradesFiltered.forEach(g => {
        const num = parseInt(g.value);
        if (counts[num] !== undefined) counts[num]++;
      });
      return [
        { name: '6 (Outstanding)', value: counts[6], color: 'hsl(var(--success))' },
        { name: '5 (Excellent)', value: counts[5], color: 'hsl(142 71% 55%)' },
        { name: '4 (Good)', value: counts[4], color: 'hsl(199 89% 48%)' },
        { name: '3 (Satisfactory)', value: counts[3], color: 'hsl(var(--warning))' },
        { name: '2 (Poor)', value: counts[2], color: 'hsl(24 94% 50%)' },
        { name: '1 (Failing)', value: counts[1], color: 'hsl(var(--destructive))' },
      ].filter(d => d.value > 0);
    } else {
      const counts: Record<string, number> = {};
      LETTER_GRADES.forEach(l => counts[l] = 0);
      studentGradesFiltered.forEach(g => { if (counts[g.value] !== undefined) counts[g.value]++; });
      const colors = ['hsl(var(--success))', 'hsl(142 71% 55%)', 'hsl(199 89% 48%)', 'hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(24 94% 50%)', 'hsl(var(--destructive))', 'hsl(0 0% 50%)'];
      return LETTER_GRADES.map((l, i) => ({ name: `${l} (${LETTER_LABELS[l]})`, value: counts[l], color: colors[i] })).filter(d => d.value > 0);
    }
  }, [studentGradesFiltered, currentSystem]);

  const subjectAverages = useMemo(() => {
    return SUBJECTS.map(subject => {
      const subGrades = grades.filter(g => g.subject === subject && g.term === selectedTerm &&
        (selectedGroup === 'all' || MOCK_STUDENTS.find(s => s.id === g.studentId)?.group === selectedGroup)
      );
      const avg = subGrades.length > 0 ? +(subGrades.reduce((s, g) => s + g.numericValue, 0) / subGrades.length).toFixed(1) : 0;
      return { subject: subject.slice(0, 6), average: avg, fullName: subject };
    });
  }, [grades, selectedTerm, selectedGroup]);

  const dashboardStats = useMemo(() => {
    const relevantGrades = grades.filter(g =>
      g.term === selectedTerm &&
      (selectedGroup === 'all' || MOCK_STUDENTS.find(s => s.id === g.studentId)?.group === selectedGroup) &&
      (selectedStudent === 'all' || g.studentId === selectedStudent)
    );
    const totalGrades = relevantGrades.length;
    const avg = totalGrades > 0 ? +(relevantGrades.reduce((s, g) => s + g.numericValue, 0) / totalGrades).toFixed(2) : 0;
    const studentsInScope = selectedStudent !== 'all'
      ? [MOCK_STUDENTS.find(s => s.id === selectedStudent)!].filter(Boolean)
      : filteredStudents;
    const excellentStudents = studentsInScope.filter(s => {
      const sg = relevantGrades.filter(g => g.studentId === s.id);
      const sAvg = sg.length > 0 ? sg.reduce((sum, g) => sum + g.numericValue, 0) / sg.length : 0;
      return sg.length > 0 && (getGradingSystem(s.yearGroup) === 'numeric' ? sAvg >= 5 : sAvg >= 6.5);
    }).length;
    const atRisk = studentsInScope.filter(s => {
      const sg = relevantGrades.filter(g => g.studentId === s.id);
      const sAvg = sg.length > 0 ? sg.reduce((sum, g) => sum + g.numericValue, 0) / sg.length : 0;
      return sg.length > 0 && (getGradingSystem(s.yearGroup) === 'numeric' ? sAvg < 3 : sAvg < 3.5);
    }).length;
    return { totalGrades, avg, excellentStudents, atRisk, studentsCount: studentsInScope.length };
  }, [grades, selectedTerm, selectedGroup, selectedStudent, filteredStudents]);

  const termTrend = useMemo(() => {
    return TERMS.map(t => {
      const tGrades = grades.filter(g =>
        g.term === t &&
        (selectedGroup === 'all' || MOCK_STUDENTS.find(s => s.id === g.studentId)?.group === selectedGroup) &&
        (selectedStudent === 'all' || g.studentId === selectedStudent)
      );
      const avg = tGrades.length > 0 ? +(tGrades.reduce((s, g) => s + g.numericValue, 0) / tGrades.length).toFixed(2) : 0;
      return { term: t.replace('Term ', 'T'), avg, fullName: t };
    });
  }, [grades, selectedGroup, selectedStudent]);

  const selectedStudentData = useMemo(() => {
    if (selectedStudent === 'all') return null;
    const student = MOCK_STUDENTS.find(s => s.id === selectedStudent);
    if (!student) return null;
    const studentAllGrades = grades.filter(g => g.studentId === selectedStudent);
    const bySubject: Record<string, Grade[]> = {};
    studentAllGrades.forEach(g => { if (!bySubject[g.subject]) bySubject[g.subject] = []; bySubject[g.subject].push(g); });
    return { student, bySubject };
  }, [selectedStudent, grades]);

  const getAvgBadgeVariant = (avg: number, yearGroup: number): 'default' | 'secondary' | 'destructive' => {
    const system = getGradingSystem(yearGroup);
    if (system === 'numeric') return avg >= 5 ? 'default' : avg >= 3 ? 'secondary' : 'destructive';
    return avg >= 6 ? 'default' : avg >= 4 ? 'secondary' : 'destructive';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Grades
          </h1>
          <p className="text-sm text-muted-foreground">Academic journal — classwork, tests, term & year grades</p>
        </div>

        {/* Dashboard Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="text-2xl font-bold mt-0.5">{dashboardStats.avg}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${dashboardStats.avg >= 4 ? 'bg-success/10' : dashboardStats.avg >= 3 ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                  <TrendingUp className={`w-4 h-4 ${dashboardStats.avg >= 4 ? 'text-success' : dashboardStats.avg >= 3 ? 'text-warning' : 'text-destructive'}`} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{dashboardStats.totalGrades} grades</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Top Performers</p>
                  <p className="text-2xl font-bold text-success mt-0.5">{dashboardStats.excellentStudents}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-success" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">of {dashboardStats.studentsCount} students</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-bold text-destructive mt-0.5">{dashboardStats.atRisk}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">below minimum</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning col-span-2">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">Term Trend</p>
                <Target className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={termTrend}>
                  <defs>
                    <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="term" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, currentSystem === 'numeric' ? 6 : 8]} hide />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }}
                    labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ''}
                    formatter={(value: number) => [value.toFixed(2), 'Average']}
                  />
                  <Area type="monotone" dataKey="avg" stroke="hsl(var(--primary))" fill="url(#avgGradient)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="journal" className="text-xs"><ClipboardList className="w-3.5 h-3.5 mr-1" />Journal</TabsTrigger>
          <TabsTrigger value="term" className="text-xs"><Calendar className="w-3.5 h-3.5 mr-1" />Terms</TabsTrigger>
          <TabsTrigger value="year" className="text-xs"><Award className="w-3.5 h-3.5 mr-1" />Year</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs"><BarChart3 className="w-3.5 h-3.5 mr-1" />Analytics</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Group" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="All Students" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {filteredStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* JOURNAL TAB */}
        <TabsContent value="journal">
          {selectedStudentData ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {selectedStudentData.student.name} — {selectedStudentData.student.group}
                  <Badge variant="outline" className="text-[10px] ml-2">
                    Year {selectedStudentData.student.yearGroup} · {getGradingSystem(selectedStudentData.student.yearGroup) === 'numeric' ? '1-6' : 'A*-U'}
                  </Badge>
                </CardTitle>
                <Button onClick={() => setAddGradeModal({ open: true, studentId: selectedStudentData.student.id, studentName: selectedStudentData.student.name, yearGroup: selectedStudentData.student.yearGroup })}
                  className="bg-warning hover:bg-warning/90 text-warning-foreground h-9 gap-1.5">
                  <Plus className="w-4 h-4" />Grade
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold">Subject</th>
                        <th className="text-center p-3 font-semibold">Grades</th>
                        <th className="text-center p-3 font-semibold">Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedStudentData.bySubject).map(([subject, subGrades]) => {
                        const termG = subGrades.filter(g => g.term === selectedTerm);
                        const avg = termG.length > 0 ? termG.reduce((s, g) => s + g.numericValue, 0) / termG.length : 0;
                        return (
                          <tr key={subject} className="border-b hover:bg-muted/30">
                            <td className="p-3 font-medium">{subject}</td>
                            <td className="p-3 text-center">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {termG.map((g, i) => <span key={i}>{renderGradeCell(g.value, selectedStudentData.student.yearGroup)}</span>)}
                              </div>
                            </td>
                            <td className="p-3 text-center font-bold">{formatAverage(avg, selectedStudentData.student.yearGroup)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold sticky left-0 bg-muted/50 z-10">Student</th>
                        <th className="text-center p-2 font-semibold text-xs">System</th>
                        <th className="text-center p-2 font-semibold text-xs">Classwork</th>
                        <th className="text-center p-2 font-semibold text-xs">Tests</th>
                        <th className="text-center p-2 font-semibold text-xs">Lab</th>
                        <th className="text-center p-2 font-semibold text-xs">HW</th>
                        <th className="text-center p-2 font-semibold text-xs">Avg</th>
                        <th className="text-center p-2 font-semibold text-xs w-16">Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => {
                        const system = getGradingSystem(student.yearGroup);
                        const lessonGrades = getStudentGradesByType(student.id, 'lesson');
                        const testGrades = getStudentGradesByType(student.id, 'test');
                        const labGrades = getStudentGradesByType(student.id, 'lab');
                        const hwGrades = getStudentGradesByType(student.id, 'homework');
                        const avg = getStudentAverage(student.id);

                        return (
                          <tr key={student.id} className="border-b hover:bg-muted/30">
                            <td className="p-3 font-medium sticky left-0 bg-background z-10">
                              <div>
                                <div className="text-sm">{student.name}</div>
                                <div className="text-xs text-muted-foreground">{student.group}</div>
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <Badge variant="outline" className="text-[9px]">
                                {system === 'numeric' ? `1-6` : `A*-U`}
                              </Badge>
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex flex-wrap gap-0.5 justify-center">
                                {lessonGrades.map((g, i) => <span key={i}>{renderGradeCell(g.value, student.yearGroup)}</span>)}
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex flex-wrap gap-0.5 justify-center">
                                {testGrades.map((g, i) => <span key={i}>{renderGradeCell(g.value, student.yearGroup)}</span>)}
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex flex-wrap gap-0.5 justify-center">
                                {labGrades.length > 0 ? labGrades.map((g, i) => <span key={i}>{renderGradeCell(g.value, student.yearGroup)}</span>) : <span className="text-xs text-muted-foreground">—</span>}
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex flex-wrap gap-0.5 justify-center">
                                {hwGrades.length > 0 ? hwGrades.map((g, i) => <span key={i}>{renderGradeCell(g.value, student.yearGroup)}</span>) : <span className="text-xs text-muted-foreground">—</span>}
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <Badge variant={getAvgBadgeVariant(avg, student.yearGroup)} className="text-xs">
                                {formatAverage(avg, student.yearGroup)}
                              </Badge>
                            </td>
                            <td className="p-2 text-center">
                              <Button size="sm" className="h-8 w-8 p-0 bg-warning hover:bg-warning/80 text-warning-foreground rounded-lg shadow-sm"
                                onClick={() => setAddGradeModal({ open: true, studentId: student.id, studentName: student.name, yearGroup: student.yearGroup })}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TERM TAB */}
        <TabsContent value="term">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Term Grades — {selectedSubject} — {selectedTerm}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Student</th>
                      <th className="text-center p-3 font-semibold">System</th>
                      <th className="text-center p-3 font-semibold">Average</th>
                      <th className="text-center p-3 font-semibold">Count</th>
                      <th className="text-center p-3 font-semibold">Term Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const avg = getStudentAverage(student.id);
                      const count = studentGradesFiltered.filter(g => g.studentId === student.id).length;
                      const tGrade = termGrades[student.id]?.[`${selectedSubject}-${selectedTerm}`];

                      return (
                        <tr key={student.id} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{student.name}</td>
                          <td className="p-3 text-center"><Badge variant="outline" className="text-[9px]">{getGradingSystem(student.yearGroup) === 'numeric' ? '1-6' : 'A*-U'}</Badge></td>
                          <td className="p-3 text-center">{formatAverage(avg, student.yearGroup)}</td>
                          <td className="p-3 text-center">{count}</td>
                          <td className="p-3 text-center">
                            {editingCell?.studentId === student.id && editingCell?.column === 'term' ? (
                              <div className="flex items-center gap-1 justify-center">
                                <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-14 h-7 text-center text-xs" autoFocus
                                  placeholder={getGradingSystem(student.yearGroup) === 'numeric' ? '1-6' : 'A-U'}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSetTermGrade(student.id); if (e.key === 'Escape') { setEditingCell(null); setEditValue(''); } }} />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleSetTermGrade(student.id)}><Save className="h-3 w-3" /></Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-center">
                                {tGrade ? renderGradeCell(tGrade, student.yearGroup) : <span className="text-xs text-muted-foreground">—</span>}
                                <Button size="sm" className="h-7 w-7 p-0 bg-warning hover:bg-warning/80 text-warning-foreground rounded-lg"
                                  onClick={() => { setEditingCell({ studentId: student.id, column: 'term' }); setEditValue(tGrade || ''); }}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* YEAR TAB */}
        <TabsContent value="year">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Year Grades — {selectedSubject}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Student</th>
                      {TERMS.map(t => <th key={t} className="text-center p-3 font-semibold text-xs">{t}</th>)}
                      <th className="text-center p-3 font-semibold">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const yGrade = yearGrades[student.id]?.[selectedSubject];
                      return (
                        <tr key={student.id} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{student.name}</td>
                          {TERMS.map(t => {
                            const tg = termGrades[student.id]?.[`${selectedSubject}-${t}`];
                            return <td key={t} className="p-3 text-center">{tg ? renderGradeCell(tg, student.yearGroup) : <span className="text-xs text-muted-foreground">—</span>}</td>;
                          })}
                          <td className="p-3 text-center">
                            {editingCell?.studentId === student.id && editingCell?.column === 'year' ? (
                              <div className="flex items-center gap-1 justify-center">
                                <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-14 h-7 text-center text-xs" autoFocus
                                  placeholder={getGradingSystem(student.yearGroup) === 'numeric' ? '1-6' : 'A-U'}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSetYearGrade(student.id); if (e.key === 'Escape') { setEditingCell(null); setEditValue(''); } }} />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleSetYearGrade(student.id)}><Save className="h-3 w-3" /></Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-center">
                                {yGrade ? renderGradeCell(yGrade, student.yearGroup) : <span className="text-xs text-muted-foreground">—</span>}
                                <Button size="sm" className="h-7 w-7 p-0 bg-warning hover:bg-warning/80 text-warning-foreground rounded-lg"
                                  onClick={() => { setEditingCell({ studentId: student.id, column: 'year' }); setEditValue(yGrade || ''); }}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Grade Distribution — {selectedSubject}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                      {gradeDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Average by Subject</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subjectAverages}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, currentSystem === 'numeric' ? 6 : 8]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }}
                      labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ''} />
                    <Bar dataKey="average" name="Average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Group Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {groups.map(group => {
                    const groupStudents = MOCK_STUDENTS.filter(s => s.group === group);
                    const groupGrades = grades.filter(g => groupStudents.some(s => s.id === g.studentId) && g.term === selectedTerm);
                    const avg = groupGrades.length > 0 ? (groupGrades.reduce((s, g) => s + g.numericValue, 0) / groupGrades.length).toFixed(1) : '0';
                    const yearGroup = groupStudents[0]?.yearGroup || 0;
                    return (
                      <Card key={group} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="text-sm font-medium">{group}</div>
                          <div className="text-2xl font-bold mt-1">{avg}</div>
                          <div className="text-xs text-muted-foreground">average · {getGradingSystem(yearGroup) === 'numeric' ? '1-6' : 'A*-U'}</div>
                          <div className="mt-2 flex items-center gap-1 text-xs">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span>{groupStudents.length} students</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {addGradeModal && (
        <AddGradeModal
          open={addGradeModal.open}
          onOpenChange={(open) => { if (!open) setAddGradeModal(null); }}
          studentName={addGradeModal.studentName}
          yearGroup={addGradeModal.yearGroup}
          subject={selectedSubject}
          term={selectedTerm}
          onSubmit={(value, numericValue, type, comment) => handleAddGradeFromModal(addGradeModal.studentId, value, numericValue, type, comment)}
        />
      )}
    </div>
  );
};

export default Grades;
