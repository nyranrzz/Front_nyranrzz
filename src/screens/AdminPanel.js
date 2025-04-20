import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Dimensions
} from 'react-native';
import { Icon } from '@rneui/themed';
import { authApi } from '../services/api';

// Get screen width to calculate box dimensions
const screenWidth = Dimensions.get('window').width;
const boxSize = (screenWidth - 60) / 2; // Size for square boxes (accounting for padding and gap)

const AdminPanel = ({ route, navigation }) => {
  const { user } = route.params;
  const currentDate = new Date().toLocaleDateString('az-AZ');
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle refresh
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      // Placeholder for refresh functionality
      Alert.alert('Uğurlu', 'Məlumatlar yeniləndi');
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Xəta', 'Məlumatları yeniləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      navigation.navigate('Login');
    }
  };

  // Handle box press
  const handleBoxPress = (boxName) => {
    if (boxName === 'Hesabatlar') {
      navigation.navigate('ReportsPanel', { user });
    } else if (boxName === 'Yeni məhsul əlave et') {
      navigation.navigate('AddProductPanel', { user });
    } else {
      Alert.alert('Bildiriş', `${boxName} funksiyanallığı hazırlanmaqdadır`);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.marketName}>{user.name} XOŞ GƏLMİSİNİZ</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
              <Icon name="refresh" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon name="logout" type="material" color="white" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content area with two square boxes */}
      <View style={styles.content}>
        <View style={styles.boxesContainer}>
          <TouchableOpacity 
            style={styles.box} 
            onPress={() => handleBoxPress('Hesabatlar')}
          >
            <Icon 
              name="bar-chart" 
              type="material" 
              color="#3498db" 
              size={40} 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.boxText}>Hesabatlar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.box} 
            onPress={() => handleBoxPress('Yeni məhsul əlave et')}
          >
            <Icon 
              name="add-circle-outline" 
              type="material" 
              color="#3498db" 
              size={40} 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.boxText}>Yeni məhsul əlave et</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  marketName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    justifyContent: 'flex-start',
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    width: boxSize,
    height: boxSize,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  iconContainer: {
    marginBottom: 15,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default AdminPanel; 