import { Users, Package, DollarSign, Store, UserPlus, ShieldCheck, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers, mockProducts, mockOrders } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  const sellers = mockUsers.filter(u => u.role === 'seller');
  const users = mockUsers.filter(u => u.role === 'user');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-medium mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Users', value: users.length, icon: Users },
            { title: 'Sellers', value: sellers.length, icon: Store },
            { title: 'Products', value: mockProducts.length, icon: Package },
            { title: 'Revenue', value: '$45,231', icon: DollarSign },
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

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">User</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Email</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Joined</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-label">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{u.name}</td>
                          <td className="py-3 px-2 text-body">{u.email}</td>
                          <td className="py-3 px-2 text-body">{u.createdAt}</td>
                          <td className="py-3 px-2 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sellers" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">Sellers</CardTitle>
                <Button variant="luxury" size="sm"><UserPlus className="h-4 w-4 mr-2" />Add Seller</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Seller</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Email</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Products</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-label">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.map((s) => (
                        <tr key={s.id} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{s.name}</td>
                          <td className="py-3 px-2 text-body">{s.email}</td>
                          <td className="py-3 px-2">{mockProducts.filter(p => p.sellerId === s.id).length}</td>
                          <td className="py-3 px-2 text-right">
                            <Button variant="ghost" size="icon"><ShieldCheck className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">All Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Product</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Seller</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-label">Price</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-label">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.slice(0, 5).map((p) => (
                        <tr key={p.id} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{p.name}</td>
                          <td className="py-3 px-2 text-body">{p.sellerName}</td>
                          <td className="py-3 px-2">${p.price}</td>
                          <td className="py-3 px-2 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
