async function getAnswer() {
    try {
        const res = await axios.get('/answer');
        const name = res.data;
        const answer = document.getElementById('answer');
        answer.textContent = name;
    } catch(err) {
        console.error(err);
    }
}

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tech = e.target.webtech.value;
    if (!tech) {
        return alert('웹 기술을 입력하세요');
    }
    try {
        await axios.post('/webtech', { tech });
        getAnswer();
    } catch(err) {
        console.error(err);
    }
    e.target.webtech.value = '';
});