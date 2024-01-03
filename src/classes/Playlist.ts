type APIPlaylist = {
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: { height: number, url: string, width: number }[];
  name: string;
  owner: { display_name: string };
  tracks: { href: string };
  uri: string;
}

class PlaylistImage {
  constructor(
    public height: number,
    public url: string,
    public width: number
  ) {}
}

class Playlist {
  constructor(
    public externalUrl: string,
    public href: string,
    public id: string,
    public name: string,
    public owner: string,
    public tracksHref: string,
    public uri: string,
    public image?: PlaylistImage
  ) {}
}

export { Playlist, PlaylistImage, APIPlaylist };
