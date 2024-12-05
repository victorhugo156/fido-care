const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {https} = require("firebase-functions/v2");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const fetch = require("node-fetch");

// Initialize Firebase and Firestore
initializeApp();
const db = getFirestore();

// PayPal Configuration
const PAYPAL_CLIENT_ID = "AS_GTolwioaJfiCbhiq5779NyJRbbAfGTxKgUOKa1MuVo-0ll_kh8O7NOiOT-KfBo5ENwJ97fx6GeXVN";
const PAYPAL_CLIENT_SECRET = "EFjgoWwj-4E967DnIilHJKBUKWyyrTCheTkAoEopOGhyAzkK03W0UYE9tyelHDoGcTsqwm3QKSrrcJ6M";
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

// Test Account Emails
const TEST_PET_SITTER = "sb-plqc4731169958@businessPetSitter.example.com";

/**
 * Fetch PayPal Access Token
 * @return {Promise<string>}
 */
const fetchAccessToken = async () => {
  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (response.ok) {
    return data.access_token;
  } else {
    console.error("Failed to fetch access token:", data);
    throw new Error(data.error || "Failed to fetch access token");
  }
};

/**
 * Create PayPal Order
 * @param {number} totalAmount - Total payment amount in AUD
 * @return {Promise<Object>}
 */
const createOrder = async (totalAmount) => {
  const accessToken = await fetchAccessToken(); // Replace with your existing function to get the access token
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "AUD",
            value: totalAmount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: "fidocare://paypal-success", // Replace 'myapp' with your actual scheme from app.json
        cancel_url: "fidocare://paypal-cancel", // Replace 'myapp' with your actual scheme from app.json
      },
    }),
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.error("Failed to create order:", data);
    throw new Error(data.error || "Failed to create order");
  }
};


/**
 * Capture PayPal Order
 * @param {string} orderID
 * @return {Promise<Object>}
 */
const captureOrder = async (orderID) => {
  const accessToken = await fetchAccessToken();
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.error("Failed to capture order:", data);
    throw new Error(data.error || "Failed to capture order");
  }
};

/**
 * Send Payout to Pet Sitter
 * @param {string} recipientEmail
 * @param {number|string} amount
 * @return {Promise<Object>}
 */
