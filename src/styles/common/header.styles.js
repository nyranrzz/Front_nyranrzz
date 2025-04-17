import { StyleSheet, Platform, StatusBar } from 'react-native';
import { theme } from '../../constants/theme';

export const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.header.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + theme.spacing.xs : theme.spacing['2xl'],
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
  title: {
    color: theme.colors.header.text,
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.semibold,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
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
}); 