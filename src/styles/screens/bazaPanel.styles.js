import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { theme } from '../../constants/theme';

const screenWidth = Dimensions.get('window').width;
const TABLE_PADDING = theme.spacing.lg;
const AVAILABLE_WIDTH = screenWidth - (TABLE_PADDING * 2);

// Sabit sütun genişlikleri - Yeni oranlar
const productColumnWidth = AVAILABLE_WIDTH * 0.10; // Məhsul column
const marketColumnWidth = AVAILABLE_WIDTH * 0.08; // Market column
const totalColumnWidth = AVAILABLE_WIDTH * 0.10; // Cəm column
const priceColumnWidth = AVAILABLE_WIDTH * 0.10; // Qiymət column
const grandTotalColumnWidth = AVAILABLE_WIDTH * 0.15; // Cəm*Qiymət column

export const bazaPanelStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: theme.colors.header.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? 10 : 40,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.header.border,
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
    color: theme.colors.header.text,
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.semibold,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.normal,
    letterSpacing: 0.3,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.borderRadius.sm,
  },
  marketSelectorContainer: {
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
    flexDirection: 'column',
  },
  marketSelectorLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  pickerContainer: {
    backgroundColor: theme.colors.background.dark,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedMarketText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    maxHeight: '70%',
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  marketOption: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  marketOptionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
  },
  tableHeaderContainer: {
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
    paddingHorizontal: TABLE_PADDING,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.table.header,
    marginVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  columnHeader: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.dark,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border.dark,
  },
  productColumn: {
    width: productColumnWidth,
    textAlign: 'left',
    paddingLeft: theme.spacing.md,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.dark,
  },
  marketColumn: {
    width: marketColumnWidth,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.dark,
    textAlign: 'center',
  },
  totalColumn: {
    width: totalColumnWidth,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.dark,
    textAlign: 'center',
  },
  priceColumn: {
    width: priceColumnWidth,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.dark,
    textAlign: 'center',
  },
  grandTotalColumn: {
    width: grandTotalColumnWidth,
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: TABLE_PADDING,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  cell: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.primary,
    paddingHorizontal: 0,
  },
  productCell: {
    width: productColumnWidth,
    fontWeight: theme.typography.fontWeights.medium,
    paddingLeft: theme.spacing.md,
  },
  marketCell: {
    width: marketColumnWidth,
    textAlign: 'center',
    backgroundColor: theme.colors.background.dark,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    color: theme.colors.text.secondary,
  },
  totalCell: {
    width: totalColumnWidth,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.semibold,
    backgroundColor: theme.colors.background.dark,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    color: theme.colors.primary.dark,
  },
  priceInput: {
    width: priceColumnWidth,
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.xs,
    padding: theme.spacing.xs,
    marginHorizontal: 0,
    textAlign: 'center',
  },
  grandTotalCell: {
    width: grandTotalColumnWidth,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.background,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary.light,
  },
  footer: {
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.main,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 32 : theme.spacing.lg,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  footerText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  footerValue: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeights.semibold,
    backgroundColor: theme.colors.primary.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    ...theme.shadows.md,
    elevation: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: 0.5,
  },
  
  // Section header style
  sectionHeader: {
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  
  // Orders list styles
  ordersContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.md,
  },
  orderCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  orderMarket: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
  },
  orderDate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  modalHeader: {
    backgroundColor: theme.colors.header.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? 10 + StatusBar.currentHeight : 40,
    paddingBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    color: theme.colors.header.text,
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.semibold,
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: theme.typography.fontSizes.sm,
  },
  closeButton: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  
  // Order details table styles
  orderTableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.dark,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  orderColumn: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  productColumn: {
    width: '35%',
    textAlign: 'left',
    paddingLeft: theme.spacing.sm,
  },
  quantityColumn: {
    width: '20%',
  },
  priceColumn: {
    width: '20%',
  },
  totalColumn: {
    width: '25%',
  },
  orderTableRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  orderCell: {
    fontSize: theme.typography.fontSizes.md,
    padding: theme.spacing.sm,
  },
  productCell: {
    width: '35%',
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
  },
  quantityInput: {
    width: '20%',
    backgroundColor: theme.colors.background.dark,
    borderRadius: theme.borderRadius.sm,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  priceInput: {
    width: '20%',
    backgroundColor: theme.colors.background.dark,
    borderRadius: theme.borderRadius.sm,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  totalCell: {
    width: '25%',
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: 'center',
    color: theme.colors.primary.main,
  },
  
  // Modal footer styles
  modalFooter: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.main,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.dark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary.main,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
}); 