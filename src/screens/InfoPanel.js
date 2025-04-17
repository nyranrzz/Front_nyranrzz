import React, { useState, useCallback, memo, useRef } from 'react';
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
} from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { infoPanelStyles as styles } from '../styles/screens/infoPanel.styles';

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

  // Bakiye hesaplama
  const calculateRemainder = useCallback(() => {
    const total = parseFloat(values.totalReceived.replace(',', '.')) || 0;
    const damaged = parseFloat(values.damagedGoods.replace(',', '.')) || 0;
    const cashReg = parseFloat(values.cashRegister.replace(',', '.')) || 0;
    const cash = parseFloat(values.cash.replace(',', '.')) || 0;
    const salary = parseFloat(values.salary.replace(',', '.')) || 0;
    const expenses = parseFloat(values.expenses.replace(',', '.')) || 0;
    const difference = parseFloat(values.difference.replace(',', '.')) || 0;

    return (total - damaged - cashReg - cash - salary - expenses - difference).toFixed(2);
  }, [values]);

  const handleReset = useCallback(() => {
    setValues(prev => ({
      ...prev,
      damagedGoods: '',
      cashRegister: '',
      cash: '',
      salary: '',
      expenses: '',
      difference: '',
    }));
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleConfirm = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
              <TouchableOpacity onPress={handleReset} style={styles.iconButton}>
                <Icon name="refresh" type="material" color="white" size={22} />
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
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InfoPanel; 