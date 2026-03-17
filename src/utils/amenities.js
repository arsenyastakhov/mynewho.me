export const AMENITY_GROUPS = [
  {
    title: 'Access & Security',
    options: [
      'Smart Lock Access',
      'Digital Lock',
      'Smart Doorbell',
      'Smart Garage Door',
      'Garage Door with Outside Remote',
      'Outside Security Cameras',
      'Flood Sensors',
      'Remote Access',
    ],
  },
  {
    title: 'Kitchen & Finishes',
    options: [
      'Stainless Steel Appliances',
      'Quartz Countertops',
      'Vinyl Flooring',
      'Tile Flooring',
    ],
  },
  {
    title: 'Layout & Interior',
    options: [
      '10+ ft Ceilings',
      'Walk-in Closets',
      'Double Vanity',
      'Pantry',
      'Laundry Room',
      'Electric Charger',
    ],
  },
  {
    title: 'Outdoor & Lot Features',
    options: [
      'Covered Lanai',
      'Corner Lot',
      'Large Backyard',
    ],
  },
  {
    title: 'Efficiency',
    options: [
      'Energy Efficient Windows',
      'Hurricane Proof',
      'Flood Resistant',
      'Smart Automations',
      'LED Lighting',
    ],
  },
];

export const dedupeAmenities = (amenities = []) => [...new Set(amenities)];

export const groupAmenities = (amenities = []) => {
  const uniqueAmenities = dedupeAmenities(amenities);
  return AMENITY_GROUPS
    .map((group) => ({
      title: group.title,
      options: group.options.filter((option) => uniqueAmenities.includes(option)),
    }))
    .filter((group) => group.options.length > 0);
};
