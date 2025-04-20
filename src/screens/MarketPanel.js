import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { marketPanelStyles as styles } from '../styles/screens/marketPanel.styles';
import { productApi, orderApi, marketTotalApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';

const MarketPanel = ({ route, navigation }) => {
  const { user } = route.params;
  const currentDate = new Date().toLocaleDateString('az-AZ');
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getAllProducts();
      
      setProducts(data);
      
      // Fetch draft orders from API
      try {
        const draftOrders = await orderApi.getDraftOrdersByMarketId(user.id);
        
        if (draftOrders && draftOrders.length > 0) {
          console.log('Loaded draft orders from API:', draftOrders.length);
          
          // Apply drafts to products
          const updatedOrders = data.map(product => {
            const draft = draftOrders.find(d => d.product_id === product.id);
            
            if (draft) {
              return {
                ...product,
                quantity: draft.quantity.toString(),
                receivedQuantity: draft.received_quantity ? draft.received_quantity.toString() : '',
                price: draft.price ? draft.price.toString() : '',
                total: draft.total ? draft.total.toString() : '0'
              };
            } else {
              return {
                ...product,
                quantity: '',
                receivedQuantity: '',
                price: '',
                total: '0'
              };
            }
          });
          
          setOrders(updatedOrders);
        } else {
          // Initialize orders with fetched products
          initializeOrders(data);
        }
      } catch (error) {
        console.error('Error loading draft orders:', error);
        initializeOrders(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert(
        'Xəta',
        'Məhsulları yükləmək mümkün olmadı. Zəhmət olmasa internet bağlantınızı yoxlayın.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const initializeOrders = (productsData) => {
    setOrders(productsData.map(product => ({
      ...product,
      quantity: '',
      receivedQuantity: '',
      price: '',
      total: '0'
    })));
  };

  const saveOrdersToStorage = async () => {
    try {
      await AsyncStorage.setItem(`orders_${user.id}`, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  };

  const formatDecimalInput = (text) => {
    // Replace comma with dot and remove any non-numeric characters except dot
    let sanitizedText = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    
    // Handle decimal numbers properly
    const parts = sanitizedText.split('.');
    if (parts.length > 2) {
      // Keep only first decimal point
      sanitizedText = parts[0] + '.' + parts.slice(1).join('');
    }
    
    return sanitizedText;
  };

  const handleQuantityChange = (text, index) => {
    const newOrders = [...orders];
    const sanitizedText = formatDecimalInput(text);
    newOrders[index].quantity = sanitizedText;
    calculateTotal(newOrders, index);
    setOrders(newOrders);
  };

  const handleReceivedQuantityChange = (text, index) => {
    const newOrders = [...orders];
    const sanitizedText = formatDecimalInput(text);
    newOrders[index].receivedQuantity = sanitizedText;
    calculateTotal(newOrders, index);
    setOrders(newOrders);
  };

  const handlePriceChange = (text, index) => {
    const newOrders = [...orders];
    const sanitizedText = formatDecimalInput(text);
    newOrders[index].price = sanitizedText;
    calculateTotal(newOrders, index);
    setOrders(newOrders);
  };

  const calculateTotal = (orderList, index) => {
    // Parse values as float to handle decimal numbers
    const quantity = parseFloat(orderList[index].receivedQuantity.replace(',', '.')) || 0;
    const price = parseFloat(orderList[index].price.replace(',', '.')) || 0;
    
    // Calculate with full decimal precision
    const total = quantity * price;
    
    // Format to 2 decimal places
    orderList[index].total = total.toFixed(2);
    
    // No more real-time updates - we'll only update on save button press
  };
  
  // Update total received in real-time - now will only be called by the save button
  const updateTotalReceivedInRealTime = async (totalAmount) => {
    try {
      console.log(`Updating total received: ${totalAmount} for market ${user.id}`);
      const response = await marketTotalApi.saveTotalReceived(user.id, totalAmount);
      console.log('Update total received response:', response);
    } catch (error) {
      console.error('Error updating total received:', error);
      // Fail silently - don't show errors to the user
    }
  };

  const calculateGrandTotal = () => {
    // Calculate sum with full decimal precision
    const total = orders.reduce((sum, order) => {
      const orderTotal = parseFloat(order.total.replace(',', '.')) || 0;
      return sum + orderTotal;
    }, 0);
    
    // Format final result to 2 decimal places
    return total.toFixed(2);
  };

  // Handle refresh - only reload data without clearing it
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchProducts();
      Alert.alert('Uğurlu', 'Məlumatlar yeniləndi');
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Xəta', 'Məlumatları yeniləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset - clear all data
  const handleReset = async () => {
    // Confirm before resetting
    Alert.alert(
      'Təsdiq',
      'Bütün sifarişlər sıfırlanacaq. Davam etmək istəyirsiniz?',
      [
        {
          text: 'Xeyr',
          style: 'cancel'
        },
        {
          text: 'Bəli',
          onPress: async () => {
            try {
              setIsResetting(true);
              
              const newOrders = products.map(product => ({
                ...product,
                quantity: '',
                receivedQuantity: '',
                price: '',
                total: '0'
              }));
              setOrders(newOrders);
              
              // Clear draft orders from API
              await orderApi.clearDraftOrders(user.id);
              console.log('Draft orders cleared from API');
              
              // Clear saved orders from AsyncStorage as well (for legacy support)
              await AsyncStorage.removeItem(`orders_${user.id}`);
              
              Alert.alert('Uğurlu', 'Bütün sifarişlər sıfırlandı');
            } catch (error) {
              console.error('Error clearing draft orders:', error);
              Alert.alert('Xəta', 'Sifarişləri sıfırlamaq mümkün olmadı');
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await authApi.logout();
      
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Navigate to login screen anyway
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const handleInfoPress = () => {
    navigation.navigate('InfoPanel', { user });
  };

  const handleSendOrder = async () => {
    // Make sure there's at least one product with a quantity
    const orderItems = orders.filter(order => 
      parseFloat(order.quantity) > 0
    );
    
    if (orderItems.length === 0) {
      Alert.alert('Xəta', 'Ən azı bir məhsulun miqdarını daxil edin');
      return;
    }
    
    try {
      setIsSending(true);
      
      // Format order items for API
      const formattedItems = orderItems.map(item => ({
        productId: item.id,
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.price) || 0
      }));
      
      // Send order to API
      await orderApi.createOrder(user.id, formattedItems);
      
      // Save draft orders to keep the quantities persistent
      await saveDraftOrdersToAPI();
      
      Alert.alert(
        'Uğurlu', 
        'Sifariş göndərildi',
        [{ text: 'Tamam' }]
      );
      
    } catch (error) {
      console.error('Error sending order:', error);
      Alert.alert(
        'Xəta',
        'Sifarişi göndərmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const saveDraftOrdersToAPI = async () => {
    try {
      // Save all items - include quantity, receivedQuantity, price, and total
      const draftItems = orders.map(order => ({
        productId: order.id,
        quantity: parseFloat(order.quantity) || 0,
        receivedQuantity: parseFloat(order.receivedQuantity) || 0,
        price: parseFloat(order.price) || 0,
        total: parseFloat(order.total) || 0
      }));
      
      await orderApi.saveDraftOrders(user.id, draftItems);
      console.log(`Saved ${draftItems.length} draft items to API`);
      
      return true;
    } catch (error) {
      console.error('Error saving draft orders to API:', error);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Calculate the current grand total
      const grandTotal = calculateGrandTotal();
      
      // Save all draft orders to API with the full details
      const success = await saveDraftOrdersToAPI();
      
      // Also save to AsyncStorage for backward compatibility
      await saveOrdersToStorage();
      
      // Save the grand total to the market total API
      await marketTotalApi.saveTotalReceived(user.id, grandTotal);
      console.log(`Saved total received amount: ${grandTotal} for market ID: ${user.id}`);
      
      setIsSaving(false);
      
      if (success) {
        Alert.alert('Uğurlu', 'Məlumatlar yadda saxlanıldı');
      } else {
        Alert.alert('Xəta', 'Məlumatları yadda saxlamaq mümkün olmadı');
      }
    } catch (error) {
      console.error('Error saving order data:', error);
      setIsSaving(false);
      Alert.alert('Xəta', 'Məlumatları yadda saxlamaq mümkün olmadı');
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
            <TouchableOpacity onPress={handleInfoPress} style={styles.iconButton}>
              <Icon name="info" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
              <Icon name="refresh" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReset} style={styles.iconButton}>
              <Icon name="delete" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon name="logout" type="material" color="white" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Fixed Table Header */}
        <View style={styles.tableHeaderContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.productColumnHeader]}>MƏHSUL</Text>
            <Text style={[styles.columnHeader, styles.numberColumnHeader]}>SİFARİŞ</Text>
            <Text style={[styles.columnHeader, styles.numberColumnHeader]}>MİQDAR</Text>
            <Text style={[styles.columnHeader, styles.numberColumnHeader]}>QİYMƏT</Text>
            <Text style={[styles.columnHeader, styles.totalColumnHeader]}>CƏM</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {/* Table Rows */}
          {orders.map((order, index) => (
            <View key={order.id} style={styles.tableRow}>
              <Text style={styles.productCell}>{order.name}</Text>
              <TextInput
                style={styles.inputCell}
                value={order.quantity}
                onChangeText={(text) => handleQuantityChange(text, index)}
                keyboardType="decimal-pad"
                placeholder="0"
              />
              <TextInput
                style={styles.inputCell}
                value={order.receivedQuantity}
                onChangeText={(text) => handleReceivedQuantityChange(text, index)}
                keyboardType="decimal-pad"
                placeholder="0"
              />
              <TextInput
                style={styles.inputCell}
                value={order.price}
                onChangeText={(text) => handlePriceChange(text, index)}
                keyboardType="decimal-pad"
                placeholder="0"
              />
              <Text style={styles.totalCell}>{order.total}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            Qəbul Olunan Cəm:
          </Text>
          <Text style={styles.grandTotal}>{calculateGrandTotal()}</Text>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Sifarişi Göndər"
            onPress={handleSendOrder}
            containerStyle={styles.actionButtonContainer}
            buttonStyle={styles.actionButton}
            loading={isSending}
            disabled={isSending || isSaving || isResetting}
          />
          <Button
            title="Yadda saxla"
            onPress={handleSave}
            containerStyle={styles.actionButtonContainer}
            buttonStyle={[styles.actionButton, styles.saveButton]}
            loading={isSaving}
            disabled={isSending || isSaving || isResetting}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MarketPanel; 