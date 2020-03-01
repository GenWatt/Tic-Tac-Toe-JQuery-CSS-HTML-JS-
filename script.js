const blockConteiner = $(".block-conteiner");
const inputColumn = $("#column-value");
const inputRow = $("#row-value");
let columns;
let rows;
let numberBlocks;
const numberArray = [];

$("#set-grid").click(() => {
  columns = inputColumn.val();
  rows = inputRow.val();

  blockConteiner.text("");
  numberBlocks = columns * rows;

  blockConteiner.css({
    gridTemplateColumns: `repeat(${columns},20px)`,
    gridTemplateRows: `repeat(${rows},20px)`
  });
  const duration = 20;

  for (let i = 1; i <= numberBlocks; i++) {
    const newBlocks = document.createElement("div");

    newBlocks.className = "block";

    blockConteiner.append(newBlocks);

    const block = $(".block");

    setTimeout(() => {
      $(block).css("transform", "translate(5px,5px)");
    }, duration * i);
  }
});

// random animation

let multiple = 0;

const randomAnimation = () => {
  const block = $(".block");
  if (numberArray.length === numberBlocks) return;

  let randomNumber = Math.floor(Math.random() * numberBlocks);

  for (let i = 0; i < numberArray.length; i++) {
    multiple += 0.8 / numberBlocks;
    setTimeout(() => {
      $(block[randomNumber]).css("transform", "translate(100px,100px)");
    }, 10 * multiple);

    if (numberArray[i] === randomNumber) {
      return randomAnimation();
    }
  }

  numberArray.push(randomNumber);

  if (numberArray.length < numberBlocks) return randomAnimation();
};

$("#random-animation-btn").on("click", () => {
  numberArray.length = 0;
  randomAnimation();
});

//--------------------------------------------------------
let howMany;
let HighestNumber;
const randomNumbersArray = [];
let randomNumber;

$(".multi-multi-input,.block-inputs").focusin(function() {
  $(this)
    .prev()
    .addClass("active");
});

$(".multi-multi-input,.block-inputs").focusout(function() {
  if ($(this).val() === "") {
    $(this)
      .prev()
      .removeClass("active");
  }
});

$("#show-count").click(() => {
  howMany = $("#how-many").val();
  HighestNumber = $("#highest-number").val();
  randomNumbersArray.length = 0;
  $(".ball-conteiner").html("");
  createBalls();
});

const createBalls = () => {
  if (randomNumbersArray.length >= howMany) return;
  randomNumber = Math.floor(Math.random() * HighestNumber + 1);

  for (i = 0; i < howMany; i++) {
    if (randomNumbersArray[i] === randomNumber) return createBalls();
    else if (randomNumbersArray.length >= howMany) break;
  }
  randomNumbersArray.push(randomNumber);

  if (randomNumbersArray.length >= howMany) {
    randomNumbersArray
      .sort((a, b) => a - b)
      .map(n => {
        const div = document.createElement("div");
        div.className = "ball";
        $(div).text(n);

        $(".ball-conteiner").append(div);

        animateBalls();
      });
    return;
  } else return createBalls();
};

const animateBalls = () => {
  const ball = $(".ball");

  $(ball).each((i, el) => {
    setTimeout(() => {
      $(el).css({
        transform: "translateY(0)scale(1)"
      });
    }, 100 * i);
  });
};

//game tic tac toe
let columnTile = 3;
let rowTile = 3;
let numberTiles = 9;
const tilesConteiner = $(".tiles-conteiner");
let tiles;
let winningPoints = 3;

$(".game-mode-options-btn").click(function() {
  columnTile = parseFloat($(this).val());
  rowTile = columnTile;
  numberTiles = rowTile * columnTile;
  columnTile === 3 ? (winningPoints = 3) : (winningPoints = 4);
});

$(".start-game").click(() => {
  $(".start-game-view ").addClass("hide");
  createTiles();
});

const createTiles = () => {
  $("#back-btn").css("display", "block");
  for (let i = 1; i <= numberTiles; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    $(tile).css("float", "left");
    $(tile).css("width", 100 / columnTile + "%");
    $(tile).css("height", 100 / columnTile + "%");

    tilesConteiner.append(tile);
  }

  tiles = $(".tile");
  tiles.each((i, el) => {
    $(el).on("click", insertSign);
    setTimeout(() => {
      $(el).addClass("tile-show");
      if (i === numberTiles) {
        $(".tiles-conteiner").css("pointer-events", "all");
      }
    }, 50 * i);
  });
};

let whatSign = true;
let player1Points = 0;
let player2Points = 0;
let player1Win = null;

function insertSign() {
  if ($(this).html() !== "") return;

  const div = document.createElement("div");
  div.className = whatSign ? "sign circle" : "sign cross";
  $(this).attr("data-type", whatSign);
  whatSign = !whatSign;

  $(this).append(div);

  const insideCircle = document.createElement("span");
  insideCircle.className = "inside-circle";

  $(this)
    .children()
    .append(insideCircle);

  setTimeout(() => {
    $(this)
      .children()
      .addClass("show");

    $(".inside-circle").addClass("inside-circle-show");
  }, 10);

  checkPicks();
  clickedElements++;
  player1Win = null;

  for (let i = 0; i <= tiles.length; i++) {
    grid(i * columnTile + columnTile - 1, columnTile * i, 1);
  }

  for (let i = 0; i <= columnTile; i++) {
    grid(columnTile * columnTile, i, columnTile);
  }

  grid(columnTile * (columnTile - 1), columnTile - 1, columnTile - 1);
  grid(columnTile * columnTile - 1, 0, columnTile + 1);

  if (player1Win === null && clickedElements === numberTiles) {
    return result("Remis");
  }
}

let array = [];
let clickedElements = 0;

const checkPicks = () => {
  array.length = 0;

  for (let i = 0; i < tiles.length; i++) {
    array.push($(tiles[i]).attr("data-type"));
  }
};

const grid = (loopRepeat, satrtLoop, interator) => {
  player1Points = 0;
  player2Points = 0;

  for (i = satrtLoop; i <= loopRepeat; i += interator) {
    if (array[i] === "true") {
      player2Points = 0;
      player1Points++;
    } else if (array[i] === "false") {
      player1Points = 0;
      player2Points++;
    } else if (array[i] === undefined) {
      player2Points = 0;
      player1Points = 0;
    }
  }

  if (player2Points === winningPoints) {
    player1Win = true;
    return result(`<span class="player-name">Player 2</span> wygrywa.`);
  } else if (player1Points === winningPoints) {
    player1Win = false;
    return result(`<span class="player-name">Player 1</span> wygrywa.`);
  }
};

const result = winner => {
  $(".tiles-conteiner").css("pointer-events", "none");
  $("#back-btn").css("display", "none");

  $(".result").addClass("game-over");
  $(".end-game-result").html(
    `<p class="game-over-text">Rezultat:${winner}</p>`
  );
};

$(".next-game").click(() => {
  clickedElements = 0;
  $(".result").removeClass("game-over");
  tilesConteiner.html("");
  createTiles();
});

const backBtn = $(".back-btn");

$(backBtn).click(() => {
  clickedElements = 0;
  tilesConteiner.html("");
  $(".start-game-view").removeClass("hide");
  $(".result").removeClass("game-over");
});
