'use client';

// ============================================================
// TERMINAL STATUS MODAL
// Real-time display of terminal checkout progress
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

interface TerminalStatusModalProps {
  isOpen: boolean;
  saleId: string;
  amount: number;
  onComplete: (data: {
    paymentId: string;
    tipAmount: number;
    totalAmount: number;
    cardBrand?: string;
    cardLast4?: string;
  }) => void;
  onCancel: () => void;
  onRetry: () => void;
  onClose: () => void;
}

interface TerminalStatus {
  checkout_id: string;
  status: string;
  display_status: string;
  display_message: string;
  amount_money: number;
  tip_money: number;
  total_money: number;
  square_payment_id?: string;
  error_code?: string;
  error_message?: string;
  payment?: {
    id: string;
    status: string;
    amount: number;
    tip_amount: number;
    card_brand?: string;
    card_last_four?: string;
    processor_receipt_url?: string;
  };
  sale?: {
    id: string;
    sale_number: string;
    status: string;
    gross_total: number;
    tip_total: number;
    amount_paid: number;
    balance_due: number;
  };
}

export default function TerminalStatusModal({
  isOpen,
  saleId,
  amount,
  onComplete,
  onCancel,
  onRetry,
  onClose,
}: TerminalStatusModalProps) {
  const [status, setStatus] = useState<TerminalStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);

  // Poll for status
  const pollStatus = useCallback(async () => {
    if (!saleId || completedRef.current) return;
    
    try {
      const res = await fetch(`/api/pos/invoices/${saleId}/square/terminal-status`);
      const data = await res.json();
      
      if (res.ok && data.checkout_id) {
        setStatus(data);
        
        // Check for completion
        if (data.status === 'COMPLETED' && !completedRef.current) {
          completedRef.current = true;
          setPolling(false);
          
          // Notify parent
          onComplete({
            paymentId: data.square_payment_id || data.payment?.id || '',
            tipAmount: data.tip_money || 0,
            totalAmount: data.total_money || data.amount_money || 0,
            cardBrand: data.payment?.card_brand,
            cardLast4: data.payment?.card_last_four,
          });
        } else if (['CANCELED', 'FAILED', 'EXPIRED'].includes(data.status)) {
          setPolling(false);
          setError(data.error_message || data.display_message || 'Payment failed');
        }
      } else if (res.status === 404) {
        // Checkout not yet created, keep polling
      } else {
        console.error('Failed to fetch status:', data);
      }
    } catch (err) {
      console.error('Error polling status:', err);
    }
  }, [saleId, onComplete]);

  // Start polling when modal opens
  useEffect(() => {
    if (isOpen && saleId) {
      setPolling(true);
      setError(null);
      completedRef.current = false;
      
      // Start immediate poll
      pollStatus();
      
      // Poll every 2 seconds
      pollIntervalRef.current = setInterval(pollStatus, 2000);
    }
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isOpen, saleId, pollStatus]);

  // Handle cancel
  const handleCancel = async () => {
    setCanceling(true);
    
    try {
      const res = await fetch(`/api/pos/invoices/${saleId}/square/cancel`, {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setPolling(false);
        onCancel();
      } else {
        setError(data.error || 'Could not cancel checkout');
      }
    } catch (err) {
      setError('Failed to cancel');
    } finally {
      setCanceling(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setStatus(null);
    setError(null);
    completedRef.current = false;
    onRetry();
  };

  if (!isOpen) return null;

  // Determine display state
  const displayStatus = status?.display_status || 'pending';
  const isCompleted = status?.status === 'COMPLETED';
  const isFailed = ['CANCELED', 'FAILED', 'EXPIRED'].includes(status?.status || '');
  const isInProgress = !isCompleted && !isFailed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white backdrop-blur-sm"
        onClick={isCompleted || isFailed ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-black rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-black">
          <h2 className="text-xl font-semibold text-white text-center">
            {isCompleted ? 'Payment Complete' : isFailed ? 'Payment Failed' : 'Terminal Payment'}
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {isCompleted ? (
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : isFailed ? (
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Amount */}
          <div className="text-center mb-4">
            <p className="text-black text-sm">
              {isCompleted ? 'Total Charged' : 'Amount'}
            </p>
            <p className="text-4xl font-bold text-white">
              ${((status?.total_money || amount) / 100).toFixed(2)}
            </p>
            {status?.tip_money && status.tip_money > 0 && (
              <p className="text-green-400 text-sm mt-1">
                Includes ${(status.tip_money / 100).toFixed(2)} tip
              </p>
            )}
          </div>
          
          {/* Status Message */}
          <div className="text-center mb-6">
            {isInProgress && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                <p className="text-black">
                  {status?.display_message || 'Sending to terminal...'}
                </p>
              </div>
            )}
            {isCompleted && (
              <p className="text-green-400">
                Payment successful!
                {status?.payment?.card_brand && status?.payment?.card_last_four && (
                  <span className="block text-sm text-black mt-1">
                    {status.payment.card_brand} ****{status.payment.card_last_four}
                  </span>
                )}
              </p>
            )}
            {isFailed && (
              <p className="text-[#FF2D8E]">
                {error || status?.display_message || 'Payment was not completed'}
              </p>
            )}
          </div>
          
          {/* Progress Steps (when in progress) */}
          {isInProgress && (
            <div className="space-y-2 mb-6">
              <StatusStep 
                label="Sending to terminal" 
                status={displayStatus === 'pending' ? 'active' : 'completed'} 
              />
              <StatusStep 
                label="Waiting for customer" 
                status={displayStatus === 'in_progress' ? 'active' : displayStatus === 'pending' ? 'pending' : 'completed'} 
              />
              <StatusStep 
                label="Processing payment" 
                status={displayStatus === 'completed' ? 'active' : 'pending'} 
              />
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-black flex gap-3">
          {isInProgress && (
            <button
              onClick={handleCancel}
              disabled={canceling}
              className="flex-1 py-3 px-4 bg-black text-white rounded-xl hover:bg-black disabled:opacity-50"
            >
              {canceling ? 'Canceling...' : 'Cancel'}
            </button>
          )}
          
          {isFailed && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-black text-white rounded-xl hover:bg-black"
              >
                Close
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 py-3 px-4 bg-[#FF2D8E] text-white rounded-xl hover:bg-black font-medium"
              >
                Try Again
              </button>
            </>
          )}
          
          {isCompleted && (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Status step indicator
function StatusStep({ label, status }: { label: string; status: 'pending' | 'active' | 'completed' }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        status === 'completed' ? 'bg-green-500' :
        status === 'active' ? 'bg-blue-500' :
        'bg-black'
      }`}>
        {status === 'completed' ? (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : status === 'active' ? (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        ) : (
          <div className="w-2 h-2 bg-white0 rounded-full" />
        )}
      </div>
      <span className={`text-sm ${
        status === 'active' ? 'text-white' : 'text-black'
      }`}>
        {label}
      </span>
    </div>
  );
}
