import React, { useState } from 'react';
import { Upload } from 'lucide-react';

enum PizzaSizeEnum {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
  }
  
  interface PizzaSize {
    size: PizzaSizeEnum;
    price: number;
  }
  
  interface PizzaFormData {
    name: string;
    description: string;
    base_price: number;
    category: string;
    sizes: PizzaSize[];
    image: File | null;
  }
  

export const CreatePizzaForm: React.FC = () => {
const [formData, setFormData] = useState<PizzaFormData>({
    name: '',
    description: '',
    base_price: 0,
    category: '',
    sizes: [
    { size: PizzaSizeEnum.SMALL, price: 0 },
    { size: PizzaSizeEnum.MEDIUM, price: 0 },
    { size: PizzaSizeEnum.LARGE, price: 0 },
    ],
    image: null,
});

const [imagePreview, setImagePreview] = useState<string>('');

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    setFormData({ ...formData, image: file });
    const reader = new FileReader();
    reader.onloadend = () => {
        setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    }
};

const handleSizePriceChange = (index: number, price: number) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], price };
    setFormData({ ...formData, sizes: newSizes });
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    try {
    // Create FormData object to handle file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description || '');
    submitData.append('base_price', formData.base_price.toString());
    submitData.append('category', formData.category);
    submitData.append('sizes', JSON.stringify(formData.sizes));
    if (formData.image) {
        submitData.append('image', formData.image);
    }

    const response = await fetch('http://localhost:8000/api/pizzas', {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${token}`,
        },
        body: submitData,
    });

    if (response.ok) {
        alert('Pizza created successfully!');
        // Reset form
        setFormData({
        name: '',
        description: '',
        base_price: 0,
        category: '',
        sizes: [
            { size: PizzaSizeEnum.SMALL, price: 0 },
            { size: PizzaSizeEnum.MEDIUM, price: 0 },
            { size: PizzaSizeEnum.LARGE, price: 0 },
        ],
        image: null,
        });
        setImagePreview('');
    } else {
        throw new Error('Failed to create pizza');
    }
    } catch (error) {
    console.error('Error creating pizza:', error);
    alert('Failed to create pizza');
    }
};

return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Create New Pizza</h2>
    <div className="space-y-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center">
        <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-red-500 transition-colors">
            <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            />
            <div className="flex flex-col items-center">
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
            ) : (
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500">Upload Pizza Image</span>
            </div>
        </label>
        </div>

        {/* Basic Information */}
        <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700">Base Price</label>
        <input
            type="number"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            min="0"
            step="0.01"
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
        >
            <option value="">Select category</option>
            <option value="buy1get4">Buy 1 Get 4</option>
            <option value="veg">Veg</option>
            <option value="3pizzas">3 Pizzas Start @ 399 Rs</option>
            <option value="jainSpecial">Jain Special</option>
            <option value="mealsAndDeals">Meals And Deals</option>
            <option value="vegPizza">Veg Pizza</option>
            <option value="halfAndHalf">Half & Half Pizza</option>
            <option value="classicMania">Classic Mania</option>
            <option value="pasta">Pasta</option>
            <option value="garlicBread">Garlic Bread</option>
            <option value="sides">Sides</option>
            <option value="non-veg">Non Veg</option>
        </select>
        </div>

        {/* Size Prices */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Size Prices</label>
        <div className="space-y-2">
            {formData.sizes.map((size, index) => (
            <div key={size.size} className="flex items-center gap-2">
                <span className="w-20 text-sm font-medium">{size.size}</span>
                <input
                type="number"
                value={size.price}
                onChange={(e) => handleSizePriceChange(index, parseFloat(e.target.value))}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                required
                min="0"
                step="0.01"
                placeholder={`Price for ${size.size}`}
                />
            </div>
            ))}
        </div>
        </div>

        <button
        type="submit"
        className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
        Create Pizza
        </button>
    </div>
    </form>
);
};