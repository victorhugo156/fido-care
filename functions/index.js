const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const fetch = require("node-fetch");

initializeApp();
const db = getFirestore();


/**This function is in charge of sending notification to the user as soon
 * as a new Bokkings document is created in Firebase FIrestore.
 */

//DEfine CLoud Function -> This thunction triggers when a new document is created in the "Bookings"collection 
exports.sendBookingNotification = onDocumentCreated("/Bookings/{bookingId}", async (event) => {
  const booking = event.data.data(); //Extractiong data from Booking document
  const petSitterId = booking.PetSitterID;//Extracting PetSitter ID from Booking doc

  try {
    // Look up the pet sitter’s user document in the Users collection
    const usersSnapshot = await db
        .collection("Users")
        .where("id", "==", petSitterId) // Query to find the user with the matching PetSitterID
        .get();

    if (usersSnapshot.empty) {
      //Checking if the user exist
      console.error("No matching user found for the provided PetSitterID.");
      return;
    }

    //As the snapshot will return an array with documents, which it was established
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
      headings: {en: "New Booking Request"},// Title of the notification
      contents: {en: "You have a new booking request! Check it out!"}, // Body text of the notification
    };

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
