import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { infoPanelStyles as styles } from '../styles/screens/infoPanel.styles';
import { marketTotalApi, marketTransactionApi } from '../services/api';

// Memoize edilmiş TableRow komponenti
const TableRow = memo(({ label, value, onChange, editable = true, inputRef }) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableLabel}>{label}</Text>
    {editable ? (
      <TextInput
        ref={inputRef}
        style={styles.tableInput}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholder="0.00"
        placeholderTextColor="#9CA3AF"
      />
    ) : (
      <Text style={styles.tableValue}>{value} ₼</Text>
    )}
  </View>
));

const InfoPanel = ({ route, navigation }) => {
  const { user } = route.params;
  const currentDate = new Date().toLocaleDateString('az-AZ');
  const [isSaving, setIsSaving] = useState(false);

  // Input referansları
  const inputRefs = {
    damagedGoods: useRef(null),
    cashRegister: useRef(null),
    cash: useRef(null),
    salary: useRef(null),
    expenses: useRef(null),
    difference: useRef(null),
  };

  // State yönetimi
  const [values, setValues] = useState({
    totalReceived: '',
    damagedGoods: '',
    cashRegister: '',
    cash: '',
    salary: '',
    expenses: '',
    difference: '',
  });

  // Fetch the total received value only when component mounts (once)
  useEffect(() => {
    // Single fetch when component loads
    fetchTotalReceived();
    
    // No more polling/interval
  }, [user.id]);
  
  const fetchTotalReceived = async () => {
    try {
      console.log(`Fetching total received for market ${user.id}`);
      const response = await marketTotalApi.getTotalReceived(user.id);
      console.log('Fetched total received:', response);
      
      if (response && response.totalAmount !== undefined) {
        setValues(prev => ({
          ...prev,
          totalReceived: response.totalAmount.toString()
        }));
      }
    } catch (error) {
      console.error('Error fetching total received:', error);
      // Fail silently - keep using the existing value
      // We don't want to show errors to the user or reset the value
    }
  };

  // Input değişiklik handler'ı
  const handleInputChange = useCallback((field, value) => {
    // Virgülü noktaya çevir
    let processedValue = value.replace(/,/g, '.');
    
    // Sadece sayı ve nokta karakterlerine izin ver
    processedValue = processedValue.replace(/[^0-9.]/g, '');
    
    // Birden fazla nokta varsa sadece ilkini koru
    const parts = processedValue.split('.');
    if (parts.length > 2) {
      processedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setValues(prevValues => ({
      ...prevValues,
      [field]: processedValue
    }));
  }, []);

  // Sayısal değeri güvenli şekilde dönüştür
  const safeParseFloat = (value) => {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseFloat(value.toString().replace(/,/g, '.'));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Bakiye hesaplama
  const calculateRemainder = useCallback(() => {
    const total = safeParseFloat(values.totalReceived);
    const damaged = safeParseFloat(values.damagedGoods);
    const cashReg = safeParseFloat(values.cashRegister);
    const cash = safeParseFloat(values.cash);
    const salary = safeParseFloat(values.salary);
    const expenses = safeParseFloat(values.expenses);
    const difference = safeParseFloat(values.difference);

    return (total - damaged - cashReg - cash - salary - expenses - difference).toFixed(2);
  }, [values]);

  const handleReset = useCallback(() => {
    // Kullanıcıya onay sor
    Alert.alert(
      'Diqqət',
      'Bu əməliyyat form məlumatlarını sıfırlayacaq və "Qəbul olunan cəm" dəyərini sıfırlayacaq. Davam etmək istəyirsiniz?',
      [
        {
          text: 'Ləğv et',
          style: 'cancel'
        },
        {
          text: 'Sıfırla',
          onPress: async () => {
            try {
              // Önce ekrandaki tüm değerleri sıfırla
              setValues({
                totalReceived: '',
                damagedGoods: '',
                cashRegister: '',
                cash: '',
                salary: '',
                expenses: '',
                difference: '',
              });
              
              // Veritabanında da "Qəbul olunan cəm" değerini sıfırla
              await marketTotalApi.saveTotalReceived(user.id, 0);
              
              // Sıfırlama işlemi başarılı mesajı göster
              Alert.alert('Uğurlu', 'Məlumatlar sıfırlandı');
            } catch (error) {
              console.error('Error resetting total received value:', error);
              // Hata olsa da en azından ekrandaki değerler sıfırlanmış olacak
              Alert.alert('Qismən uğurlu', 'Məlumatlar sıfırlandı, lakin verilənlər bazasında xəta baş verdi');
            }
          }
        }
      ]
    );
  }, [user.id]);

  const handleRefreshTotal = useCallback(async () => {
    try {
      // Re-fetch the total received value
      await fetchTotalReceived();
      console.log('Refreshed total received value');
    } catch (error) {
      console.error('Error refreshing total received:', error);
      // Fail silently
    }
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Confirm işleminde verileri kaydetme
  const handleConfirm = useCallback(async () => {
    try {
      setIsSaving(true);
      
      // Kaydetmeden önce kullanıcıya sor
      Alert.alert(
        'Təsdiq',
        'Bu məlumatları yadda saxlamaq istəyirsiniz?',
        [
          {
            text: 'Ləğv et',
            style: 'cancel',
            onPress: () => setIsSaving(false),
          },
          {
            text: 'Təsdiq et',
            onPress: async () => {
              try {
                // Değerleri hazırla, boş ise 0 olarak gönder
                const transactionData = {
                  totalReceived: safeParseFloat(values.totalReceived),
                  damagedGoods: safeParseFloat(values.damagedGoods),
                  cashRegister: safeParseFloat(values.cashRegister),
                  cash: safeParseFloat(values.cash),
                  salary: safeParseFloat(values.salary),
                  expenses: safeParseFloat(values.expenses),
                  difference: safeParseFloat(values.difference),
                  remainder: safeParseFloat(calculateRemainder()),
                  // Bugünün tarihini ekle
                  transactionDate: new Date().toISOString().split('T')[0]
                };
                
                console.log('Saving transaction data:', transactionData);
                
                // API'yi çağır ve verileri kaydet
                const response = await marketTransactionApi.saveTransaction(user.id, transactionData);
                
                console.log('Transaction save response:', response);
                
                if (response && response.success) {
                  Alert.alert(
                    'Uğurlu',
                    response.message || 'Məlumatlar yadda saxlanıldı',
                    [
                      {
                        text: 'Tamam',
                        onPress: () => navigation.goBack()
                      }
                    ]
                  );
                } else {
                  throw new Error('Məlumatları yadda saxlamaq mümkün olmadı');
                }
              } catch (error) {
                console.error('Error saving transaction:', error);
                Alert.alert('Xəta', error.message || 'Məlumatları yadda saxlamaq mümkün olmadı');
                setIsSaving(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in handleConfirm:', error);
      Alert.alert('Xəta', 'Gözlənilməz bir xəta baş verdi');
      setIsSaving(false);
    }
  }, [values, calculateRemainder, user.id, navigation, safeParseFloat]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.marketName}>{user.name} XOŞ GƏLMİSİNİZ</Text>
              <Text style={styles.date}>{currentDate}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                <Icon name="arrow-back" type="material" color="white" size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRefreshTotal} style={styles.iconButton}>
                <Icon name="refresh" type="material" color="white" size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReset} style={styles.iconButton}>
                <Icon name="delete" type="material" color="white" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Table */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.tableContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <TableRow 
                label="Qəbul olunan cəm:"
                value={values.totalReceived}
                editable={false}
              />
              <TableRow 
                label="Xarab mal:"
                value={values.damagedGoods}
                onChange={(value) => handleInputChange('damagedGoods', value)}
                inputRef={inputRefs.damagedGoods}
              />
              <TableRow 
                label="Kassa:"
                value={values.cashRegister}
                onChange={(value) => handleInputChange('cashRegister', value)}
                inputRef={inputRefs.cashRegister}
              />
              <TableRow 
                label="Nəğd:"
                value={values.cash}
                onChange={(value) => handleInputChange('cash', value)}
                inputRef={inputRefs.cash}
              />
              <TableRow 
                label="Əməkhaqqı:"
                value={values.salary}
                onChange={(value) => handleInputChange('salary', value)}
                inputRef={inputRefs.salary}
              />
              <TableRow 
                label="Rasxod:"
                value={values.expenses}
                onChange={(value) => handleInputChange('expenses', value)}
                inputRef={inputRefs.expenses}
              />
              <TableRow 
                label="Fərq:"
                value={values.difference}
                onChange={(value) => handleInputChange('difference', value)}
                inputRef={inputRefs.difference}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.remainderContainer}>
            <Text style={styles.remainderLabel}>Qalıq:</Text>
            <Text style={styles.remainderValue}>{calculateRemainder()} ₼</Text>
          </View>
          <Button
            title="Təsdiq Et"
            onPress={handleConfirm}
            containerStyle={styles.confirmButtonContainer}
            buttonStyle={styles.confirmButton}
            titleStyle={styles.confirmButtonText}
            loading={isSaving}
            disabled={isSaving}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InfoPanel; 