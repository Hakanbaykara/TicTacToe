import { copyArray } from "./index";
import { getWinner } from "./gameLogic";

export const botTurn = (map, gameMode) => {
    // collect all possiable options
    const possiablePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === '') {
          possiablePositions.push({row: rowIndex, col: columnIndex});
        }
      });
    });

    let chosenOption;

    if (gameMode == 'BOT_MEDIUM') {
      // Attack
      possiablePositions.forEach(possiablePosition => {
        const mapCopy = copyArray(map);

        mapCopy[possiablePosition.row][possiablePosition.col] = 'O';

        const winner = getWinner(mapCopy);
        if (winner === 'O') {
          // Attack that position
          chosenOption = possiablePosition;
        }
      });

      if (!chosenOption) {
        // Defend
        // Check if the oponent wins if it takes one of the possable positions
        possiablePositions.forEach(possiablePosition => {
          const mapCopy = copyArray(map);

          mapCopy[possiablePosition.row][possiablePosition.col] = 'X';

          const winner = getWinner(mapCopy);
          if (winner === 'X') {
            // Defend that position
            chosenOption = possiablePosition;
          }
        });
      }
    }
    //choose random
    if (!chosenOption) {
      chosenOption =
        possiablePositions[
          Math.floor(Math.random() * possiablePositions.length)
        ];
    }

    return chosenOption;
  };