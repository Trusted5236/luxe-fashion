import { useState, useMemo, useEffect } from 'react';
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
import { fetchProducts } from '@/services/api';
import { set } from 'date-fns';
import { fetchCategories, individualProducts} from '@/services/api';
import { useParams } from 'react-router-dom';

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
  const [categories, setCategories] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [productsData, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 8;
  const {id} = useParams();
  const [productDetails, setProductDetails] = useState(null); 

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


useEffect(() => {
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(
        selectedCategories[0], 
        searchParams.get('search') || '',
        currentPage,
        perPage
      );
      
      const mappedProducts = data.products.map(p => ({
        id: p._id,
        sellerName: p.sellerName,
        name: p.title,
        price: p.price,
        images: p.images,
        image: p.displayImage,
        category: selectedCategories[0] || '',
        rating: p.reviews.averageRating,
        reviews: p.reviews.numberOfReviews,
        originalPrice: p.bonus,
      }));
      
      setProducts(mappedProducts);
      setTotalPages(data.totalPages); // Store total pages
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [selectedCategories, searchParams, currentPage]);

 const filteredProducts = useMemo(() => {
  let productList = [...productsData];

  
  // Keep price range filtering
  if (selectedPriceRanges.length > 0) {
    productList = productList.filter(p => {
      return selectedPriceRanges.some(range => {
        if (range === '0-100') return p.price < 100;
        if (range === '100-250') return p.price >= 100 && p.price < 250;
        if (range === '250-500') return p.price >= 250 && p.price < 500;
        if (range === '500+') return p.price >= 500;
        return true;
      });
    });
  }

  // Keep sorting
  switch (sortBy) {
    case 'price-low':
      productList.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      productList.sort((a, b) => b.price - a.price);
      break;
  }

  return productList;
}, [productsData, selectedPriceRanges, sortBy]);

  // const toggleCategory = (category: string) => {
  //   setSelectedCategories(prev =>
  //     prev.includes(category)
  //       ? prev.filter(c => c !== category)
  //       : [...prev, category]
  //   );
  // };

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
          {categories.map(category => (
  <div key={category._id} className="flex items-center gap-3">
    <Checkbox
      id={`cat-${category.name}`}
      checked={selectedCategories.includes(category.name)}
      onCheckedChange={() => toggleCategory(category.name)}
    />
    <Label htmlFor={`cat-${category.name}`}>
      {category.name}
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

  const toggleCategory = (category: string) => {
  setSelectedCategories(prev =>
    prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category]
  );
  setCurrentPage(1); // Reset to page 1
};



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
  {loading ? (
    <div className="text-center py-16">Loading products...</div>
  ) : filteredProducts.length > 0 ? (
    <>
      <ProductGrid products={filteredProducts} columns={gridCols} />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
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
