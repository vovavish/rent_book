import { useState } from 'react';
import { YMaps, Map, Placemark } from '@iminside/react-yandex-maps';
import styles from './address-picker.module.scss';
import { UserActionButton } from '../ui';

export const AddressPicker = ({
  onSelect,
  apiKey,
  defaultLocation,
}: {
  onSelect: (location: { address: string; lat: number; lon: number }) => void;
  apiKey: string;
  defaultLocation?: { address?: string; lat?: number; lon?: number };
}) => {
  const [address, setAddress] = useState(defaultLocation?.address || '');
  const [selectedLocation, setSelectedLocation] = useState<{
    address?: string;
    lat?: number;
    lon?: number;
  } | null>(defaultLocation || null);

  // Обработка поиска адреса
  const handleSearch = async () => {
    if (!address) return;
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(
          address,
        )}`,
      );
      const data = await response.json();
      const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;
      if (geoObject) {
        const [lat, lon] = geoObject.Point.pos.split(' ').map(Number);
        const selectedAddr = geoObject.metaDataProperty.GeocoderMetaData.text;
        const newLocation = { address: selectedAddr, lat, lon };
        setSelectedLocation(newLocation);
        setAddress(selectedAddr); // Обновляем поле ввода
        onSelect(newLocation);
      } else {
        alert('Адрес не найден');
      }
    } catch (error) {
      console.error('Ошибка геокодирования адреса:', error);
    }
  };

  const handleMapClick = async (e: any) => {
    const coords = e.get('coords');
    if (!coords || coords.length !== 2) {
      console.error('Координаты не получены:', coords);
      return;
    }
    const [lon, lat] = coords;
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${lat},${lon}`,
      );
      const data = await response.json();
      const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;
      if (geoObject) {
        const selectedAddr = geoObject.metaDataProperty.GeocoderMetaData.text;
        const newLocation = { address: selectedAddr, lat, lon };
        setSelectedLocation(newLocation);
        setAddress(selectedAddr); // Обновляем поле ввода
        onSelect(newLocation);
      } else {
        alert('Не удалось найти адрес для этого местоположения');
      }
    } catch (error) {
      console.error('Ошибка обратного геокодирования:', error);
    }
  };

  const hasValidCoords = selectedLocation?.lat !== undefined && selectedLocation?.lon !== undefined;

  const mapState = hasValidCoords
    ? { center: [selectedLocation.lon as number, selectedLocation.lat as number], zoom: 10 }
    : { center: [55.75, 37.57], zoom: 9 };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите адрес"
          className={styles.input}
        />
        <UserActionButton onClick={handleSearch} type="button" className={styles.button}>
          Поиск
        </UserActionButton>
      </div>
      <YMaps query={{ apikey: apiKey }}>
        <Map className={styles.map} state={mapState} onClick={handleMapClick}>
          {selectedLocation && (
            <Placemark geometry={[selectedLocation.lon, selectedLocation.lat]} />
          )}
        </Map>
      </YMaps>
    </div>
  );
};
