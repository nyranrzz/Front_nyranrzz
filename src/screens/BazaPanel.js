import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { bazaPanelStyles as styles } from '../styles/screens/bazaPanel.styles';
import { bazaApi, orderApi, marketApi, productApi, authApi } from '../services/api';
import { theme } from '../constants/theme';

const BazaPanel = ({ route, navigation }) => {
  const { user } = route.params;
  const currentDate = new Date().toLocaleDateString('az-AZ');

  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [marketOrders, setMarketOrders] = useState({});

  // Fetch markets, products, and pending orders when component mounts
  useEffect(() => {
    fetchMarkets();
    fetchProducts();
    fetchPendingOrders();
    fetchSavedPrices(); // New: Fetch saved prices
  }, []);

  const fetchMarkets = async () => {
    try {
      const data = await marketApi.getAllMarkets();
      setMarkets(data);
      if (data.length > 0) {
        setSelectedMarket(data[0]);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
      Alert.alert(
        'Xəta',
        'Marketləri yükləmək mümkün olmadı. Zəhmət olmasa internet bağlantınızı yoxlayın.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productApi.getAllProducts();
      setProducts(data.map(product => ({
        ...product,
        marketQuantity: '0',
        total: '0',
        price: '',
        grandTotal: '0'
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert(
        'Xəta',
        'Məhsulları yükləmək mümkün olmadı. Zəhmət olmasa internet bağlantınızı yoxlayın.'
      );
    }
  };

  // New function to fetch saved prices
  const fetchSavedPrices = async () => {
    try {
      setIsLoading(true);
      const data = await bazaApi.getPrices();

      if (data && data.prices && data.prices.length > 0) {
        // Update product prices from saved data, but preserve total values
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          
          for (const product of updatedProducts) {
            const savedPrice = data.prices.find(p => p.product_id === product.id);
            
            if (savedPrice) {
              product.price = savedPrice.price.toString();
              // Toplam sütununu değiştirmiyoruz, pazar siparişlerinden gelen değeri koruyoruz
              // product.total = savedPrice.total.toString();
              
              // Toplam değerini sipariş verilerinden alıyoruz
              const totalQuantity = parseFloat(getTotalOrderQuantity(product.id)) || 0;
              const price = parseFloat(savedPrice.price) || 0;
              product.grandTotal = (totalQuantity * price).toFixed(2);
            }
          }
          
          return updatedProducts;
        });
      }
    } catch (error) {
      console.error('Error fetching saved prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await bazaApi.getOrders();
      setPendingOrders(orders);

      // Process each order to build a map of product quantities for each market
      const orderDetailsPromises = orders.map(order => 
        bazaApi.getOrderById(order.id)
      );

      const orderDetails = await Promise.all(orderDetailsPromises);
      
      // Create a map of market_id -> product_id -> quantity
      const marketOrdersMap = {};
      
      orderDetails.forEach(orderDetail => {
        const marketId = orderDetail.market_id;
        
        if (!marketOrdersMap[marketId]) {
          marketOrdersMap[marketId] = {};
        }
        
        orderDetail.items.forEach(item => {
          const productId = item.product_id;
          const quantity = parseFloat(item.requested_quantity) || 0;
          
          if (!marketOrdersMap[marketId][productId]) {
            marketOrdersMap[marketId][productId] = 0;
          }
          
          marketOrdersMap[marketId][productId] += quantity;
        });
      });
      
      // Sadece veri çekme işlemi yapıyoruz, herhangi bir statü değişikliği yapmıyoruz
      setMarketOrders(marketOrdersMap);
      
      // Fiyat verilerini de tekrar yükleyelim
      await fetchSavedPrices();
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      Alert.alert(
        'Xəta',
        'Sifarişləri yükləmək mümkün olmadı. Zəhmət olmasa internet bağlantınızı yoxlayın.'
      );
    } finally {
      setIsLoading(false);
    }
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

  const handleClearData = async () => {
    // Confirm before deleting all data
    Alert.alert(
      'Təsdiq',
      'Bütün sifarişlər və qiymətlər silinəcək. Davam etmək istəyirsiniz?',
      [
        {
          text: 'Xeyr',
          style: 'cancel'
        },
        {
          text: 'Bəli',
          onPress: async () => {
            try {
              // Show loading
              setIsLoading(true);
              
              // Call API to clear all data in database
              await bazaApi.clearAllOrders();
              
              // Also clear the prices
              await bazaApi.clearPrices();
              
              // Clear local state for everything
              setProducts(prevProducts =>
                prevProducts.map(product => ({
                  ...product,
                  marketQuantity: '0',
                  total: '0',
                  price: '',
                  grandTotal: '0'
                }))
              );
              
              // Clear all market orders data
              setMarketOrders({});
              setPendingOrders([]);
              
              // Show success message
              Alert.alert('Uğurlu', 'Bütün sifarişlər və qiymətlər silindi');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert(
                'Xəta',
                'Məlumatları silmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.'
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleReset = () => {
    // Only reset the price column, keep market numbers the same
    setProducts(prevProducts =>
      prevProducts.map(product => ({
        ...product,
        price: '',
        grandTotal: '0'
      }))
    );
  };

  const handlePriceChange = (text, index) => {
    let processedValue = text.replace(/,/g, '.');
    processedValue = processedValue.replace(/[^0-9.]/g, '');
    
    const parts = processedValue.split('.');
    if (parts.length > 2) {
      processedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    const newProducts = [...products];
    newProducts[index].price = processedValue;
    
    const total = parseFloat(newProducts[index].total) || 0;
    const price = parseFloat(processedValue) || 0;
    newProducts[index].grandTotal = (total * price).toFixed(2);
    
    setProducts(newProducts);
  };

  const calculateGrandTotal = () => {
    return products.reduce((sum, product) => {
      // Hesaplama: Toplam miktar * Fiyat (yani Cəm sütunundaki değer)
      const totalQuantity = parseFloat(getTotalOrderQuantity(product.id)) || 0;
      const price = parseFloat(product.price) || 0;
      const productTotal = totalQuantity * price;
      
      return sum + productTotal;
    }, 0).toFixed(2);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Format the products for saving
      const formattedItems = products
        .filter(p => parseFloat(p.price) > 0) // Only save products with prices
        .map(product => ({
          productId: product.id,
          price: product.price,
          total: getTotalOrderQuantity(product.id),
          grandTotal: (parseFloat(getTotalOrderQuantity(product.id)) * parseFloat(product.price)).toFixed(2)
        }));
      
      // Save prices to database
      await bazaApi.savePrices(formattedItems, calculateGrandTotal());
      
      // Artık siparişleri onaylamıyoruz, sadece fiyatları kaydediyoruz
      // Bu sayede pazar numarası sütunundaki değerler korunacak
      
      Alert.alert('Uğurlu', 'Qiymətlər yadda saxlanıldı', [
        { text: 'Tamam', onPress: () => {
          // Sadece fiyat verilerini yeniliyoruz, siparişleri değil
          fetchSavedPrices();
        }}
      ]);
    } catch (error) {
      console.error('Error confirming data:', error);
      Alert.alert(
        'Xəta',
        'Məlumatları yadda saxlamaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setIsModalVisible(false);
  };

  // Get order quantity for a product and market
  const getOrderQuantity = (productId, marketId) => {
    if (!marketOrders[marketId] || !marketOrders[marketId][productId]) {
      return "0";
    }
    return marketOrders[marketId][productId].toString();
  };

  // Get total order quantity for a product across all markets
  const getTotalOrderQuantity = (productId) => {
    let total = 0;
    Object.keys(marketOrders).forEach(marketId => {
      if (marketOrders[marketId] && marketOrders[marketId][productId]) {
        total += parseFloat(marketOrders[marketId][productId]) || 0;
      }
    });
    return total.toString();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
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
            <Text style={styles.marketName}>Baza İdarəetmə</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => {
              // Sadece verileri yenile, herhangi bir statü değişikliği yapma
              fetchPendingOrders();
            }} style={styles.iconButton}>
              <Icon name="refresh" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearData} style={styles.iconButton}>
              <Icon name="delete" type="material" color="white" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon name="logout" type="material" color="white" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Market Selector */}
      <View style={styles.marketSelectorContainer}>
        <Text style={styles.marketSelectorLabel}>Market Seçin:</Text>
        <TouchableOpacity 
          style={styles.pickerContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.selectedMarketText}>
            {selectedMarket ? selectedMarket.name : 'Market seçin'}
          </Text>
          <Icon name="arrow-drop-down" type="material" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Market Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center', 
            alignItems: 'center'
          }}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={{
            width: '90%',
            maxHeight: 350,
            backgroundColor: 'white',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <ScrollView 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {markets.map((market) => (
                <TouchableOpacity 
                  key={market.id}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f1f5f9',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: selectedMarket?.id === market.id ? '#f0f9ff' : 'white',
                  }}
                  onPress={() => handleMarketSelect(market)}
                >
                  <Text style={{
                    fontSize: 15,
                    color: '#2c3e50',
                    fontWeight: selectedMarket?.id === market.id ? 'bold' : 'normal',
                  }}>
                    {market.id} - {market.name}
                  </Text>
                  {selectedMarket?.id === market.id && (
                    <Icon 
                      name="check" 
                      type="material" 
                      size={20} 
                      color="#3498db"
                      containerStyle={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Table Header */}
      <View style={styles.tableHeaderContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, styles.productColumn]}>Məhsul</Text>
          <Text style={[styles.columnHeader, styles.marketColumn]}>
            {selectedMarket ? selectedMarket.id : '-'}
          </Text>
          <Text style={[styles.columnHeader, styles.totalColumn]}>Cəmi</Text>
          <Text style={[styles.columnHeader, styles.priceColumn]}>Qiymət</Text>
          <Text style={[styles.columnHeader, styles.grandTotalColumn]}>Cəm</Text>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView style={styles.tableContainer}>
        {products.map((product, index) => (
          <View key={product.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.productCell]}>{product.name}</Text>
            <Text style={[styles.cell, styles.marketCell]}>
              {selectedMarket ? getOrderQuantity(product.id, selectedMarket.id) : '-'}
            </Text>
            <Text style={[styles.cell, styles.totalCell]}>
              {getTotalOrderQuantity(product.id)}
            </Text>
            <TextInput
              style={[styles.cell, styles.priceInput]}
              value={product.price}
              onChangeText={(text) => handlePriceChange(text, index)}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />
            <Text style={[styles.cell, styles.grandTotalCell]}>
              {(parseFloat(getTotalOrderQuantity(product.id)) * (parseFloat(product.price) || 0)).toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerText}>Ümumi Məbləğ:</Text>
            <Text style={styles.footerValue}>
              {calculateGrandTotal()} ₼
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Icon 
            name="check-circle" 
            type="material" 
            color="white" 
            size={24} 
            containerStyle={{ marginRight: 8 }}
          />
          <Text style={styles.confirmButtonText}>Təsdiq Et</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BazaPanel; 