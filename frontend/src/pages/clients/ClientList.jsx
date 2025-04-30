
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClientList = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });
  
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (invoices) {
      // Extract unique clients based on client name/email
      const clientsMap = {};
      
      invoices.forEach(invoice => {
        if (!clientsMap[invoice.clientName]) {
          clientsMap[invoice.clientName] = {
            name: invoice.clientName,
            email: invoice.clientEmail,
            address: invoice.clientAddress,
            totalInvoices: 1,
            totalAmount: invoice.total,
            invoices: [invoice]
          };
        } else {
          clientsMap[invoice.clientName].totalInvoices += 1;
          clientsMap[invoice.clientName].totalAmount += invoice.total;
          clientsMap[invoice.clientName].invoices.push(invoice);
        }
      });
      
      setClients(Object.values(clientsMap));
    }
  }, [invoices]);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) || 
    (client.email && client.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button asChild>
          <a href="/invoices/new">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Create Invoice
          </a>
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            Manage your clients and their invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium text-muted-foreground py-3">Client</th>
                    <th className="text-left font-medium text-muted-foreground py-3 hidden md:table-cell">Email</th>
                    <th className="text-right font-medium text-muted-foreground py-3">Invoices</th>
                    <th className="text-right font-medium text-muted-foreground py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-4 font-medium">{client.name}</td>
                      <td className="py-4 hidden md:table-cell">{client.email || '-'}</td>
                      <td className="py-4 text-right">{client.totalInvoices}</td>
                      <td className="py-4 text-right">₹{client.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No clients found.</p>
              <Button asChild className="mt-4">
                <a href="/invoices/new">Create Your First Invoice</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;
