import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const ReviewItem = ({ review }) => {
    const { userName, userAvatar, rating, comment, createdAt } = review;

    const formattedDate = createdAt && createdAt.seconds
        ? new Date(createdAt.seconds * 1000).toLocaleDateString('en-GB')
        : 'Unknown Date';

    return (
        <View style={styles.reviewItem}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
            <View style={styles.reviewContent}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                        <Ionicons
                            key={i}
                            name={i < rating ? 'star' : 'star-outline'}
                            size={16}
                            color={i < rating ? Colors.CORAL_PINK : Colors.GRAY_200}
                        />
                    ))}
                </View>
                <Text style={styles.comment}>{comment}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewItem: {
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    reviewContent: {
        flex: 1,
    },
    userName: {
        fontFamily: Font_Family.BOLD,
        color: Colors.DARK_TEXT,
        fontSize: 16,
    },
    date: {
        fontFamily: Font_Family.REGULAR,
        color: Colors.GRAY_600,
        fontSize: 12,
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    comment: {
        fontFamily: Font_Family.REGULAR,
        color: Colors.GRAY_700,
        fontSize: 14,
        marginTop: 5,
    },
});

export default ReviewItem;








