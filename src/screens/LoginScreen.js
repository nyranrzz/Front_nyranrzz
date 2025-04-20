import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { Button } from '@rneui/themed';
import { loginScreenStyles as styles } from '../styles/screens/loginScreen.styles';
import { authApi, API_URL, getUserInfo } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing login on component mount
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const userData = await getUserInfo();
        
        if (userData && userData.token) {
          console.log('Found existing login for:', userData.email);
          // Navigate based on user role
          switch (userData.role) {
            case 'admin':
              navigation.navigate('AdminPanel', { user: userData });
              break;
            case 'baza':
              navigation.navigate('BazaPanel', { user: userData });
              break;
            case 'market':
              navigation.navigate('MarketPanel', { user: userData });
              break;
            default:
              console.log('Unknown user role:', userData.role);
              setIsInitializing(false);
          }
        } else {
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Error checking existing login:', error);
        setIsInitializing(false);
      }
    };

    checkExistingLogin();
  }, [navigation]);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      // iOS için Alert kullanabilirsiniz
      Alert.alert('Bilgi', message);
    }
  };

  const handleLogin = async () => {
    try {
      // Validate inputs
      if (!email || !password) {
        Alert.alert('Xəta', 'E-poçt və şifrə daxil edin');
        return;
      }
      
      setIsLoading(true);
      
      console.log('Attempting login with:', { email });
      console.log('API URL:', `${API_URL}/auth/login`);

      // Show toast for debug purposes in non-production builds
      // if (__DEV__) {
      //   showToast(`Bağlanılıyor: ${API_URL}/auth/login`);
      // }

      const data = await authApi.login(email, password);
      console.log('Login successful, navigating to:', data.user.role);
      
      // Login başarılıysa kendi token ve kullanıcı bilgilerini saklar
      // authApi.login içinde zaten setToken ve setUserInfo çağrılıyor
      
      // Navigate based on user role
      switch (data.user.role) {
        case 'admin':
          navigation.navigate('AdminPanel', { user: data.user });  // Token zaten API tarafında saklandı
          break;
        case 'baza':
          navigation.navigate('BazaPanel', { user: data.user });  // Token zaten API tarafında saklandı
          break;
        case 'market':
          navigation.navigate('MarketPanel', { user: data.user });  // Token zaten API tarafında saklandı
          break;
        default:
          console.log('Unknown user role:', data.user.role);
          Alert.alert('Xəta', 'İstifadəçi rolu tanınmadı');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Network errors
      if (error.message.includes('Network request failed') || error.toString().includes('Network request failed')) {
        Alert.alert(
          'Bağlantı xətası',
          'Serverlə əlaqə yaratmaq mümkün olmadı. İnternet bağlantınızı yoxlayın və ya daha sonra cəhd edin.',
          [{ text: 'Tamam', style: 'cancel' }]
        );
      } else {
        // Other errors
        Alert.alert(
          'Xəta',
          error.message || 'E-poçt və ya şifrə səhvdir',
          [{ text: 'Tamam', style: 'cancel' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking for existing login
  if (isInitializing) {
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
      <View style={styles.innerContainer}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Market İdarəetmə</Text>
          <Text style={styles.subtitle}>Anbar İdarəetmə Sistemi</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-poçt"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifrə"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <Button
            title="Daxil ol"
            onPress={handleLogin}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen; 