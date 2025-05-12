interface EmptyTextProps {
  children: React.ReactNode;
}

import styles from './empty-text.module.scss';

export const EmptyText = ({ children }: EmptyTextProps) => {
  return <p className={styles.emptyText}>{children}</p>;
};
