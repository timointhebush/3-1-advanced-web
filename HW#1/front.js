// 회사 레이블을 입력했을 때, CEO이름을 최종적으로 출력해주는 함수
// Ajax get방식 사용
async function getLabelAnswer() {
    try {
        const res = await axios.get('/labelAnswer');
        const name = res.data;
        const answer = document.getElementById('answer');
        answer.textContent = name;
    } catch(err) {
        console.error(err);
    }
}

// 라디오 버튼에서 아티스트를 선택했을 때, 레이블 이름을 최종적으로 출력해주는 함수
// Ajax get방식 사용
async function getArtistAnswer() {
    try {
        const res = await axios.get('/artistAnswer');
        const name = res.data;
        const answer = document.getElementById('answer2');
        answer.textContent = name;
    } catch(err) {
        console.error(err);
    }
}

// index.html에서 회사 레이블 이름을 폼 태그에 입력했을 때, 이를 처리해주는 코드
// 입력하지 않았을 때, alert 발생
// 첫번째 (회사 레이블 명 입력) 폼 제출 시 실행
document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const label = e.target.label.value;
    if (!label) {
        return alert('레이블 이름을 입력하세요');
    }
    try {
        await axios.post('/labelName', { label });
        getLabelAnswer();
    } catch(err) {
        console.error(err);
    }
    e.target.label.value = '';
});

// index.html 라디오 버튼에서 특정 아티스트를 선택했을 때, 이를 처리해주는 코드
// 선택하지 않았을 때, alert 발생
// 두번째 (라디오 버튼에서 아티스트 선택) 폼 제출 시 실행
document.getElementById('form2').addEventListener('submit', async (e) => {
    e.preventDefault();
    const artist = e.target.artist.value;
    if (!artist) {
        return alert('아티스트 이름을 선택하세요');
    }
    try {
        await axios.post('/labelName', { artist });
        getArtistAnswer();
    } catch(err) {
        console.error(err);
    }
});