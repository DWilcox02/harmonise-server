# Harmonise-Server
Backend for Harmonise - Provides user authentication and synchronisation services

### How to Run:
1. ```tsc --watch```
2. ```node dist/SpotLogin.js```
3. Go to client app (currently ```http://localhost:...``` (forgot exact number)) and press login
4. Client will receive select information necessary to request synchronisation, server (this) will handle the rest

Make sure .env file is up to date.