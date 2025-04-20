import React, { useState, useEffect } from 'react';
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
  TextInput
} from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { productApi } from '../services/api';

const AddProductPanel = ({ route, navigation }) => {
  const { user } = route.params;
  const currentDate = new Date().toLocaleDateString('az-AZ');
  const [isLoading, setIsLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if user has admin role
  useEffect(() => {
    console.log('Current user:', user);
    if (user && user.role !== 'admin') {
      Alert.alert(
        'İcazə xətası',
        'Məhsul əlavə etmək üçün admin səlahiyyətiniz olmalıdır.',
        [{ text: 'Geri qayıt', onPress: () => navigation.goBack() }]
      );
    }
  }, [user, navigation]);
  
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

  // Handle back
  const handleBack = () => {
    navigation.goBack();
  };

  // Handle submit new product
  const handleSubmit = async () => {
    // Validate product name
    if (!productName.trim()) {
      Alert.alert('Xəta', 'Məhsul adı daxil edin');
      return;
    }
    
    // Check if user has admin role
    if (user && user.role !== 'admin') {
      Alert.alert('İcazə xətası', 'Məhsul əlavə etmək üçün admin səlahiyyətiniz olmalıdır.');
      return;
    }

    try {
      setIsSaving(true);
      
      console.log('--------- ÜRÜN EKLEME İŞLEMİ BAŞLADI ---------');
      console.log('1. Ürün Adı:', productName);
      console.log('2. Kullanıcı Bilgileri:', JSON.stringify(user));
      
      // Call the API to add product
      console.log('3. API Çağrısı Yapılıyor...');
      const response = await productApi.addProduct(productName);
      
      console.log('4. Server Yanıtı:', JSON.stringify(response));
      
      // Reset the input
      setProductName('');
      
      // Show success message
      Alert.alert('Uğurlu', 'Məhsul uğurla əlavə edildi');
      console.log('--------- ÜRÜN EKLEME İŞLEMİ TAMAMLANDI ---------');
      
    } catch (error) {
      console.error('--------- ÜRÜN EKLEME HATASI ---------');
      console.error('Hata Detayları:', error);
      
      // Display more specific error messages
      let errorMsg = 'Məhsulu əlavə etmək mümkün olmadı';
      
      if (error.message.includes('403') || error.message.includes('icazə')) {
        errorMsg = 'Bu əməliyyat üçün icazəniz yoxdur. Admin səlahiyyətləri tələb olunur.';
      } else if (error.message.includes('401') || error.message.includes('giriş')) {
        errorMsg = 'Avtorizasiya xətası. Zəhmət olmasa yenidən daxil olun.';
      } else {
        errorMsg += `: ${error.message}`;
      }
      
      Alert.alert('Xəta', errorMsg);
    } finally {
      setIsSaving(false);
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
            <Text style={styles.marketName}>Yeni məhsul əlave et</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
              <Icon name="refresh" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
              <Icon name="arrow-back" type="material" color="white" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content area */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Məhsul adı"
            value={productName}
            onChangeText={setProductName}
            autoCapitalize="words"
            editable={!isSaving}
          />
          
          <Button
            title="Göndər"
            onPress={handleSubmit}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            loading={isSaving}
            disabled={isSaving || !productName.trim()}
          />
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
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
  },
});

export default AddProductPanel; 