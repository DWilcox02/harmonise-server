class ProfileImage {
  constructor(
    public url: string,
    public height: number,
    public width: number
  ) {}
}

class UserProfile {
  constructor(
    public display_name: string,
    public id: string,
    public images: ProfileImage[]
  ) {}
}

export { ProfileImage, UserProfile };
