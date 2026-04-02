const VIDEO_URL =
  "https://static.warondisease.org/assets/videos/optimitron-demo-2026-03-31-seekable.mp4";

export function DemoVideoSection() {
  return (
    <video
      className="w-full block"
      src={VIDEO_URL}
      controls
      preload="metadata"
      playsInline
    />
  );
}
