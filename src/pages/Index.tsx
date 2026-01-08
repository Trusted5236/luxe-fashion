import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { CategoryCard } from '@/components/categories';
import { Button } from '@/components/ui/button';
import { mockProducts, mockCategories } from '@/data/mockData';
import { useEffect, useRef, useState } from 'react';
import SplitType from "split-type"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchCategories} from '@/services/api';
import { Category } from '@/types';
import { heroContent } from '@/constants';
console.log(heroContent)
import { fetchProducts } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { setToken } from '@/services/api';


gsap.registerPlugin(ScrollTrigger)
const features = [
  {
    icon: Truck,
    title: 'Complimentary Shipping',
    description: 'Free shipping on all orders over $200',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Your payment information is always protected',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
  },
];

const images = heroContent.map(content => content.image);


export default function Index() {
  const navigate = useNavigate()
  const {checkAuth} = useAuth()
  const containerRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
const featuredRef = useRef<HTMLDivElement>(null);
const bannerRef = useRef<HTMLDivElement>(null);
const arrivalsRef = useRef<HTMLDivElement>(null);
const featuresRef = useRef<HTMLDivElement>(null);
const categoryText = useRef<HTMLDivElement>(null);
const featuredText = useRef<HTMLDivElement>(null);
const arrivalText = useRef<HTMLDivElement>(null);
const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);
const heroRef = useRef(null);
  const curveRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const actionsRef = useRef(null);
  const generalAction = useRef(null);
  const imageRefs = useRef([]);
  const titleH1Ref = useRef(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setArrivals] = useState([]);

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  
  console.log('🔍 URL Params:', window.location.search);
  console.log('🔍 Token from URL:', token);
  console.log('🔍 Error from URL:', error);
  
  if (error) {
    toast({
      title: 'Authentication Failed',
      description: 'Unable to sign in with Google',
      variant: 'destructive'
    });
    window.history.replaceState({}, '', '/');
    return;
  }
  
  if (token) {
    console.log('✅ Token found, storing...');
    setToken(token);
    console.log('📦 Token stored:', localStorage.getItem('accessToken'));
    
    // Clean URL first
    window.history.replaceState({}, '', '/');
    
    // Then check auth with delay
    setTimeout(async () => {
      console.log('⏳ Calling checkAuth...');
      await checkAuth();
      console.log('✅ checkAuth completed');
      
      toast({
        title: 'Welcome',
        description: 'Successfully signed in with Google',
      });
    }, 500);
  }
}, [checkAuth]);

  useEffect(() => {
  const loadFeatured = async () => {
    try {
      const data = await fetchProducts('', '', 1, 8);
      const mappedProducts = data.products.map(p => ({
        id: p._id,
        name: p.title,
        price: p.price,
        image: p.displayImage,
        // ... rest of mapping
      }));
      setFeaturedProducts(mappedProducts);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  loadFeatured();
}, []);

  useEffect(() => {
  const loadFeatured = async () => {
    try {
      const data = await fetchProducts('', '', 1, 4);
      const mappedProducts = data.products.map(p => ({
        id: p._id,
        name: p.title,
        price: p.price,
        image: p.displayImage,
        // ... rest of mapping
      }));
      setArrivals(mappedProducts);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  loadFeatured();
}, []);

  useEffect(() => {
  if (loading) return;
  if (!titleRef.current || !titleH1Ref.current || !subtitleRef.current || !actionsRef.current) return;

  const ctx = gsap.context(() => {
    // Initial setup
    gsap.set(imageRefs.current.slice(1), { opacity: 0 });
    
    
    // Function to animate content change
    const animateContentChange = (index) => {
      const tl = gsap.timeline();
      
      // Fade out current content
      tl.to([titleRef.current, titleH1Ref.current, subtitleRef.current, actionsRef.current, generalAction.current], {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power2.in",
        stagger: 0.05
      })
      // Change content (this triggers React re-render)
      .call(() => {
        setCurrentHeroIndex(index);
      })
      // Wait for React to update DOM
      .set({}, {}, "+=0.1")
      // Fade in new content using .to() instead of .from()
      .to([titleRef.current, titleH1Ref.current, subtitleRef.current, actionsRef.current, generalAction.current], {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.1
      });
      
      return tl;
    };

    // Image + Content rotation timeline (10 seconds each)
    const mainTl = gsap.timeline({ repeat: -1 });
    
    heroContent.forEach((content, i) => {
      const nextIndex = (i + 1) % heroContent.length;
      
      mainTl
        // Show current image and content for 10 seconds
        .to({}, { duration: 10 })
        // Crossfade to next image
        .to(imageRefs.current[i], {
          opacity: 0,
          scale: 1.1,
          duration: 1.5,
          ease: "power2.inOut"
        }, "-=1.5")
        .to(imageRefs.current[nextIndex], {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.inOut"
        }, "<")
        // Animate content change
        .add(animateContentChange(nextIndex), "<");
    });

    // Initial content animation
    gsap.from([titleRef.current, titleH1Ref.current, subtitleRef.current, actionsRef.current, generalAction.current], {
      y: 100,
      opacity: 0,
      stagger: 0.15,
      duration: 2,
      ease: "elastic.out(1, 0.5)",
      delay: 0.5
    });

    // Curve animation
    if (curveRef.current) {
      gsap.from(curveRef.current, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.2,
        ease: "power3.inOut",
        delay: 0.8
      });
    }
  }, heroRef);

  return () => ctx.revert();
}, [loading]);

// Add this useEffect after your existing ones
useEffect(() => {
  if (loading) return;

  const ctx = gsap.context(() => {
    
    // Categories Section - Cards fly in from bottom with stagger
    gsap.from('.category-card', {
      scrollTrigger: {
        trigger: categoriesRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 2,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    });

    gsap.from(categoryText.current, {
      scrollTrigger: {
        trigger: categoriesRef.current,
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Featured Products - Fade up with blur effect
    gsap.from(featuredText.current, {
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from(featuredRef.current.querySelectorAll('.product-card'), {
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top 70%',
      },
      y: 80,
      opacity: 0,
      scale: 0.9,
      duration: 2.5,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Banner - Zoom in with overlay fade
    gsap.from(bannerRef.current.querySelector('img'), {
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top 80%',
      },
      scale: 1.3,
      duration: 3,
      ease: 'power2.out'
    });

    gsap.from(bannerRef.current.querySelectorAll('p, h2, button'), {
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top 70%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // New Arrivals - Slide in from sides alternating
    gsap.from(arrivalText.current, {
      scrollTrigger: {
        trigger: arrivalsRef.current,
        start: 'top 80%',
      },
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    const arrivalCards = arrivalsRef.current.querySelectorAll('.product-card');
    arrivalCards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: arrivalsRef.current,
          start: 'top 70%',
        },
        y : 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.5,
        ease: 'back.out(1.2)'
      });
    });

    // Features - Pop in with bounce
    gsap.from(featuresRef.current.querySelectorAll('.grid > div'), {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 85%',
      },
      y: 30, 
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(2)'
    });

  });

  return () => ctx.revert();
}, [loading]);

  useEffect(() => {
  const loadCategories = async () => {
    setLoading(true)
    try {
      const fetchedCategories = await fetchCategories()
      setSelectedCategories(fetchedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  loadCategories()
}, [])




  
  if (loading) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    </Layout>
  );
}


  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-[rgb(186,123,91)]/90">
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Image Stack */}
        <div className="absolute inset-0">
          {images.map((src, i) => (
            <img
              key={i}
              ref={el => imageRefs.current[i] = el}
              src={src}
              alt={`Hero ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                opacity: i === 0 ? 1 : 0,
                transform: 'scale(1)'
              }}
            />
          ))}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center z-10">
  <div className="w-full px-2 max-w-xl">
    <div>
      <p ref={titleRef} className="text-sm text-white/90 uppercase tracking-[0.3em] mb-4">
        {heroContent[currentHeroIndex].eyebrow}
      </p>
      <h1 ref={titleH1Ref} className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-tight"
  style={{
    background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 50%, #A67358 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}>
        <span className="block">{heroContent[currentHeroIndex].titleLine1}</span>
        <span className="block">{heroContent[currentHeroIndex].titleLine2}</span>
      </h1>
    </div>
    
    <p ref={subtitleRef} className="mt-6 text-white/90 text-lg max-w-md">
      {heroContent[currentHeroIndex].description}
    </p>

    <div className='w-full flex flex-col sm:flex-row gap-2'>
      <div ref={generalAction} className=" flex flex-wrap gap-4">
      <Link 
        to={`/products?category=${heroContent[currentHeroIndex].category}`}
      className="px-4 py-4 bg-primary text-white font-medium rounded-lg  hover:scale-90 transition-all duration-75 ease-in-out"
      >
        {heroContent[currentHeroIndex].ctag}
      </Link>
    </div>
    
    <div ref={actionsRef} className=" flex flex-wrap gap-4 ">
      <Link 
        to={`/products?category=${heroContent[currentHeroIndex].category}`}
        className="px-4 py-4 bg-white text-[#000000] border-1 border-black rounded-lg font-medium hover:scale-90 transition-all duration-75 ease-in-out"
      >
        {heroContent[currentHeroIndex].cta}
      </Link>
    </div>
    </div>
    
  </div>
</div>

        {/* C-Curve Divider */}
        {/* <div 
          ref={curveRef}
          className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none"
        >
          <svg 
            className="absolute bottom-0 w-full h-full" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0,0 Q360,120 720,60 T1440,0 L1440,120 L0,120 Z" 
              fill="rgb(17, 24, 39)"
              className="drop-shadow-2xl"
            />
          </svg>
        </div> */}
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={categoryText} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-medium">Shop by Category</h2>
            <p className="mt-3 text-body">Explore our carefully curated collections</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {selectedCategories.map((category) => (
              <div className='category-card'>
                <CategoryCard key={category._id} category={category}  />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={featuredRef} className="py-20 bg-off-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div ref={featuredText}>
              <h2 className="font-display text-3xl md:text-4xl font-medium">Featured Pieces</h2>
              <p className="mt-3 text-body">Our editors' selection of the season's finest</p>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wider"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
            <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Promotional Banner */}
      <section ref={bannerRef}  className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80"
            alt="Luxury showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-sm text-background/90 uppercase tracking-[0.3em] mb-4">
            Limited Time
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-background font-medium">
            Season Sale
          </h2>
          <p className="mt-4 text-background/90 text-lg max-w-md mx-auto">
            Up to 40% off on selected luxury items. Elevate your wardrobe today.
          </p>
          <Button asChild variant="secondary" size="xl" className="mt-8">
            <Link to="/products?sale=true">Shop Sale</Link>
          </Button>
        </div>
      </section>

      {/* New Arrivals */}
      <section ref={arrivalsRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div ref={arrivalText}>
              <h2 className="font-display text-3xl md:text-4xl font-medium">New Arrivals</h2>
              <p className="mt-3 text-body">The latest additions to our collection</p>
            </div>
            <Link
              to="/products?sort=newest"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wider"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-16 bg-muted border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="mt-4 font-display text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
