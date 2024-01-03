"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistImage = exports.Playlist = void 0;
class PlaylistImage {
    constructor(height, url, width) {
        this.height = height;
        this.url = url;
        this.width = width;
    }
}
exports.PlaylistImage = PlaylistImage;
class Playlist {
    constructor(externalUrl, href, id, name, owner, tracksHref, uri, image) {
        this.externalUrl = externalUrl;
        this.href = href;
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.tracksHref = tracksHref;
        this.uri = uri;
        this.image = image;
    }
}
exports.Playlist = Playlist;
