import { useState } from 'react';
import './App.css';
import './index.css';

function App() {
  const [sudokuArr, setSudokuArr] = useState(Array(9).fill().map(() => Array(9).fill(-1)));
  const [initial, setInitial] = useState(Array(9).fill().map(() => Array(9).fill(-1)));
  const [setupMode, setSetupMode] = useState(true);

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1, grid = getDeepCopy(sudokuArr);
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setSudokuArr(grid);
  }

  function compareSudokus(currentSudoku, solvedSudoku) {
    let res = {
      isComplete: true,
      isSolvable: true
    };
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (currentSudoku[i][j] !== solvedSudoku[i][j]) {
          if (currentSudoku[i][j] !== -1) res.isSolvable = false;
          res.isComplete = false;
        }
      }
    }
    return res;
  }

  function newSudoku(){
    setSetupMode(true);
  }
  function checkSudoku() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    let compare = compareSudokus(sudokuArr, sudoku);
    if (compare.isComplete) {
      alert("Congratulations! You have solved Sudoku!");
    } else if (compare.isSolvable) {
      alert("Keep Going!");
    } else {
      alert("Sudoku can't be solved. Try again!");
    }
  }

  function checkCol(grid, col, num) {
    return grid.map(row => row[col]).indexOf(num) === -1;
  }

  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  function checkBox(grid, row, col, num) {
    let boxArr = [], rowStart = row - (row % 3), colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }
    return boxArr.indexOf(num) === -1;
  }

  function checkValid(grid, row, col, num) {
    if (checkRow(grid, row, num) && checkCol(grid, col, num) && checkBox(grid, row, col, num)) {
      return true;
    }
    return false;
  }

  function getNext(row, col) {
    if (col < 8) return [row, col + 1];
    if (row < 8) return [row + 1, 0];
    return [0, 0];
  }

  function solver(grid, row = 0, col = 0) {
    if (grid[row][col] !== -1) {
      let [newRow, newCol] = getNext(row, col);
      return solver(grid, newRow, newCol);
    }
    for (let num = 1; num <= 9; num++) {
      if (checkValid(grid, row, col, num)) {
        grid[row][col] = num;
        let [newRow, newCol] = getNext(row, col);
        if (!newRow && !newCol) return true;
        if (solver(grid, newRow, newCol)) return true;
      }
    }
    grid[row][col] = -1;
    return false;
  }

  function solveSudoku() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    setSudokuArr(sudoku);
  }

  function resetSudoku() {
    setSudokuArr(getDeepCopy(initial));
  }

  function onSetupInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1, grid = getDeepCopy(initial);
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setInitial(grid);
    setSudokuArr(grid);
  }

  function finishSetup() {
    setSetupMode(false);
  }

  return (
    <div className="App">
      <div className="App-header">
        {setupMode ? (
          <>
            <h4>Setup Sudoku</h4>
            <table>
              <tbody>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                  return (
                    <tr key={rIndex} className={(row + 1) % 3 === 0 ? 'bBorder' : ''}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                        return (
                          <td key={rIndex + cIndex} className={(col + 1) % 3 === 0 ? 'rBorder' : ''}>
                            <input
                              onChange={(e) => onSetupInputChange(e, row, col)}
                              value={initial[row][col] === -1 ? '' : initial[row][col]}
                              className="cellInput"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="buttonContainer">
            <button className="button" onClick={finishSetup}>Finish Setup</button>
            </div>
          </>
        ) : (
          <>
            <h4>Sudoku Solver</h4>
            <table>
              <tbody>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                  return (
                    <tr key={rIndex} className={(row + 1) % 3 === 0 ? 'bBorder' : ''}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                        return (
                          <td key={rIndex + cIndex} className={(col + 1) % 3 === 0 ? 'rBorder' : ''}>
                            <input
                              onChange={(e) => onInputChange(e, row, col)}
                              value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]}
                              className="cellInput"
                              disabled={initial[row][col] !== -1}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="buttonContainer">
              <button className="button" onClick={checkSudoku}>Check</button>
              <button className="button" onClick={solveSudoku}>Solve</button>
              <button className="button" onClick={resetSudoku}>Reset</button>
              <button className="button" onClick={newSudoku}>New</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
