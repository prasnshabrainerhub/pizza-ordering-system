import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { PIZZA_CATEGORIES } from '../../types/types';

enum PizzaSizeEnum {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
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

interface Pizza extends Omit<PizzaFormData, 'image'> {
    id: string;
    image_url: string;
}

export const PizzaManagement: React.FC = () => {
    const { t } = useTranslation();
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [isAddingPizza, setIsAddingPizza] = useState(false);
    const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState<PizzaFormData>({
        name: '',
        description: '',
        base_price: 0,
        category: PIZZA_CATEGORIES[0].id,
        sizes: [
            { size: PizzaSizeEnum.SMALL, price: 0 },
            { size: PizzaSizeEnum.MEDIUM, price: 0 },
            { size: PizzaSizeEnum.LARGE, price: 0 },
        ],
        image: null,
    });
    
    const getImageUrl = (url: string | null | undefined): string => {
        if (!url) return '/placeholder-pizza.jpg';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        // If it's a relative URL without leading slash, add it
        if (!url.startsWith('/')) {
            return `/${url}`;
        }
        
        return url;
    };

    const fetchPizzas = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/pizzas', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setPizzas(data);
            }
        } catch (error) {
            console.error('Error fetching pizzas:', error);
        }
    };

    useEffect(() => {
        fetchPizzas();
    }, []);

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

        if (!token) {
            alert('Please log in again');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('base_price', formData.base_price.toString());
            formDataToSend.append('category', formData.category);
            formDataToSend.append('sizes', JSON.stringify(formData.sizes));

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const url = editingPizza 
                ? `http://localhost:8000/api/pizzas/${editingPizza.id}`
                : 'http://localhost:8000/api/pizzas';
            
            const method = editingPizza ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save pizza');
            }

            await fetchPizzas();
            resetForm();
        } catch (error) {
            console.error('Error saving pizza:', error);
            alert(error instanceof Error ? error.message : 'Failed to save pizza');
        }
    };

    const handleDelete = async (pizzaId: string) => {
        if (!confirm('Are you sure you want to delete this pizza?')) return;

        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`http://localhost:8000/api/pizzas/${pizzaId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchPizzas();
            }
        } catch (error) {
            console.error('Error deleting pizza:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            base_price: 0,
            category: PIZZA_CATEGORIES[0].id,
            sizes: [
                { size: PizzaSizeEnum.SMALL, price: 0 },
                { size: PizzaSizeEnum.MEDIUM, price: 0 },
                { size: PizzaSizeEnum.LARGE, price: 0 },
            ],
            image: null,
        });
        setImagePreview('');
        setIsAddingPizza(false);
        setEditingPizza(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('Manage Pizzas')}</h2>
                <button
                    onClick={() => setIsAddingPizza(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                >
                    <Plus size={20} />
                    {t('Add Pizza')}
                </button>
            </div>

            {(isAddingPizza || editingPizza) && (
                <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-6 rounded-lg">
                    <div className="flex flex-col items-center mb-4">
                        <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-red-500 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-32 h-32 object-cover rounded-lg mb-2" 
                                    />
                                ) : editingPizza?.image_url ? (
                                    <Image
                                        src={getImageUrl(editingPizza.image_url)}
                                        alt="Current"
                                        width={128}
                                        height={128}
                                        className="object-cover rounded-lg mb-2"
                                    />
                                ) : (
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                )}
                                <span className="text-sm text-gray-500">{t('Upload Pizza Image')}</span>
                            </div>
                        </label>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('Name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('Description')}</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                rows={3}
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('Category')}</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            >
                                {PIZZA_CATEGORIES.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('Sizes')}</label>
                            <div className="space-y-2">
                                {formData.sizes.map((size, index) => (
                                    <div key={size.size} className="flex items-center gap-4">
                                        <span className="w-24 capitalize">{size.size}</span>
                                        <input
                                            type="number"
                                            value={size.price}
                                            onChange={(e) => handleSizePriceChange(index, parseFloat(e.target.value))}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                {editingPizza ? 'Update' : 'Create'} {t('Pizza')}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                {t('Cancel')}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Pizza List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Image')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Name')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Category')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('Base Price')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pizzas.map((pizza) => (
                            <tr key={pizza.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-12 w-12 relative">
                                        <Image
                                            src={getImageUrl(pizza.image_url)}
                                            alt={pizza.name}
                                            width={48}
                                            height={48}
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{pizza.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{pizza.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{pizza.base_price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => {
                                            setEditingPizza(pizza);
                                            setFormData({
                                                ...pizza,
                                                image: null,
                                            });
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pizza.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};