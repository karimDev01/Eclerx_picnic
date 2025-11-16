'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Registration } from '@/app/lib/types';

interface RegistrationActionsProps {
  registration: Registration;
  onStatusChange: () => void;
}

export function RegistrationActions({ registration, onStatusChange }: RegistrationActionsProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/registrations/${registration.id}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error approving registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/registrations/${registration.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (response.ok) {
        setRejectDialogOpen(false);
        setRejectionReason('');
        onStatusChange();
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
    } finally {
      setLoading(false);
    }
  };

  if (registration.status === 'approved') {
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Approved</span>;
  }

  if (registration.status === 'rejected') {
    return (
      <div>
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Rejected</span>
        {registration.rejectionReason && (
          <p className="text-xs text-muted-foreground mt-1">{registration.rejectionReason}</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="default" 
          onClick={handleApprove}
          disabled={loading}
        >
          Approve
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => setRejectDialogOpen(true)}
          disabled={loading}
        >
          Reject
        </Button>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Registration</DialogTitle>
            <DialogDescription>Provide a reason for rejection. This will be sent to the user.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-24"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={loading || !rejectionReason.trim()}
            >
              {loading ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
