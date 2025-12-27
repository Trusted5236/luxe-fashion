import { useState } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockProducts, mockOrders } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AddProductForm from '@/components/AddProdouctForm';


export default function SellerDashboard() {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAddProduct = (productData) => {
  console.log('New product:', productData);
  // Add your API call here
  setShowAddProduct(false);
};

  
  if (!user || user.role !== 'seller') {
    return <Navigate to="/auth" replace />;
  }

  const sellerProducts = mockProducts.filter(p => p.sellerId === user.id || p.sellerName === user.name);
  const totalRevenue = sellerProducts.reduce((sum, p) => sum + p.price * 10, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-medium">Seller Dashboard</h1>
            <p className="text-body mt-1">Welcome back, {user.name}</p>
          </div>
          <Button variant="luxury" onClick={() => setShowAddProduct(true)}>
  <Plus className="h-4 w-4 mr-2" /> Add Product
</Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Products', value: sellerProducts.length, icon: Package },
            { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
            { title: 'Orders', value: '24', icon: ShoppingCart },
            { title: 'Growth', value: '+12%', icon: TrendingUp },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-body">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-display font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-label">Product</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-label">Price</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-label">Stock</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-label">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-12 h-16 object-cover" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">${product.price}</td>
                      <td className="py-3 px-2">
                        <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">In Stock</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddProduct && (
  <AddProductForm 
    onClose={() => setShowAddProduct(false)}
    onSubmit={handleAddProduct}
  />
)}
    </Layout>
  );
}
