import Link from "next/link";
import Navbar from "@/components/Navbar";
import Benefits from "@/components/Benefits";
import FoodCard from "@/components/FoodCard";

import { initialFoods } from "@/data/menu";

export default function Home() {
  return (
    <>
      <Navbar />

      <section
        id="home"
        className="min-h-[430px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,.75), rgba(0,0,0,.2)), url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=85')",
        }}
      >
        <div className="container-main text-white">
          <div className="max-w-xl">

            <p className="text-orange-400 font-bold text-sm mb-3">
              Welcome to Foodies
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Good Food
              <br />
              Great Moments
            </h1>

            <p className="mt-5 text-sm leading-6 text-gray-200 max-w-md">
              Fresh ingredients, delicious meals, and a cozy
              atmosphere. Your favorite restaurant, online.
            </p>

            <div className="flex gap-3 mt-7">
              <Link
                href="/menu"
                className="btn-orange text-sm"
              >
                View Menu
              </Link>

              <button className="btn-outline text-sm">
                Book a Table
              </button>
            </div>

          </div>
        </div>
      </section>

      <Benefits />

      <section className="py-14" id="about">
        <div className="container-main">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">
              Featured Foods
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Our customers&apos; favorite meals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {initialFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
              />
            ))}
          </div>

        </div>
      </section>

      <section
        id="contact"
        className="green-bg text-white py-12"
      >
        <div className="container-main text-center">

          <h2 className="text-2xl font-bold">
            Ready to order?
          </h2>

          <p className="text-sm mt-2 text-gray-200">
            Enjoy delicious meals delivered to your doorstep.
          </p>

          <Link
            href="/menu"
            className="inline-block btn-orange mt-5"
          >
            Order Now
          </Link>

        </div>
      </section>
    </>
  );
}