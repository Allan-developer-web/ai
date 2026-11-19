"use client";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import { useRestaurant } from "@/context/RestaurantContext";

export default function DashboardPage() {
  const {
    user,
    orders,
  } = useRestaurant();

  const totalSpent = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const favorite =
    orders[0]?.items[0]?.name ?? "Pizza";

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-56px)] bg-gray-50">

        <div className="container-main grid md:grid-cols-[230px_1fr] min-h-[calc(100vh-56px)]">

          <aside className="green-bg text-white p-5">

            <div className="flex items-center gap-3 pb-7">

              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                ◯
              </div>

              <div>
                <b>
                  {user?.name ?? "Guest User"}
                </b>

                <p className="text-[10px]">
                  {user?.email ?? "guest@example.com"}
                </p>
              </div>

            </div>

            <nav className="space-y-2 text-sm">

              <div className="p-3 rounded bg-white/20">
                ⌂ Dashboard
              </div>

              <div className="p-3 rounded">
                ▣ My Orders
              </div>

              <div className="p-3 rounded">
                ♙ Profile
              </div>

              <div className="p-3 rounded">
                ⌖ Addresses
              </div>

            </nav>

          </aside>

          <section className="p-6">

            <h1 className="text-2xl font-bold mb-6">
              Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                  Total Spent
                </p>

                <b className="text-2xl">
                  ${totalSpent.toFixed(2)}
                </b>
              </div>

              <div className="card p-5">
                <p className="text-xs text-gray-500">
                  Favorite Food
                </p>

                <b className="text-2xl">
                  {favorite}
                </b>
              </div>

            </div>

            <div className="card mt-6 overflow-hidden">

              <div className="p-5 flex justify-between">
                <h2 className="font-bold">
                  Recent Orders
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">
                    You have not placed any orders yet.
                  </p>

                  <Link
                    href="/menu"
                    className="inline-block btn-green mt-4"
                  >
                    Order Food
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full text-xs">

                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">
                          Order
                        </th>

                        <th className="text-left p-4">
                          Date
                        </th>

                        <th className="text-left p-4">
                          Total
                        </th>

                        <th className="text-left p-4">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-t"
                        >

                          <td className="p-4">
                            {order._id}
                          </td>

                          <td className="p-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>

                          <td className="p-4">
                            ${order.total.toFixed(2)}
                          </td>

                          <td className="p-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                              {order.orderStatus}
                            </span>
                          </td>

                        </tr>
                      ))}

                    </tbody>
                  </table>

                </div>
              )}

            </div>

          </section>
        </div>
      </main>
    </>
  );
}