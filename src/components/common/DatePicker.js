import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Icon } from '@rneui/themed';
import { datePickerStyles } from '../../styles/common/datePicker.styles';

const DatePicker = ({
  label,
  selectedDate,
  onDateSelect,
  isVisible,
  onClose,
  availableDates,
  formatDate,
}) => {
  const renderDateOption = ({ item }) => (
    <TouchableOpacity
      style={datePickerStyles.dateOption}
      onPress={() => {
        onDateSelect(item);
        onClose();
      }}
    >
      <Text style={datePickerStyles.dateOptionText}>{formatDate(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={datePickerStyles.container}>
        <Text style={datePickerStyles.label}>{label}</Text>
        <TouchableOpacity
          style={datePickerStyles.pickerButton}
          onPress={() => onClose()}
        >
          <Text style={datePickerStyles.selectedText}>
            {selectedDate ? formatDate(selectedDate) : 'Tarix seçin'}
          </Text>
          <Icon name="arrow-drop-down" type="material" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={datePickerStyles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={datePickerStyles.modalContent}>
            <FlatList
              data={availableDates}
              renderItem={renderDateOption}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default DatePicker; 