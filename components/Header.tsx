import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { LogOut } from 'lucide-react-native';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear authentication tokens here
    // For example: AsyncStorage.removeItem('authToken');
    
    // Redirect to login
    router.replace('/(auth)');
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <LogOut size={24} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    paddingTop: 60,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.background,
  },
});