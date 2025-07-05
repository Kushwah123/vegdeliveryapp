import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
import ProductCard from '../components/ProductCard';
import {
  Row,
  Col,
  Form,
  Container,
  Card,
  InputGroup
} from 'react-bootstrap';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter ? p.category === categoryFilter : true)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <Container fluid className="px-md-5 mt-4">
      <h2 className="mb-4 text-primary fw-bold text-center">🥕 Fresh & Organic Vegetables</h2>
      <Row>
        {/* Sidebar Filter (Sticky) */}
        <Col md={3} className="mb-4">
          <div className="position-sticky" style={{ top: '90px' }}>
            <Card className="mb-3 shadow-sm border-0">
              <Card.Header className="bg-primary text-white fw-semibold">
                🔍 Search
              </Card.Header>
              <Card.Body>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm border-0">
              <Card.Header className="bg-primary text-white fw-semibold">
                🧾 Category
              </Card.Header>
              <Card.Body>
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white fw-semibold">
                💲 Sort by Price
              </Card.Header>
              <Card.Body>
                <Form.Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </div>
        </Col>

        {/* Product Listing */}
        <Col md={9}>
          <Row>
            {loading ? (
              <p className="text-center text-muted">Loading products...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col key={product._id} xs={12} sm={6} md={4} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <p className="text-center text-danger">No products found.</p>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
