import { X, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';



// Modal Component
export function ProductModal({ product, isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');
  const modalRef = useRef(null)

  

  const handleClose = () =>{
    gsap.to(modalRef.current, {
        opacity: 0,
       scale: 0.8,
       duration: 0.3,
       onComplete: () => onClose() 
    })
  }

  useEffect(() => {
     if (isOpen && modalRef.current) {
       gsap.fromTo(modalRef.current, 
         { opacity: 0, scale: 0.8 },
         { opacity: 1, scale: 1, duration: 0.3 }
       );
     }
   }, [isOpen]);

   if (!isOpen || !product) return null;



  return (
    <div ref={modalRef} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Product Details</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-secondary/20 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage || product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img || (!selectedImage && index === 0)
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">
                  {product.title}
                </h3>
                {product.category?.name && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Price & Bonus */}
              <div className="flex items-baseline gap-4">
                <div>
                  <p className="text-sm text-label mb-1">Price</p>
                  <p className="text-3xl font-display font-bold text-primary">
                    ${product.bonus}
                  </p>
                </div>
                {product.bonus > 0 && (
                  <div>
                    <p className="text-sm text-label mb-1">Bonus</p>
                    <p className="text-2xl font-display font-semibold text-green-600">
                      ${product.price}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-label mb-2">Description</p>
                <p className="text-body leading-relaxed">{product.description}</p>
              </div>

              {/* Stock */}
              <div>
                <p className="text-sm font-medium text-label mb-2">Stock</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-700' 
                      : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock} units available
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="border-t border-border pt-6">
                <p className="text-sm font-medium text-label mb-2">Seller Information</p>
                <div className="bg-secondary/20 rounded-lg p-4">
                  <p className="font-medium text-body mb-1">
                    {product.seller?.name || product.sellerName}
                  </p>
                  {product.seller?.email && (
                    <p className="text-sm text-label">{product.seller.email}</p>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm font-medium text-label mb-3">
                    Reviews ({product.reviews.length})
                  </p>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="bg-secondary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-label">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-body">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product ID */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-label">Product ID: {product._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-secondary text-body font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

