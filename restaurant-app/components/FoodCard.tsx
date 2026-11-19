"use client";

import Link from "next/link";
import { Food } from "@/data/menu";
import { useRestaurant } from "@/context/RestaurantContext";

type Props = {
  food: Food;
};

const FoodCard = ({ food }: Props) => {
  const { addToCart } = useRestaurant();

  return (
    <div className="card overflow-hidden">

      <Link href={`/menu/${food.id}`}>
        <img
          src={food.image}
          alt={food.name}
          className="food-image"
        />
      </Link>

      <div className="p-3">

        <Link href={`/menu/${food.id}`}>
          <h3 className="font-bold text-sm hover:text-green-700">
            {food.name}
          </h3>
        </Link>

        <p className="text-[11px] text-gray-500 mt-1">
          {food.description}
        </p>

        <div className="flex items-center justify-between mt-3">

          <span className="font-bold text-sm">
            ${food.price.toFixed(2)}
          </span>

          <button
            onClick={() => addToCart(food)}
            className="w-7 h-7 rounded-full green-bg text-white hover:bg-green-800"
          >
            +
          </button>

        </div>
      </div>
    </div>
  );
};

export default FoodCard;