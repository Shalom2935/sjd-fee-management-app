import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Payment } from '@/types';
import Header from '@/components/Header';

// Mock data
const payments: Payment[] = [
  {
    id: '1',
    receiptNumber: 'REC001',
    amount: 100000,
    status: 'approved',
    imageUrl: 'https://example.com/receipt1.jpg',
    date: '2024-01-15',
  },
  {
    id: '2',
    receiptNumber: 'REC002',
    amount: 150000,
    status: 'pending',
    imageUrl: 'https://example.com/receipt2.jpg',
    date: '2024-02-01',
  },
  {
    id: '3',
    receiptNumber: 'REC003',
    amount: 50000,
    status: 'rejected',
    imageUrl: 'https://example.com/receipt3.jpg',
    date: '2024-02-10',
    rejectionReason: 'Image floue',
  },
];

export default function PaymentHistory() {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'approved':
        return Colors.success;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.secondary;
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const renderItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.row}>
        <Text style={styles.receiptNumber}>Reçu #{item.receiptNumber}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.amount}>{item.amount.toLocaleString()} FCFA</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>

      {item.rejectionReason && (
        <Text style={styles.rejectionReason}>Raison: {item.rejectionReason}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Historique des Paiements" />

      <FlatList
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.background,
  },
  list: {
    padding: 16,
  },
  paymentCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  receiptNumber: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  rejectionReason: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.error,
  },
});