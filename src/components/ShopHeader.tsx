import { ShoppingCart, Database, Upload, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ShopHeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onUploadClick: () => void;
}

export const ShopHeader = ({ cartCount, onCartClick, onUploadClick }: ShopHeaderProps) => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">DataVault</h1>
              <p className="text-sm text-muted-foreground">Premium Database Marketplace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-bitcoin text-white border-bitcoin">
              <Bitcoin className="h-4 w-4 mr-1" />
              BTC Accepted
            </Badge>
            
            <Button variant="outline" onClick={onUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Stock
            </Button>
            
            <Button variant="outline" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-secondary text-secondary-foreground">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};