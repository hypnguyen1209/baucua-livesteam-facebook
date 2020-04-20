let storage = []; // [{id_user: '', coin: ''}]
let listCommentAnimal = []; //[{id_sender: '', text: ['', '', '']}]
let resultAnimal = [...new Array(3)];
let x = 3; // số lần chơi
let timeToPlay = 2; // thời gian chuẩn bị bắt đầu chơi (2 phút)
let timePlayToPlay = 0.1; // 0.1 == 6s thời gian chuyển tiếp giữa các ván (0.1 phút)
(() => {
    warmUpCountdown().then(() => order(warmUp, timeCountdown, execXoc, execComment));
})()


function order(warmUp, timeCountdown, execXoc, execComment) {
    return new Promise(resolve => {
        warmUp().then(() => {
            return timeCountdown();
        }).then(() => {
            return execXoc();
        }).then(() => {
            return execComment();
        }).then(() => {
            --x;
            if(x > 0) order(warmUp, timeCountdown, execXoc, execComment);
            else endRoll(); resolve();
        })
    })
}

function warmUpCountdown() {
    return new Promise(resolve => {
        let distance = timeToPlay*60;
        let intervalId = setInterval(() => {
        let minutes = Math.floor((distance /60));
        let seconds = Math.floor((distance % 60));
        document.querySelector('#countdown span').innerText = `Sẽ bắt đầu chơi trong ${String("0" + minutes).slice(-2)}:${String("0" + seconds).slice(-2)}`;
        if(distance < 0) {
            clearInterval(intervalId);
            document.querySelector('.announce p').innerHTML = 'Hãy comment thứ mà bạn muốn đặt cược.'
            document.querySelector('#countdown span').innerText = 'Hết warmUp, chuẩn bị chơi nè.';
            resolve();
        }
        --distance;
        }, 1000)
    })
}
function warmUp() {
    return new Promise(resolve => {
        let distance = timePlayToPlay*60;
        let intervalId = setInterval(() => {
        let minutes = Math.floor((distance / 60));
        let seconds = Math.floor((distance % 60));
        document.querySelector('#countdown span').innerText = `Đang chờ ${String("0" + minutes).slice(-2)}:${String("0" + seconds).slice(-2)}`;
        if(distance < 0) {
            clearInterval(intervalId);
            document.querySelector('.announce p').innerHTML = 'Hãy comment thứ mà bạn muốn đặt cược.'
            document.querySelector('#countdown span').innerText = 'Chuẩn bị chơi nè.';
            resolve();
        }
        --distance;
        }, 1000)
    })
}

function execComment() {
    return new Promise(resolve => {
        listCommentAnimal.map((itemComment, index) => {
            if(!storage.map(item => item.id_user).includes(itemComment.id_sender.split('_')[0])) {
                storage.push({id_user: itemComment.id_sender.split('_')[0], coin: 50});
                itemComment.text.map(itemText => {
                    if(resultAnimal.includes(itemText)) {
                        storage[storage.map(item => item.id_user).indexOf(itemComment.id_sender.split('_')[0])].coin += 1;
                    } else {
                        storage[storage.map(item => item.id_user).indexOf(itemComment.id_sender.split('_')[0])].coin -= 1;
                    }
                })
            } else {
                itemComment.text.map(itemText => {
                    if(resultAnimal.includes(itemText)) {
                        storage[storage.map(item => item.id_user).indexOf(itemComment.id_sender.split('_')[0])].coin += 1;
                    } else {
                        storage[storage.map(item => item.id_user).indexOf(itemComment.id_sender.split('_')[0])].coin -= 1;
                    }
                })
            }
            if(index === listCommentAnimal.length - 1) resolve();
        })
    })
}

function timeCountdown() {
    listCommentAnimal = [];
    document.getElementsByClassName('answer')[0].style.display = 'none';
    return new Promise(resolve => {
        let i = 30;
        let intervalId = setInterval(() => {
            Array.from(document.querySelectorAll('.item-cmt')).map(item=> {
                if(!listCommentAnimal.map(item => item.id_sender).includes(item.querySelector('img').alt)) {
                    let commentText = item.querySelector('p').innerHTML;
                    let re = /(|-)?(huou|bau|ga|tom|ca|cua)/g;
                    let filterUnicode = commentText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    if(filterUnicode.match(re)) {
                        listCommentAnimal.push({id_sender: item.querySelector('img').alt, text: filterUnicode.match(re)});
                    }
                }
                return;
            })
            document.querySelector('#countdown span').innerText = `00:${String("0" + i).slice(-2)}`;
            --i;
            if(i < -1) {
                clearInterval(intervalId);
                document.getElementsByClassName('answer')[0].style.display = 'grid';
                document.querySelector('.announce p').innerHTML = 'Bắt đầu xóc...';
                document.querySelector('#countdown span').innerText = 'Hết time';
                resolve();
            }
        }, 1000)
    })    
}

function execXoc() {
    resultAnimal = [...new Array(3)];
    return new Promise(resolve => {
        function randomN() {
            return Math.floor(Math.random()*6)
        }
        let listAnimal = ['chicken', 'deer', 'fish', 'shrimp', 'calabash', 'crab'];
        let listAnimal2 = ['gà', 'hươu', 'cá', 'tôm', 'bầu', 'cua'];
        let listAnimal3 = ['ga', 'huou', 'ca', 'tom', 'bau', 'cua'];
        let a = randomN();
        let b = randomN();
        let c = randomN();
        let i = 0;
        let intervalId = setInterval(() => {
            document.querySelector('[alt="1"]').src = `img/${listAnimal[(a + i) % 6]}.png`;
            document.querySelector('[alt="2"]').src = `img/${listAnimal[(b + i) % 6]}.png`;
            document.querySelector('[alt="3"]').src = `img/${listAnimal[(c + i) % 6]}.png`;
            ++i;
            if( i > 50) {
                clearInterval(intervalId);
                resultAnimal[0] = listAnimal3[(a + i - 1) % 6];
                resultAnimal[1] = listAnimal3[(b + i - 1) % 6];
                resultAnimal[2] = listAnimal3[(c + i - 1) % 6];
                document.querySelector('.announce p').innerHTML = `Xin chúc mừng những bạn đã đặt cược ${listAnimal2[(a + i - 1) % 6]}, ${listAnimal2[(b + i -1 ) % 6]} và ${listAnimal2[(c + i - 1) % 6]}`;
                resolve();
            }
        }, 100)
    })
     
}

function endRoll() {
    console.log(resultAnimal);
    console.log(listCommentAnimal);
    console.log(storage);
    document.querySelector('.announce p').innerHTML = `Hôm nay chúng ta chơi tới đây thôi nhé`;
    localStorage.setItem(new Date(), JSON.stringify(storage));
    storage = [];
}