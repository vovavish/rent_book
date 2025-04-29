import React from 'react';

import styles from './user-action-button.module.scss';

type UserActionButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'owner' | 'reader' | 'cancel' | 'rejected';
};

export const UserActionButton: React.FC<UserActionButtonProps> = ({
  onClick,
  disabled,
  children,
  variant = 'owner',
}) => {
  const className = {
    owner: styles.ownerButton,
    reader: styles.readerButton,
    cancel: styles.cancelButton,
    rejected: styles.rejectedButton,
  }[variant];

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
