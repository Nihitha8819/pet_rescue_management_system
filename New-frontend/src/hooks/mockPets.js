{/*Sample Pet profiles.
Should be deleted later*/}

export interface Pet {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';
  breed: string;
  location: string;
  status: 'adoptable' | 'lost' | 'found' | 'reunited' | 'adopted';
  image: string;
  age?: string;
  description?: string;
  date?: string;
  health?: {
    vaccinated: string;
    neutered: string;
    chipped: string;
  };
  owner?: {
    name: string;
    memberSince: string;
    rating: number;
  };
}

export const mockPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    type: "Cat",
    breed: "British Shorthair",
    location: "Hyderabad, TG",
    status: "adoptable",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    age: "1 year",
    description: "Luna is a gentle soul who loves sunny spots and quiet afternoons.",
    health: { vaccinated: "Fully", neutered: "Yes", chipped: "Yes" },
    owner: { name: "Sarah Johnson", memberSince: "2023", rating: 4.9 }
  },
  {
    id: "2",
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    location: "Mumbai, MH",
    status: "adoptable",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d",
    age: "2 years",
    description: "Max is full of energy and loves to play fetch for hours.",
    health: { vaccinated: "Fully", neutered: "Yes", chipped: "Yes" },
    owner: { name: "Mike Ross", memberSince: "2022", rating: 4.8 }
  },
  {
    id: "3",
    name: "Charlie",
    type: "Dog",
    breed: "French Bulldog",
    location: "Chennai, TN",
    status: "adoptable",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    age: "3 years",
    description: "Charlie is a small dog with a big personality.",
    health: { vaccinated: "Partially", neutered: "Yes", chipped: "No" },
    owner: { name: "Emma Watson", memberSince: "2023", rating: 4.7 }
  },
  {
    id: "4",
    name: "Daisy",
    type: "Cat",
    breed: "Maine Coon",
    location: "Bangalore, KA",
    status: "adoptable",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce",
    age: "4 years",
    description: "Daisy is a majestic cat with a very fluffy coat.",
    health: { vaccinated: "Fully", neutered: "Yes", chipped: "Yes" },
    owner: { name: "John Doe", memberSince: "2021", rating: 5.0 }
  },
  {
    id: "5",
    name: "Cooper",
    type: "Dog",
    breed: "Beagle",
    location: "Secunderabad, TG",
    status: "lost",
    date: "Lost: 2 days ago",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8",
    description: "Cooper escaped from his leash near the fountain."
  },
  {
    id: "6",
    name: "Bella",
    type: "Cat",
    breed: "Siamese",
    location: "Queens, NY",
    status: "found",
    date: "Found: 1 week ago",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26",
    description: "Found wandering in a backyard. Very friendly."
  }
];
