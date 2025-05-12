import React from 'react';

import styles from './user-action-button.module.scss';
import clsx from 'clsx';

type UserActionButtonProps = {
  onClick?: (e: React.FormEvent | React.SyntheticEvent) => Promise<void> | void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'owner' | 'reader' | 'cancel' | 'rejected' | 'admin' | 'standard';
  type?: 'button' | 'submit';
  className?: string;
};

export const UserActionButton: React.FC<UserActionButtonProps> = ({
  onClick,
  disabled,
  children,
  variant = 'owner',
  type = 'button',
  className = '',
}) => {
  const style = {
    owner: styles.ownerButton,
    reader: styles.readerButton,
    cancel: styles.cancelButton,
    rejected: styles.rejectedButton,
    admin: styles.adminButton,
    standard: styles.standardButton,
  }[variant];

  return (
    <button className={clsx(style, className)} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
