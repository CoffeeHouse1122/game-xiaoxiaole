let goalScore = 1000 // 目标分数
let curScore = 0 // 当前分数
let countDown = 60 // 倒计时
let stars = [] // 布局矩阵 7*7
let choose = [] // 选中元素
let flag = false
let gameStatus = false // 游戏状态
let types = ['itemT0', 'itemT1', 'itemT2', 'itemT3', 'itemT4', 'itemT5']
let gameSection = document.getElementById("gameSection")
let startBtn = document.querySelector(".start")
let time = document.querySelector(".time")
let score = document.querySelector(".curScore")

// 初始化
function init() {
  curScore = 0
  countDown = 60
  time.innerHTML = countDown
  score.innerHTML = curScore
  stars = []
  gameSection.innerHTML = ''
  for (let i = 0; i < 7; i++) {
    stars[i] = [];
    for (let j = 0; j < 7; j++) {
      let type = parseInt(Math.random() * 6)
      let star = document.createElement("div")
      star.className = `item itemT${type}`
      star.style.left = 1 * i + 'rem'
      star.style.bottom = 1 * j + 'rem'
      star.x = i
      star.y = j
      star.itemType = type
      // star.innerHTML = `${i},${j}`
      stars[i][j] = star
      gameSection.append(star)
    }
  }
}

// 选择相邻的相同元素
function check(tag) {

  if (tag.classList[0] != 'item') return

  if (choose.indexOf(tag) == -1) {
    choose.push(tag);
  }
  if (stars[tag.x][tag.y + 1] && stars[tag.x][tag.y + 1].itemType == tag.itemType && choose.indexOf(stars[tag.x][tag.y + 1]) == -1) {
    check(stars[tag.x][tag.y + 1]);
  }

  if (stars[tag.x][tag.y - 1] && stars[tag.x][tag.y - 1].itemType == tag.itemType && choose.indexOf(stars[tag.x][tag.y - 1]) == -1) {
    check(stars[tag.x][tag.y - 1]);
  }

  if (stars[tag.x - 1] && stars[tag.x - 1][tag.y] && stars[tag.x - 1][tag.y].itemType == tag.itemType && choose.indexOf(stars[tag.x - 1][tag.y]) == -1) {
    check(stars[tag.x - 1][tag.y]);
  }

  if (stars[tag.x + 1] && stars[tag.x + 1][tag.y] && stars[tag.x + 1][tag.y].itemType == tag.itemType && choose.indexOf(stars[tag.x + 1][tag.y]) == -1) {
    check(stars[tag.x + 1][tag.y]);
  }
}

// 新增元素并刷新位置
function refresh() {
  for (let i = stars.length - 1; i >= 0; i--) {
    if (stars[i].length < 7) {
      let addLength = 7 + (7 - stars[i].length)
      for (let j = 7; j < addLength; j++) {
        // console.log(j)
        let type = parseInt(Math.random() * 5)
        stars[i][j] = document.createElement("div")
        stars[i][j].className = `item itemT${type}`
        stars[i][j].itemType = type
        stars[i][j].style.left = 1 * i + 'rem'
        stars[i][j].style.bottom = 1 * j + 'rem'
        stars[i][j].x = i;
        stars[i][j].y = j;
        // stars[i][j].innerHTML = `${i},${j}`
        // stars[i][j].style.transition = "left 0.3s, bottom 0.3s";
        gameSection.append(stars[i][j])
        stars[i] = stars[i].filter(function (e) {
          return e
        });
      }
    }
  }

  for (let i = 0; i < stars.length; i++) {
    for (let j = 0; j < stars[i].length; j++) {
      // console.log(i, j)
      setTimeout(function () {
        stars[i][j].style.left = 1 * i + 'rem'
        stars[i][j].style.bottom = 1 * j + 'rem'
        stars[i][j].x = i;
        stars[i][j].y = j;
        // stars[i][j].innerHTML = `${i},${j}`
        stars[i][j].style.transition = "left 0.3s, bottom 0.3s";
      }, 100)

    }
  }
}

// 排序
function sort() {
  if (choose.length > 1) {
    let chooseArr = [];
    for (let i = stars.length - 1; i >= 0; i--) {
      for (let j = stars[i].length - 1; j >= 0; j--) {
        if (choose.indexOf(stars[i][j]) != -1) {
          chooseArr.push(stars[i][j]);
        }
      }
    }
    choose = chooseArr;
  }
}

// 添加选择动画
function addChooseAni() {
  if (choose.length > 1) {
    for (let i = 0; i < choose.length; i++) {
      choose[i].classList.add("itemAni")
    }
  }
}

// 移出选择动画
function removeChooseAni() {
  if (choose.length > 1) {
    for (let i = 0; i < choose.length; i++) {
      choose[i].classList.remove("itemAni")
    }
  }
}

// 得分机制
function getScore() { 
  if(choose.length <= 1) return

  if(choose.length == 2) {
    curScore = curScore + 2
  }
  if(choose.length == 3) {
    curScore = curScore + 3
  }
  if(choose.length == 4) {
    curScore = curScore + 3
  }
  if(choose.length >= 5) {
    curScore = curScore + 10
  }
  if(choose.length >= 10) {
    curScore = curScore + 100
  }
}

// 注册消除 - pc
gameSection.onclick = function (e) {
  e = e || window.event
  e.preventDefault();
  if(!gameStatus) return
  if (flag) return
  flag = true
  if (choose.length > 1) {
    getScore()
    for (let i = 0; i < choose.length; i++) {
      // console.log(choose[i].x, choose[i].y)
      setTimeout(function () {
        gameSection.removeChild(stars[choose[i].x][choose[i].y])
        stars[choose[i].x].splice(choose[i].y, 1);
      }, 100 * i)
    }
    score.innerHTML = curScore
    setTimeout(refresh, choose.length * 105);
  }

  setTimeout(function () {
    choose = []
    flag = false
  }, choose.length * 200)

}

// 注册消除 - wap
gameSection.ontouchstart = function (e) {
  e = e || window.event
  e.preventDefault();
  if(!gameStatus) return
  if (flag) return
  flag = true
  check(e.target);
  sort()
  if (choose.length > 1) {
    getScore()
    for (let i = 0; i < choose.length; i++) {
      // console.log(choose[i].x, choose[i].y)
      setTimeout(function () {
        gameSection.removeChild(stars[choose[i].x][choose[i].y])
        stars[choose[i].x].splice(choose[i].y, 1);
      }, 100 * i)
    }
    score.innerHTML = curScore
    setTimeout(refresh, choose.length * 105);
  }

  setTimeout(function () {
    choose = []
    flag = false
  }, choose.length * 200)

}

// 注册鼠标移入移出
gameSection.onmousemove = function (e) {
  if(!gameStatus) return
  if (flag) return
  e = e || window.event
  check(e.target);
  sort()
  addChooseAni()
  e.target.onmouseout = function (e) {
    if(!gameStatus) return
    if (flag) return
    e = e || window.event
    removeChooseAni()
    choose = [];
  }
}

// 开始
startBtn.onclick = function () {
  if(gameStatus) return
  gameStatus = true
  this.classList.remove('startAni')
  init()
  let timeFlag = setInterval(() => {
    countDown--
    time.innerHTML = countDown
    if (countDown <= 0) {
      clearInterval(timeFlag)
      alert(`恭喜获得${curScore}分`)
      gameStatus = false
      this.classList.add('startAni')
    }
  }, 1000);
}

init()
