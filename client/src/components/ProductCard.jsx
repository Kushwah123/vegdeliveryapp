import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, updateCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart); // Redux cart items

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
    let updatedCart;

    if (existingItem) {
      updatedCart = items.map((i) =>
        i.productId === product._id ? newItem : i
      );
    } else {
      updatedCart = [...items, newItem];
    }

    dispatch(addProductToCart(newItem));        // ✅ Redux local update
    dispatch(updateCart(updatedCart));   // ✅ Backend sync
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
        <Button variant="primary" onClick={handleAddToCart} className="w-100">
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
