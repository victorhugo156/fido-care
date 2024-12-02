import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';
import Font_Size from '../../constants/Font_Size';

const getStatusStyle = (status) => {
    console.log("Status received:", status);
    switch (status) {
        case 'Confirmed':
            return { backgroundColor: '#4CAF50' };
        case 'Pending':
            return { backgroundColor: '#FFC107' };
        case 'Cancelled':
            return { backgroundColor: '#F44336' };
        default:
            return { backgroundColor: Colors.GRAY };
    }
};

export default function CardBookingPetOwner({
    petName,
    status,
    sitterName,
    ownerName,
    date,
    price,
    service,
    onViewDetailsPress,
    onConfirmPress,
    currentUserId,
    petSitterId, }) {

    const isPetSitter = currentUserId === petSitterId; // Check if the current user is the Pet Sitter
    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <View style={styles.petNameContainer}>
                    <Icon name="pets" size={20} color={Colors.TURQUOISE_GREEN} style={styles.petIcon} />
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                <View style={[styles.statusContainer, getStatusStyle(status)]}>
                    <Text style={styles.status}>{status}</Text>
                </View>
            </View>
                <Text style={styles.sitterName}>{isPetSitter ? `Pet Owner: ${ownerName}` : `Pet Sitter: ${sitterName}`}</Text>
            <View style={styles.detailRow}>
                <View style={styles.detailItemDate}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <View style={styles.detailLabelText}>
                        <Text style={styles.date}>{date}</Text>
                    </View>
                    
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text style={styles.price}>{price}</Text>
                </View>
            </View>
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Service:</Text>
                <Text style={styles.service}>{service}</Text>
            </View>

            <View style={styles.callToActions}>
                <View style={styles.containerViewDetails}>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={onViewDetailsPress}
                    >
                        <Text style={styles.viewDetailsBtnText}>View Details</Text>
                        <Icon name="chevron-right" size={16} color={Colors.BRIGHT_BLUE} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    itemContainer: {
        width: 400,
        // backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },

    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,

    },
    petNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petIcon: {
        marginRight: 8,
    },
    petName: {
        fontSize: Font_Size.XL,
        fontFamily: Font_Family.BOLD,
        color: Colors.GRAY_600,
    },
    statusContainer: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    status: {
        fontSize: Font_Size.SM,
        fontFamily: Font_Family.BOLD,
        color: '#FFFFFF',
    },
    sitterName: {
        fontSize: Font_Size.MD,
        fontFamily: Font_Family.BOLD,
        marginBottom: 8,
        color: Colors.BRIGHT_BLUE,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
    },

    detailLabelText:{
        width: 90,
    },

    detailLabel: {
        fontSize: Font_Size.MD,
        fontFamily: Font_Family.BLACK,
        color: Colors.GRAY_600,
        marginRight: 6,
    },
    date: {
        fontSize: Font_Size.MD,
        fontFamily: Font_Family.REGULAR,
        color: Colors.GRAY_600,

    },
    price: {
        fontSize: Font_Size.MD,
        fontFamily: Font_Family.BOLD,
        color: Colors.GRAY_600,
    },
    service: {
        fontSize: Font_Size.MD,
        fontFamily: Font_Family.REGULAR,
        color: Colors.GRAY_600,
    },

    callToActions: {
        width: "100%",
        // height: 100,

        flexDirection: "column-reverse",
        justifyContent: "space-between",
        alignItems: "center",

        paddingTop: 15

    },

    containerViewDetails: {
        width: "100%",
        alignItems: "flex-end",
    },

    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    containerBtnActions: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    btnActionsConfirm: {
        backgroundColor: Colors.GREEN_VARIAENT,
        height: 40,
        width: 120,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",

        gap: 10,

        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.TURQUOISE_GREEN,
    },
    btnActionsCancel: {
        backgroundColor: Colors.PINK_VARIENT,
        height: 40,
        width: 120,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",

        gap: 10,

        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.CORAL_PINK,

    },


    viewDetailsBtnText: {
        fontSize: Font_Size.MD,
        fontFamily: Font_Family.BOLD,
        color: Colors.BRIGHT_BLUE,
    },

    detailsBtnActionsText: {
        fontSize: Font_Size.SM,
        fontFamily: Font_Family.BOLD,
        color: Colors.GRAY_700,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: Font_Size.MD,
        color: Colors.GRAY,
        marginTop: 50,
    },
});