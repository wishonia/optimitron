"use client";

import Link from "next/link";
import { PLAYLISTS, estimatePlaylistDuration } from "@/lib/demo-script";

interface PlaylistSelectorProps {
  currentId: string;
}

/** Group playlists by type based on ID prefix */
const groups = [
  { label: "Presentations", ids: ["hackathon", "full-demo", "investor"] },
  {
    label: "YouTube",
    ids: PLAYLISTS.filter((p) => p.id.startsWith("youtube-")).map((p) => p.id),
  },
  {
    label: "Social",
    ids: PLAYLISTS.filter((p) => p.id.startsWith("social-")).map((p) => p.id),
  },
];

export function PlaylistSelector({ currentId }: PlaylistSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {groups.map((group) => (
        <div key={group.label} className="flex items-center gap-1">
          <span className="text-[10px] font-black uppercase text-muted-foreground">
            {group.label}:
          </span>
          {group.ids.map((id) => {
            const playlist = PLAYLISTS.find((p) => p.id === id);
            if (!playlist) return null;
            const duration = Math.ceil(estimatePlaylistDuration(id) / 60);
            const isActive = id === currentId;
            return (
              <Link
                key={id}
                href={`/demo?playlist=${id}`}
                className={`text-xs font-black px-2 py-1 border-2 border-primary transition-all ${
                  isActive
                    ? "bg-brutal-pink text-brutal-pink-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                {playlist.name.replace(/ \(\d+ min\)/, "")} ({duration}m)
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
