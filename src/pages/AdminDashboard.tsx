import { Users, Package, DollarSign, Store, UserPlus, ShieldCheck, Trash2, FolderPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postCategory, fetchCategories, deleteCategory} from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface Category {
  name: string;
  image: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  console.log('Categories:', categories);
  
  const [activeTab, setActiveTab] = useState('categories');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({ name: '', image: '' });

  const handleCreateCategory = async () => {
  if (!newCategory.name || !newCategory.image) return;
  
  try {
    const formData : any = new FormData();
    formData.append('name', newCategory.name);
    formData.append('image', newCategory.image);
    
    await postCategory(formData);
    toast({
              title: 'Upload Successful',
              description: 'Category created successfully',
            });
    setNewCategory({ name: '', image: null });
    setShowCategoryForm(false);
    loadCategories();
  } catch (error) {
    console.error('Error creating category:', error);
    toast({
            title: 'Upload Failed',
            description: error instanceof Error ? error.message : 'An unexpected error occurred',
            variant: 'destructive',
          });
  }
};


    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

  useEffect(() => {
    loadCategories();
  }, []);


  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast({
        title: 'Delete Successful',
        description: 'Category deleted successfully',
      });
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Mock data
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-02-20' },
  ];
  
  const mockSellers = [
    { id: '3', name: 'Luxury Store', email: 'store@example.com', role: 'seller', createdAt: '2024-01-10', products: 5 },
  ];

  const mockProducts = [
    { id: '1', name: 'Designer Watch', sellerName: 'Luxury Store', price: 299, sellerId: '3' },
    { id: '2', name: 'Leather Wallet', sellerName: 'Luxury Store', price: 89, sellerId: '3' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-medium mb-8">Welcome, {user?.name || 'Admin'}</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Users', value: mockUsers.length, icon: Users },
            { title: 'Sellers', value: mockSellers.length, icon: Store },
            { title: 'Products', value: mockProducts.length, icon: Package },
            { title: 'Revenue', value: '$45,231', icon: DollarSign },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-border p-6">
              <div className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-body">{stat.title}</p>
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-display font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-border">
          <div className="border-b border-border px-6">
            <div className="flex space-x-8">
              {['categories', 'users', 'sellers', 'products'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-label hover:text-body hover:border-border'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-medium">Categories</h2>
                  <button
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Add Category
                  </button>
                </div>

                {/* Create Category Form */}
                {showCategoryForm && (
                  <div className="bg-secondary/30 rounded-lg p-6 mb-6 border border-border">
                    <h3 className="font-display text-lg font-medium mb-4">Create New Category</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-label mb-2">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., Accessories, Electronics"
                        />
                      </div>
                      <div>
  <label className="block text-sm font-medium text-label mb-2">
    Category Image
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
  />
</div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleCreateCategory}
                          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Create Category
                        </button>
                        <button
                          onClick={() => setShowCategoryForm(false)}
                          className="px-4 py-2 bg-secondary text-body text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-secondary/20 relative">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display font-medium">{category.name}</h3>
                            <p className="text-sm text-label mt-1">ID: {category._id}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-12">
                    <FolderPlus className="h-12 w-12 text-label mx-auto mb-4" />
                    <p className="text-body">No categories yet. Create your first category!</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="font-display text-xl font-medium mb-4">Users</h2>
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
                      {mockUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{u.name}</td>
                          <td className="py-3 px-2 text-body">{u.email}</td>
                          <td className="py-3 px-2 text-body">{u.createdAt}</td>
                          <td className="py-3 px-2 text-right">
                            <button className="px-3 py-1 text-sm text-body hover:bg-secondary/50 rounded">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sellers Tab */}
            {activeTab === 'sellers' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-medium">Sellers</h2>
                  <button className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Seller
                  </button>
                </div>
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
                      {mockSellers.map((s) => (
                        <tr key={s.id} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{s.name}</td>
                          <td className="py-3 px-2 text-body">{s.email}</td>
                          <td className="py-3 px-2">{s.products}</td>
                          <td className="py-3 px-2 text-right space-x-2">
                            <button className="p-2 hover:bg-secondary/50 rounded">
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h2 className="font-display text-xl font-medium mb-4">All Products</h2>
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
                      {mockProducts.map((p) => (
                        <tr key={p.id} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{p.name}</td>
                          <td className="py-3 px-2 text-body">{p.sellerName}</td>
                          <td className="py-3 px-2">${p.price}</td>
                          <td className="py-3 px-2 text-right space-x-2">
                            <button className="px-3 py-1 text-sm text-body hover:bg-secondary/50 rounded">View</button>
                            <button className="p-2 hover:bg-red-50 rounded text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}