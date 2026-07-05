import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Wallet, AlertCircle, Zap, Check, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
  },
  {
    id: '2',
    type: 'bank',
    last4: '6789',
    brand: 'Bank of America',
    expiryMonth: 0,
    expiryYear: 0,
  },
];

export default function WalletReplenishmentWidget() {
  const [autoReplenish, setAutoReplenish] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('1');
  const [replenishAmount, setReplenishAmount] = useState(5000);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentBalance = 18400;
  const threshold = 2000;
  const isLowBalance = currentBalance < threshold * 2; // Alert at 2x threshold

  const handleTopUp = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowTopUpModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Low Balance Alert */}
      {isLowBalance && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-200/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Wallet Balance Low</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Your wallet is running low. Top up now to continue receiving qualified opportunities.
              </p>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => setShowTopUpModal(true)}
              >
                Top Up Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Current Balance</p>
                <p className="text-3xl font-bold text-foreground">${currentBalance.toLocaleString()}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowTopUpModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Zap className="w-4 h-4 mr-2" />
              Top Up
            </Button>
          </div>

          <div className="bg-background rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Auto-replenishment threshold</p>
            <p className="text-lg font-semibold text-foreground">${threshold.toLocaleString()}</p>
          </div>
        </Card>
      </motion.div>

      {/* Auto-Replenishment Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Auto-Replenishment</h3>
              <p className="text-xs text-muted-foreground">
                Automatically top up when balance drops below threshold
              </p>
            </div>
            <Switch checked={autoReplenish} onCheckedChange={setAutoReplenish} />
          </div>

          <AnimatePresence>
            {autoReplenish && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-border"
              >
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Replenishment Amount
                  </label>
                  <div className="flex gap-2">
                    {[2500, 5000, 10000, 25000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setReplenishAmount(amount)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          replenishAmount === amount
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        ${amount / 1000}k
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {method.brand} •••• {method.last4}
                            </p>
                            {method.type === 'card' && (
                              <p className="text-xs text-muted-foreground">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            )}
                          </div>
                          {selectedPayment === method.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-200/30 rounded-lg p-3">
                  <p className="text-xs text-green-900 font-semibold">
                    Get 5% bonus credit when you enable auto-replenishment
                  </p>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() =>
                    toast.success(
                      `Auto-replenishment set: top up $${replenishAmount.toLocaleString()} when the balance runs low.`,
                    )
                  }
                >
                  Enable Auto-Replenishment
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Replenishment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-border">
          <h3 className="font-semibold text-foreground mb-4">Recent Top-Ups</h3>
          <div className="space-y-3">
            {[
              { date: 'Apr 18', amount: 10000, status: 'Completed' },
              { date: 'Apr 10', amount: 5000, status: 'Completed' },
              { date: 'Mar 28', amount: 15000, status: 'Completed' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">${item.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                  {item.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top-Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowTopUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Top Up Wallet</h2>

              <div className="space-y-4 mb-6">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <p className="text-3xl font-bold text-foreground">${replenishAmount.toLocaleString()}</p>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm font-semibold text-foreground">
                    {paymentMethods.find((m) => m.id === selectedPayment)?.brand} •••• 4242
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowTopUpModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleTopUp}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="mr-2"
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
