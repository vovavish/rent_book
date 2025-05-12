import { Mail, HelpCircle } from 'lucide-react';
import styles from './footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>БукРент - площадка для аренды бумажной литературы</h3>
          <p className={styles.footerText}>
            Доступ к тысячам книг, журналов и прочей литературы без необходимости покупки! Читайте
            любимые произведения и открывайте новые.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Навигация</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="#" className={styles.footerLink}>
                Главная
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Новинки
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Рекомендации
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Как это работает?
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                О проекте
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Поддержка
              </a>
            </li>
          </ul>
        </div>
<div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Личный кабинет</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="#" className={styles.footerLink}>
                Мои объявления
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Сдаю
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Арендую
              </a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>
                Избранное
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Контакты</h3>
          <ul className={styles.footerList}>
            <li className={styles.contactItem}>
              <Mail size={16} className={styles.contactIcon} />
              <span>book_rental@yandex.ru</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} БукРент. Все права защищены.
        </p>
      </div>
    </footer>
  );
};
