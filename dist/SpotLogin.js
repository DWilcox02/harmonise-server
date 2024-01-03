"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000; // or your desired port
app.use((0, cors_1.default)());
let accessToken = "";
const clientUrl = "http://localhost:5173";
function getUserProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Log the user's profile data
            // console.log("User Profile:", response.data);
            return response.data; // Return the user's profile data
        }
        catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    });
}
function getUserPlaylists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Make a GET request to Spotify API to retrieve user's playlists
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the request header
                },
            };
            const response = yield axios_1.default.get('https://api.spotify.com/v1/me/playlists', config);
            // Extract playlist data from the Spotify API response
            const playlists = response.data.items; // Assuming the playlists are in the 'items' array
            // Respond with the retrieved playlists
            return playlists;
        }
        catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    });
}
// Route to initiate Spotify authentication
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
// Route to handle Spotify callback
app.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.post("https://accounts.spotify.com/api/token", null, {
            params: tokenParams,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        accessToken = response.data.access_token;
        getUserProfile().then((value) => {
            const profile = value;
            res.set({
                "Content-Security-Policy": "frame-ancestors 'self'",
            });
            res
                .status(200)
                .send(`<script>window.opener.postMessage({ display_name: '${profile.display_name}' }, '${clientUrl}');</script>`);
        });
        // You can now use the accessToken to make requests on behalf of the user
        // Store this token securely and use it in subsequent Spotify API requests
        // res.send(accessToken);
    }
    catch (error) {
        console.error("Error exchanging code for access token:", error);
        res.status(500).send("Error during authentication");
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
