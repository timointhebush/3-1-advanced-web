const promise = new Promise((resolve, reject) => {
    console.log('파일 읽기 시작...');
    setTimeout(() => {
        let read = true;
        if (read) resolve('파일 읽기 성공');
        else reject(new Error('파일 읽기 실패'));
    }, 2000);
});

promise
    .then(value => {
        console.log(value);
    })
    .catch(error => {
        console.log(error);
    })
    .finally(() => {
        console.log('finally');
    });

const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Carrot')
    }, 1000)
});

fetchData
    .then(data => data + ' Cheese')
    .then(data => data + ' Cake')
    .then(data => {
        return new Promise((resolve, rejcet) => {
            setTimeout(() => {
                resolve(data + '!')
            }, 1000)
        });
    })
    .then(data => console.log(data))
    .catch(error => {
        console.log(error);
    });