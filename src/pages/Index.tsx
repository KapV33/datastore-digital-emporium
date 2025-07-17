import { useState } from "react";
import databasePreview from "@/assets/database-preview.jpg";
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
    price: 199.99,
    category: "E-commerce",
    format: "CSV",
    records: 1250000,
    preview: databasePreview,
    tags: ["customers", "e-commerce", "analytics"],
    lastUpdated: "2024-01-15",
    source: "Global retailers",
    schema: "customer_id, email, first_name, last_name, age, gender, location, total_spent, last_purchase_date, preferred_categories"
  },
  {
    id: "2", 
    name: "Financial Markets Dataset",
    description: "Historical stock prices, trading volumes, and market indicators from 2010-2024",
    price: 599.99,
    category: "Finance",
    format: "JSON",
    records: 3400000,
    preview: databasePreview,
    tags: ["stocks", "finance", "trading"],
    lastUpdated: "2024-01-18",
    source: "Financial exchanges",
    schema: "symbol, company_name, date, open_price, high_price, low_price, close_price, volume, market_cap"
  },
  {
    id: "3",
    name: "Social Media Analytics",
    description: "Anonymized social media posts, engagement metrics, and sentiment analysis data",
    price: 149.99,
    category: "Social Media",
    format: "CSV",
    records: 890000,
    preview: databasePreview,
    tags: ["social-media", "analytics", "sentiment"],
    lastUpdated: "2024-01-12",
    source: "Social platforms",
    schema: "post_id, platform, user_id, content, engagement_score, sentiment, timestamp, hashtags"
  },
  {
    id: "4",
    name: "Real Estate Listings Database",
    description: "Property listings with prices, locations, features, and market trends",
    price: 249.99,
    category: "Real Estate",
    format: "XLSX",
    records: 750000,
    preview: databasePreview,
    tags: ["properties", "real-estate", "housing"],
    lastUpdated: "2024-01-16",
    source: "Property listings",
    schema: "property_id, address, city, state, zip_code, price, bedrooms, bathrooms, square_feet, property_type, year_built"
  },
  {
    id: "5",
    name: "Healthcare Research Data",
    description: "Clinical trial data, patient outcomes, and medical device performance metrics",
    price: 349.99,
    category: "Healthcare",
    format: "JSON",
    records: 2100000,
    preview: databasePreview,
    tags: ["healthcare", "medical", "research"],
    lastUpdated: "2024-01-10",
    source: "Medical institutions",
    schema: "patient_id, age_group, gender, diagnosis_codes, treatment_type, outcome, duration, insurance_type"
  },
  {
    id: "6",
    name: "Cryptocurrency Trading Data",
    description: "Bitcoin, Ethereum, and altcoin trading data with order books and price movements",
    price: 179.99,
    category: "Cryptocurrency",
    format: "CSV",
    records: 1890000,
    preview: databasePreview,
    tags: ["crypto", "trading", "blockchain"],
    lastUpdated: "2024-01-14",
    source: "Crypto exchanges",
    schema: "symbol, timestamp, open, high, low, close, volume, market_cap, circulating_supply"
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
