export const theme = {
  colors: {
    primary: {
      main: '#3498db',
      dark: '#2980b9',
      light: '#5dade2',
      background: '#ebf5fb',
    },
    secondary: {
      main: '#2c3e50',
      dark: '#1a252f',
      light: '#34495e',
      background: '#ebedef',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      dark: '#f8f9fa',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
      disabled: '#95a5a6',
      hint: '#bdc3c7',
    },
    border: {
      main: '#e2e8f0',
      dark: '#cbd5e1',
      light: '#f1f5f9',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    header: {
      background: '#2c3e50',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.1)',
    },
    table: {
      header: '#f8fafc',
      headerBorder: '#e2e8f0',
      row: '#ffffff',
      rowBorder: '#f1f5f9',
      highlight: '#eff6ff',
    },
  },
  
  typography: {
    fontSizes: {
      xs: 12,
      sm: 13,
      md: 15,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 22,
      '4xl': 24,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },

  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}; 