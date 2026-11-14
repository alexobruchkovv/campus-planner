import { Alert, Platform } from 'react-native';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * Диалог подтверждения. На iOS/Android — системный Alert,
 * в браузере — window.confirm, потому что Alert с кнопками там не работает.
 */
export function confirmAction(options: ConfirmOptions, onConfirm: () => void): void {
  const { title, message, confirmLabel, cancelLabel = 'Отмена', destructive = false } = options;

  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
