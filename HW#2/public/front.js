// 사용자 이름 눌렀을 때 플레이리스트 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {
  el.addEventListener('click', function () {
    const id = el.querySelector('td').textContent;
    getPlaylist(id);
  });
});
// 사용자 로딩
async function getUser() {
  try {
    const res = await axios.get('/users');
    const users = res.data;
    console.log(users);
    const tbody = document.querySelector('#user-list tbody');
    tbody.innerHTML = '';
    users.map(function (user) {
      const row = document.createElement('tr');
      row.addEventListener('click', () => {
        getPlaylist(user.id);
      });
      // 로우 셀 추가
      let td = document.createElement('td');
      td.textContent = user.id;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = user.email;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = user.name;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = user.notice ? '동의' : '동의X';
      row.appendChild(td);
      // 교재 예제에서, 사용자를 삭제할 수 있는 버튼 추가.
      td = document.createElement('td');
      user_remove = document.createElement('button');
      user_remove.setAttribute('id', 'user_remove')
      user_remove.textContent = '삭제'
      user_remove.addEventListener('click', async () => {
        try {
            await axios.delete(`/users/${user.id}`);
            getUser();
        } catch(err) {
            console.log(err);
        }
    });
      td.appendChild(user_remove);
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}
// 플레이리스트 로딩
async function getPlaylist(id) {
  try {
    const res = await axios.get(`/users/${id}/playlist`);
    const songs = res.data;
    const list = document.getElementById('play-list');
    list.innerHTML = '';

    const username = document.createElement('span');
    username.textContent = `${songs[0].User.name}의 플레이리스트`
    list.appendChild(username);
    list.appendChild(document.createElement('br'));

    songs.map(function (song) {
      const songDiv = document.createElement('div');
      songDiv.setAttribute('id', 'songDiv');
      const title = document.createElement('span');
      title.setAttribute('id', 'title');
      const artist = document.createElement('span');
      artist.setAttribute('id', 'artist');

      title.textContent = song.title
      artist.textContent = song.artist;

      const query = `${artist.textContent}+${title.textContent}`;
      const search_url = `https://www.youtube.com/results?search_query=${query}`;

      const youtube = document.createElement('a');
      youtube.setAttribute('href', search_url);

      const youtube_icon = document.createElement('img');
      youtube_icon.setAttribute('src', 'youtube_logo.png');
      youtube_icon.setAttribute('height', '40px');
      youtube_icon.setAttribute('id', 'youtube_icon');

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
              await axios.patch(`/playlist/${song.id}`, {artist, title});
              getPlaylist(song.userid);
          } catch(err) {
              console.error(err);
          }
      });

      const remove = document.createElement('button');
      remove.setAttribute('id', 'remove');
      remove.textContent='삭제';
      remove.addEventListener('click', async () => {
          try {
              await axios.delete(`/playlist/${song.id}`);
              getPlaylist(song.userid);
          } catch(err) {
              console.log(err);
          }
      });
      
      youtube.appendChild(youtube_icon);
      songDiv.appendChild(artist);
      songDiv.appendChild(title);
      songDiv.appendChild(youtube);
      songDiv.appendChild(edit);
      songDiv.appendChild(remove);
      list.appendChild(songDiv);
    })
  } catch (err) {
    console.error(err);
  }
};
// 사용자 등록 시
document.getElementById('signup').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const name = e.target.name.value;
  const notice = e.target.notice.checked;
  if (!name) {
    return alert('이름을 입력하세요');
  }
  if (!email) {
    return alert('나이를 입력하세요');
  }
  try {
    await axios.post('/users', { name, email, notice });
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.name.value = '';
  e.target.email.value = '';
  e.target.notice.checked = false;
});
// 노래 등록 시
document.getElementById('addSong').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = e.target.userid.value;
  const artist = e.target.artist.value;
  const title = e.target.title.value;
  if (!id) {
    return alert('아이디를 입력하세요');
  }
  if (!artist) {
    return alert('아티스트 명을 입력하세요');
  }
  if (!title) {
    return alert('노래 제목을 입력하세요');
  }
  try {
    await axios.post('/playlist', { id, artist, title });
    getPlaylist(id);
  } catch (err) {
    console.error(err);
  }
  e.target.userid.value = '';
  e.target.artist.value = '';
  e.target.title.value = '';
});

window.onload = getUser;
