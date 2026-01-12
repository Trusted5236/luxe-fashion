import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { navLinks } from '@/constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/auth';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/seller';
      default:
        return '/account';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide">
            LUXÉ
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-body hover:text-foreground transition-colors tracking-wide uppercase"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
            {isAuthenticated ? (
  <div className="hidden sm:flex items-center gap-2">
    <div 
      className="relative"
      onMouseEnter={() => setShowAccountMenu(true)}
      onMouseLeave={() => setShowAccountMenu(false)}
    >
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>

      {showAccountMenu && (
        <div  className="absolute right-0 top-full pt-2 z-50">
          <div className="w-72 bg-background border border-border rounded-lg shadow-lg p-4">
          <div className="space-y-4">
            <div className="border-b border-border pb-3">
              <p className="font-medium text-heading">{user.name}</p>
              <p className="text-sm text-label">{user.email}</p>
            </div>
            
            <div>
              <p className="text-xs text-label uppercase tracking-wide mb-2">Account Type</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                {user.role}
              </span>
            </div>

            {/* {user.role === 'user' && (
              <Button 
                variant="luxury" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  navigate('/request-seller');
                  setShowAccountMenu(false);
                }}
              >
                Become a Seller
              </Button>
            )} */}

            {user.role !== 'user' && (
              <Button 
                variant="luxury-outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  navigate(getDashboardLink());
                  setShowAccountMenu(false);
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
    <Button variant="ghost" size="sm" onClick={logout}>
      Sign Out
    </Button>
  </div>
) : (
              <Button
                variant="luxury-outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-99 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="py-2 text-sm font-medium text-body hover:text-foreground transition-colors tracking-wide uppercase"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-border mt-2">
  {isAuthenticated ? (
    <div className="flex flex-col gap-3">
      <div className="border-b border-border pb-3">
        <p className="font-medium text-heading">{user.name}</p>
        <p className="text-sm text-label">{user.email}</p>
      </div>
      
      <div>
        <p className="text-xs text-label uppercase tracking-wide mb-2">Account Type</p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
          {user.role}
        </span>
      </div>

      {user.role === 'user' && (
        <Button 
          variant="luxury" 
          size="sm" 
          className="w-full"
          onClick={() => {
            navigate('/request-seller');
            setIsOpen(false);
          }}
        >
          Become a Seller
        </Button>
      )}

      {user.role !== 'user' && (
        <Button 
          variant="luxury-outline" 
          size="sm" 
          className="w-full"
          onClick={() => {
            navigate(getDashboardLink());
            setIsOpen(false);
          }}
        >
          Go to Dashboard
        </Button>
      )}

      <button
        onClick={() => {
          logout();
          setIsOpen(false);
        }}
        className="py-2 text-sm font-medium text-body hover:text-foreground text-left"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <Button
      variant="luxury"
      className="w-full"
      onClick={() => {
        navigate('/auth');
        setIsOpen(false);
      }}
    >
      Sign In
    </Button>
  )}
</div>
              ) : (
                <Button
                  variant="luxury"
                  className="w-full"
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

      </nav>
    </header>
  );
}
