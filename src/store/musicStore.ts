import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Howl } from "howler";
import type { Song, Playlist } from "@types/index";

interface MusicState {
  currentSong: Song | null;
  playlist: Playlist | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  shuffle: boolean;
  repeat: "none" | "one" | "all";
  queue: Song[];
  currentTime: number;
  duration: number;
  howlInstance: Howl | null;

  // Actions
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  stopSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaylist: (playlist: Playlist) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
}

// Default romantic playlist
const defaultSongs: Song[] = [
  {
    id: "1",
    title: "Anniversary Celebration",
    artist: "Love Symphony",
    url: "/music/queue_song/01-anniversary-celebration.m4a",
    duration: 180,
    genre: "Romantic",
    mood: "romantic",
    thumbnail: "/images/song1-thumb.jpg",
  },
  {
    id: "2",
    title: "Love Story Theme",
    artist: "Romantic Orchestra",
    url: "/music/queue_song/02-love-story-theme.m4a",
    duration: 210,
    genre: "Classical",
    mood: "nostalgic",
    thumbnail: "/images/song2-thumb.jpg",
  },
  {
    id: "3",
    title: "Our First Dance",
    artist: "Memory Lane",
    url: "/music/song1.m4a",
    duration: 195,
    genre: "Ballad",
    mood: "romantic",
    thumbnail: "/images/song3-thumb.jpg",
  },
];

const defaultPlaylist: Playlist = {
  id: "default",
  name: "Anniversary Romance",
  description: "Perfect songs for your special day",
  songs: defaultSongs,
  thumbnail: "/images/romantic-playlist.jpg",
  mood: "romantic",
};

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      playlist: defaultPlaylist,
      isPlaying: false,
      isPaused: false,
      volume: 0.7,
      shuffle: false,
      repeat: "none",
      queue: [...defaultSongs],
      currentTime: 0,
      duration: 0,
      howlInstance: null,

      playSong: (song: Song) => {
        const { howlInstance } = get();

        // Stop current song if playing
        if (howlInstance) {
          howlInstance.stop();
          howlInstance.unload();
        }

        // Create new Howl instance
        const newHowl = new Howl({
          src: [song.url],
          html5: true,
          volume: get().volume,
          onplay: () => {
            set({ isPlaying: true, isPaused: false });
          },
          onpause: () => {
            set({ isPaused: true });
          },
          onstop: () => {
            set({ isPlaying: false, isPaused: false, currentTime: 0 });
          },
          onend: () => {
            const { repeat, nextSong } = get();
            if (repeat === "one") {
              newHowl.play();
            } else {
              nextSong();
            }
          },
          onloaderror: (id, error) => {
            console.error("Music loading error:", error);
          },
          onplayerror: (id, error) => {
            console.error("Music playback error:", error);
          },
        });

        // Update state
        set({
          currentSong: song,
          howlInstance: newHowl,
          duration: song.duration,
          currentTime: 0,
        });

        // Play the song
        newHowl.play();
      },

      pauseSong: () => {
        const { howlInstance } = get();
        if (howlInstance && howlInstance.playing()) {
          howlInstance.pause();
        }
      },

      resumeSong: () => {
        const { howlInstance } = get();
        if (howlInstance && !howlInstance.playing()) {
          howlInstance.play();
        }
      },

      stopSong: () => {
        const { howlInstance } = get();
        if (howlInstance) {
          howlInstance.stop();
        }
      },

      nextSong: () => {
        const { queue, currentSong, shuffle, repeat } = get();
        if (!currentSong || queue.length === 0) return;

        const currentIndex = queue.findIndex(
          (song) => song.id === currentSong.id,
        );
        let nextIndex: number;

        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else {
          nextIndex = currentIndex + 1;
          if (nextIndex >= queue.length) {
            if (repeat === "all") {
              nextIndex = 0;
            } else {
              return; // End of queue
            }
          }
        }

        const nextSong = queue[nextIndex];
        if (nextSong) {
          get().playSong(nextSong);
        }
      },

      previousSong: () => {
        const { queue, currentSong } = get();
        if (!currentSong || queue.length === 0) return;

        const currentIndex = queue.findIndex(
          (song) => song.id === currentSong.id,
        );
        const prevIndex =
          currentIndex - 1 >= 0 ? currentIndex - 1 : queue.length - 1;

        const prevSong = queue[prevIndex];
        if (prevSong) {
          get().playSong(prevSong);
        }
      },

      setVolume: (volume: number) => {
        const { howlInstance } = get();
        set({ volume });
        if (howlInstance) {
          howlInstance.volume(volume);
        }
      },

      toggleShuffle: () => {
        set({ shuffle: !get().shuffle });
      },

      toggleRepeat: () => {
        const { repeat } = get();
        const nextRepeat =
          repeat === "none" ? "one" : repeat === "one" ? "all" : "none";
        set({ repeat: nextRepeat });
      },

      setPlaylist: (playlist: Playlist) => {
        set({
          playlist,
          queue: [...playlist.songs],
        });
      },

      addToQueue: (song: Song) => {
        const { queue } = get();
        set({ queue: [...queue, song] });
      },

      removeFromQueue: (songId: string) => {
        const { queue } = get();
        set({ queue: queue.filter((song) => song.id !== songId) });
      },

      clearQueue: () => {
        set({ queue: [] });
      },
    }),
    {
      name: "anniversary-music-store",
      version: 1,
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        playlist: state.playlist,
      }),
    },
  ),
);
