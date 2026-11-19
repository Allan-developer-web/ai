"use client";

import { useState } from "react";

import {
  Food,
} from "@/data/menu";

import {
  Order,
  useRestaurant,
} from "@/context/RestaurantContext";

export default function AdminPage() {
  const {
    foods,
    orders,
    addFood,
    updateFood,
    deleteFood,
    updateOrderStatus,
  } = useRestaurant();

  const [active, setActive] =
    useState("Dashboard");

  const [editing, setEditing] =
    useState<Food | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "Main Dishes",
    price: "",
    description: "",
    image: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      category: "Main Dishes",
      price: "",
      description: "",
      image: "",
    });

    setEditing(null);
  };

  const saveFood = () => {
    if (
      !form.name ||
      !form.price ||
      !form.description ||
      !form.image
    ) {
      return;
    }

    const foodData = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description,
      image: form.image,
      rating: editing?.rating ?? 4.5,
      reviews: editing?.reviews ?? 0,
    };

    if (editing) {
      updateFood({
        ...editing,
        ...foodData,
      });
    } else {
      addFood(foodData);
    }

    resetForm();
  };

  const editFood = (food: Food) => {
    setEditing(food);

    setForm({
      name: food.name,
      category: food.category,
      price: String(food.price),
      description: food.description,
      image: food.image,
    });

    setActive("Menu Items");
  };

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="grid md:grid-cols-[230px_1fr] min-h-screen">

        <aside className="green-bg text-white p-5">

          <h1 className="font-bold text-lg mb-8">
            🍴 Foodies Admin
          </h1>

          <nav className="space-y-2">

            {[
              "Dashboard",
              "Menu Items",
              "Orders",
              "Users",
              "Reports",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setActive(item)
                }
                className={`w-full text-left p-3 rounded text-sm ${
                  active === item
                    ? "bg-white/20"
                    : ""
                }`}
              >
                {item}
              </button>
            ))}

          </nav>

        </aside>

        <section>

          <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
            <b>🍴 {active}</b>
            <span className="text-sm">
              Foodies Admin
            </span>
          </header>

          <div className="p-6">

            {active === "Dashboard" && (
              <>
                <h1 className="text-2xl font-bold">
                  Dashboard
                </h1>

                <div className="grid md:grid-cols-3 gap-4 mt-6">

                  <div className="card p-5">
                    <p className="text-xs text-gray-500">
                      Total Orders
                    </p>
                    <b className="text-2xl">
                      {orders.length}
                    </b>
                  </div>

                  <div className="card p-5">
                    <p className="text-xs text-gray-500">
                      Total Revenue
                    </p>
                    <b className="text-2xl">
                      $
                      {orders
                        .reduce(
                          (sum, order) =>
                            sum + order.total,
                          0
                        )
                        .toFixed(2)}
                    </b>
                  </div>

                  <div className="card p-5">
                    <p className="text-xs text-gray-500">
                      Menu Items
                    </p>
                    <b className="text-2xl">
                      {foods.length}
                    </b>
                  </div>

                </div>

                <div className="card p-5 mt-6">
                  <h2 className="font-bold mb-5">
                    Recent Orders
                  </h2>

                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-3">

                      {orders
                        .slice(0, 5)
                        .map((order) => (
                          <div
                            key={order._id}
                            className="flex justify-between border-b pb-3 text-xs"
                          >
                            <span>
                              {order.customer.name}
                            </span>

                            <span>
                              ${order.total.toFixed(2)}
                            </span>

                            <span>
                              {order.orderStatus}
                            </span>
                          </div>
                        ))}

                    </div>
                  )}
                </div>
              </>
            )}

            {active === "Menu Items" && (
              <>

                <div className="flex justify-between items-center mb-6">

                  <h1 className="text-2xl font-bold">
                    Menu Items
                  </h1>

                </div>

                <div className="card p-5 mb-6">

                  <h2 className="font-bold mb-4">
                    {editing
                      ? "Edit Food"
                      : "Add New Food"}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">

                    <input
                      className="border rounded p-3 text-sm"
                      placeholder="Food name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />

                    <select
                      className="border rounded p-3 text-sm"
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category:
                            e.target.value,
                        })
                      }
                    >
                      <option>
                        Appetizers
                      </option>
                      <option>
                        Main Dishes
                      </option>
                      <option>
                        Desserts
                      </option>
                      <option>
                        Drinks
                      </option>
                    </select>

                    <input
                      className="border rounded p-3 text-sm"
                      placeholder="Price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: e.target.value,
                        })
                      }
                    />

                    <input
                      className="border rounded p-3 text-sm"
                      placeholder="Image URL"
                      value={form.image}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image: e.target.value,
                        })
                      }
                    />

                    <textarea
                      className="border rounded p-3 text-sm md:col-span-2"
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={saveFood}
                      className="btn-green"
                    >
                      {editing
                        ? "Update Food"
                        : "Add Food"}
                    </button>

                    {editing && (
                      <button
                        onClick={resetForm}
                        className="border rounded px-5"
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </div>

                <div className="card overflow-hidden">

                  {foods.map((food) => (
                    <div
                      key={food.id}
                      className="p-4 border-b flex items-center gap-4"
                    >

                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">

                        <b className="text-sm">
                          {food.name}
                        </b>

                        <p className="text-xs text-gray-500">
                          {food.category}
                        </p>

                        <p className="text-xs">
                          ${food.price.toFixed(2)}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          editFood(food)
                        }
                        className="text-green-700 text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteFood(food.id)
                        }
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>

                    </div>
                  ))}

                </div>

              </>
            )}

            {active === "Orders" && (
              <>

                <h1 className="text-2xl font-bold mb-6">
                  Orders
                </h1>

                <div className="card overflow-hidden">

                  {orders.length === 0 ? (
                    <p className="p-6 text-sm text-gray-500">
                      No orders available.
                    </p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="p-5 border-b"
                      >

                        <div className="flex flex-wrap justify-between gap-4">

                          <div>
                            <b className="text-sm">
                              {order._id}
                            </b>

                            <p className="text-xs text-gray-500">
                              {order.customer.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {order.customer.address}
                            </p>
                          </div>

                          <div>
                            <b>
                              ${order.total.toFixed(2)}
                            </b>

                            <p className="text-xs">
                              {order.paymentMethod}
                            </p>
                          </div>

                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(
                                order._id,
                                e.target.value as Order["orderStatus"]
                              )
                            }
                            className="border rounded px-3 py-2 text-xs"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="preparing">
                              Preparing
                            </option>

                            <option value="ready">
                              Ready
                            </option>

                            <option value="out_for_delivery">
                              Out for delivery
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>

                        </div>

                      </div>
                    ))
                  )}

                </div>

              </>
            )}

            {active === "Users" && (
              <div className="card p-6">

                <h1 className="text-2xl font-bold mb-5">
                  Users
                </h1>

                <p className="text-sm text-gray-500">
                  User accounts are currently stored
                  locally. Database authentication will
                  be connected in the backend stage.
                </p>

              </div>
            )}

            {active === "Reports" && (
              <div className="card p-6">

                <h1 className="text-2xl font-bold mb-5">
                  Reports
                </h1>

                <div className="grid md:grid-cols-3 gap-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Orders
                    </p>
                    <b className="text-xl">
                      {orders.length}
                    </b>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Revenue
                    </p>
                    <b className="text-xl">
                      $
                      {orders
                        .reduce(
                          (sum, order) =>
                            sum + order.total,
                          0
                        )
                        .toFixed(2)}
                    </b>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Products
                    </p>
                    <b className="text-xl">
                      {foods.length}
                    </b>
                  </div>

                </div>

              </div>
            )}

            {active === "Settings" && (
              <div className="card p-6">

                <h1 className="text-2xl font-bold">
                  Settings
                </h1>

                <p className="text-sm text-gray-500 mt-3">
                  Restaurant settings will be connected
                  to the backend later.
                </p>

              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}