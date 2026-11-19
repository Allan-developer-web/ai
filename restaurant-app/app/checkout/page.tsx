"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

import { useRestaurant } from "@/context/RestaurantContext";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    placeOrder,
    user,
    loadingUser,
  } = useRestaurant();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] =
    useState("Cash on Delivery");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace("/login");
    }
  }, [loadingUser, user, router]);

  const submitOrder = async () => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!name || !phone || !address) {
      setError("Please complete all delivery fields.");
      return;
    }

    const success = await placeOrder(
      name,
      phone,
      address,
      payment
    );

    if (success) {
      router.push("/dashboard");
    }
  };

  if (loadingUser || !user) {
    return (
      <>
        <Navbar />

        <main className="py-12">
          <div className="container-main text-center text-sm text-gray-600">
            Checking your account...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="py-8">
        <div className="container-main">

          <div className="grid md:grid-cols-2 gap-8">

            <section>

              <h1 className="text-xl font-bold mb-5">
                Delivery Information
              </h1>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-5">
                  {error}
                </div>
              )}

              <div className="space-y-4">

                <label className="block text-xs font-bold">
                  Full Name

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full border rounded p-3 mt-2 text-sm"
                    placeholder="John Doe"
                  />
                </label>

                <label className="block text-xs font-bold">
                  Phone Number

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    className="w-full border rounded p-3 mt-2 text-sm"
                    placeholder="+254 712 345678"
                  />
                </label>

                <label className="block text-xs font-bold">
                  Delivery Address

                  <input
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    className="w-full border rounded p-3 mt-2 text-sm"
                    placeholder="123 Main Street, Nairobi"
                  />
                </label>

              </div>

              <h2 className="font-bold text-sm mt-7 mb-3">
                Payment Method
              </h2>

              <div className="space-y-3 text-sm">

                {[
                  "Cash on Delivery",
                  "Credit / Debit Card",
                  "M-Pesa",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="radio"
                      checked={payment === item}
                      onChange={() =>
                        setPayment(item)
                      }
                    />

                    {item}
                  </label>
                ))}

              </div>

              <button
                onClick={submitOrder}
                disabled={!cart.length}
                className="btn-green w-full mt-7 disabled:opacity-50"
              >
                Place Order
              </button>

            </section>

            <section className="card p-6 h-fit">

              <h2 className="font-bold mb-5">
                Order Summary
              </h2>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-center mb-4"
                >

                  <img
                    src={item.image}
                    className="w-12 h-12 rounded object-cover"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <b className="text-xs">
                      {item.name}
                    </b>

                    <p className="text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="text-xs">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </span>

                </div>
              ))}

              <div className="border-t mt-5 pt-4 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-700">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

              </div>

            </section>

          </div>

        </div>
      </main>
    </>
  );
}