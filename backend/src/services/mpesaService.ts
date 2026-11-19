import axios from "axios";

function getBaseUrl() {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

export async function getMpesaToken() {
  const key =
    process.env.MPESA_CONSUMER_KEY;

  const secret =
    process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error(
      "M-Pesa credentials are not configured"
    );
  }

  const credentials = Buffer.from(
    `${key}:${secret}`
  ).toString("base64");

  const response = await axios.get(
    `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  return response.data.access_token;
}

export async function initiateStkPush(
  phone: string,
  amount: number,
  accountReference: string,
  transactionDescription: string
) {
  const token = await getMpesaToken();

  const shortcode =
    process.env.MPESA_SHORTCODE;

  const passkey =
    process.env.MPESA_PASSKEY;

  const callback =
    process.env.MPESA_CALLBACK_URL;

  if (
    !shortcode ||
    !passkey ||
    !callback
  ) {
    throw new Error(
      "M-Pesa configuration is incomplete"
    );
  }

  const timestamp = getTimestamp();

  const password = Buffer.from(
    shortcode + passkey + timestamp
  ).toString("base64");

  const response = await axios.post(
    `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: shortcode,

      Password: password,

      Timestamp: timestamp,

      TransactionType:
        "CustomerPayBillOnline",

      Amount: Math.round(amount),

      PartyA: phone,

      PartyB: shortcode,

      PhoneNumber: phone,

      CallBackURL: callback,

      AccountReference: accountReference,

      TransactionDesc:
        transactionDescription,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "application/json",
      },
    }
  );

  return response.data;
}

function getTimestamp() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  const seconds = String(
    date.getSeconds()
  ).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}