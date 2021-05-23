// 객체에 담겨있는 정보들을 이용해 플레이리스트를 구현하는 코드.
// youtube url끝에 쿼리를 붙여 등록한 아티스트와 노래 제목으로
// 검색할 수 있도록 구현
async function getPlaylist() {
    try {
        const playlist_data = await axios.get('/playlistData');
        const playlist = playlist_data.data;
        console.log('hello');

        const list = document.getElementById('list');
        list.innerHTML = '';

        Object.keys(playlist).map(function(user) {
            const songDiv = document.createElement('div');
            songDiv.setAttribute('id', 'songDiv');
            const title = document.createElement('span');
            title.setAttribute('id', 'title');
            const artist = document.createElement('span');
            artist.setAttribute('id', 'artist');
            title.textContent = playlist[user].title
            artist.textContent = playlist[user].artist;

            const query = `${artist.textContent}+${title.textContent}`;
            const search_url = `https://www.youtube.com/results?search_query=${query}`;

            const youtube = document.createElement('a');
            youtube.setAttribute('href', search_url);

            const youtube_icon = document.createElement('img');
            youtube_icon.setAttribute('src', 'youtube_logo.png');
            youtube_icon.setAttribute('height', '40px');
            youtube_icon.setAttribute('id', 'youtube_icon');
            
            youtube.appendChild(youtube_icon);
            songDiv.appendChild(artist);
            songDiv.appendChild(title);
            songDiv.appendChild(youtube);
            list.appendChild(songDiv);
            console.log(playlist.data);
        });
    } catch(err) {
        console.error(err);
    }
};

window.onload = getPlaylist;