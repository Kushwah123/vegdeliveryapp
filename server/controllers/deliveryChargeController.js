// controllers/deliveryChargeController.js
import DeliveryCharge from '../models/DeliveryCharge.js';


// 🔹 Get all delivery charges
export const getAllCharges = async (req, res) => {
  const charges = await DeliveryCharge.find();
  res.json(charges);
};

// 🔹 Get charge for a specific colony
export const getChargeByColony = async (req, res) => {
  const { colony } = req.params;
  const charge = await DeliveryCharge.findOne({ colony });
  if (!charge) return res.status(404).json({ message: 'Charge not found for colony' });
  res.json(charge);
};

// 🔹 Set or Update charge by colony
export const setCharge = async (req, res) => {
  const { colony, charge } = req.body;
  let existing = await DeliveryCharge.findOne({ colony });

  if (existing) {
    existing.charge = charge;
    await existing.save();
    res.json({ message: 'Charge updated', data: existing });
  } else {
    const newCharge = await DeliveryCharge.create({ colony, charge });
    res.json(newCharge);
  }
};




// @desc    Update a delivery charge
// @route   PUT /api/deliverycharges/:id
// @access  Private/Admin
export const updateDeliveryCharge = async (req, res) => {
  try {
    const { colony, charge } = req.body;

    const deliveryCharge = await DeliveryCharge.findById(req.params.id);

    if (!deliveryCharge) {
      return res.status(404).json({ message: 'Delivery charge not found' });
    }

    deliveryCharge.colony = colony ?? deliveryCharge.colony;
    deliveryCharge.charge = charge ?? deliveryCharge.charge;

    const updatedCharge = await deliveryCharge.save();

    res.status(200).json({
      message: 'Delivery charge updated successfully',
      data: updatedCharge,
    });
  } catch (error) {
    console.error('Error updating delivery charge:', error.message);
    res.status(500).json({ message: 'Server error while updating charge' });
  }
};

// @desc    Delete a delivery charge
// @route   DELETE /api/deliverycharges/:id
// @access  Private/Admin
export const deleteDeliveryCharge = async (req, res) => {
  try {
    const deliveryCharge = await DeliveryCharge.findById(req.params.id);

    if (!deliveryCharge) {
      return res.status(404).json({ message: 'Delivery charge not found' });
    }

    await deliveryCharge.deleteOne(); // Recommended over remove()

    res.status(200).json({ message: 'Delivery charge removed successfully' });
  } catch (error) {
    console.error('Error deleting delivery charge:', error.message);
    res.status(500).json({ message: 'Server error while deleting charge' });
  }
};
