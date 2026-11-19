"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

import { useRestaurant } from "@/context/RestaurantContext";

export default function CartPage() {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
  } = useRestaurant();

  return (
    <>
      <Navbar />

      <main className="py-8">
        <div className="container-main">

          <h1 className="text-2xl font-bold mb-6">
            Your Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-5">
                🛒
              </div>

              <h2 className="text-xl font-bold">
                Your cart is empty
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Add some delicious meals to continue.
              </p>

              <Link
                href="/menu"
                className="inline-block btn-green mt-6"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="card overflow-hidden">

                <div className="hidden md:grid grid-cols-4 bg-gray-50 p-4 text-xs font-bold">
                  <span>Item</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid md:grid-cols-4 items-center gap-4 p-4 border-t"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                      />

                      <div>
                        <b className="text-sm">
                          {item.name}
                        </b>

                        <p className="text-xs text-gray-500">
                          {item.sauce}
                        </p>
                      </div>

                    </div>

                    <span className="text-sm">
                      ${item.price.toFixed(2)}
                    </span>

                    <div>
                      <div className="border inline-flex rounded">

                        <button
                          className="px-3"
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span className="px-3 border-x">
                          {item.quantity}
                        </span>

                        <button
                          className="px-3"
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>
                    </div>

                    <div className="flex items-center justify-between">

                      <span className="font-bold text-sm">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>

                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="text-red-500"
                      >
                        🗑
                      </button>

                    </div>

                  </div>
                ))}

              </div>

              <div className="flex justify-end mt-7">

                <div className="w-full md:w-80 text-sm">

                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <b>
                      ${cartSubtotal.toFixed(2)}
                    </b>
                  </div>

                  <div className="flex justify-between py-2">
                    <span>Delivery Fee</span>
                    <b>
                      ${deliveryFee.toFixed(2)}
                    </b>
                  </div>

                  <div className="border-t flex justify-between py-4 text-lg">
                    <b>Total</b>

                    <b className="text-green-700">
                      ${cartTotal.toFixed(2)}
                    </b>
                  </div>

                  <div className="flex gap-3">

                    <Link
                      href="/menu"
                      className="border rounded px-5 py-3 text-xs flex-1 text-center"
                    >
                      Continue Shopping
                    </Link>

                    <Link
                      href="/checkout"
                      className="btn-green text-xs flex-1 text-center"
                    >
                      Proceed to Checkout
                    </Link>

                  </div>

                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </>
  );
}