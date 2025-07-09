import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, updateCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

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
    if (!user) {
      navigate('/login');
      return;
    }

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


🛒 *ऑर्डर करें:* https://veg4you.netlify.app/product/${product._id}

📲 ताज़ी सब्ज़ियाँ सीधे आपके दरवाज़े तक!
*Veg4You* के साथ अब खरीदारी और भी आसान है।`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, '_blank');
};


  return (
    <Card className="mb-4 shadow-sm">
      <Card.Img
        variant="top"
        src={product.image}
        height="180"
        style={{ objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          <strong>₹{product.price}</strong> /kg
          <br />
          <small className="text-muted">{product.category}</small>
        </Card.Text>

        <Form.Group controlId={`quantity-${product._id}`}>
          <Form.Control
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
            className="mb-2"
          />
        </Form.Group>

        {/* Buttons in one row, same original design */}
        <div className="d-flex flex-wrap gap-2">
          <Button variant="primary" className="w-100" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="success" className="w-100" onClick={handleBuyNow}>
            Buy Now
          </Button>
          <Button variant="success"  className="w-100" onClick={handleWhatsAppShare}>
            📲 Share on WhatsApp
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
