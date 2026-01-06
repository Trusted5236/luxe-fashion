import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category.name}`}
      className={cn(
        "group relative block aspect-[3/4] overflow-hidden bg-muted",
        className
      )}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl md:text-3xl font-medium text-background tracking-wide">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-background/80">{category.productCount} Products</p>
      </div>
    </Link>
  );
}
