import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Trash2, Bitcoin, Download } from "lucide-react";
import { Product } from "./ProductTable";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const Cart = ({ items, onClose, onRemoveItem, onUpdateQuantity }: CartProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedPurchases, setCompletedPurchases] = useState<string[]>([]);
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const btcWalletAddress = "1MuCbBteMFrQpcXBNCftPRAwJ954LqZWjy";

  const handleBTCPayment = async () => {
    setIsProcessingPayment(true);
    
    // Show wallet address for payment
    toast({
      title: "Send Bitcoin Payment",
      description: `Send equivalent of $${total.toFixed(2)} in BTC to: ${btcWalletAddress}`,
    });
    
    // Simulate Bitcoin payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mark all items as purchased and delivered
      const purchasedIds = items.map(item => item.id);
      setCompletedPurchases(purchasedIds);
      
      toast({
        title: "Payment Successful!",
        description: "Your databases have been automatically delivered. Download links are now active.",
      });

      // Clear cart after a moment
      setTimeout(() => {
        items.forEach(item => onRemoveItem(item.id));
        setCompletedPurchases([]);
      }, 5000);
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your Bitcoin payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Shopping Cart ({items.length})</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Your cart is empty
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => {
              const isPurchased = completedPurchases.includes(item.id);
              
              return (
                <div key={item.id} className={`p-4 border rounded-lg ${isPurchased ? 'bg-shop-success/10 border-shop-success' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {isPurchased && (
                          <Badge className="bg-shop-success text-white">
                            Delivered
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{item.category}</Badge>
                        <span>{item.format}</span>
                        <span>{item.records.toLocaleString()} records</span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="font-mono font-semibold mb-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      {isPurchased ? (
                        <Button size="sm" variant="outline" className="mb-2">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      )}
                      
                      {!isPurchased && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>

            {completedPurchases.length === 0 && (
              <div className="space-y-3">
                <Button
                  onClick={handleBTCPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white"
                  size="lg"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing Bitcoin Payment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bitcoin className="h-5 w-5" />
                      Pay with Bitcoin
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Secure Bitcoin payment • Instant auto-delivery • No registration required
                </p>
              </div>
            )}

            {completedPurchases.length > 0 && (
              <div className="text-center p-4 bg-shop-success/10 rounded-lg border border-shop-success">
                <p className="text-shop-success font-medium">
                  🎉 Purchase Complete! Your databases have been delivered.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Download links are now active. Items will be removed from cart shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};