function getSpotifyAlbumId(albumURL) {
  if (!albumURL) return null;

  // Handles: https://open.spotify.com/album/<id>?...
  const match = albumURL.match(/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

export default function SpotifyEmbed({ albumURL, height = 352 }) {
  const albumId = getSpotifyAlbumId(albumURL);
  if (!albumId) return null;

  const src = `https://open.spotify.com/embed/album/${albumId}?utm_source=generator`;

  return (
    <div style={{ borderRadius: 12, overflow: "hidden" }}>
      <iframe
        title="Spotify album"
        src={src}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
