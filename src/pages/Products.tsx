import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { mockProducts, mockCategories } from '@/data/mockData';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const priceRanges = [
  { value: '0-100', label: 'Under $100' },
  { value: '100-250', label: '$100 - $250' },
  { value: '250-500', label: '$250 - $500' },
  { value: '500+', label: '$500+' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by category
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      products = products.filter(p => {
        return selectedPriceRanges.some(range => {
          if (range === '0-100') return p.price < 100;
          if (range === '100-250') return p.price >= 100 && p.price < 250;
          if (range === '250-500') return p.price >= 250 && p.price < 500;
          if (range === '500+') return p.price >= 500;
          return true;
        });
      });
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        // Featured - keep original order
        break;
    }

    return products;
  }, [selectedCategories, selectedPriceRanges, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSortBy('featured');
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Category</h3>
        <div className="space-y-3">
          {mockCategories.map(category => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label htmlFor={`cat-${category.slug}`} className="text-sm text-body cursor-pointer">
                {category.name} ({category.productCount})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Price Range</h3>
        <div className="space-y-3">
          {priceRanges.map(range => (
            <div key={range.value} className="flex items-center gap-3">
              <Checkbox
                id={`price-${range.value}`}
                checked={selectedPriceRanges.includes(range.value)}
                onCheckedChange={() => togglePriceRange(range.value)}
              />
              <Label htmlFor={`price-${range.value}`} className="text-sm text-body cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-medium">All Products</h1>
          <p className="mt-2 text-body">{filteredProducts.length} products</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-label hidden sm:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grid Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={gridCols === 3 ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setGridCols(3)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={gridCols === 4 ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setGridCols(4)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} columns={gridCols} />
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-body">No products found</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
