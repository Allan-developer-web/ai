"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { useRestaurant } from "@/context/RestaurantContext";

export default function MealDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { foods, addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [sauce, setSauce] =
    useState("Mushroom Sauce");

  const food = foods.find(
    (item) => item.id === id
  );

  if (!food) {
    return (
      <>
        <Navbar />

        <main className="py-20 text-center">
          <h1 className="text-2xl font-bold">
            Food not found
          </h1>

          <Link
            href="/menu"
            className="inline-block btn-green mt-5"
          >
            Back to Menu
          </Link>
        </main>
      </>
    );
  }

  const addFood = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(food, sauce);
    }
  };

  return (
    <>
      <Navbar />

      <main className="py-8">
        <div className="container-main">

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <img
                src={food.image}
                alt={food.name}
                className="w-full h-[360px] object-cover rounded-lg"
              />

              <div className="grid grid-cols-4 gap-2 mt-3">
                {foods.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/menu/${item.id}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-full object-cover rounded"
                    />
                  </Link>
                ))}
              </div>

            </div>

            <div className="pt-3">

              <h1 className="text-2xl font-bold">
                {food.name}
              </h1>

              <div className="flex gap-2 items-center mt-2">
                <span className="gold">
                  ★★★★★
                </span>

                <span className="text-xs text-gray-500">
                  ({food.rating}) {food.reviews} reviews
                </span>
              </div>

              <p className="font-bold text-xl mt-3">
                ${food.price.toFixed(2)}
              </p>

              <p className="text-sm text-gray-600 mt-4 leading-6">
                {food.description}. Carefully prepared
                using fresh ingredients and served with your
                choice of sauce.
              </p>

              <h3 className="font-bold text-sm mt-6">
                Select Sauce
              </h3>

              <div className="space-y-3 mt-3 text-sm">
                {[
                  "Mushroom Sauce",
                  "Peppercorn Sauce",
                  "BBQ Sauce",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="radio"
                      name="sauce"
                      checked={sauce === item}
                      onChange={() => setSauce(item)}
                    />

                    {item}
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-7">

                <div className="border rounded flex items-center">
                  <button
                    className="px-3"
                    onClick={() =>
                      setQuantity((q) =>
                        Math.max(1, q - 1)
                      )
                    }
                  >
                    −
                  </button>

                  <span className="px-3 border-x">
                    {quantity}
                  </span>

                  <button
                    className="px-3"
                    onClick={() =>
                      setQuantity((q) => q + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addFood}
                  className="btn-green flex-1"
                >
                  Add to Cart
                </button>

              </div>

              <Link
                href="/cart"
                className="block text-center mt-4 text-sm text-green-700"
              >
                View Cart
              </Link>

            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-10 cream-bg p-6 rounded">

            <div>
              <b>♧ Fresh Ingredients</b>
              <p className="text-xs mt-1">
                Locally sourced
              </p>
            </div>

            <div>
              <b>🚚 Fast Delivery</b>
              <p className="text-xs mt-1">
                30–45 mins
              </p>
            </div>

            <div>
              <b>↻ Easy Returns</b>
              <p className="text-xs mt-1">
                If you&apos;re not satisfied
              </p>
            </div>

          </div>

        </div>
      </main>
    </>
  );
}