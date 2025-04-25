import { SyntheticEvent, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { Link } from "react-router-dom";

import styles from "./register.module.css";

export const RegisterPage = () => {
  const { authStore } = useStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    authStore.signUp(email, name, lastname, surname, password);
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={styles.formField}>
          <div className={styles.formField}>
            <label htmlFor="name" className={styles.label}>
              Имя
            </label>
            <input
              id="name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Введите имя"
              required
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="lastname" className={styles.label}>
              Фамилия
            </label>
            <input
              id="lastname"
              type="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={styles.input}
              placeholder="Введите почту"
              required
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="surname" className={styles.label}>
              Отчество
            </label>
            <input
              id="surname"
              type="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className={styles.input}
              placeholder="Введите отчество"
              required
            />
          </div>
            <label htmlFor="email" className={styles.label}>
              Почта
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Введите почту"
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Введите пароль"
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Зарегестрироваться
          </button>
        </form>

        <p className={styles.footerText}>
          Вы уже зарегестрированы?{" "}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}