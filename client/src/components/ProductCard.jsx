import React, { useState } from 'react';
import { Card, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, updateCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';
import { BsHeart, BsHeartFill, BsStarFill, BsWhatsapp } from 'react-icons/bs';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!user) return navigate('/login');

    const newItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Number(quantity),
    };

    const existingItem = items.find((i) => i.productId === product._id);
    const updatedCart = existingItem
      ? items.map((i) => (i.productId === product._id ? newItem : i))
      : [...items, newItem];

    dispatch(addProductToCart(newItem));
    dispatch(updateCart(updatedCart));
  };

  const handleBuyNow = () => {
    if (!user) return navigate('/login');
    const tempItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Number(quantity),
    };
    navigate('/checkout', { state: { item: tempItem } });
  };

  const handleWhatsAppShare = () => {
    const msg = `🌿 *${product.name}* अब उपलब्ध है!

💰 *कीमत:* ₹${product.price}/kg
📦 *कैटेगरी:* ${product.category}

🛒 *ऑर्डर करें:* https://veg4you.netlify.app/

📲 ताज़ी सब्ज़ियाँ सीधे आपके दरवाज़े तक!
*Veg4You* के साथ अब खरीदारी और भी आसान है।`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleWishlist = () => setWishlisted(!wishlisted);

  return (
    <Card
      className="mb-4 shadow-sm position-relative"
      style={{
        background: 'linear-gradient(145deg, #f9f9f9, #ffffff)',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
      }}
    >
      {/* ❤️ Wishlist Button */}
      <Button
        variant="light"
        onClick={toggleWishlist}
        className="position-absolute top-0 end-0 m-2 p-1 border-0"
        aria-label="Add to Wishlist"
      >
        {wishlisted ? (
          <BsHeartFill size={20} color="red" />
        ) : (
          <BsHeart size={20} color="gray" />
        )}
      </Button>

      {/* Product Image */}
      <Card.Img
        variant="top"
        src={product.image}
        height="180"
        style={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
      />

      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center fw-semibold">
          {product.name}
        </Card.Title>

        {/* Price & Category */}
        <Card.Text className="mb-1">
          <strong className="text-success">₹{product.price}</strong> <span className="text-muted">/kg</span>
          <br />
          <small className="text-muted">{product.category}</small>
        </Card.Text>

        {/* ⭐ Star Rating (Demo) */}
        <div className="mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <BsStarFill key={star} color="#ffc107" size={16} />
          ))}
        </div>

        {/* Quantity Input */}
        <Form.Group controlId={`quantity-${product._id}`} className="mb-2">
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity (kg)"
            style={{
              borderRadius: '8px',
              border: '1px solid #ced4da',
            }}
          />
        </Form.Group>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={handleAddToCart}>
            🛒 Add to Cart
          </Button>
          <Button variant="success" onClick={handleBuyNow}>
            ⚡ Buy Now
          </Button>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Share this product on WhatsApp</Tooltip>}
          >
            <Button variant="outline-success" onClick={handleWhatsAppShare}>
              <BsWhatsapp className="me-2" size={18} />
              Share on WhatsApp
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
