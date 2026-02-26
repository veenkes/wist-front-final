import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Filter,
  Calendar,
  DollarSign,
  PieChart
} from 'lucide-react';
import { mockExpenses, formatCurrency, Expense } from '@/data/mockData';
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { ExpenseDetailModal } from '@/components/modals/ExpenseDetailModal';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function Expenses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Calculate summary statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = mockExpenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const lastMonthExpenses = mockExpenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const percentageChange = totalLastMonth > 0 
    ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 
    : 0;

  // Calculate category totals
  const categoryTotals = thisMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  // Filter and sort expenses
  const filteredExpenses = mockExpenses
    .filter(expense => {
      const matchesSearch = 
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      const matchesPaymentMethod = selectedPaymentMethod === 'all' || expense.paymentMethod === selectedPaymentMethod;
      
      return matchesSearch && matchesCategory && matchesPaymentMethod;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Category', 'Payee', 'Amount', 'Payment Method', 'Description'];
    const rows = filteredExpenses.map(e => [
      e.id,
      e.date,
      e.category,
      e.payee,
      e.amount.toString(),
      e.paymentMethod,
      e.description
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Salaries': 'bg-blue-500',
      'Office/Equipment': 'bg-purple-500',
      'Software/Subscriptions': 'bg-cyan-500',
      'Marketing': 'bg-pink-500',
      'Transportation': 'bg-orange-500',
      'Facilities': 'bg-yellow-500',
      'Supplies': 'bg-green-500',
      'Events': 'bg-red-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all company expenses</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total This Month</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalThisMonth)}</p>
              <div className="flex items-center gap-1 mt-2">
                {percentageChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm ${percentageChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.abs(percentageChange).toFixed(1)}% vs last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expenses This Month</p>
              <p className="text-2xl font-bold mt-1">{thisMonthExpenses.length}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Across {Object.keys(categoryTotals).length} categories
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-2xl font-bold mt-1">
                {Object.keys(categoryTotals).length > 0 
                  ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {Object.keys(categoryTotals).length > 0 
                  ? formatCurrency(Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][1])
                  : formatCurrency(0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Expense Analytics Chart */}
      {chartData.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Expenses by Category (This Month)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Filters and Actions */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Salaries">Salaries</SelectItem>
              <SelectItem value="Office/Equipment">Office/Equipment</SelectItem>
              <SelectItem value="Software/Subscriptions">Software/Subscriptions</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Facilities">Facilities</SelectItem>
              <SelectItem value="Supplies">Supplies</SelectItem>
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'amount')}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Expenses List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="bg-muted/50">
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Payee</th>
                <th className="text-left p-4 font-semibold">Description</th>
                <th className="text-left p-4 font-semibold">Payment Method</th>
                <th className="text-right p-4 font-semibold">Amount</th>
                <th className="text-center p-4 font-semibold">Attachments</th>
                <th className="text-center p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getCategoryColor(expense.category)} text-white`}>
                      {expense.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">{expense.payee}</td>
                  <td className="p-4 max-w-xs truncate">{expense.description}</td>
                  <td className="p-4">
                    <Badge variant="outline">{expense.paymentMethod}</Badge>
                  </td>
                  <td className="p-4 text-right font-semibold">{formatCurrency(expense.amount)}</td>
                  <td className="p-4 text-center">
                    <Badge variant="secondary">
                      {expense.attachments?.length || 0} file(s)
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExpense(expense)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No expenses found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      <AddExpenseModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
      
      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          open={!!selectedExpense}
          onOpenChange={(open) => !open && setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
