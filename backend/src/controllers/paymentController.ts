import { Response, Request } from "express";
import Order from "../models/Order";
import { AuthRequest } from "../middleware/authMiddleware";
import { normalizeKenyanPhone } from "../utils/phone";
import { initiateStkPush } from "../services/mpesaService";
import Stripe from "stripe";
import { stripe } from "../services/stripeService";

export async function mpesaStkPush(
  req: AuthRequest,
  res: Response
) {
  const { orderId, phone } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    userId: req.user!.userId,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  if (
    order.paymentMethod !== "mpesa"
  ) {
    return res.status(400).json({
      message:
        "This order is not configured for M-Pesa",
    });
  }

  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      message: "Order has already been paid",
    });
  }

  const normalizedPhone =
    normalizeKenyanPhone(phone);

  const result = await initiateStkPush(
    normalizedPhone,
    order.total,
    order._id.toString(),
    "Foodies Restaurant Order"
  );

  order.paymentStatus = "processing";

  order.mpesaCheckoutRequestId =
    result.CheckoutRequestID;

  await order.save();

  res.json({
    message:
      "M-Pesa payment request sent",
    checkoutRequestId:
      result.CheckoutRequestID,
    customerMessage:
      result.CustomerMessage,
  });
}

export async function mpesaCallback(
  req: Request,
  res: Response
) {
  const callback =
    req.body?.Body?.stkCallback;

  if (!callback) {
    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }

  const checkoutRequestId =
    callback.CheckoutRequestID;

  const resultCode =
    callback.ResultCode;

  const order =
    await Order.findOne({
      mpesaCheckoutRequestId:
        checkoutRequestId,
    });

  if (!order) {
    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }

  if (resultCode === 0) {
    const metadata =
      callback.CallbackMetadata?.Item || [];

    const receipt =
      metadata.find(
        (item: any) =>
          item.Name ===
          "MpesaReceiptNumber"
      )?.Value;

    order.paymentStatus = "paid";

    order.orderStatus = "preparing";

    order.mpesaReceiptNumber =
      receipt
        ? String(receipt)
        : undefined;

    await order.save();
  } else {
    order.paymentStatus = "failed";

    await order.save();
  }

  res.json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
}
export async function createStripeCheckout(
  req: AuthRequest,
  res: Response
) {
  if (!stripe) {
    return res.status(503).json({
      message:
        "Stripe is not configured",
    });
  }

  const { orderId } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    userId: req.user!.userId,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  if (
    order.paymentMethod !== "card"
  ) {
    return res.status(400).json({
      message:
        "This order is not configured for card payment",
    });
  }

  const currency =
    process.env.STRIPE_CURRENCY || "usd";

  const lineItems =
    order.items.map((item) => ({
      price_data: {
        currency,

        product_data: {
          name: item.name,
        },

        unit_amount: Math.round(
          item.price * 100
        ),
      },

      quantity: item.quantity,
    }));

  lineItems.push({
    price_data: {
      currency,

      product_data: {
        name: "Delivery Fee",
      },

      unit_amount: Math.round(
        order.deliveryFee * 100
      ),
    },

    quantity: 1,
  });

  const session =
    await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      success_url:
        `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.FRONTEND_URL}/checkout`,

      metadata: {
        orderId: order._id.toString(),
      },
    });

  order.paymentStatus = "processing";

  order.stripeSessionId =
    session.id;

  await order.save();

  res.json({
    checkoutUrl: session.url,
  });
}
export async function stripeWebhook(
  req: Request,
  res: Response
) {
  if (!stripe) {
    return res.status(503).send();
  }

  const signature =
    req.headers[
      "stripe-signature"
    ] as string;

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).send();
  }

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe webhook verification failed"
    );

    return res.status(400).send();
  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session;

    const orderId =
      session.metadata?.orderId;

    if (orderId) {
      const order =
        await Order.findById(orderId);

      if (order) {
        order.paymentStatus = "paid";

        order.orderStatus =
          "preparing";

        await order.save();
      }
    }
  }

  res.json({
    received: true,
  });
}