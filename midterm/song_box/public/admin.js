// 플레이리스트를 관리하는 프론트엔드를 위한 자바스크립트 코드
// playlist.js와 비슷하지만, 곡 정보를 수정, 삭제할 수 있는 버튼이 추가.
async function getPlaylist() {
    try {
        const playlist_data = await axios.get('/playlistData');
        const playlist = playlist_data.data;
        console.log('프론트 js 실행')

        const list = document.getElementById('list');
        list.innerHTML = '';

        Object.keys(playlist).map(function(key) {
            const songDiv = document.createElement('div');
            songDiv.setAttribute('id', 'songDiv');
            const title = document.createElement('span');
            title.setAttribute('id', 'title');
            const artist = document.createElement('span');
            artist.setAttribute('id', 'artist');
            title.textContent = playlist[key].title
            artist.textContent = playlist[key].artist;

            const edit = document.createElement('button');
            edit.setAttribute('id', 'edit');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => {
                const artist = prompt('수정할 아티스트 이름을 입력하세요');
                const title = prompt('수정할 노래 제목을 입력하세요');
                if (!artist || !title) {
                    return alert('수정할 이름과 글을 반드시 입력하셔야 합니다');
                }
                try {
                    await axios.put('/admin/' + key, {artist, title});
                    getPlaylist();
                } catch(err) {
                    console.error(err);
                }
            });

            const remove = document.createElement('button');
            remove.setAttribute('id', 'remove');
            remove.textContent='삭제';
            remove.addEventListener('click', async () => {
                try {
                    await axios.delete('/admin/' + key);
                    getPlaylist();
                } catch(err) {
                    console.log(err);
                }
            });

            songDiv.appendChild(artist);
            songDiv.appendChild(title);
            songDiv.appendChild(edit);
            songDiv.appendChild(remove);
            list.appendChild(songDiv);
            console.log(playlist.data);
        });
    } catch(err) {
        console.error(err);
    }
}

console.log('js파일 실행');
window.onload = getPlaylist;

document.getElementById('addSong').addEventListener('submit', async (e) => {
    e.preventDefault();

    const artist = e.target.artist.value;
    const title = e.target.title.value;
    if (!artist || !title) {
        return alert('이름과 메모를 입력하세요');
    }
    try {
        await axios.post('/admin', {artist, title});
        getPlaylist();
    } catch (err) {
        console.error(err);
    }

    e.target.artist.value = '';
    e.target.title.value = '';
});