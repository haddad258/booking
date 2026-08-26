import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import customerService from '../services/customer.service';

/**
 * Fix: favorites previously only worked for logged-in users — toggle()
 * silently did nothing for guests, with no feedback and no persistence.
 * Now:
 *   - Logged-in users: favorites are stored on their account via the API
 *     (unchanged behavior), so they're consistent across devices/sessions.
 *   - Guests: favorites persist in localStorage (survives page refresh and
 *     navigation, same as before but now actually implemented instead of
 *     being a no-op).
 *   - On login, any favorites saved as a guest are automatically merged
 *     into the account once, then local storage is cleared — so a user
 *     who favorites properties before logging in doesn't lose them.
 */
const GUEST_FAVORITES_KEY = 'guest_favorites';

function readGuestFavorites() {
  try {
    const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestFavorites(list) {
  try {
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(list));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — favorites
    // simply won't persist across a refresh for this guest session, but
    // the in-memory state still works for the current page visit.
  }
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const mergedForUserRef = useRef(null); // avoids re-merging guest favorites on every re-render

  const loadAccountFavorites = useCallback(async () => {
    try {
      const data = await customerService.listFavorites();
      setFavorites(data);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      if (user) {
        // Merge any guest-saved favorites into the account exactly once
        // per login (guarded by ref, not state, so it can't loop).
        if (mergedForUserRef.current !== user.id) {
          mergedForUserRef.current = user.id;
          const guestFavs = readGuestFavorites();
          if (guestFavs.length > 0) {
            await Promise.all(
              guestFavs.map((f) => customerService.addFavorite(f.bookable_type, f.bookable_id).catch(() => {}))
            );
            writeGuestFavorites([]);
          }
        }
        if (!cancelled) await loadAccountFavorites();
      } else {
        if (!cancelled) setFavorites(readGuestFavorites());
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loadAccountFavorites]);

  const isFavorite = (type, id) => favorites.some((f) => f.bookable_type === type && f.bookable_id === id);

  const toggle = async (property, type) => {
    const currentlyFavorite = isFavorite(type, property.id);

    if (user) {
      if (currentlyFavorite) {
        await customerService.removeFavorite(type, property.id);
      } else {
        await customerService.addFavorite(type, property.id);
      }
      await loadAccountFavorites();
      return;
    }

    const list = readGuestFavorites();
    const next = currentlyFavorite
      ? list.filter((f) => !(f.bookable_type === type && f.bookable_id === property.id))
      : [...list, { bookable_type: type, bookable_id: property.id }];
    writeGuestFavorites(next);
    setFavorites(next);
  };

  return { favorites, isFavorite, toggle, loading, isGuest: !user };
}

export default useFavorites;
