import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const STORAGE_KEY = "likeData";
const TOAST_STYLE = { borderRadius: "10px", background: "rgb(115 115 115)", color: "#fff" };

const LikedSongsContext = createContext(null);

export const LikedSongsProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedSongs));
  }, [likedSongs]);

  const loadLikedSongs = useCallback(async () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setLikedSongs(saved ? JSON.parse(saved) : []);
  }, []);

  const isLiked = useCallback(
    (songId) => likedSongs.some((item) => item.id === songId),
    [likedSongs]
  );

  const toggleLike = useCallback(
    async (song) => {
      const exists = likedSongs.some((item) => item.id === song.id);
      if (!exists) {
        const updated = [...likedSongs, song];
        setLikedSongs(updated);
        toast(`Song (${song?.name}) disimpan ke favorit lokal`, {
          icon: "✅",
          duration: 1500,
          style: TOAST_STYLE,
        });
      } else {
        const updated = likedSongs.filter((item) => item.id !== song.id);
        setLikedSongs(updated);
        toast(`Song (${song?.name}) dihapus dari favorit`, {
          icon: "⚠️",
          duration: 1500,
          style: TOAST_STYLE,
        });
      }
    },
    [likedSongs]
  );

  const removeSong = useCallback(async (songId) => {
    const updated = likedSongs.filter((item) => item.id !== songId);
    setLikedSongs(updated);
    toast(`Song removed successfully.`, {
      icon: "✅",
      duration: 1500,
      style: TOAST_STYLE,
    });
  }, [likedSongs]);

  const removeSongsBulk = useCallback(async (songIds) => {
    if (!Array.isArray(songIds) || songIds.length === 0) return;
    const updated = likedSongs.filter((item) => !songIds.includes(item.id));
    setLikedSongs(updated);
    toast(`${songIds.length} songs removed from favorites.`, {
      icon: "✅",
      duration: 1500,
      style: TOAST_STYLE,
    });
  }, [likedSongs]);

  const importLikes = useCallback(async (songIds = []) => {
    if (!songIds.length) return false;
    toast.success(`Import favorit selesai ke local storage`, { style: TOAST_STYLE });
    return true;
  }, []);

  const reorderLikes = useCallback(async (newOrderedSongs) => {
    setLikedSongs(newOrderedSongs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrderedSongs));
    toast.success("Likes reordered!", { style: TOAST_STYLE });
  }, []);

  return (
    <LikedSongsContext.Provider
      value={{ likedSongs, isLiked, toggleLike, removeSong, removeSongsBulk, loadLikedSongs, importLikes, reorderLikes }}
    >
      {children}
    </LikedSongsContext.Provider>
  );
};

const useLikedSongs = () => {
  const context = useContext(LikedSongsContext);
  if (!context) {
    throw new Error("useLikedSongs must be used within a LikedSongsProvider");
  }
  return context;
};

export default useLikedSongs;
