"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = exports.ProfileImage = void 0;
class ProfileImage {
    constructor(url, height, width) {
        this.url = url;
        this.height = height;
        this.width = width;
    }
}
exports.ProfileImage = ProfileImage;
class UserProfile {
    constructor(display_name, id, images) {
        this.display_name = display_name;
        this.id = id;
        this.images = images;
    }
}
exports.UserProfile = UserProfile;
