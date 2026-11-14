import React from 'react';
import EmptyState from '../ui/EmptyState';
import Screen from '../ui/Screen';

export default function TaskNotFound({ onBack }: { onBack: () => void }) {
  return (
    <Screen>
      <EmptyState
        icon="🤷"
        title="Задача не найдена"
        description="Возможно, она была удалена."
        actionLabel="Вернуться к списку"
        onAction={onBack}
      />
    </Screen>
  );
}
