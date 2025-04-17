import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { headerStyles } from '../../styles/common/header.styles';

const Header = ({ 
  title, 
  subtitle, 
  onReset, 
  onLogout, 
  onInfo, 
  onBack,
  showInfoButton = false,
  showBackButton = false,
  showResetButton = true,
  showLogoutButton = true,
}) => {
  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerTop}>
        <View style={headerStyles.headerLeft}>
          <Text style={headerStyles.title}>{title}</Text>
          <Text style={headerStyles.subtitle}>{subtitle}</Text>
        </View>
        <View style={headerStyles.headerButtons}>
          {showBackButton && (
            <TouchableOpacity onPress={onBack} style={headerStyles.iconButton}>
              <Icon name="arrow-back" type="material" color="white" size={22} />
            </TouchableOpacity>
          )}
          {showInfoButton && (
            <TouchableOpacity onPress={onInfo} style={headerStyles.iconButton}>
              <Icon name="info" type="material" color="white" size={22} />
            </TouchableOpacity>
          )}
          {showResetButton && (
            <TouchableOpacity onPress={onReset} style={headerStyles.iconButton}>
              <Icon name="refresh" type="material" color="white" size={22} />
            </TouchableOpacity>
          )}
          {showLogoutButton && (
            <TouchableOpacity onPress={onLogout} style={headerStyles.iconButton}>
              <Icon name="logout" type="material" color="white" size={22} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header; 