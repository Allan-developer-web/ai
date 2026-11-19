"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { Food } from "@/data/menu";
import { apiFetch } from "@/lib/api";

/* =========================
   TYPES
========================= */

export type CartItem = Food & {
  quantity: number;
  sauce?: string;
};

export type Order = {
  _id: string;
  createdAt: string;

  customer: {
    name: string;
    phone: string;
    address: string;
  };

  paymentMethod:
    | "cash"
    | "mpesa"
    | "card";

  items: CartItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;

  paymentStatus:
    | "pending"
    | "processing"
    | "paid"
    | "failed"
    | "refunded";

  orderStatus:
    | "pending"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type RestaurantContextType = {
  foods: Food[];
  cart: CartItem[];
  orders: Order[];
  user: User | null;

  loadingFoods: boolean;
  loadingUser: boolean;
  loadingOrders: boolean;

  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;

  addToCart: (
    food: Food,
    sauce?: string
  ) => void;

  updateCartQuantity: (
    id: string,
    quantity: number
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  clearCart: () => void;

  login: (
    email: string,
    password: string
  ) => Promise<{ message: string; redirect: string; user: User } | null>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ message: string; redirect: string; user: User }>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  placeOrder: (
    customer: string,
    phone: string,
    address: string,
    payment: string
  ) => Promise<Order | null>;

  refreshOrders: () => Promise<void>;

  updateOrderStatus: (
    id: string,
    status: Order["orderStatus"]
  ) => Promise<boolean>;

  addFood: (
    food: Omit<Food, "id">
  ) => Promise<boolean>;

  updateFood: (
    food: Food
  ) => Promise<boolean>;

  deleteFood: (
    id: string
  ) => Promise<boolean>;
};

/* =========================
   CONTEXT
========================= */

const RestaurantContext =
  createContext<
    RestaurantContextType | undefined
  >(undefined);

type ApiFoodItem = {
  _id?: string;
  id?: string;
  name?: string;
  category?: string;
  price?: number | string;
  description?: string;
  image?: string;
  rating?: number | string;
  reviews?: number | string;
};

/* =========================
   NORMALIZE MONGODB FOOD
========================= */

const normalizeFood = (
  item: ApiFoodItem
): Food => {
  return {
    id: String(item._id ?? item.id ?? ""),
    name: item.name ?? "",
    category: item.category ?? "",
    price: Number(item.price ?? 0),
    description: item.description ?? "",
    image: item.image ?? "",
    rating: Number(item.rating ?? 0),
    reviews: Number(item.reviews ?? 0),
  };
};

/* =========================
   PROVIDER
========================= */

export const RestaurantProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [foods, setFoods] =
    useState<Food[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [user, setUser] =
    useState<User | null>(null);

  const [loadingFoods, setLoadingFoods] =
    useState(true);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [loadingOrders, setLoadingOrders] =
    useState(false);

  /* =========================
     LOAD MENU
  ========================= */

  const loadFoods = useCallback(
    async () => {
      try {
        setLoadingFoods(true);

        const data =
          await apiFetch<{
            items: ApiFoodItem[];
          }>("/menu");

        setFoods(
          data.items.map(normalizeFood)
        );
      } catch (error) {
        console.error(
          "Failed to load menu:",
          error
        );
      } finally {
        setLoadingFoods(false);
      }
    },
    []
  );

  /* =========================
     LOAD CURRENT USER
  ========================= */

  const refreshUser = useCallback(
    async () => {
      try {
        setLoadingUser(true);

        const data =
          await apiFetch<{
            user: User;
          }>("/auth/me");

        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    },
    []
  );

  /* =========================
     LOAD USER ORDERS
  ========================= */

  const refreshOrders = useCallback(
    async () => {
      if (!user) {
        setOrders([]);
        return;
      }

      try {
        setLoadingOrders(true);

        const data =
          await apiFetch<{
            orders: Order[];
          }>("/orders");

        setOrders(data.orders);
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );
      } finally {
        setLoadingOrders(false);
      }
    },
    [user]
  );

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    void loadFoods();
    void refreshUser();
  }, [loadFoods, refreshUser]);

  /* =========================
     LOAD ORDERS WHEN USER
     CHANGES
  ========================= */

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  /* =========================
     LOAD CART
  ========================= */

  useEffect(() => {
    const savedCart =
      localStorage.getItem(
        "foodies_cart"
      );

    if (!savedCart) {
      return;
    }

    try {
      const parsedCart =
        JSON.parse(savedCart) as CartItem[];

      setCart(parsedCart);
    } catch {
      setCart([]);
    }
  }, []);

  /* =========================
     SAVE CART
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "foodies_cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (
    food: Food,
    sauce = ""
  ) => {
    setCart((current) => {
      const existing =
        current.find(
          (item) =>
            item.id === food.id
        );

      if (existing) {
        return current.map(
          (item) =>
            item.id === food.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                  sauce:
                    sauce ||
                    item.sauce,
                }
              : item
        );
      }

      return [
        ...current,
        {
          ...food,
          quantity: 1,
          sauce,
        },
      ];
    });
  };

  /* =========================
     UPDATE CART QUANTITY
  ========================= */

  const updateCartQuantity = (
    id: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  /* =========================
     REMOVE FROM CART
  ========================= */

  const removeFromCart = (
    id: string
  ) => {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  /* =========================
     CLEAR CART
  ========================= */

  const clearCart = () => {
    setCart([]);
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async (
    email: string,
    password: string
  ) => {
    if (!email || !password) {
      return null;
    }

    try {
      const data =
        await apiFetch<{
          message: string;
          redirect: string;
          user: User;
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        });

      setUser(data.user);

      return data;
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      return null;
    }
  };

  /* =========================
     REGISTER
  ========================= */

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    return apiFetch<{
      message: string;
      redirect: string;
      user: User;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = async () => {
    try {
      await apiFetch(
        "/auth/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      setUser(null);
      setOrders([]);
    }
  };

  /* =========================
     PLACE ORDER
  ========================= */

  const normalizePaymentMethod = (
    payment: string
  ): "cash" | "mpesa" | "card" => {
    const value = payment.toLowerCase();

    if (
      value.includes("mpesa") ||
      value.includes("m-pesa")
    ) {
      return "mpesa";
    }

    if (
      value.includes("card") ||
      value.includes("credit") ||
      value.includes("debit")
    ) {
      return "card";
    }

    return "cash";
  };

  const placeOrder = async (
    customer: string,
    phone: string,
    address: string,
    payment: string
  ) => {
    if (!user) {
      return null;
    }

    if (!cart.length) {
      return null;
    }

    try {
      const data =
        await apiFetch<{
          order: Order;
        }>("/orders", {
          method: "POST",

          body: JSON.stringify({
            customer: {
              name: customer,
              phone,
              address,
            },

            paymentMethod:
              normalizePaymentMethod(payment),

            items: cart.map(
              (item) => ({
                menuItemId:
                  item.id,
                quantity:
                  item.quantity,
              })
            ),
          }),
        });

      setOrders((current) => [
        data.order,
        ...current,
      ]);

      clearCart();

      return data.order;
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      return null;
    }
  };

  /* =========================
     UPDATE ORDER STATUS
     ADMIN
  ========================= */

  const updateOrderStatus =
    async (
      id: string,
      status: Order["orderStatus"]
    ) => {
      try {
        const data =
          await apiFetch<{
            order: Order;
          }>(
            `/admin/orders/${id}/status`,
            {
              method: "PATCH",

              body: JSON.stringify({
                orderStatus: status,
              }),
            }
          );

        setOrders((current) =>
          current.map(
            (order) =>
              order._id === id
                ? data.order
                : order
          )
        );

        return true;
      } catch (error) {
        console.error(
          "Failed to update order:",
          error
        );

        return false;
      }
    };

  /* =========================
     ADD FOOD
     ADMIN
  ========================= */

  const addFood = async (
    food: Omit<Food, "id">
  ) => {
    try {
      const data =
        await apiFetch<{
          item: ApiFoodItem;
        }>("/admin/menu", {
          method: "POST",

          body: JSON.stringify({
            name: food.name,
            description:
              food.description,
            price: food.price,
            category:
              food.category,
            image: food.image,
            rating:
              food.rating,
            reviews:
              food.reviews,
            available: true,
            sauces: [],
          }),
        });

      const newFood =
        normalizeFood(data.item);

      setFoods((current) => [
        newFood,
        ...current,
      ]);

      return true;
    } catch (error) {
      console.error(
        "Failed to add food:",
        error
      );

      return false;
    }
  };

  /* =========================
     UPDATE FOOD
     ADMIN
  ========================= */

  const updateFood = async (
    food: Food
  ) => {
    try {
      const data =
        await apiFetch<{
          item: ApiFoodItem;
        }>(
          `/admin/menu/${food.id}`,
          {
            method: "PATCH",

            body: JSON.stringify({
              name: food.name,
              description:
                food.description,
              price: food.price,
              category:
                food.category,
              image: food.image,
              rating:
                food.rating,
              reviews:
                food.reviews,
            }),
          }
        );

      const updatedFood =
        normalizeFood(data.item);

      setFoods((current) =>
        current.map((item) =>
          item.id === food.id
            ? updatedFood
            : item
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to update food:",
        error
      );

      return false;
    }
  };

  /* =========================
     DELETE FOOD
     ADMIN
  ========================= */

  const deleteFood = async (
    id: string
  ) => {
    try {
      await apiFetch(
        `/admin/menu/${id}`,
        {
          method: "DELETE",
        }
      );

      setFoods((current) =>
        current.filter(
          (food) =>
            food.id !== id
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to delete food:",
        error
      );

      return false;
    }
  };

  /* =========================
     CART CALCULATIONS
  ========================= */

  const cartCount =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const cartSubtotal =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  /*
   * This is only for displaying
   * the cart estimate.
   *
   * The backend remains the
   * authoritative source for
   * the actual order total.
   */

  const deliveryFee =
    cart.length ? 2 : 0;

  const cartTotal =
    cartSubtotal +
    deliveryFee;

  /* =========================
     PROVIDER
  ========================= */

  return (
    <RestaurantContext.Provider
      value={{
        foods,
        cart,
        orders,
        user,

        loadingFoods,
        loadingUser,
        loadingOrders,

        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        login,
        register,
        logout,

        refreshUser,

        placeOrder,
        refreshOrders,

        updateOrderStatus,

        addFood,
        updateFood,
        deleteFood,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useRestaurant =
  () => {
    const context =
      useContext(
        RestaurantContext
      );

    if (!context) {
      throw new Error(
        "useRestaurant must be used inside RestaurantProvider"
      );
    }

    return context;
  };