'use client';

// ============================================================
// CLIENT WALLET COMPONENT
// Shows gift cards and available credits for checkout
// ============================================================

import { useState, useEffect } from 'react';

interface GiftCard {
  id: string;
  code: string;
  last4: string;
  initialValue: number;
  currentBalance: number;
  status: string;
  type: string;
  expiresAt: string | null;
  isExpired: boolean;
  isOwned: boolean;
  isPurchased: boolean;
  purchaserName: string | null;
  message: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

interface WalletData {
  giftCards: GiftCard[];
  giftCardBalance: number;
  totalAvailable: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  notes: string | null;
}

interface ClientWalletProps {
  clientId: string;
  onSelectGiftCard?: (card: GiftCard, amount: number) => void;
  checkoutMode?: boolean;
  amountDue?: number;
}

export default function ClientWallet({
  clientId,
  onSelectGiftCard,
  checkoutMode = false,
  amountDue = 0,
}: ClientWalletProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [applyAmount, setApplyAmount] = useState<number>(0);

  useEffect(() => {
    fetchWallet();
  }, [clientId]);

  const fetchWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/clients/${clientId}/wallet`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch wallet');
      }

      setWallet(data.wallet);
      setTransactions(data.recentTransactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCard = (card: GiftCard) => {
    if (selectedCard === card.id) {
      setSelectedCard(null);
      setApplyAmount(0);
    } else {
      setSelectedCard(card.id);
      // Default to full balance or amount due, whichever is less
      setApplyAmount(Math.min(card.currentBalance, amountDue || card.currentBalance));
    }
  };

  const handleApply = () => {
    if (!selectedCard || !onSelectGiftCard || applyAmount <= 0) return;
    
    const card = wallet?.giftCards.find(c => c.id === selectedCard);
    if (card) {
      onSelectGiftCard(card, applyAmount);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-2"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={fetchWallet} className="text-sm text-red-700 underline mt-2">
          Retry
        </button>
      </div>
    );
  }

  if (!wallet || wallet.giftCards.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-xl">
        <span className="text-3xl mb-2 block">🎁</span>
        <p className="text-gray-500 text-sm">No gift cards available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Available */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
        <p className="text-sm opacity-90">Available Balance</p>
        <p className="text-3xl font-bold">{formatCurrency(wallet.totalAvailable)}</p>
        <p className="text-xs opacity-75 mt-1">{wallet.giftCards.length} gift card{wallet.giftCards.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Gift Cards List */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-700">Your Gift Cards</h3>
        
        {wallet.giftCards.map(card => (
          <div
            key={card.id}
            className={`p-4 border rounded-xl transition-all ${
              selectedCard === card.id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${checkoutMode ? 'cursor-pointer' : ''}`}
            onClick={() => checkoutMode && handleSelectCard(card)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{card.code}</span>
                  {card.isExpired && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expired</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">•••• {card.last4}</p>
                {card.message && (
                  <p className="text-xs text-gray-400 mt-2 italic">"{card.message}"</p>
                )}
                {card.purchaserName && !card.isOwned && (
                  <p className="text-xs text-gray-400 mt-1">From: {card.purchaserName}</p>
                )}
              </div>
              
              <div className="text-right">
                <p className={`text-xl font-bold ${card.currentBalance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {formatCurrency(card.currentBalance)}
                </p>
                <p className="text-xs text-gray-400">of {formatCurrency(card.initialValue)}</p>
              </div>
            </div>

            {/* Amount selector when selected in checkout mode */}
            {checkoutMode && selectedCard === card.id && (
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm text-gray-600 mb-2">Amount to apply:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={applyAmount}
                    onChange={(e) => setApplyAmount(Math.min(parseFloat(e.target.value) || 0, card.currentBalance))}
                    className="flex-1 px-3 py-2 border rounded-lg text-lg font-bold"
                    max={card.currentBalance}
                    min={0}
                    step={0.01}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleApply(); }}
                    disabled={applyAmount <= 0 || applyAmount > card.currentBalance}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setApplyAmount(card.currentBalance); }}
                    className="text-xs text-purple-600"
                  >
                    Use Full Balance
                  </button>
                  {amountDue > 0 && amountDue <= card.currentBalance && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setApplyAmount(amountDue); }}
                      className="text-xs text-purple-600"
                    >
                      Cover Amount Due ({formatCurrency(amountDue)})
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Expiration warning */}
            {card.expiresAt && !card.isExpired && (
              <p className="text-xs text-amber-600 mt-2">
                Expires {formatDate(card.expiresAt)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity (non-checkout mode) */}
      {!checkoutMode && transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {transactions.slice(0, 5).map(txn => (
              <div key={txn.id} className="flex items-center justify-between text-sm py-2 border-b">
                <div>
                  <p className="text-gray-700 capitalize">{txn.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400">{formatDate(txn.createdAt)}</p>
                </div>
                <p className={`font-medium ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CHECKOUT WALLET PICKER (Simplified for POS)
// ============================================================
export function CheckoutWalletPicker({
  clientId,
  amountDue,
  onApply,
}: {
  clientId: string;
  amountDue: number;
  onApply: (giftCardId: string, amount: number, code: string) => void;
}) {
  return (
    <ClientWallet
      clientId={clientId}
      checkoutMode
      amountDue={amountDue}
      onSelectGiftCard={(card, amount) => onApply(card.id, amount, card.code)}
    />
  );
}
