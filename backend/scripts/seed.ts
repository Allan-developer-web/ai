import "dotenv/config";

import bcrypt from "bcryptjs";

import { connectDB } from "../src/config/db";

import User from "../src/models/User";
import MenuItem from "../src/models/MenuItem";

async function seed() {
  await connectDB();

  /* =========================
     ADMIN ACCOUNT
  ========================= */

  const adminEmail =
    "admin@foodies.com";

  const existingAdmin =
    await User.findOne({
      email: adminEmail,
    });

  if (!existingAdmin) {
    const password =
      await bcrypt.hash(
        "ChangeThisPassword123!",
        12
      );

    await User.create({
      name: "Foodies Administrator",
      email: adminEmail,
      password,
      role: "admin",
    });

    console.log(
      "Admin account created"
    );
  } else {
    console.log(
      "Admin account already exists"
    );
  }

  /* =========================
     MENU
  ========================= */
await MenuItem.deleteMany({});

await MenuItem.insertMany([
  {
    name: "Caesar Salad",
    description:
      "Fresh lettuce, parmesan, croutons",
    price: 9.99,
    category: "Appetizers",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 85,
    available: true,
    sauces: [],
  },

  {
    name: "Grilled Chicken",
    description:
      "Juicy grilled chicken with herbs",
    price: 14.99,
    category: "Main Dishes",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 120,
    available: true,
    sauces: [
      "BBQ",
      "Chilli",
      "Garlic",
    ],
  },

  {
    name: "Beef Burger",
    description:
      "Classic burger with fries",
    price: 12.99,
    category: "Main Dishes",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 96,
    available: true,
    sauces: [
      "Ketchup",
      "Mayo",
      "BBQ",
    ],
  },

  {
    name: "Pasta Alfredo",
    description:
      "Creamy sauce with mushrooms",
    price: 11.99,
    category: "Main Dishes",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 72,
    available: true,
    sauces: [],
  },

  {
    name: "Margherita Pizza",
    description:
      "Fresh tomatoes, basil, mozzarella",
    price: 13.99,
    category: "Main Dishes",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 145,
    available: true,
    sauces: [],
  },

  {
    name: "Chocolate Cake",
    description:
      "Rich and creamy chocolate cake",
    price: 6.99,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 101,
    available: true,
    sauces: [],
  },
]);

console.log(
  "Menu replaced successfully"
);

  process.exit(0);
}

seed();