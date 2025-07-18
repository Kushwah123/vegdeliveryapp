// src/components/Slider.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1000&q=80',
    caption: 'Fresh Vegetables Delivered to Your Doorstep',
  },
  {
    src: 'https://images.unsplash.com/photo-1584270354949-1f1b2a5836f5?auto=format&fit=crop&w=1000&q=80',
    caption: '100% Organic Produce Straight from the Farm',
  },
  {
    src: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1000&q=80',
    caption: 'Healthy Eating Starts with Fresh Veggies',
  },
];

const Slider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[400px] overflow-hidden relative rounded-2xl shadow-xl">
      <motion.img
        key={images[index].src}
        src={images[index].src}
        alt="vegetable"
        className="w-full h-full object-cover"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{images[index].caption}</h2>
        <p className="text-lg md:text-xl">Veg4You - Farm Fresh Vegetables Every Day</p>
      </div>
    </div>
  );
};

export default Slider;
