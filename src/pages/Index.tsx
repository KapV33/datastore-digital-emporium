import { useState } from "react";
import { ShopHeader } from "@/components/ShopHeader";
import { ProductTable, Product } from "@/components/ProductTable";
import { FileUploader } from "@/components/FileUploader";
import { Cart } from "@/components/Cart";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CartItem extends Product {
  quantity: number;
}

// Sample data to showcase the shop
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "E-commerce Customer Database",
    description: "Comprehensive customer data with purchase history, demographics, and behavior patterns",
    price: 0.0045,
    category: "E-commerce",
    size: "2.1 GB",
    format: "CSV",
    records: 1250000
  },
  {
    id: "2", 
    name: "Financial Markets Dataset",
    description: "Historical stock prices, trading volumes, and market indicators from 2010-2024",
    price: 0.0089,
    category: "Finance",
    size: "5.4 GB", 
    format: "JSON",
    records: 3400000
  },
  {
    id: "3",
    name: "Social Media Analytics",
    description: "Anonymized social media posts, engagement metrics, and sentiment analysis data",
    price: 0.0032,
    category: "Social Media",
    size: "1.8 GB",
    format: "CSV",
    records: 890000
  },
  {
    id: "4",
    name: "Real Estate Listings Database",
    description: "Property listings with prices, locations, features, and market trends",
    price: 0.0067,
    category: "Real Estate",
    size: "3.2 GB",
    format: "XLSX",
    records: 750000
  },
  {
    id: "5",
    name: "Healthcare Research Data",
    description: "Clinical trial data, patient outcomes, and medical device performance metrics",
    price: 0.0156,
    category: "Healthcare",
    size: "8.7 GB",
    format: "JSON",
    records: 2100000
  },
  {
    id: "6",
    name: "Cryptocurrency Trading Data",
    description: "Bitcoin, Ethereum, and altcoin trading data with order books and price movements",
    price: 0.0098,
    category: "Cryptocurrency",
    size: "4.6 GB",
    format: "CSV",
    records: 1890000
  }
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleProductsAdded = (newProducts: Product[]) => {
    setProducts(prev => [...prev, ...newProducts]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
        onUploadClick={() => setShowUploader(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Premium Database Marketplace
          </h2>
          <p className="text-muted-foreground text-lg">
            High-quality, verified databases for your business needs. Pay securely with Bitcoin and receive instant delivery.
          </p>
        </div>

        <ProductTable
          products={products}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Upload Dialog */}
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <FileUploader
            onProductsAdded={handleProductsAdded}
            onClose={() => setShowUploader(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <Cart
            items={cartItems}
            onClose={() => setShowCart(false)}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
