import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Pressable, Modal, TouchableOpacity, Text, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Payment } from '@/types';
import Header from '@/components/Header';

// Mock data
const pendingPayments: Payment[] = [
  {
    id: '1',
    receiptNumber: 'REC001',
    amount: 100000,
    status: 'pending',
    imageUrl: require('@/assets/images/receipt.png'),
    date: '2024-02-15',
  },
  {
    id: '2',
    receiptNumber: 'REC002',
    amount: 150000,
    status: 'pending',
    imageUrl: require('@/assets/images/receipt.png'),
    date: '2024-02-16',
  },
];

// Predefined rejection reasons
const rejectionReasons = [
  "Image floue ou illisible",
  "Montant incorrect",
  "Reçu déjà soumis",
  "Informations manquantes",
  "Document non valide"
];

export default function AdminHome() {
  const [payments, setPayments] = useState(pendingPayments);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [paymentToReject, setPaymentToReject] = useState<string | null>(null);

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

  const handleApprove = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
    // In a real app, update the backend accordingly
  };

  const handleReject = (id: string) => {
    setPaymentToReject(id);
    setShowRejectionForm(true);
  };

  const confirmReject = () => {
    if (paymentToReject) {
      // In a real app, update the backend with the rejection reason
      setPayments(payments.filter(payment => payment.id !== paymentToReject));
      closeRejectionForm();
    }
  };

  const closeRejectionForm = () => {
    setShowRejectionForm(false);
    setPaymentToReject(null);
    setRejectionReason('');
  };

  const selectPredefinedReason = (reason: string) => {
    setRejectionReason(reason);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const renderItem = ({ item }: { item: Payment }) => {
    const imageSource = typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl;
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

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => handleApprove(item.id)}>
            <Text style={styles.buttonText}>Approuver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item.id)}>
            <Text style={[styles.buttonText, styles.rejectButtonText]}>Rejeter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Paiements en Attente" />

      <FlatList
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun paiement en attente</Text>
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

      {/* Rejection Form Modal */}
      <Modal visible={showRejectionForm} transparent={true} animationType="slide" onRequestClose={closeRejectionForm}>
        <View style={styles.rejectionModalContainer}>
          <View style={styles.rejectionForm}>
            <Text style={styles.rejectionTitle}>Motif de rejet</Text>
            
            <TextInput
              style={styles.rejectionInput}
              placeholder="Saisir le motif de rejet"
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
            />
            
            <Text style={styles.rejectionSubtitle}>Ou choisir un motif:</Text>
            
            <View style={styles.reasonsList}>
              {rejectionReasons.map((reason, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.reasonItem,
                    rejectionReason === reason && styles.selectedReasonItem
                  ]}
                  onPress={() => selectPredefinedReason(reason)}
                >
                  <Text 
                    style={[
                      styles.reasonText,
                      rejectionReason === reason && styles.selectedReasonText
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.rejectionButtonRow}>
              <TouchableOpacity 
                style={[styles.rejectionButton, styles.cancelButton]} 
                onPress={closeRejectionForm}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.rejectionButton, 
                  styles.confirmButton,
                  !rejectionReason && styles.disabledButton
                ]} 
                onPress={confirmReject}
                disabled={!rejectionReason}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: Colors.primary,
  },
  rejectButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.background,
  },
  rejectButtonText: {
    color: Colors.error,
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
  // Rejection form styles
  rejectionModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  rejectionForm: {
    width: '90%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rejectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  rejectionInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  rejectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  reasonsList: {
    marginBottom: 20,
  },
  reasonItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReasonItem: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  reasonText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  selectedReasonText: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  rejectionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rejectionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  confirmButton: {
    backgroundColor: Colors.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  confirmButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.background,
  },
});