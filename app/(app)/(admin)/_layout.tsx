import { Tabs } from 'expo-router';
import { ClipboardList, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopColor: Colors.border,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Paiements',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="approved"
        options={{
          title: 'Approuvés',
          tabBarIcon: ({ color, size }) => <CheckCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}