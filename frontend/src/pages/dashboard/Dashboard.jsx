
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    draft: 0
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (invoices) {
      // Calculate stats
      const total = invoices.length;
      const paid = invoices.filter(inv => inv.status === 'paid').length;
      const pending = invoices.filter(inv => inv.status === 'sent').length;
      const draft = invoices.filter(inv => inv.status === 'draft').length;
      
      setStats({ total, paid, pending, draft });
      
      // Prepare chart data - get totals for the last 6 months
      const now = new Date();
      const sixMonthsData = Array.from({ length: 6 }, (_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = format(month, 'MMM');
        
        // Get invoices for this month
        const monthInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.date);
          return invDate.getMonth() === month.getMonth() && 
                 invDate.getFullYear() === month.getFullYear();
        });
        
        const total = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
        
        return {
          month: monthName,
          total: total
        };
      }).reverse();
      
      setChartData(sixMonthsData);
    }
  }, [invoices]);

  // Get recent invoices (top 5)
  const recentInvoices = invoices?.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ).slice(0, 5);

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        <Button asChild>
          <Link to="/invoices/new">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            New Invoice
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Invoice totals for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Total']}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      padding: '8px'
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your recently created invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentInvoices?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium text-muted-foreground py-3">Invoice #</th>
                    <th className="text-left font-medium text-muted-foreground py-3">Client</th>
                    <th className="text-left font-medium text-muted-foreground py-3">Date</th>
                    <th className="text-right font-medium text-muted-foreground py-3">Amount</th>
                    <th className="text-left font-medium text-muted-foreground py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <Link to={`/invoices/${invoice._id}`} className="text-primary hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3">{invoice.clientName}</td>
                      <td className="py-3">{format(new Date(invoice.date), 'MMM dd, yyyy')}</td>
                      <td className="py-3 text-right">₹{invoice.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No invoices yet. Get started by creating your first invoice!</p>
              <Button asChild className="mt-4">
                <Link to="/invoices/new">Create Invoice</Link>
              </Button>
            </div>
          )}

          {recentInvoices?.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/invoices">View All Invoices</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
