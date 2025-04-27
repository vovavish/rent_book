import React from "react"

import styles from './dashboard-title.module.scss';

interface DashboardTitleProps {
  children: React.ReactNode;
}

export const DashboardTitle = ({ children }: DashboardTitleProps) => {
  return (
    <h2 className={styles.dashboard_title}>{children}</h2>
  )
}