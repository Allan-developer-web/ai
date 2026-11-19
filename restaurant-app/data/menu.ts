export type Food = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
};

export const initialFoods: Food[] = [
  {
    id: "1",
    name: "Caesar Salad",
    category: "Appetizers",
    price: 9.99,
    description: "Fresh lettuce, parmesan, croutons",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 85,
  },
  {
    id: "2",
    name: "Grilled Chicken",
    category: "Main Dishes",
    price: 14.99,
    description: "Juicy grilled chicken with herbs",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: "3",
    name: "Beef Burger",
    category: "Main Dishes",
    price: 12.99,
    description: "Classic burger with fries",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 96,
  },
  {
    id: "4",
    name: "Pasta Alfredo",
    category: "Main Dishes",
    price: 11.99,
    description: "Creamy sauce with mushrooms",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 72,
  },
  {
    id: "5",
    name: "Margherita Pizza",
    category: "Main Dishes",
    price: 13.99,
    description: "Fresh tomatoes, basil, mozzarella",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 145,
  },
  {
    id: "6",
    name: "Chocolate Cake",
    category: "Desserts",
    price: 6.99,
    description: "Rich and creamy chocolate cake",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 101,
  },
];

export const foods = initialFoods;

export const categories = [
  "All",
  "Appetizers",
  "Main Dishes",
  "Desserts",
  "Drinks",
];