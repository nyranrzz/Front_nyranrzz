import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export const datePickerStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  pickerButton: {
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
  selectedText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
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
  dateOption: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  dateOptionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
  },
}); 