// utils/imageUtils.ts

export const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder-pizza.jpg';
    
    // If it's already a full URL, return it
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it's a relative path, ensure it starts with /
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  };