import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { CategoryCard } from '@/components/categories';
import { Button } from '@/components/ui/button';
import { mockProducts, mockCategories } from '@/data/mockData';
import { useEffect, useRef } from 'react';
import SplitType from "split-type"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


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

const images = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
  "https://images.unsplash.com/photo-1699832728171-cf774fa92150?q=80&w=1330&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1724184888075-99af09dfa57c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

export default function Index() {
  const featuredProducts = mockProducts.slice(0, 4);
  const newArrivals = mockProducts.slice(4, 8);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
const featuredRef = useRef<HTMLDivElement>(null);
const bannerRef = useRef<HTMLDivElement>(null);
const arrivalsRef = useRef<HTMLDivElement>(null);
const featuresRef = useRef<HTMLDivElement>(null);
const categoryText = useRef<HTMLDivElement>(null);
const featuredText = useRef<HTMLDivElement>(null);
const arrivalText = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!titleRef.current || !subTitleRef.current) return

    const titleSplit = new SplitType(titleRef.current, {
      types : "lines,words"
    })

    const subtitleSplit = new SplitType(subTitleRef.current, {
      types : "words"
    })

    gsap.from(titleSplit.words, {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.5,
    })

    gsap.from(subtitleSplit.words, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: "power3.out",
    stagger: 0.05,
  });

  return ()=>{
    titleSplit.revert()
    subtitleSplit.revert()
  }
  }, [])

  useGSAP(()=>{
    const imgs = gsap.utils.toArray<HTMLImageElement>(".hero-image")

    const tl = gsap.timeline({repeat : -1})

    imgs.forEach((img, i)=>{
      const next = imgs[(i + 1) % imgs.length]

      tl
      .to(img, { opacity: 0, scale: 1.1, duration: 1.5, ease: "power2.out" })
      .to(next, { opacity: 1, scale: 1, duration: 5, ease: "power2.out" }, "<")
      .to({}, { duration: 2 })
    })
  }, {scope: heroRef})

  useGSAP(()=>{
    gsap.from(categoryText.current?.querySelectorAll("h2, p"),{
      scrollTrigger:{
        trigger: categoriesRef.current,
        start: "top 80%"
      },
      y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
    })


    gsap.from(arrivalText.current?.querySelectorAll("h2, p"),{
      scrollTrigger:{
        trigger: arrivalsRef.current,
        start: "top 80%"
      },
      y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
    })



    gsap.from(featuredText.current?.querySelectorAll("h2, p"),{
      scrollTrigger:{
        trigger: featuredRef.current,
        start: "top 80%"
      },
      y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.5,
    ease: "power3.out"
    })

    gsap.from(".category-card", {
      scrollTrigger: {
        trigger: categoriesRef.current,
        start: "top 80%"
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.6,
      ease: "power3.out"
    })


    gsap.from(".product-card", {
      scrollTrigger: {
        trigger: featuredRef.current ? featuredRef.current : arrivalsRef.current,
        start: "top 80%"
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.6,
      ease: "power3.out"
    })

      gsap.from(bannerRef.current, {
    scrollTrigger: {
      trigger: bannerRef.current,
      start: "top 80%"
    },
    opacity: 0,
    duration: 5,
    ease: "power3.out"
  });
  }, {scope: containerRef})

  
  

  return (
    <Layout>
      <div ref={containerRef}>
              {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div ref={heroRef} className="absolute inset-0">
          {images.map((src, i)=>(
            <img
            key={i}
            src={src}
            className="hero-image absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
        
          <div className="absolute inset-0 w-full h-full object-cover" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl hero-content">
            <p ref={titleRef} className="text-sm text-background/90 uppercase tracking-[0.3em] mb-4 hero-title">
              New Collection 2024
            </p>
            <h1 ref={titleRef} className="font-display text-5xl md:text-6xl lg:text-7xl text-background font-medium leading-tight">
              Timeless
              <br />
              Elegance
            </h1>
            <p ref={subTitleRef} className="mt-6 text-background/90 text-lg max-w-md hero-descriptions">
              Discover our curated selection of luxury fashion pieces designed for the discerning individual.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 hero-actions">
              <Button asChild variant="secondary" size="xl">
                <Link to="/products">Shop Collection</Link>
              </Button>
              <Button asChild variant="luxury-outline" size="xl" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/products?category=women">Women's</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={categoryText} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-medium">Shop by Category</h2>
            <p className="mt-3 text-body">Explore our carefully curated collections</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {mockCategories.map((category) => (
              <div className='category-card'>
                <CategoryCard key={category.id} category={category}  />
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
