export interface Track {
  id: string;
  artist: string;
  title: string;
  duration: string;
  previewUrl: string;
  album?: string;
  albumArt?: string;
  spotifyUrl?: string;
  playedAt?: string;
}

// Curated fallback — shown until /api/recently-played responds (or if it 503s
// because Spotify env vars aren't configured yet). previewUrl is empty because
// Spotify deprecated 30s previews (Nov 2024); these are metadata-only.
export const FALLBACK_TRACKS: Track[] = [
  { id: "1", artist: "Daft Punk", title: "Something About Us", duration: "3:52", previewUrl: "", album: "Discovery" },
  { id: "2", artist: "Tame Impala", title: "The Less I Know The Better", duration: "3:38", previewUrl: "", album: "Currents" },
  { id: "3", artist: "Mac DeMarco", title: "Chamber of Reflection", duration: "3:52", previewUrl: "", album: "Salad Days" },
  { id: "4", artist: "Gorillaz", title: "On Melancholy Hill", duration: "3:53", previewUrl: "", album: "Plastic Beach" },
  { id: "5", artist: "MGMT", title: "Electric Feel", duration: "3:49", previewUrl: "", album: "Oracular Spectacular" },
  { id: "6", artist: "The Strokes", title: "Reptilia", duration: "3:41", previewUrl: "", album: "Room on Fire" },
  { id: "7", artist: "Arctic Monkeys", title: "Do I Wanna Know?", duration: "4:33", previewUrl: "", album: "AM" },
  { id: "8", artist: "Tame Impala", title: "Let It Happen", duration: "7:47", previewUrl: "", album: "Currents" },
];
