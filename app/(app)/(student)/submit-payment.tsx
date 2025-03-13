import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';

export default function SubmitPayment() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [amount, setAmount] = useState('');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'web') {
      // Mock camera permission for web
      setHasPermission(true);
      setShowCamera(true);
    }
  };

  const handleCapture = async () => {
    // Mock capture - in real app, this would capture an actual photo
    setReceiptImage('https://images.unsplash.com/photo-1554774853-719586f82d77');
    setShowCamera(false);
  };

  const handleSubmit = () => {
    // Mock submission - in real app, this would send data to backend
    alert('Reçu soumis avec succès!');
    setReceiptImage(null);
    setReceiptNumber('');
    setAmount('');
  };

  if (showCamera) {
    return (
      <View style={styles.container}>
        <View style={styles.camera}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Text style={styles.buttonText}>Prendre la photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Soumettre un Paiement" />

      <View style={styles.content}>
        {receiptImage ? (
          <Image source={{ uri: receiptImage }} style={styles.preview} />
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={requestCameraPermission}>
            <Text style={styles.uploadText}>Photographier le reçu</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          placeholder="Numéro du reçu"
          value={receiptNumber}
          onChangeText={setReceiptNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Montant (FCFA)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!receiptImage || !receiptNumber || !amount) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!receiptImage || !receiptNumber || !amount}
        >
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  camera: {
    flex: 1,
    backgroundColor: '#000',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  captureButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#F3F4F6',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: Colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});