const board = (() => {
          let board = ["-","-","-","-","-","-","-","-","-"];
          const movePiece = ({n, player}) => {
                    board[n] = player.symb;
                     return checkWinner(player.symb);
          }
          const checkPlay = (n) => {
                    if (board[n] =="-") {
                              return false;
                    } else {
                              return true;
                    }
          }
          const reset = () => {
                    board = ["-","-","-","-","-","-","-","-","-"];
                    document.querySelectorAll('.gameBoard-cell').forEach( cell => cell.innerText= "");
          }
          const checkWinner = (player) => {
                    let winner =  false;
                    winner = checkWinner2(board, winner, player);
                    winner = checkWinner2(otherboard(), winner, player);
                    winner = checkWinner3(board, winner, player);
                    return winner;
          }
          const otherboard = () => {
                    const otherboard = [];
                    for( let i = 0; i <3; i++) {
                              otherboard.push(board[i+0]);
                              otherboard.push(board[i+3]);
                              otherboard.push(board[i+6]);
                    }
                    return otherboard;
          }
          const checkWinner2 = (board, winner, symb) => {
                    const board2 = board.map( item => {
                              if (item==symb) {
                                        item = 1;
                              }
                              return item;
                    });
                    for( let i = 0; i <board2.length; i+=3){
                              if (board2[i]+board2[i+1]+board2[i+2] == 3) {
                                        winner = true;
                              }
                    }
                    return winner;

          }
          const checkWinner3 = (board, winner, player) => {
                    if ([board[0],board[4],board[8]].join() ==  ["1","1","1"].map(item=> item=player).join() || 
                    [board[2],board[4],board[6]].join() ==  ["1","1","1"].map(item=> item=player).join()) {
                              winner = true;
                    }
                    return winner;
          }
          return {movePiece, reset, checkPlay};
})();

const Player = (name, symb, className) => {
          let win = 0;
          const getWin = () => {
                    return win;
          }
          const setWin = () => {
                    win++;
          }
          const reset = () => {
                    win = 0;
          }
          return {name, symb, className, getWin, setWin, reset};
}

const gameController = ({player1, player2}, board) => {
          const resetButton = document.querySelector('#reset');
          let moves = 9;
          let lastPlayer;
          let winnerPlayer;
          const reset = () => {
                    moves = 9;
                    lastPlayer = "";
                    winnerPlayer = "";
                    board.reset();
          }
          const resetAll  = () => {
                    reset();
                    for( stat of document.querySelectorAll(".winplayer")) {
                              stat.classList.remove("active");
                    }
                    player1.reset();
                    player2.reset();
                    document.querySelector(".look").classList.add("play");
                    document.querySelector(".look").classList.remove("win");
                    resetButton.addEventListener("click", controller.reset);
                    resetButton.removeEventListener("click", controller.resetAll);


          }
          const check = (e) => {
                    const n = e.target.getAttribute('index');
                    if (winnerPlayer || moves<=0 || board.checkPlay(n)) return;
                    if (lastPlayer==player1) {
                              lastPlayer = player2;
                    } else {
                              lastPlayer = player1;
                    }
                    e.target.innerText = lastPlayer.symb;
                    if (board.movePiece({n, player:lastPlayer})) {
                              winnerPlayer = lastPlayer;
                              lastPlayer.setWin();
                              if (lastPlayer.getWin() < 3) document.querySelector(lastPlayer.className+"win"+lastPlayer.getWin()).classList.add("active");
                              if(lastPlayer.getWin()==3) {
                                        document.querySelector(".w3").classList.add(`${lastPlayer.className.slice(1)}win${lastPlayer.getWin()}`);
                                        document.querySelector(".w3").classList.add("active");
                                        gameOver(lastPlayer);
                                        resetButton.removeEventListener("click", controller.reset);
                              }
                              return;
                    }
                    moves--;
          }
          const gameOver = lastPlayer => {
                    const target =  document.querySelector(".look");
                    target.innerHTML = `<h1>Congrats! ${lastPlayer.name} YOU ROCK!</h1>`;
                    target.classList.remove('play');
                    target.classList.add('win');
                    resetButton.removeEventListener("click", controller.reset);
                    resetButton.addEventListener("click", controller.resetAll);

          }
          return {check, reset, resetAll}
}

const look = (() => {
          const target = document.querySelector(".look");
          const play = () => {
                    const name1 = target.querySelector("label:first-of-type input").value;
                    const name2 = target.querySelector("label:last-of-type input").value;
                    console.log({name1, name2});
                    if (!name1 || !name2) return;
                    newPlayer1 = Player(name1, "O", ".player1");
                    newPlayer2 = Player(name2, "X", ".player2");
                    document.querySelector(newPlayer1.className).innerText = `${newPlayer1.name} - ${newPlayer1.symb}`;
                    document.querySelector(newPlayer2.className).innerText = `${newPlayer2.symb} - ${newPlayer2.name}`;
                    controller = gameController({player1: newPlayer1, player2: newPlayer2}, board);
                    document.querySelectorAll(".gameBoard-cell").forEach(cell => cell.addEventListener("click", controller.check));
                    reset.addEventListener("click", controller.reset);
                    target.classList.add("play");
                    }
          const init = () => {
                    target.innerHTML = `<h1>Set the players!!</h1>
                    <label>Player n1: <input type="text" value="pedro"></label>
                    <label>Player n2: <input type="text" value="alejandro"></label>
                    <button type="button">PLAY!!</button>`;
                    target.querySelector('button').addEventListener("click",play);
          }
          return {init};
})();

let newPlayer1, newPlayer2, controller;

const newBoard = ((selector =".gameBoard") => {
          const target = document.querySelector(selector);
          for (let i = 0; i < 9; i++) {
                    const div = document.createElement("div");
                    div.className = "gameBoard-cell";
                    div.setAttribute("index", i);
                    target.appendChild(div);
          }
})();

look.init();