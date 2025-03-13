import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';

// Mock data
const studentAccount = {
  totalFees: 500000,
  paidAmount: 300000,
  previousDebt: 50000,
};

export default function StudentHome() {
  const remainingAmount = studentAccount.totalFees - studentAccount.paidAmount;
  const totalDue = remainingAmount + studentAccount.previousDebt;

  return (
    <View style={styles.container}>
      <Header title="Mon Compte" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frais de Scolarité 2023-2024</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Montant total:</Text>
            <Text style={styles.value}>{studentAccount.totalFees.toLocaleString()} FCFA</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Montant payé:</Text>
            <Text style={[styles.value, { color: Colors.success }]}>
              {studentAccount.paidAmount.toLocaleString()} FCFA
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Reste à payer:</Text>
            <Text style={[styles.value, { color: Colors.primary }]}>
              {remainingAmount.toLocaleString()} FCFA
            </Text>
          </View>
      
          <View style={styles.divider} />
      
          <View style={styles.row}>
            <Text style={styles.label}>Dettes antérieures:</Text>
            <Text style={[styles.value, { color: Colors.error }]}>
              {studentAccount.previousDebt.toLocaleString()} FCFA
            </Text>
          </View>
      
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total dû:</Text>
            <Text style={styles.totalValue}>{totalDue.toLocaleString()} FCFA</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
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
  card: {
    margin: 16,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  totalRow: {
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
});