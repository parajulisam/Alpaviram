const PREFERENCE_KEY = 'preference';

// Function to get preferences from localStorage
export const getPreference = () => {
  const savedPreference = localStorage.getItem(PREFERENCE_KEY);
  return savedPreference ? JSON.parse(savedPreference) : { category: {}, brand: {} }; // Default to empty objects
};

// Function to add or update preferences (category and brand)
export const addPreference = (categoryId, brandId, score) => {
  // Get current preferences
  const currentPreference = getPreference();

  // Update category score if categoryId is provided
  if (categoryId !== undefined) {
    currentPreference.category[categoryId] = (currentPreference.category[categoryId] || 0) + score;
  }

  // Update brand score if brandId is provided
  if (brandId !== undefined) {
    currentPreference.brand[brandId] = (currentPreference.brand[brandId] || 0) + score;
  }

  // Save updated preference back to localStorage
  localStorage.setItem(PREFERENCE_KEY, JSON.stringify(currentPreference));
};
