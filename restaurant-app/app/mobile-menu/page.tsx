import Navbar from "@/components/Navbar";
import FoodCard from "@/components/FoodCard";
import { foods } from "@/data/menu";

export default function MobileMenuPage() {
  return (
    <>
      <Navbar />

      <main className="py-8">
        <div className="container-main">
          <h1 className="text-xl font-bold">Our Menu</h1>

          <p className="text-xs text-gray-500 mt-1">
            Explore our delicious meals.
          </p>

          <div className="flex gap-2 mt-5 overflow-x-auto pb-2">
            {["All", "Appetizers", "Main Dishes", "Desserts"].map(
              (item) => (
                <button
                  key={item}
                  className={`px-4 py-2 rounded-full text-[10px] whitespace-nowrap ${
                    item === "All"
                      ? "green-bg text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="space-y-3 mt-5">
            {foods.map((food) => (
              <div
                key={food.id}
                className="card p-2 flex gap-3 items-center"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-24 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h2 className="font-bold text-xs">
                    {food.name}
                  </h2>

                  <p className="text-[10px] text-gray-500">
                    {food.description}
                  </p>

                  <b className="text-xs">
                    ${food.price.toFixed(2)}
                  </b>
                </div>

                <button className="w-6 h-6 rounded-full green-bg text-white text-xs">
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}