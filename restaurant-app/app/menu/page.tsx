"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FoodCard from "@/components/FoodCard";
import { categories } from "@/data/menu";
import { useRestaurant } from "@/context/RestaurantContext";

export default function MenuPage() {
  const { foods } = useRestaurant();

  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = foods.filter((food) => {
    const categoryMatch =
      selected === "All" ||
      food.category === selected;

    const searchMatch =
      food.name
        .toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <>
      <Navbar />

      <main className="py-10">
        <div className="container-main">

          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold">
              Our Menu
            </h1>

            <p className="text-xs text-gray-500 mt-2">
              Explore our delicious meals, carefully prepared
              for you.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food..."
              className="w-full border rounded-full px-5 py-3 text-sm"
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-7">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelected(category)}
                className={`px-5 py-2 rounded-full text-xs ${
                  selected === category
                    ? "green-bg text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">
                No food items found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filtered.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}