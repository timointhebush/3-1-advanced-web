async function getUser() {
    try {
        const res = await axios.get('/users');
        const users = res.data;

        const list = document.getElementById('list');
        list.innerHTML = '';

        Object.keys(users).map(function(key) {
            const userDiv = document.createElement('div');
            const span = document.createElement('span');
            span.textContent = users[key].name + '님의 글 : ' + users[key].memo;

            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => {
                const name = prompt('수정할 이름을 입력하세요');
                const memo = prompt('수정할 글을 입력하세요');
                if (!name || !memo) {
                    return alert('수정할 이름과 글을 반드시 입력하셔야 합니다');
                }
                try {
                    await axios.put('/user/' + key, {name, memo});
                    getUser();
                } catch(err) {
                    console.error(err);
                }
            });

            const remove = document.createElement('button');
            remove.textContent='삭제';
            remove.addEventListener('click', async () => {
                try {
                    await axios.delete('/user/' + key);
                    getUser();
                } catch(err) {
                    console.log(err);
                }
            });

            userDiv.appendChild(span);
            userDiv.appendChild(edit);
            userDiv.appendChild(remove);
            list.appendChild(userDiv);
            console.log(res.data);
        });
    } catch(err) {
        console.error(err);
    }
}

window.onload = getUser;

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const memo = e.target.memo.value;
    if (!name || !memo) {
        return alert('이름과 메모를 입력하세요');
    }
    try {
        await axios.post('/user', {name, memo});
        getUser();
    } catch (err) {
        console.error(err);
    }

    e.target.name.value = '';
    e.target.memo.value = '';
});