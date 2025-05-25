/// <reference types="vite-plugin-svgr/client" />

import { Heart, User, Search } from 'lucide-react';

import AllJanresIcon from '../../assets/DarhboardAlt.svg?react';

import styles from './header.module.scss';

import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserActionButton } from '../ui';
import { useState } from 'react';

export const Header = observer(() => {
  const { authStore } = useStore();

  const location = useLocation();
  const isBooksPage = location.pathname.startsWith('/dashboard');
  const isSupportPage = location.pathname.startsWith('/support');
  const isAdminPage = location.pathname.startsWith('/admin');

  const [searchValue, setSearchValue] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim() === '') {
      return;
    }
    
    navigate(`/search?query=${searchValue}`);
  };

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
            <Link to="/news" className={styles.navLink}>
              Новинки
            </Link>
          </li>
          <li className={styles.navListItem}>
            <Link to="/recommended" className={styles.navLink}>
              Рекомендации
            </Link>
          </li>
          <li className={styles.navListItem}>
            <Link to="/about" className={styles.navLink}>
              О проекте
            </Link>
          </li>
          {!authStore.user?.roles.includes('ADMIN') ? (
            <li className={styles.navListItem}>
              <Link to="/dashboard/favorites" className={styles.navLink}>
                <Heart className={styles.icon} />
                <p>Избранное</p>
              </Link>
            </li>
          ) : (
            <li className={styles.navListItem}>
              <Link to="/how_it_works" className={styles.navLink}>
                Как это работает?
              </Link>
            </li>
          )}
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
        <Link to="/" className={styles.logo}>
          <h1 className={styles.title}>ЛитЭра</h1>
        </Link>
        {!isBooksPage && !isSupportPage && !isAdminPage && (
          <div className={styles.searchContainer}>
            <UserActionButton variant="reader">
              <Link to="/search" className={styles.searchLinkJanres}>
                <AllJanresIcon className={styles.searchLinkJanresImage} /> <div>Все жанры</div>
              </Link>
            </UserActionButton>
            <div className={styles.search}>
              <div className={styles.searchInputContainer}>
                <input type="text" placeholder="Найти издание..." className={styles.searchInput} value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                <Search onClick={handleSearch} className={styles.searchIcon}/>
              </div>
              <div className={styles.searchDelimiter}>или</div>
              <div className={styles.rentOutBookButton}>
                <UserActionButton variant="owner" className={styles.rentOutBookButton}>
                  <Link to="/dashboard/books" className={styles.rentOutBook}>
                    Разместить объявление
                  </Link>
                </UserActionButton>
              </div>
            </div>
          </div>
        )}
        <hr className={styles.hr} />
      </div>
      <nav className={styles.navAdditional}>
        <ul className={styles.navAdditionalList}>
          {!authStore.user?.roles.includes('ADMIN') && (
            <li className={styles.navListItem}>
              <Link to="/how_it_works" className={styles.navLink}>
                Как это работает?
              </Link>
            </li>
          )}
          {!authStore.user?.roles.includes('ADMIN') ? (
            <li className={styles.navListItem}>
              <Link to="/support/new" className={styles.navLink}>
                Поддержка
              </Link>
            </li>
          ) : (
            <Link to="/admin/dashboard" className={styles.navLink}>
              Панель техподдержки
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
});
