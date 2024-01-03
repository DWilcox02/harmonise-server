type PlaylistImage = {
    height: number
    url: string
    width: number
}

type Playlist = {
    externalUrl: string
    href: string
    id: string
    image: PlaylistImage
    name: string
    owner: string
    tracksHref: string
    uri: string
}

export { Playlist, PlaylistImage }