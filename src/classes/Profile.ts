type ProfileImage = {
    url: string;
    height: number;
    width: number;
}

type UserProfile = {
    display_name: string;
    id: string
    images: ProfileImage[];

}

export { ProfileImage, UserProfile }