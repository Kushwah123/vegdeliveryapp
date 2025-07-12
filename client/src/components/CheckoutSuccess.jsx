import React, { useState } from 'react';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import qrImage from '../assets/qr-code.png'; // upload your QR image in /assets

const CheckoutSuccess = ({ onCOD, onOnlinePaymentSubmit }) => {
  const [paymentFile, setPaymentFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    setPaymentFile(e.target.files[0]);
    setUploadSuccess(false);
  };

  const handleConfirmPayment = () => {
    if (paymentFile) {
      const formData = new FormData();
      formData.append('screenshot', paymentFile);

      onOnlinePaymentSubmit(formData); // send to backend
      setUploadSuccess(true);
      setShowModal(false);
    }
  };

  return (
    <div className="text-center mt-5">
      <h4 className="text-success">🛍️ Checkout Completed</h4>
      <p>Select your payment method to proceed:</p>

      {/* COD Option */}
      <Button variant="outline-primary" onClick={onCOD} className="me-3">
        Cash on Delivery (COD)
      </Button>

      {/* QR Payment Option */}
      <Button variant="outline-success" onClick={() => setShowModal(true)}>
        Pay Online via QR Code
      </Button>

      {/* Success Message */}
      {uploadSuccess && (
        <Alert variant="success" className="mt-3">
          Payment screenshot uploaded successfully!
        </Alert>
      )}

      {/* Modal for QR & Screenshot */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Scan QR & Upload Screenshot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={qrImage} alt="QR Code" className="img-fluid mb-3" style={{ maxHeight: 200 }} />
            <p className="text-muted">Scan above QR using your UPI app</p>

            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label>Upload Payment Screenshot (JPG, PNG)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmPayment} disabled={!paymentFile}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutSuccess;
