// src/utils/IceManApi.js

const baseUrl = "https://sandbox.momodeveloper.mtn.com";

// ⚠️ Replace with your actual subscription key and UUID
const subscriptionKey = "bb7f0a58d6bc43c1ae8dc5b185f237ff";
const referenceId = "C1787280-8C22-438E-AD8C-D70C80A20F07";

/**
 * Create a new API user (once only)
 */
export const createApiUser = async () => {
  const response = await fetch(`${baseUrl}/v1_0/apiuser`, {
    method: "POST",
    headers: {
      "X-Reference-Id": referenceId,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      providerCallbackHost: "https://api.wtwr.dnet.hu"
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create API user");
  }

  return true;
};

/**
 * Generate API key for the created API user
 */
export const generateApiKey = async () => {
  const response = await fetch(`${baseUrl}/v1_0/apiuser/${referenceId}/apikey`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  });

  if (!response.ok) {
    throw new Error("Failed to generate API key");
  }

  return response.json(); // returns { apiKey: "...", ... }
};

/**
 * Get access token for making further API requests
 */
export const getAccessToken = async (apiUserId, apiKey) => {
  const credentials = btoa(`${apiUserId}:${apiKey}`);

  const response = await fetch(`${baseUrl}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get access token");
  }

  return response.json(); // returns { access_token, token_type, expires_in }
};

/**
 * Initiate a payment (collection request)
 */
export const requestPayment = async (accessToken, externalId, amount, currency, payerNumber) => {
  const transactionId = crypto.randomUUID();

  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Reference-Id": transactionId,
      "X-Target-Environment": "sandbox",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency,
      externalId,
      payer: {
        partyIdType: "MSISDN",
        partyId: payerNumber
      },
      payerMessage: "Ice vending payment",
      payeeNote: "Thanks for your purchase!"
    })
  });

  if (!response.ok) {
    throw new Error("Payment request failed");
  }

  return transactionId; // Useful for tracking the payment
};
