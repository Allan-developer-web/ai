import { Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import MenuItem from "../models/MenuItem";
import { AuthRequest } from "../middleware/authMiddleware";

const deliveryFee = Number(
  process.env.DELIVERY_FEE || 200
);

export async function createOrder(
  req: AuthRequest,
  res: Response
) {
  const {
    items,
    customer,
    paymentMethod,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order must contain at least one item",
    });
  }

  if (
    !customer?.name ||
    !customer?.phone ||
    !customer?.address
  ) {
    return res.status(400).json({
      message: "Customer information is required",
    });
  }

  if (
    !["cash", "mpesa", "card"].includes(
      paymentMethod
    )
  ) {
    return res.status(400).json({
      message: "Invalid payment method",
    });
  }

  const ids = items.map(
    (item: any) => item.menuItemId
  );

  const menuItems = await MenuItem.find({
    _id: { $in: ids },
    available: true,
  });

  const menuMap = new Map(
    menuItems.map((item) => [
      item._id.toString(),
      item,
    ])
  );

  const orderItems = [];

  let subtotal = 0;

  for (const requestedItem of items) {
    const menuItem = menuMap.get(
      requestedItem.menuItemId
    );

    if (!menuItem) {
      return res.status(400).json({
        message: `Menu item ${requestedItem.menuItemId} is unavailable`,
      });
    }

    const quantity = Number(
      requestedItem.quantity
    );

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 50
    ) {
      return res.status(400).json({
        message: "Invalid quantity",
      });
    }

    subtotal +=
      menuItem.price * quantity;

    orderItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      image: menuItem.image,
    });
  }

  const total =
    subtotal + deliveryFee;

  const order = await Order.create({
    userId: req.user!.userId,

    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
    },

    items: orderItems,

    subtotal,
    deliveryFee,
    total,

    paymentMethod,

    paymentStatus: "pending",

    orderStatus: "pending",
  });

  res.status(201).json({
    message: "Order created successfully",
    order,
  });
}

export async function getMyOrders(
  req: AuthRequest,
  res: Response
) {
  const orders = await Order.find({
    userId: req.user!.userId,
  }).sort({
    createdAt: -1,
  });

  res.json({
    orders,
  });
}

export async function getMyOrder(
  req: AuthRequest,
  res: Response
) {
  const id =
    typeof req.params.id === "string"
      ? req.params.id
      : req.params.id?.[0];

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  const order = await Order.findOne({
    _id: id,
    userId: req.user!.userId,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  res.json({
    order,
  });
}

export async function cancelOrder(
  req: AuthRequest,
  res: Response
) {
  const id =
    typeof req.params.id === "string"
      ? req.params.id
      : req.params.id?.[0];

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  const order = await Order.findOne({
    _id: id,
    userId: req.user!.userId,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  if (
    ["delivered", "cancelled"].includes(
      order.orderStatus
    )
  ) {
    return res.status(400).json({
      message: "This order cannot be cancelled",
    });
  }

  order.orderStatus = "cancelled";

  await order.save();

  res.json({
    message: "Order cancelled",
    order,
  });
}