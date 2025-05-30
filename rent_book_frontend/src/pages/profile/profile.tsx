import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { DashboardTitle } from '../../components/ui/dashboard-title';
import { UserActionButton } from '../../components/ui';
import { Star } from 'lucide-react';
import { ModalWithChildren } from '../../components/modal/modal-with-children';
import { ChangePassword } from '../../components/change-password/change-password';

export const MyProfilePage = observer(() => {
  const { userProfileStore, authStore } = useStore();
  const [editMode, setEditMode] = useState<'profile' | 'phones' | 'cards' | null>(null);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [cardNumbers, setCardNumbers] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState('');
  const [newCard, setNewCard] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ownerRating = userProfileStore.profile?.ownerRating ?? 0;
  const readerRating = userProfileStore.profile?.readerRating ?? 0;

  useEffect(() => {
    userProfileStore.fetchProfile();
  }, [userProfileStore]);

  useEffect(() => {
    if (userProfileStore.profile) {
      setName(userProfileStore.profile.name);
      setLastname(userProfileStore.profile.lastname);
      setSurname(userProfileStore.profile.surname || '');
      setPhoneNumbers([...userProfileStore.profile.phoneNumbers]);
      setCardNumbers([...userProfileStore.profile.cardNumbers]);
    }
  }, [userProfileStore.profile]);

  const handleSaveProfile = async () => {
    await userProfileStore.updateProfile({ name, lastname, surname });
    setEditMode(null);
  };

  const handleSavePhones = async () => {
    await userProfileStore.updatePhoneNumbers({ phoneNumbers });
    setEditMode(null);
  };

  const handleSaveCards = async () => {
    await userProfileStore.updateCardNumbers({ cardNumbers });
    setEditMode(null);
  };

  const addPhone = () => {
    if (newPhone.trim() && !phoneNumbers.includes(newPhone.trim())) {
      setPhoneNumbers([...phoneNumbers, newPhone.trim()]);
      setNewPhone('');
    }
  };

  const removePhone = (phone: string) => {
    setPhoneNumbers(phoneNumbers.filter((p) => p !== phone));
  };

  const addCard = () => {
    if (newCard.trim() && !cardNumbers.includes(newCard.trim())) {
      setCardNumbers([...cardNumbers, newCard.trim()]);
      setNewCard('');
    }
  };

  const removeCard = (card: string) => {
    setCardNumbers(cardNumbers.filter((c) => c !== card));
  };

  if (userProfileStore.isLoading && !userProfileStore.profile) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (!userProfileStore.profile) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h3>Профиль не найден</h3>
        <p>Не удалось загрузить данные вашего профиля</p>
        <UserActionButton onClick={() => userProfileStore.fetchProfile()}>
          Попробовать снова
        </UserActionButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isModalOpen && (
        <ModalWithChildren onCancel={() => setIsModalOpen(false)} headerText="Смена пароля">
          <ChangePassword
            onSubmit={async (oldPassword, newPassword) => {
              await authStore.changePassword(oldPassword, newPassword);
              setIsModalOpen(false);
            }}
          />
        </ModalWithChildren>
      )}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <DashboardTitle>Мой профиль</DashboardTitle>
          <UserActionButton
            onClick={() => setIsModalOpen(true)}
            variant="rejected"
            className={styles.headerButton}
          >
            Изменить пароль
          </UserActionButton>
        </div>
        <div>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {name[0]}
              {lastname[0]}
            </div>
            {!authStore.user?.roles.includes('ADMIN') && <div className={styles.ratings}>
              <div className={styles.myRatingTitle}>Мой рейтинг:</div>
              <div className={styles.myRating}>
                <div className={styles.ratingItem}>Владелец: {ownerRating.toFixed(1)}</div>
                <Star size={16} color="#FFD700" fill="#FFD700" />
              </div>
              <div className={styles.myRating}>
                <div className={styles.ratingItem}>Читатель: {readerRating.toFixed(1)}</div>
                <Star size={16} color="#FFD700" fill="#FFD700" />
              </div>
            </div>}
          </div>
        </div>
      </header>

      {userProfileStore.error && (
        <div className={styles.errorMessage}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
            />
          </svg>
          {userProfileStore.error}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Основная информация</h2>
          {editMode !== 'profile' && (
            <UserActionButton
              onClick={() => setEditMode('profile')}
              variant="standard"
              className={styles.editWrapper}
            >
              <div className={styles.editButton}>
                <svg className={styles.editIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
              </div>
            </UserActionButton>
          )}
        </div>

        {editMode === 'profile' ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.formInput}
                placeholder="Введите имя"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Фамилия</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className={styles.formInput}
                placeholder="Введите фамилию"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Отчество</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className={styles.formInput}
                placeholder="Введите отчество (если есть)"
              />
            </div>
            <div className={styles.formActions}>
              <UserActionButton onClick={() => setEditMode(null)} variant="rejected">
                Отмена
              </UserActionButton>
              <UserActionButton onClick={handleSaveProfile}>Сохранить изменения</UserActionButton>
            </div>
          </div>
        ) : (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Имя</span>
              <span className={styles.infoValue}>{name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Фамилия</span>
              <span className={styles.infoValue}>{lastname}</span>
            </div>
            {surname && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Отчество</span>
                <span className={styles.infoValue}>{surname}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{userProfileStore.profile.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Телефонные номера</h2>
          {editMode !== 'phones' && (
            <UserActionButton
              onClick={() => setEditMode('phones')}
              variant="reader"
              className={styles.editWrapper}
            >
              {phoneNumbers.length > 0 ? (
                <div className={styles.editButton}>
                  <svg className={styles.editIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                    />
                  </svg>
                </div>
              ) : (
                <div className={styles.editButton}>
                  <svg className={styles.editIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                    />
                  </svg>
                </div>
              )}
            </UserActionButton>
          )}
        </div>

        {editMode === 'phones' ? (
          <div className={styles.editForm}>
            <div className={styles.listContainer}>
              {phoneNumbers.length > 0 ? (
                <ul className={styles.itemsList}>
                  {phoneNumbers.map((phone) => (
                    <li key={phone} className={styles.listItem}>
                      <span className={styles.itemText}>{phone}</span>
                      <UserActionButton
                        onClick={() => removePhone(phone)}
                        aria-label="Удалить номер"
                        variant="rejected"
                      >
                        <div className={styles.editButton}>
                          <svg className={styles.icon} viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                            />
                          </svg>
                        </div>
                      </UserActionButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyState}>
                  <svg className={styles.emptyIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79M20,11V9.5H18V11H20M20,14V12.5H18V14H20Z"
                    />
                  </svg>
                  <p>Нет добавленных номеров</p>
                </div>
              )}

              <div className={styles.addItemForm}>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  className={styles.formInput}
                />
                <UserActionButton onClick={addPhone}>
                  <div className={styles.editButton}>
                    <svg className={styles.addIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                    Добавить
                  </div>
                </UserActionButton>
              </div>
            </div>

            <div className={styles.formActions}>
              <UserActionButton onClick={() => setEditMode(null)} variant="rejected">
                Отмена
              </UserActionButton>
              <UserActionButton onClick={handleSavePhones}>Сохранить изменения</UserActionButton>
            </div>
          </div>
        ) : (
          <div className={styles.infoContainer}>
            {phoneNumbers.length > 0 ? (
              <ul className={styles.itemsList}>
                {phoneNumbers.map((phone) => (
                  <li key={phone} className={styles.listItem}>
                    <svg className={styles.itemIcon} viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79M20,11V9.5H18V11H20M20,14V12.5H18V14H20Z"
                      />
                    </svg>
                    <span className={styles.itemText}>{phone}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79M20,11V9.5H18V11H20M20,14V12.5H18V14H20Z"
                  />
                </svg>
                <p>Нет добавленных номеров</p>
              </div>
            )}
          </div>
        )}
      </div>

      {!authStore.user?.roles.includes('ADMIN') && <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Банковские карты</h2>
          {editMode !== 'cards' && (
            <UserActionButton
              onClick={() => setEditMode('cards')}
              variant="standard"
              className={styles.editWrapper}
            >
              {cardNumbers.length > 0 ? (
                <div className={styles.editButton}>
                  <svg className={styles.editIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                    />
                  </svg>
                </div>
              ) : (
                <div className={styles.editButton}>
                  <svg className={styles.editIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                    />
                  </svg>
                </div>
              )}
            </UserActionButton>
          )}
        </div>

        {editMode === 'cards' ? (
          <div className={styles.editForm}>
            <div className={styles.listContainer}>
              {cardNumbers.length > 0 ? (
                <ul className={styles.itemsList}>
                  {cardNumbers.map((card) => (
                    <li key={card} className={styles.listItem}>
                      <span className={styles.itemText}>**** **** **** {card.slice(-4)}</span>
                      <UserActionButton
                        onClick={() => removeCard(card)}
                        aria-label="Удалить карту"
                        variant="rejected"
                      >
                        <div className={styles.editButton}>
                          <svg className={styles.icon} viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                            />
                          </svg>
                        </div>
                      </UserActionButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyState}>
                  <svg className={styles.emptyIcon} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,11H4V8H20V11Z"
                    />
                  </svg>
                  <p>Нет добавленных карт</p>
                </div>
              )}

              <div className={styles.addItemForm}>
                <input
                  type="text"
                  value={newCard}
                  onChange={(e) => setNewCard(e.target.value)}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className={styles.formInput}
                />
                <UserActionButton onClick={addCard}>
                  <div className={styles.editButton}>
                    <svg className={styles.addIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                    Добавить
                  </div>
                </UserActionButton>
              </div>
            </div>

            <div className={styles.formActions}>
              <UserActionButton onClick={() => setEditMode(null)} variant="rejected">
                Отмена
              </UserActionButton>
              <UserActionButton onClick={handleSaveCards}>Сохранить изменения</UserActionButton>
            </div>
          </div>
        ) : (
          <div className={styles.infoContainer}>
            {cardNumbers.length > 0 ? (
              <ul className={styles.itemsList}>
                {cardNumbers.map((card) => (
                  <li key={card} className={styles.listItem}>
                    <svg className={styles.itemIcon} viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,11H4V8H20V11Z"
                      />
                    </svg>
                    <span className={styles.itemText}>**** **** **** {card.slice(-4)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,11H4V8H20V11Z"
                  />
                </svg>
                <p>Нет добавленных карт</p>
              </div>
            )}
          </div>
        )}
      </div>}
      <div className={styles.profileFooter}>
        <UserActionButton onClick={() => authStore.logout()}>Выход</UserActionButton>
      </div>
    </div>
  );
});
