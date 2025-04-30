
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInvoice, downloadInvoicePdf, sendInvoiceEmail, deleteInvoice } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  
  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id)
  });

  const handleDelete = async () => {
    try {
      await deleteInvoice(id);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendInvoiceEmail(id);
      toast.success(`Email sent to ${invoice.clientEmail}`);
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'sent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Invoice {invoice?.invoiceNumber}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice?.status)}`}>
              {invoice?.status.charAt(0).toUpperCase() + invoice?.status.slice(1)}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Created on {format(new Date(invoice?.date), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/invoices')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back
          </Button>
          
          <Button variant="outline" onClick={() => downloadInvoicePdf(id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </Button>
          
          {invoice?.clientEmail && (
            <Button variant="outline" onClick={handleSendEmail}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Invoice
            </Button>
          )}
          
          <Button onClick={() => navigate(`/invoices/edit/${id}`)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Edit
          </Button>
          
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Bill To:</h3>
                  <div className="mt-1">
                    <p className="font-semibold">{invoice?.clientName}</p>
                    {invoice?.clientEmail && <p>{invoice.clientEmail}</p>}
                    {invoice?.clientAddress && (
                      <p className="whitespace-pre-line mt-1">{invoice.clientAddress}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Invoice Number:</h3>
                    <p className="font-semibold">{invoice?.invoiceNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Issue Date:</h3>
                    <p>{format(new Date(invoice?.date), 'MMMM d, yyyy')}</p>
                  </div>
                  
                  {invoice?.dueDate && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Due Date:</h3>
                      <p>{format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left font-medium text-muted-foreground py-3">Description</th>
                        <th className="text-center font-medium text-muted-foreground py-3">Qty</th>
                        <th className="text-right font-medium text-muted-foreground py-3">Price</th>
                        <th className="text-right font-medium text-muted-foreground py-3">Tax</th>
                        <th className="text-right font-medium text-muted-foreground py-3">Discount</th>
                        <th className="text-right font-medium text-muted-foreground py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice?.items.map((item, index) => {
                        const subtotal = item.quantity * item.price;
                        const tax = (item.tax / 100) * subtotal;
                        const discount = (item.discount / 100) * subtotal;
                        const total = subtotal + tax - discount;
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="py-3">{item.description}</td>
                            <td className="py-3 text-center">{item.quantity}</td>
                            <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                            <td className="py-3 text-right">{item.tax}%</td>
                            <td className="py-3 text-right">{item.discount}%</td>
                            <td className="py-3 text-right">₹{total.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <div className="w-60 space-y-2">
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">₹{invoice?.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`px-4 py-3 rounded-md border ${getStatusColor(invoice?.status)}`}>
                <p className="font-medium">{invoice?.status.charAt(0).toUpperCase() + invoice?.status.slice(1)}</p>
                {invoice?.status === 'paid' && (
                  <p className="text-sm mt-1">This invoice has been paid.</p>
                )}
                {invoice?.status === 'sent' && (
                  <p className="text-sm mt-1">This invoice is awaiting payment.</p>
                )}
                {invoice?.status === 'draft' && (
                  <p className="text-sm mt-1">This invoice is in draft mode and hasn't been sent.</p>
                )}
              </div>
              
              {invoice?.status !== 'paid' && (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => {
                    navigate(`/invoices/edit/${id}`, { state: { updateStatus: 'paid' } });
                  }}
                >
                  Mark as Paid
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadInvoicePdf(id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </Button>
              
              {invoice?.clientEmail && (
                <Button variant="outline" className="w-full justify-start" onClick={handleSendEmail}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email Invoice
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/invoices/edit/${id}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Edit Invoice
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-600" onClick={() => setDeleteDialogOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice {invoice?.invoiceNumber}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceDetail;
