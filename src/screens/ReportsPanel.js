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
  ScrollView,
  Dimensions,
  Modal
} from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { marketApi, marketTransactionApi } from '../services/api';

const screenWidth = Dimensions.get('window').width;

// Tablo başlıkları
const TABLE_HEADERS = [
  "Qəbul olunan cəm",
  "Xarab Mal",
  "Kassa",
  "Nəğd",
  "Əməkhaqqı",
  "Rasxod",
  "Fərq",
  "Qalıq"
];

// Örnek market listesi (daha sonra API'den çekilecek)
const EXAMPLE_MARKETS = [
  { id: 1, name: "Market 1" },
  { id: 2, name: "Market 2" },
  { id: 3, name: "Market 3" },
  { id: 4, name: "Market 4" },
  { id: 5, name: "Market 5" },
  { id: 6, name: "Market 6" },
  { id: 7, name: "Market 7" },
  { id: 8, name: "Market 8" },
  { id: 9, name: "Market 9" },
  { id: 10, name: "Market 10" },
  { id: 11, name: "Market 11" },
  { id: 12, name: "Market 12" },
  { id: 13, name: "Market 13" },
  { id: 14, name: "Market 14" },
  { id: 15, name: "Market 15" }
];

const ReportsPanel = ({ route, navigation }) => {
  const { user } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Tarih seçimi için state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  
  // Marketleri ve verileri yükle
  useEffect(() => {
    fetchMarkets();
  }, []);
  
  // Tarih değiştiğinde verileri yeniden yükle
  useEffect(() => {
    if (markets.length > 0) {
      fetchTransactions();
    }
  }, [selectedDate, markets]);
  
  const fetchMarkets = async () => {
    try {
      setIsLoading(true);
      // API'den marketleri çekmeye çalış
      try {
        const marketsData = await marketApi.getAllMarkets();
        setMarkets(marketsData || EXAMPLE_MARKETS);
        
        // Market listesi hazır olduğunda işlemleri de yükle
        if (marketsData && marketsData.length > 0) {
          await fetchTransactions();
        }
      } catch (error) {
        console.error('Error fetching markets:', error);
        // Örnek veri ile devam et
        setMarkets(EXAMPLE_MARKETS);
      }
    } catch (error) {
      console.error('Error in fetchMarkets:', error);
      Alert.alert('Xəta', 'Market məlumatlarını almaq mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };
  
  // İşlemleri seçilen tarihe göre yükle
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      // Tarihi YYYY-MM-DD formatına çevir
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log(`Fetching transactions for date: ${formattedDate}`);
      
      const transactionsData = await marketTransactionApi.getTransactionsByDate(formattedDate);
      console.log(`Fetched ${transactionsData.length} transactions`);
      
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Belirli bir market için işlem verisini bul
  const getTransactionForMarket = (marketId) => {
    return transactions.find(t => t.market_id === marketId) || null;
  };
  
  // Güvenli şekilde değeri formatla
  const formatValue = (value) => {
    if (value === undefined || value === null || isNaN(parseFloat(value))) {
      return '-';
    }
    return parseFloat(value).toFixed(2);
  };
  
  // Basit tarih seçici fonksiyonlar
  const formatDate = (date) => {
    return date.toLocaleDateString('az-AZ');
  };
  
  // Tarih modalını göster/gizle
  const toggleDateModal = () => {
    setShowDateModal(!showDateModal);
  };

  // Günü değiştir
  const changeDay = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Bugüne git
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Özel tarih seçimi
  const selectDate = (option) => {
    let newDate = new Date();
    
    switch(option) {
      case 'today':
        // Bugün - varsayılan
        break;
      case 'yesterday':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'lastWeek':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'lastMonth':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      default:
        break;
    }
    
    setSelectedDate(newDate);
    toggleDateModal();
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchTransactions();
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
            <Text style={styles.marketName}>Hesabatlar</Text>
            <Text style={styles.date}>{formatDate(new Date())}</Text>
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
        {/* Modern Tarih Seçici */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Tarix:</Text>
          <View style={styles.datePickerWrapper}>
            <TouchableOpacity 
              style={styles.calendarButton}
              onPress={toggleDateModal}
            >
              <Icon name="calendar-today" type="material" size={22} color="#3498db" />
              <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            
            <View style={styles.dateNavigationButtons}>
              <TouchableOpacity 
                style={styles.navigationButton}
                onPress={() => changeDay(-1)}
              >
                <Icon name="keyboard-arrow-left" type="material" size={24} color="#3498db" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.todayNavigationButton}
                onPress={goToToday}
              >
                <Text style={styles.todayNavigationText}>Bugün</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navigationButton}
                onPress={() => changeDay(1)}
              >
                <Icon name="keyboard-arrow-right" type="material" size={24} color="#3498db" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tablo */}
        <ScrollView 
          horizontal 
          style={styles.tableScrollContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tableScrollContent}
        >
          <View style={styles.tableWrapper}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.marketHeaderCell}>
                <Text style={styles.tableHeaderText}>Market</Text>
              </View>
              
              {TABLE_HEADERS.map((header, index) => (
                <View key={index} style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>{header}</Text>
                </View>
              ))}
            </View>
            
            <ScrollView style={styles.tableBodyContainer}>
              {/* Market Satırları */}
              {markets.map((market, marketIndex) => {
                // Bu market için veri var mı kontrol et
                const transaction = getTransactionForMarket(market.id);
                
                return (
                  <View 
                    key={market.id} 
                    style={[
                      styles.tableRow, 
                      marketIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                    ]}
                  >
                    <View style={styles.marketCell}>
                      <Text style={styles.marketNameText}>{market.name}</Text>
                    </View>
                    
                    {/* Total Received */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.total_received) : '-'}
                      </Text>
                    </View>
                    
                    {/* Damaged Goods */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.damaged_goods) : '-'}
                      </Text>
                    </View>
                    
                    {/* Cash Register */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.cash_register) : '-'}
                      </Text>
                    </View>
                    
                    {/* Cash */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.cash) : '-'}
                      </Text>
                    </View>
                    
                    {/* Salary */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.salary) : '-'}
                      </Text>
                    </View>
                    
                    {/* Expenses */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.expenses) : '-'}
                      </Text>
                    </View>
                    
                    {/* Difference */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.difference) : '-'}
                      </Text>
                    </View>
                    
                    {/* Remainder */}
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>
                        {transaction ? formatValue(transaction.remainder) : '-'}
                      </Text>
                    </View>
                  </View>
                );
              })}
              
              {/* Eğer henüz veri yok ya da hiç sonuç bulunamadıysa uyarı */}
              {markets.length > 0 && transactions.length === 0 && (
                <View style={styles.noDataRow}>
                  <Text style={styles.noDataText}>
                    Bu tarix üçün məlumat tapılmadı
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      
      {/* Modern Tarih Seçme Modalı */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleDateModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleDateModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tarix Seçin</Text>
                <TouchableOpacity onPress={toggleDateModal}>
                  <Icon name="close" type="material" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateOptionsContainer}>
                <TouchableOpacity
                  style={styles.dateOptionCard}
                  onPress={() => selectDate('today')}
                >
                  <Icon name="today" type="material" size={28} color="#3498db" />
                  <Text style={styles.dateOptionCardTitle}>Bugün</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.dateOptionCard}
                  onPress={() => selectDate('yesterday')}
                >
                  <Icon name="history" type="material" size={28} color="#3498db" />
                  <Text style={styles.dateOptionCardTitle}>Dünən</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.dateOptionCard}
                  onPress={() => selectDate('lastWeek')}
                >
                  <Icon name="date-range" type="material" size={28} color="#3498db" />
                  <Text style={styles.dateOptionCardTitle}>Keçən həftə</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.dateOptionCard}
                  onPress={() => selectDate('lastMonth')}
                >
                  <Icon name="event" type="material" size={28} color="#3498db" />
                  <Text style={styles.dateOptionCardTitle}>Keçən ay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    padding: 10,
    paddingTop: 20,
  },
  datePickerContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  datePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedDateText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#2c3e50',
    fontWeight: '500',
  },
  dateNavigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  todayNavigationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 8,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  todayNavigationText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  tableScrollContainer: {
    flex: 1,
  },
  tableScrollContent: {
    paddingBottom: 16,
  },
  tableWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tableBodyContainer: {
    maxHeight: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowEven: {
    backgroundColor: 'white',
  },
  tableRowOdd: {
    backgroundColor: '#f8fafb',
  },
  marketHeaderCell: {
    width: 120,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#3a5169',
  },
  marketCell: {
    width: 120,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  tableHeaderCell: {
    width: 110,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#3a5169',
  },
  tableCell: {
    width: 110,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  tableHeaderText: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  marketNameText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2c3e50',
  },
  tableCellText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4a5568',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dateOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  dateOptionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateOptionCardTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  noDataRow: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    width: '100%',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default ReportsPanel; 