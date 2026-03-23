import type { Metadata } from "next";
import { DemoPlayer } from "@/components/demo/DemoPlayer";
import { PlaylistSelector } from "@/components/demo/PlaylistSelector";
import { PLAYLISTS, DEFAULT_PLAYLIST_ID, estimatePlaylistDuration } from "@/lib/demo-script";

export const metadata: Metadata = {
  title: "Demo | The Earth Optimization Game",
  description:
    "Narrated tour of the Earth Optimization Game. Wishonia walks you through the problem, the solution, and how to play.",
};

interface PageProps {
  searchParams: Promise<{ playlist?: string }>;
}

export default async function DemoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const playlistId = params.playlist ?? DEFAULT_PLAYLIST_ID;
  const validPlaylist = PLAYLISTS.find((p) => p.id === playlistId);
  const resolvedId = validPlaylist ? playlistId : DEFAULT_PLAYLIST_ID;
  const duration = estimatePlaylistDuration(resolvedId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Playlist selector bar */}
      <div className="border-b-4 border-primary bg-background px-4 py-2 flex items-center gap-4 overflow-x-auto">
        <span className="text-xs font-black uppercase text-muted-foreground shrink-0">
          Playlist:
        </span>
        <PlaylistSelector currentId={resolvedId} />
        <span className="text-xs font-bold text-muted-foreground shrink-0 ml-auto">
          ~{Math.ceil(duration / 60)} min
        </span>
      </div>
      <div className="flex-grow">
        <DemoPlayer playlistId={resolvedId} />
      </div>
    </div>
  );
}