const sendPayout = async (recipientEmail, amount) => {
  const numericAmount = parseFloat(amount); // Ensure the amount is a valid number
  if (isNaN(numericAmount)) {
    throw new Error("Invalid amount value for payout.");
  }

  const accessToken = await fetchAccessToken();
  const senderBatchId = `batch_${Date.now()}`;

  const response = await fetch(`${PAYPAL_API}/v1/payments/payouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: "Payout from FidoCare",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: numericAmount.toFixed(2), // Ensure proper formatting
            currency: "AUD",
          },
          receiver: recipientEmail,
          note: "Payment for pet sitting services",
        },
      ],
    }),
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.error("Failed to send payout:", data);
    throw new Error(data.details && data.details[0] && data.details[0].issue || "Failed to send payout");
  }
};

/**
 * Fetch the status of a payout batch by its ID
 * @param {string} payoutBatchId - The ID of the payout batch
 * @return {Promise<Object>}
 */
const fetchPayoutStatus = async (payoutBatchId) => {
  const accessToken = await fetchAccessToken(); // Use your existing fetchAccessToken method

  const response = await fetch(`${PAYPAL_API}/v1/payments/payouts/${payoutBatchId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  const payoutDetails = await response.json();

  if (response.ok) {
    console.log("Payout Status:", payoutDetails.batch_header.batch_status);
    return payoutDetails;
  } else {
    console.error("Failed to fetch payout details:", payoutDetails);
    throw new Error(payoutDetails.error || "Failed to fetch payout details");
  }
};


/** HTTP Function: Process Payment */
exports.processPayment = https.onRequest(async (req, res) => {
  try {
    const {totalAmount} = req.body;

    if (!totalAmount) {
      return res.status(400).json({error: "Missing totalAmount in request body"});
    }

    // Step 1: Create Order
    const order = await createOrder(totalAmount);

    // Step 2: Return the approve URL to the client
    const approveLink = order.links.find((link) => link.rel === "approve").href;

    res.status(200).json({orderID: order.id, approveLink});
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({error: error.message});
  }
});

/** HTTP Function: Capture Payment and Trigger Payout */
/** HTTP Function: Capture Payment */
exports.capturePayment = https.onRequest(async (req, res) => {
  try {
    const {orderID} = req.body;

    if (!orderID) {
      return res.status(400).json({error: "Missing orderID in request body"});
    }

    let captureResult;

    try {
      // Step 1: Attempt to capture the approved order
      captureResult = await captureOrder(orderID);
    } catch (error) {
      if (error.message.includes("ORDER_ALREADY_CAPTURED")) {
        console.warn("Order already captured. Fetching existing capture details.");
        // Fetch details of the existing capture
        const accessToken = await fetchAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        const orderDetails = await response.json();
        if (!response.ok) {
          throw new Error("Failed to retrieve existing capture details");
        }

        captureResult = orderDetails;
      } else {
        throw error; // Rethrow unexpected errors
      }
    }

    // Step 2: Extract captured amount and calculate splits
    const capturedAmount = parseFloat(
        captureResult.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value,
    );
    const serviceFee = (capturedAmount * 0.15).toFixed(2); // 15% fee
    const payoutAmount = (capturedAmount * 0.85).toFixed(2); // 85% to pet sitter

    // Step 3: Trigger payout to the pet sitter
    const payoutResult = await sendPayout(TEST_PET_SITTER, payoutAmount);

    // Step 4: Check the payout status
    const payoutDetails = await fetchPayoutStatus(payoutResult.batch_header.payout_batch_id);

    // Step 5: Respond with success
    res.status(200).json({
      captureResult,
      serviceFee,
      payoutAmount,
      payoutResult,
      payoutDetails,
    });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({error: error.message});
  }
});


/** This function is in charge of sending notification to the user as soon
 * as a new Bokkings document is created in Firebase FIrestore.
 */

// Define CLoud Function -> This thunction triggers when a new document is created in the "Bookings"collection
exports.sendBookingNotification = onDocumentCreated("/Booking/{bookingId}", async (event) => {
  console.log("Function triggered for Booking ID:", event.params.bookingId);

  const booking = event.data.data(); // Extractiong data from Booking document
  const petSitterId = booking.PetSitterID; // Extracting PetSitter ID from Booking doc

  try {
    // Look up the pet sitter’s user document in the Users collection
    const usersSnapshot = await db
        .collection("Users")
        .where("id", "==", petSitterId) // Query to find the user with the matching PetSitterID
        .get();

    if (usersSnapshot.empty) {
      // Checking if the user exist
      console.error("No matching user found for the provided PetSitterID.");
      return;
    }

    // As the snapshot will return an array with documents, which it was established
    // in the query above, We are assingning the first doc that matches between User ID and PetSItter ID
    const userDoc = usersSnapshot.docs[0];
    const oneSignalPlayerId = userDoc.data().oneSignalPlayerId; // Extract OneSignal Player ID from User doc

    if (!oneSignalPlayerId) {
      console.error("OneSignal Player ID not found for this user.");
      return;
    }

    // Define the notification payload to be sent to OneSignal
    const payload = {
      app_id: "56418014-2ca0-45b0-bd36-6ea04a3d655a", // My OneSignal App ID
      include_player_ids: [oneSignalPlayerId], // The Player ID of the notification recipient
      headings: {en: "New Booking Request"}, // Title of the notification
      contents: {en: "You have a new booking request! Check it out!"}, // Body text of the notification
    };

    console.log("Notification payload:", payload);

    // Send notification to OneSignal
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content
        "Authorization": "Basic NDNiMmJkYzctNjk5Yy00YmE1LTgwNDgtYWViMzNkZDQzOTU5",
      },
      body: JSON.stringify(payload), // Convert payload to JSON
    });

    // Process the response from OneSignal
    const responseData = await response.json();
    if (responseData.errors) {
      // Log any errors from OneSignal's response
      console.error("Error response from OneSignal:", responseData.errors);
    } else {
      // Log success message
      console.log("Notification sent successfully");
    }
  } catch (error) {
    // Catch and log any errors that occur during the function execution
    console.error("Error in sendBookingNotification:", error);
  }
});
