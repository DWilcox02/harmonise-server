import express from "express";
import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { UserProfile } from "./classes/Profile";
import { Playlist, PlaylistImage, APIPlaylist } from "./classes/Playlist";

dotenv.config();

const app = express();
const port = 3000; // or your desired port

app.use(cors());

let accessToken: string = "";

const clientUrl = "http://localhost:5173";

async function getUserProfile() {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Log the user's profile data
    // console.log("User Profile:", response.data);
    return response.data; // Return the user's profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

async function getUserPlaylists(): Promise<Playlist[]> {
  try {
    // Make a GET request to Spotify API to retrieve user's playlists
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
      },
    };

    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      config
    );

    // Extract playlist data from the Spotify API response
    const playlists = response.data.items as APIPlaylist[];
    // Respond with the retrieved playlists
    return playlists.map((pl) => {
      try {
        return new Playlist(
          pl.external_urls.spotify,
          pl.href,
          pl.id,
          pl.name,
          pl.owner.display_name,
          pl.tracks.href,
          pl.uri,
          new PlaylistImage(
            pl.images[1].height,
            pl.images[1].url,
            pl.images[1].width
          )
        );
      } catch (error) {
        return new Playlist(
          pl.external_urls.spotify,
          pl.href,
          pl.id,
          pl.name,
          pl.owner.display_name,
          pl.tracks.href,
          pl.uri
        );
      }
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
}

app.get("/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const clientId = process.env.CLIENT_ID;
  //   console.log(clientId);
  const redirectUri = encodeURIComponent("http://localhost:3000/callback");
  const scope = "user-read-private user-read-email playlist-read-private"; // Add required scopes

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(authUrl);
});

app.get("/playlists", (_req, res) => {
  getUserPlaylists()
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((error) => {
      res.status(401);
    });
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/callback";

  const tokenParams = {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: tokenParams,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    getUserProfile().then((value) => {
      const profile = value as UserProfile;
      res.set({
        "Content-Security-Policy": "frame-ancestors 'self'",
      });
      res
        .status(200)
        .send(
          `<script>window.opener.postMessage({ display_name: '${profile.display_name}' }, '${clientUrl}');</script>`
        );
    });
    // You can now use the accessToken to make requests on behalf of the user
    // Store this token securely and use it in subsequent Spotify API requests
    // res.send(accessToken);
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    res.status(500).send("Error during authentication");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
