import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { colors } from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;
// Adjusted column widths for better fit
const productColumnWidth = screenWidth * 0.22; // Product name column
const numberColumnWidth = screenWidth * 0.18; // For quantity, price columns
const totalColumnWidth = screenWidth * 0.19; // For total column

export const marketPanelStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.white,
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
  tableContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: 1,
    paddingHorizontal: 8,
    position: 'relative',
  },
  tableHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    zIndex: 1,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    justifyContent: 'space-between',
  },
  columnHeader: {
    fontSize: 13,
    textAlign: 'center',
    color: '#1e293b',
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  productColumnHeader: {
    width: productColumnWidth,
    paddingLeft: 6,
    textAlign: 'left',
  },
  scrollContent: {
    paddingTop: 44,
  },
  numberColumnHeader: {
    width: numberColumnWidth - 6,
    marginHorizontal: 2,
  },
  totalColumnHeader: {
    width: totalColumnWidth - 4,
    marginLeft: 2,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productCell: {
    width: productColumnWidth,
    fontSize: 13,
    paddingLeft: 6,
    color: '#334155',
    fontWeight: '500',
  },
  inputCell: {
    width: numberColumnWidth - 6,
    height: 34,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 6,
    marginHorizontal: 2,
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#334155',
    fontSize: 13,
  },
  totalCell: {
    width: totalColumnWidth - 4,
    fontSize: 13,
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '600',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: 6,
    marginLeft: 2,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  totalLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
    letterSpacing: 0.3,
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: 100,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 4,
  },
  actionButtonContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#0284c7',
  },
}); 