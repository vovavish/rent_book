import styles from './public-offer.module.scss';

export const PublicOffer = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Договор публичной оферты</h2>
      <p>
        ДОГОВОР ПУБЛИЧНОЙ ОФЕРТЫ на аренду изданий ЛИТЭРА, размещённая на сайте
        https://bookrental.ru, предлагает неограниченному кругу лиц (далее — читатель (арендатор) и
        владелец (арендодатель)) заключить настоящий договор аренды изданий (далее — Договор) в
        соответствии со статьями 435–437 и 494 Гражданского кодекса РФ.
      </p>
      <h3 className={styles.categoryTitle}>1. Определения</h3>
      <div className={styles.categoryText}>
        <p className={styles.marginLeft}>
          1.1. Платформа – интернет-сервис ЛИТЭРА, доступный по адресу https://bookrental.ru,
          обеспечивающий аренду изданий между пользователями.
        </p>
        <p className={styles.marginLeft}>
          1.2. Владелец (арендодатель) – пользователь, размещающий издание для аренды.
        </p>
        <p className={styles.marginLeft}>
          1.3. Читатель (арендатор) – пользователь, арендующий издание.
        </p>
        <p className={styles.marginLeft}>
          1.4. Издание – книга или иное печатное или цифровое произведение, сдаваемое в аренду.
        </p>
        <p className={styles.marginLeft}>
          1.5. Личный кабинет – персональный раздел пользователя на Платформе.
        </p>
        <p className={styles.marginLeft}>
          1.6. Стоимость аренды – арендная плата, установленная владельцем.
        </p>
        <p className={styles.marginLeft}>
          1.7. Акты приема-передачи / возврата – электронные документы, подтверждающие передачу и
          возврат издания.
        </p>
        <p className={styles.marginLeft}>
          1.8. Обеспечительный платёж (депозитный платеж) – сумма, вносимая читателем для
          обеспечения обязательств по возврату издания.
        </p>
        <p className={styles.marginLeft}>
          1.9. Комиссионный платёж – вознаграждение платформе, удерживаемое с владельца.
        </p>

        <h3 className={styles.categoryTitle}>2. Предмет договора</h3>
        <p className={styles.marginLeft}>
          2.1. Владелец предоставляет издание в аренду, а читатель принимает и оплачивает аренду в
          установленный срок.
        </p>
        <p className={styles.marginLeft}>
          2.2. Издание передаётся в комплекте и состоянии, указанном в Личном кабинете владельца.
        </p>
        <p className={styles.marginLeft}>
          2.3. Платформа обеспечивает организационные и технические условия взаимодействия сторон.
        </p>
      </div>
      <h3 className={styles.categoryTitle}>3. Срок аренды</h3>
      <div className={styles.categoryText}>
        <p className={styles.marginLeft}>Издание считается переданным с момента подписания электронного акта приема-передачи. Срок
        аренды указывается в этом акте.</p>
      </div>
      <h3 className={styles.categoryTitle}>4. Передача и возврат</h3>
      <div className={styles.categoryText}>
        <p className={styles.marginLeft}>4.1. Передача и возврат издания оформляются актами.</p>
        <p className={styles.marginLeft}>
          4.2. В актах фиксируются характеристики издания, дата, время и место.
        </p>
        <p className={styles.marginLeft}>
          4.3. Подписание актов производится через Платформу простой электронной подписью.
        </p>
        <p className={styles.marginLeft}>
          4.4. Риск утраты с момента передачи издания лежит на читателе.
        </p>
        <p className={styles.marginLeft}>
          4.5. Доставка может осуществляться через курьерскую службу по согласованию.
        </p>
        <p className={styles.marginLeft}>4.6. Субаренда запрещена.</p>
      </div>
      <h3 className={styles.categoryTitle}>5. Платежи и расчёты</h3>
      <div className={styles.categoryText}>
        <p className={styles.marginLeft}>
          5.1. Стоимость аренды указывается в Личном кабинете владельца.
        </p>
        <p className={styles.marginLeft}>
          5.2. Обеспечительный платёж возвращается после возврата издания в надлежащем состоянии,
          либо удерживается при нарушении сроков и условий возврата.
        </p>
        <p className={styles.marginLeft}>
          5.3. Владелец платит комиссии платформе (10–20% от суммы аренды).
        </p>
        <p className={styles.marginLeft}>
          5.4. Читатель вносит плату через встроенную платежную систему.
        </p>
        <p className={styles.marginLeft}>
          5.5. Платформа удерживает комиссию за перевод средств (2%, минимум 30 руб.).
        </p>
      </div>
      <h3 className={styles.categoryTitle}>6. Обязанности сторон</h3>
      Владелец обязуется:
      <div className={styles.categoryText}>
        <p className={styles.marginLeft}>- предоставить издание в срок и в надлежащем состоянии;</p>
        <p className={styles.marginLeft}>- сообщить о всех известных дефектах;</p>
        <p className={styles.marginLeft}>
          - не препятствовать пользованию изданием в течение срока аренды;
        </p>
        <p className={styles.marginLeft}>- оплатить комиссионный платёж.</p>
      </div>
      Читатель обязуется:
      <div className={styles.categoryText}>
        <p className={styles.marginLeft}>- использовать издание бережно и по назначению;</p>
        <p className={styles.marginLeft}>- вернуть его в срок и в сохранности;</p>
        <p className={styles.marginLeft}>- не передавать третьим лицам.</p>
      </div>
    </div>
  );
};
