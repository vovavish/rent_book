import { Mail, SunMoon } from 'lucide-react';
import styles from './footer.module.scss';
import { Link } from 'react-router-dom';
import { UserActionButton } from '../ui';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';

export const Footer = observer(() => {
  const { toggleTheme } = useTheme();
  const { authStore } = useStore();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>ЛитЭра - площадка для аренды бумажной литературы</h3>
          <p className={styles.footerText}>
            Доступ к тысячам книг, журналов и прочей литературе без необходимости покупки! Читайте
            любимые произведения и открывайте новые.
          </p>
          <UserActionButton onClick={() => toggleTheme()} variant="rejected" className={styles.themeButton}>
            <SunMoon size={22} />
          </UserActionButton>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Навигация</h3>
          <ul className={styles.footerList}>
            <li>
              <Link to="/" className={styles.footerLink}>
                Главная
              </Link>
            </li>
            <li>
              <Link to="#" className={styles.footerLink}>
                Новинки
              </Link>
            </li>
            <li>
              <Link to="#" className={styles.footerLink}>
                Рекомендации
              </Link>
            </li>
            <li>
              <Link to="/how_it_works" className={styles.footerLink}>
                Как это работает?
              </Link>
            </li>
            <li>
              <Link to="/about" className={styles.footerLink}>
                О проекте
              </Link>
            </li>
            {!authStore.user?.roles.includes('ADMIN') ? <li>
              <Link to="/support/new" className={styles.footerLink}>
                Поддержка
              </Link>
            </li> :  <li>
              <Link to="/admin/dashboard" className={styles.footerLink}>
                Панель техподдержки
              </Link>
            </li>}
          </ul>
        </div>
        {!authStore.user?.roles.includes('ADMIN') && <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Личный кабинет</h3>
          <ul className={styles.footerList}>
            <li>
              <Link to="/dashboard/profile" className={styles.footerLink}>
                Профиль
              </Link>
            </li>
            <li>
              <Link to="/dashboard/books" className={styles.footerLink}>
                Мои объявления
              </Link>
            </li>
            <li>
              <Link to="/dashboard/rent_in_out" className={styles.footerLink}>
                Сдаю
              </Link>
            </li>
            <li>
              <Link to="/dashboard/my_rents" className={styles.footerLink}>
                Арендую
              </Link>
            </li>
            <li>
              <Link to="/dashboard/favorites" className={styles.footerLink}>
                Избранное
              </Link>
            </li>
          </ul>
        </div>}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Контакты</h3>
          <ul className={styles.footerList}>
            <li className={styles.contactItem}>
              <Mail size={22} className={styles.contactIcon} />
              <span>book_rental@yandex.ru</span>
            </li>
          </ul>
          <h3 className={styles.footerTitle}>Правила и политика</h3>
          <ul className={styles.footerList}>
            <li>
              <Link to="/privacy" className={styles.footerLink}>
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link to="/terms" className={styles.footerLink}>
                Условия использования
              </Link>
            </li>
            <li>
              <Link to="/public_offer" className={styles.footerLink}>
                Шаблон договора публичной оферты
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© {new Date().getFullYear()} ЛитЭра. Все права защищены.</p>
      </div>
    </footer>
  );
});
