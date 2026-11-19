import mongoose, { Document, Schema, Types } from "mongoose";

export type PaymentMethod = "cash" | "mpesa" | "card";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

interface OrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  mpesaCheckoutRequestId?: string;
  mpesaReceiptNumber?: string;

  stripeSessionId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
    },

    items: [
      {
        menuItemId: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        image: {
          type: String,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "mpesa", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    mpesaCheckoutRequestId: {
      type: String,
      sparse: true,
      index: true,
    },

    mpesaReceiptNumber: {
      type: String,
    },

    stripeSessionId: {
      type: String,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.model<IOrder>("Order", orderSchema);