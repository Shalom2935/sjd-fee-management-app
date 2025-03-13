import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Pressable, Modal, TouchableOpacity, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Payment } from '@/types';
import Header from '@/components/Header';

// Mock data
const approvedPayments: Payment[] = [
  {
    id: '1',
    receiptNumber: 'REC001',
    amount: 100000,
    status: 'approved',
    imageUrl: require('@/assets/images/receipt.png'), 
    date: '2024-02-10',
  },
  {
    id: '2',
    receiptNumber: 'REC002',
    amount: 150000,
    status: 'approved',
    imageUrl: require('@/assets/images/receipt.png'), 
    date: '2024-02-12',
  },
];

export default function ApprovedPayments() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Shared values for animations
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Gesture handlers
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(0.5, savedScale.value * e.scale), 3);
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      translateX.value = translateX.value;
      translateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const openImage = (image: any) => {
    if (typeof image === 'string') {
      setSelectedImage(image);
    } else if (typeof Image.resolveAssetSource === 'function') {
      setSelectedImage(Image.resolveAssetSource(image).uri);
    } else {
      setSelectedImage(image);
    }
  };
  
  const closeImage = () => {
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    setSelectedImage(null);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const renderItem = ({ item }: { item: Payment }) => {
    const imageSource =
      typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl;

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.receiptNumber}>Reçu #{item.receiptNumber}</Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>

        <Pressable onPress={() => openImage(item.imageUrl)}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} resizeMode="contain" />
          </View>
        </Pressable>

        <Text style={styles.amount}>{item.amount.toLocaleString()} FCFA</Text>
        <Text style={styles.status}>Approuvé</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Paiements Approuvés" />

      <FlatList
        data={approvedPayments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun paiement approuvé</Text>
          </View>
        }
      />

      {/* Image Preview Modal */}
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={closeImage}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeImage} />
          
          <GestureDetector gesture={composed}>
            <Animated.View style={[styles.imageWrapper, animatedStyle]}>
              <Image 
                source={{ uri: selectedImage! }} 
                style={styles.fullImage} 
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>

          <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptNumber: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  date: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  amount: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  status: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.success,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  fullImage: {
    width: '98%',
    height: '40%',
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 50,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
