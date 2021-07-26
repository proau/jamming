let accessToken;
const clientID = '92beb824c2d84eb68a4742c905659893';
const redirectUri = 'https://localhost:3000'

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

        //check for access token matchers
        const accessTokenMatch = windows.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = windows.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])
            // This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(()=>accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }else{
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id:track.id,
                name:track.name,
                artist:track.artists[0].name,
                album:track.album.name,
                uri:track.uri
            }))
        })
    },
    savePlaylist(name,trackUris){
        if(!(name) && !(trackUris)){

        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}
        let userId;

        return fetch('https://api.spotify.com/v1/me',{headers: headers})
        .then(response => response.json())
        .then(jsonResponse =>{
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/${userId}/playlists`,{
                headers : headers,
                method : `POST`,
                body: JSON.stringify({
                    name : name
                })
            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
            })
        })
    }
}

export default Spotify;