import { Heart, User, Search } from 'lucide-react';

import AllJanres from '../../assets/darhboard_alt.svg';

import styles from './header.module.scss';

import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';

export const Header = observer(() => {
  const { authStore } = useStore();
  const location = useLocation();
  const isBooksPage = location.pathname.startsWith('/dashboard');
  console.log(isBooksPage);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navListItem}>
            <Link to="/" className={styles.navLink}>
              Главная
            </Link>
          </li>
          <li className={styles.navListItem}>
            <a href="/" className={styles.navLink}>
              Как это работает?
            </a>
          </li>
          <li className={styles.navListItem}>
            <a href="/" className={styles.navLink}>
              О проекте
            </a>
          </li>
          <li className={styles.navListItem}>
            <a href="/" className={styles.navLink}>
              Поддержка
            </a>
          </li>
          <li className={styles.navListItem}>
            <Link to="/dashboard/favorites" className={styles.navLink}>
              <Heart className={styles.icon} />
              <p>Избранное</p>
            </Link>
          </li>
          <li className={styles.navListItem}>
            <Link to="/dashboard/profile" className={styles.navLink}>
              <User className={styles.icon} />
              {authStore.isUserLoading ? (
                <p>Загрузка...</p>
              ) : authStore.isAuth ? (
                <p>{authStore.user?.name}</p>
              ) : (
                <p>Вход</p>
              )}
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.titleContainer}>
        <hr className={styles.hr} />
        <h1 className={styles.title}>Арендуйте книгу</h1>
        <hr className={styles.hr} />
      </div>
      <nav className={styles.navAdditional}>
        <ul className={styles.navAdditionalList}>
          <li className={styles.navListItem}>
            <a href="/" className={styles.navLink}>
              Новинки
            </a>
          </li>
          <li className={styles.navListItem}>
            <a href="/" className={styles.navLink}>
              Рекомендации
            </a>
          </li>
        </ul>
      </nav>
      {!isBooksPage && <div className={styles.searchContainer}>
        <a href="/" className={styles.searchLinkJanres}>
          <img src={AllJanres} alt="AllJanres" className={styles.searchLinkJanresImage} />
          Все жанры
        </a>
        <div className={styles.search}>
          <div className={styles.searchInputContainer}>
            <input type="text" placeholder="Найти издание..." className={styles.searchInput} />
            <Search />
          </div>
          <div>или</div>
          <div>
            <Link to="/dashboard/books" className={styles.rentOutBook}>
              Разместить объявление
            </Link>
          </div>
        </div>
      </div>}
    </header>
  );
});
