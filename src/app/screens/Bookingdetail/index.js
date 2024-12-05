import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../../constants/Colors";
import Font_Family from "../../../constants/Font_Family";
import Font_Size from "../../../constants/Font_Size";
import { useRouter, useLocalSearchParams } from "expo-router";

// Function to handle payment and capture
const startPayment = async (details, setLoading, updateStatus) => {
  try {
    setLoading(true);

    if (!details || details.price === undefined) {
      throw new Error("Details or price information is missing.");
    }

    const totalAmount =
      typeof details.price === "string"
        ? parseFloat(details.price.replace(/[^0-9.-]+/g, ""))
        : details.price;

    if (isNaN(totalAmount)) {
      throw new Error("Invalid price format.");
    }

    // Step 1: Start Payment (processPayment function)
    const processResponse = await fetch(
      "https://processpayment-3v4do2hn6q-uc.a.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalAmount }),
      }
    );

    const processData = await processResponse.json();

    if (processResponse.ok && processData.approveLink) {
      // Redirect to PayPal approval link
      Linking.openURL(processData.approveLink);

      // Listen for PayPal redirect and finalize payment
      const handleRedirect = async (event) => {
        const url = event.url;

        if (url.includes("token=")) {
          const params = new URLSearchParams(url.split("?")[1]);
          const orderID = params.get("token");

          if (orderID) {
            console.log("Order ID received:", orderID); // Debug log

            // Step 2: Automatically capture the payment
            const captureResponse = await fetch(
              "https://capturepayment-3v4do2hn6q-uc.a.run.app",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderID }),
              }
            );

            const captureData = await captureResponse.json();

            if (captureResponse.ok) {
              console.log("Capture successful:", captureData); // Debug log

              // Update status to confirmed
              updateStatus("Confirmed");
              Alert.alert(
                "Payment Successful",
                "Your payment has been processed successfully!"
              );
            } else {
              console.error("Capture failed:", captureData); // Debug log
              throw new Error(
                captureData.error || "Failed to capture payment."
              );
            }
          } else {
            console.error("Order ID not found in URL:", url); // Debug log
          }
        } else if (url.includes("cancel")) {
          Alert.alert("Payment Cancelled", "The payment was cancelled.");
        }

        // Remove the event listener after processing
        Linking.removeEventListener("url", handleRedirect);
      };

      // Add event listener for URL changes
      Linking.addEventListener("url", handleRedirect);
    } else {
      throw new Error(processData.error || "Payment initiation failed.");
    }
  } catch (error) {
    console.error("Error during payment process:", error);
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};

const BookingDetail = () => {
  const router = useRouter();
  const { bookingDetails } = useLocalSearchParams();

  const [details, setDetails] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Function to update the booking status
  const updateStatus = (status) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      status,
    }));
  };

  useEffect(() => {
    if (bookingDetails) {
      try {
        const parsedDetails = JSON.parse(bookingDetails);
        if (parsedDetails.price === undefined) {
          throw new Error("Price is missing from booking details.");
        }
        setDetails(parsedDetails);
      } catch (error) {
        console.error("Failed to parse bookingDetails:", error);
        Alert.alert("Error", "Invalid booking details.");
      }
    }
  }, [bookingDetails]);

  if (!details) {
    return <Text style={styles.noDataText}>No booking details found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: details.sitterAvatar }}
          style={styles.sitterAvatar}
        />
        <Text style={styles.sitterName}>{details.sitterName}</Text>
      </View>

      {/* Booking Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pet Name</Text>
          <Text style={styles.infoValue}>{details.petName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Service</Text>
          <Text style={styles.infoValue}>{details.service}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{details.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price</Text>
          <Text style={styles.infoValue}>{details.price}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text
            style={[
              styles.infoValue,
              details.status === "Confirmed"
                ? styles.confirmed
                : details.status === "Pending"
                ? styles.pending
                : styles.cancelled,
            ]}
          >
            {details.status}
          </Text>
        </View>
      </View>

      {/* Conditional PayPal Button for Pending Payments */}
      {details.status === "Pending" && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => startPayment(details, setLoading, updateStatus)}
          disabled={isLoading}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/512px-PayPal_logo.svg.png",
            }}
            style={styles.paypalIcon}
          />
          <Text style={styles.payButtonText}>
            {isLoading ? "Processing..." : "Pay with PayPal"}
          </Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <ActivityIndicator size="large" color={Colors.TURQUOISE_GREEN} />
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push("/Chat")}
      >
        <Text style={styles.messageButtonText}>Message Sitter</Text>
        <Icon
          name="envelope"
          size={20}
          color={Colors.WHITE}
          style={styles.buttonIcon}
        />
      </TouchableOpacity>

      {/* Rate the Service Button - Shown only if status is "Confirmed" */}
      {details.status === "Confirmed" && (
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => router.push(`/screens/Rateservice?id=${details.id}`)}
        >
          <Text style={styles.rateButtonText}>Rate the Service</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SOFT_CREAM,
  },
  noDataText: {
    fontSize: Font_Size.LG,
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: 50,
    fontFamily: Font_Family.BOLD,
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.BRIGHT_BLUE,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  sitterAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  sitterName: {
    fontSize: Font_Size.XL,
    color: Colors.WHITE,
    fontFamily: Font_Family.BOLD,
  },
  infoContainer: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200,
  },
  infoLabel: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_700,
  },
  infoValue: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  confirmed: {
    color: Colors.TURQUOISE_GREEN,
    fontFamily: Font_Family.BOLD,
  },
  pending: {
    color: "#FFC107",
    fontFamily: Font_Family.BOLD,
  },
  cancelled: {
    color: "#F44336",
    fontFamily: Font_Family.BOLD,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  paypalIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  payButtonText: {
    fontSize: Font_Size.LG,
    color: Colors.WHITE,
    fontWeight: "bold",
    fontFamily: Font_Family.BOLD,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  messageButtonText: {
    fontSize: Font_Size.LG,
    color: Colors.WHITE,
    fontWeight: "bold",
    fontFamily: Font_Family.BOLD,
  },
  rateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  rateButtonText: {
    fontSize: Font_Size.LG,
    color: Colors.WHITE,
    fontWeight: "bold",
    fontFamily: Font_Family.BOLD,
  },
});

export default BookingDetail;









