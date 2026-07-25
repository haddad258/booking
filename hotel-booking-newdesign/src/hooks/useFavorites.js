import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import customerService from '../services/customer.service';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const load = useCallback(async () => {
    if (!user) return setFavorites([]);
    try {
      const data = await customerService.listFavorites();
      setFavorites(data);
    } catch {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const isFavorite = (type, id) => favorites.some((f) => f.bookable_type === type && f.bookable_id === id);

  const toggle = async (property, type) => {
    if (!user) return;
    if (isFavorite(type, property.id)) {
      await customerService.removeFavorite(type, property.id);
    } else {
      await customerService.addFavorite(type, property.id);
    }
    load();
  };

  return { favorites, isFavorite, toggle };
}

export default useFavorites;
