import { Response } from "express";
import MenuItem from "../models/MenuItem";
import Order from "../models/Order";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

export async function getAllOrders(
  req: AuthRequest,
  res: Response
) {
  const orders = await Order.find()
    .populate(
      "userId",
      "name email"
    )
    .sort({
      createdAt: -1,
    });

  res.json({
    orders,
  });
}

export async function updateOrderStatus(
  req: AuthRequest,
  res: Response
) {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const validStatuses = [
    "pending",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      updatedAt: new Date(),
    },
    {
      new: true,
    }
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  res.json({
    message: "Order status updated",
    order,
  });
}

export async function getAllUsers(
  req: AuthRequest,
  res: Response
) {
  const users = await User.find()
    .select("-password")
    .sort({
      createdAt: -1,
    });

  res.json({
    users,
  });
}

export async function getAdminMenu(
  req: AuthRequest,
  res: Response
) {
  const items = await MenuItem.find()
    .sort({
      createdAt: -1,
    });

  res.json({
    items,
  });
}

export async function createMenuItem(
  req: AuthRequest,
  res: Response
) {
  const {
    name,
    description,
    price,
    category,
    image,
    rating,
    reviews,
    available,
    sauces,
  } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    !category ||
    !image
  ) {
    return res.status(400).json({
      message: "Required menu fields are missing",
    });
  }

  const item = await MenuItem.create({
    name,
    description,
    price,
    category,
    image,
    rating: rating ?? 0,
    reviews: reviews ?? 0,
    available: available ?? true,
    sauces: sauces ?? [],
  });

  res.status(201).json({
    message: "Menu item created",
    item,
  });
}

export async function updateMenuItem(
  req: AuthRequest,
  res: Response
) {
  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!item) {
    return res.status(404).json({
      message: "Menu item not found",
    });
  }

  res.json({
    message: "Menu item updated",
    item,
  });
}

export async function deleteMenuItem(
  req: AuthRequest,
  res: Response
) {
  const item = await MenuItem.findByIdAndDelete(
    req.params.id
  );

  if (!item) {
    return res.status(404).json({
      message: "Menu item not found",
    });
  }

  res.json({
    message: "Menu item deleted",
  });
}