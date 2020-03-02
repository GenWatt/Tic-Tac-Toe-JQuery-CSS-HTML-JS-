//game tic tac toe
let columnTile = 3;
let rowTile = 3;
let numberTiles = 9;
const tilesConteiner = $(".tiles-conteiner");
let tiles;
let winningPoints = 3;
const arrayOfAnimatedTiles = [];

$(".game-mode-options-btn").click(function () {
  columnTile = parseFloat($(this).val());
  rowTile = columnTile;
  numberTiles = rowTile * columnTile;
  columnTile === 3 ? (winningPoints = 3) : (winningPoints = 4);

  $(".game-mode-options-btn").removeClass("game-mode-options-btn-active");
  $(this).addClass("game-mode-options-btn-active");
});

$(".start-game").click(() => {
  arrayOfAnimatedTiles.length = 0;
  $(".start-game-view ").addClass("hide");
  $(".back-btn").css("transform", "scale(1)");
  $(".tiles-conteiner").css("pointer-events", "none");
  createTiles();
});
const duration = 50;

const createTiles = () => {
  for (let i = 1; i <= numberTiles; i++) {
    const tile = document.createElement("div");

    tile.className = "tile";
    $(tile).css("float", "left");
    $(tile).css("width", 100 / columnTile + "%");
    $(tile).css("height", 100 / columnTile + "%");
    $(tile).attr("data-type", "empty");

    tilesConteiner.append(tile);
  }
  const randomAnimation = Math.floor(Math.random() * 2);

  tiles = $(".tile");
  tiles.each((i, el) => {
    $(el).on("click", insertSign);
    $(el).on("mouseover", animateOnHover);
    $(el).on("mouseleave", animateOnLeave);
    if (randomAnimation === 0) {
      setTimeout(() => {
        $(el).addClass("tile-show");
      }, duration * i);
    } else randomTileAnimation();
  });

  setTimeout(() => {
    $(".tiles-conteiner").css("pointer-events", "all");
  }, duration * numberTiles);
};

function animateOnHover() {
  $(this).children().css("transform", "scale(1.1)rotate(45deg)");
}

function animateOnLeave() {
  $(this).children().css("transform", "scale(1.0)rotate(45deg)");
}

const randomTileAnimation = () => {
  const randomTile = Math.floor(Math.random() * numberTiles);

  for (let i = 0; i < arrayOfAnimatedTiles.length; i++) {
    if (arrayOfAnimatedTiles[i] === randomTile) return randomTileAnimation();
  }
  arrayOfAnimatedTiles.push(randomTile);

  if (arrayOfAnimatedTiles.length >= numberTiles) {

    $(arrayOfAnimatedTiles).each((i, el) => {
      setTimeout(() => {
        $(tiles[el]).addClass("tile-show");
      }, duration * i);
    })
    return
  };
}

let whatSign = true;
let player1Points = 0;
let player2Points = 0;
let player1Win = null;
let player1FinalPoints = 0;
let player2FinalPoints = 0;
let array = [];
let clickedElements = 0;

function insertSign() {
  if ($(this).html() !== "") return;

  const div = document.createElement("div");
  div.className = whatSign ? "sign circle" : "sign cross";
  $(this).attr("data-type", whatSign);


  $(this).append(div);
  /* create Inside circle */
  if (whatSign) {
    const insideCircle = document.createElement("span");
    insideCircle.className = "inside-circle";

    $(this)
      .children()
      .append(insideCircle);
  } else {
    /*create another line to make cross  */
    const line = document.createElement("span");
    line.className = "cross-line";

    $(this)
      .children()
      .append(line);
  }
  whatSign = !whatSign;
  setTimeout(() => {
    $(this)
      .children()
      .addClass("show");

    $(".inside-circle").addClass("inside-circle-show");
  }, 10);

  array.length = 0;
  for (let i = 0; i < tiles.length; i++) {
    array.push($(tiles[i]).attr("data-type"));
  }

  clickedElements++;
  player1Win = null;

  /*check in row*/
  for (let i = 0; i <= columnTile; i++) {
    grid(i * columnTile + columnTile - 1, columnTile * i, 1);
  }
  /*check in column*/
  for (let i = 0; i <= columnTile; i++) {
    grid(columnTile * columnTile - 1, i, columnTile);
  }

  /*check across*/
  if (columnTile === 5) {
    for (let i = 1; i <= 2; i++) {
      grid(columnTile * (columnTile - i), columnTile - i, columnTile - 1);
      grid(columnTile * columnTile - i, i - 1, columnTile + 1);
    }
  } else {
    grid(columnTile * (columnTile - 1), columnTile - 1, columnTile - 1);
    grid(columnTile * columnTile - 1, 0, columnTile + 1);
  }

  if (player1Win === null && clickedElements === numberTiles) {
    return result(`<span class="player-name">Remis</span>`);
  }
}

const grid = (loopRepeat, satrtLoop, interator) => {
  player1Points = 0;
  player2Points = 0;

  for (i = satrtLoop; i <= loopRepeat; i += interator) {
    if (array[i] === "true") {
      player2Points = 0;
      player1Points++;
      if (player1Points === winningPoints) {
        player1Win = false;
        player1FinalPoints++;
        return result(`<span class="player-name">Player 1</span> wygrywa.`);
      }
    } else if (array[i] === "false") {
      player1Points = 0;
      player2Points++;
      if (player2Points === winningPoints) {
        player1Win = true;
        player2FinalPoints++;
        return result(`<span class="player-name">Player 2</span> wygrywa.`);
      }
    } else if (array[i] === "empty") {
      player2Points = 0;
      player1Points = 0;
    }
  }
};

const result = winner => {
  whatSign = true;
  $(".tiles-conteiner").css("pointer-events", "none");
  $(".back-btn").css("top", "0px");

  $(".result").addClass("game-over");
  $(".end-game-result").html(
    `<p class="game-over-text">Rezultat:${winner}</p>
    <p>Player1: <span class="points">${player1FinalPoints}pkt</span></p>
    <p>Player2: <span class="points">${player2FinalPoints}pkt</span></p>`
  );
};

$(".reset-points").click(() => {
  player1FinalPoints = 0;
  player2FinalPoints = 0;
})

$(".next-game").click(() => {
  clickedElements = 0;
  $(".back-btn").css("top", "-55px")
  $(".result").removeClass("game-over");
  tilesConteiner.html("");
  createTiles();
});

const backBtn = $(".back-btn");

$(backBtn).click(() => {
  clickedElements = 0;
  tilesConteiner.html("");
  $(".back-btn").css({
    transform: "scale(0)",
    top: -55
  })
  $(".start-game-view").removeClass("hide");
  $(".result").removeClass("game-over");
});
