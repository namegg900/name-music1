import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const TOAST_STYLE = { borderRadius: "10px", background: "rgb(115 115 115)", color: "#fff" };
const PLAYLIST_STORAGE_KEY = "nameMusicPlaylists";

const PlaylistContext = createContext(null);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error("usePlaylist must be used within a PlaylistProvider");
  return context;
};

const readPlaylists = () => {
  try {
    const raw = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writePlaylists = (playlists) => localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    setLoadingPlaylists(true);
    try {
      const localPlaylists = readPlaylists();
      setPlaylists(localPlaylists);
      setCollaborations([]);
    } finally {
      setLoadingPlaylists(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createPlaylist = useCallback(async (name, description = '', isPublic = false) => {
    const newPlaylist = {
      _id: crypto.randomUUID(),
      name,
      description,
      isPublic,
      songs: [],
      owner: { username: 'guest' },
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newPlaylist, ...readPlaylists()];
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success(`Playlist "${name}" created!`, { style: TOAST_STYLE });
    return newPlaylist;
  }, []);

  const deletePlaylist = useCallback(async (playlistId) => {
    const updated = readPlaylists().filter((p) => p._id !== playlistId);
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success("Playlist deleted", { style: TOAST_STYLE });
  }, []);

  const addSongToPlaylist = useCallback(async (playlistId, songId) => {
    const updated = readPlaylists().map((p) => {
      if (p._id !== playlistId) return p;
      if (p.songs?.includes(songId)) return p;
      return { ...p, songs: [...(p.songs || []), songId], updatedAt: new Date().toISOString() };
    });
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success("Song added to playlist!", { style: TOAST_STYLE, duration: 1500 });
    return true;
  }, []);

  const addSongsToPlaylistBulk = useCallback(async (playlistId, songIds) => {
    const updated = readPlaylists().map((p) => {
      if (p._id !== playlistId) return p;
      const merged = Array.from(new Set([...(p.songs || []), ...songIds]));
      return { ...p, songs: merged, updatedAt: new Date().toISOString() };
    });
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success(`Successfully added ${songIds.length} songs!`, { style: TOAST_STYLE });
    return true;
  }, []);

  const removeSongFromPlaylist = useCallback(async (playlistId, songId) => {
    const updated = readPlaylists().map((p) => p._id === playlistId
      ? { ...p, songs: (p.songs || []).filter((id) => id !== songId), updatedAt: new Date().toISOString() }
      : p);
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success("Song removed from playlist", { style: TOAST_STYLE, duration: 1500 });
  }, []);

  const importPlaylist = useCallback(async () => {
    toast("Import online dimatikan di mode gratis lokal", { icon: "ℹ️", style: TOAST_STYLE });
    return null;
  }, []);

  const togglePlaylistVisibility = useCallback(async (playlistId, isPublic) => {
    const updated = readPlaylists().map((p) => p._id === playlistId ? { ...p, isPublic } : p);
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success(isPublic ? "Playlist is now public" : "Playlist is now private", { style: TOAST_STYLE });
    return updated.find((p) => p._id === playlistId) || null;
  }, []);

  const reorderSongs = useCallback(async (playlistId, songIds) => {
    const updated = readPlaylists().map((p) => p._id === playlistId ? { ...p, songs: songIds } : p);
    writePlaylists(updated);
    setPlaylists(updated);
    toast.success("Order saved!", { style: TOAST_STYLE });
    return true;
  }, []);

  const fetchCommunityPlaylists = useCallback(async () => ({ playlists: [], total: 0, page: 1, totalPages: 1, hasMore: false }), []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        collaborations,
        loadingPlaylists,
        fetchPlaylists,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        addSongsToPlaylistBulk,
        removeSongFromPlaylist,
        importPlaylist,
        togglePlaylistVisibility,
        reorderSongs,
        fetchCommunityPlaylists,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
