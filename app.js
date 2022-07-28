document.addEventListener('DOMContentLoaded', () => {
    
    //Variable Declarations//
    let boardSize;
    let hexObject;
    let bombObject;
    let hexIdArray;
    let numberOfHexs;
    let numberOfBombs;
    let score;
    const frontBoardDiv = document.getElementById('board-front');
    const middleBoardDiv = document.getElementById('board-middle');
    const backBoardDiv = document.getElementById('board-back');

    //Popup Button events//
    const button37 = document.getElementById('popupButton37');
    const button61 = document.getElementById('popupButton61');
    const button91 = document.getElementById('popupButton91');
    const popupPlayCloseX = document.getElementById('popup-play-closeX');
    const popupGameOverCloseX = document.getElementById('popup-game-over-closeX');
    const buttonPlayAgain = document.getElementById('play-again');

    activatePlayPopup();
    activateGameOverPopup();

    function activatePlayPopup () {
        popupPlayCloseX.addEventListener("click", () => {
            removePlayPopup();
        })

        button37.addEventListener("click", () => {
            boardSize = 4;
            moveTimer = 10;
            console.log("Board Size =" + boardSize);
            gamePlay();
        })

        button61.addEventListener("click", () => {
            boardSize = 5;
            moveTimer = 12;
            console.log("Board Size =" + boardSize);
            gamePlay();
        })

        button91.addEventListener("click", () => {
            boardSize = 6;
            moveTimer = 14;
            console.log("Board Size =" + boardSize);
            gamePlay();
        })
    }

    function activateGameOverPopup () {
        popupGameOverCloseX.addEventListener("click", () => {
            removeGameOverPopup();
        })

        buttonPlayAgain.addEventListener("click", () => {
            for (let i = 0; i < (boardSize * 2 - 1); i++) {
                console.log('removing horcont-f' + i);
                document.getElementById('horcont-f' + i).remove();
                document.getElementById('horcont-m' + i).remove();
                document.getElementById('horcont-b' + i).remove();
            }
            for (let i = numberOfBombs - 1; i >= 0; i--) {
                document.getElementById('bombTimeDisplay' + i).remove();
            }
            document.getElementById('scoreP').remove();
            document.getElementById("popup-play").classList.add('popup-visible-no-animate');
            console.log("Board Size =" + boardSize);
            removeGameOverPopup();
        })
    }

    function gamePlay() {
        removePlayPopup();
        createBoard();
        numberOfBombs = boardSize;
        hexIdArray = Object.keys(hexObject);
        numberOfHexs = hexIdArray.length;
        score = 0;
        displayScore();
        placeBombs();
        findBombDistances();
        activateBoard();
    }

    function removePlayPopup() {
        document.getElementById("popup-play").setAttribute('class', 'popup');
    }

    function removeGameOverPopup () {
        document.getElementById("popup-game-over").setAttribute('class', 'popup');
    }

    function createBoard() {
        hexObject = {};
        //backBoardDiv.classList.add('color-background');
        for (let i = 0; i < (boardSize * 2 - 1); i++) {
            const horcontDivF = document.createElement('div');
            horcontDivF.setAttribute('class', 'horcont');
            horcontDivF.setAttribute('id', 'horcont-f' + i);
            frontBoardDiv.append(horcontDivF);
            const currentHorcontDivF = document.getElementById('horcont-f' + i);
            const horcontDivM = document.createElement('div');
            horcontDivM.setAttribute('class', 'horcont');
            horcontDivM.setAttribute('id', 'horcont-m' + i);
            middleBoardDiv.append(horcontDivM);
            const currentHorcontDivM = document.getElementById('horcont-m' + i);
            const horcontDivB = document.createElement('div');
            horcontDivB.setAttribute('class', 'horcont');
            horcontDivB.setAttribute('id', 'horcont-b' + i);
            backBoardDiv.append(horcontDivB);
            const currentHorcontDivB = document.getElementById('horcont-b' + i);
            if (i < boardSize) {
                for (let j = 0; j < boardSize + i; j++) {
                    const hexDivF = document.createElement('div');
                    hexDivF.setAttribute('class', 'fhex');
                    hexDivF.setAttribute('id', "f" + (i * 1000 + boardSize - i - 1 + j * 2));
                    currentHorcontDivF.append(hexDivF);
                    hexObject[i * 1000 + boardSize - i - 1 + j * 2] = {
                        bombIfSoOrder: -1,
                        bombDists: {},
                        numberVisible: 0
                    };
                    const hexDivM = document.createElement('div');
                    hexDivM.setAttribute('class', 'mhex');
                    hexDivM.setAttribute('id', "m" + (i * 1000 + boardSize - i - 1 + j * 2));
                    currentHorcontDivM.append(hexDivM);
                    const hexDivB = document.createElement('div');
                    hexDivB.setAttribute('class', 'bhex');
                    hexDivB.setAttribute('id', "b" + (i * 1000 + boardSize - i - 1 + j * 2));
                    currentHorcontDivB.append(hexDivB);
                }
            } else if (i < boardSize * 2 - 1) {
                for (let j = 0; j < boardSize * 3 - i - 2; j++) {
                    const hexDivF = document.createElement('div');
                    hexDivF.setAttribute('class', 'fhex');
                    hexDivF.setAttribute('id', "f" + (i * 1000 + i + 1 - boardSize + j * 2));
                    currentHorcontDivF.append(hexDivF);
                    hexObject[i * 1000 + i + 1 - boardSize + j * 2] = {
                        bombIfSoOrder: -1,
                        bombDists: {},
                        numberVisible: 0
                    };
                    const hexDivM = document.createElement('div');
                    hexDivM.setAttribute('class', 'mhex');
                    hexDivM.setAttribute('id', "m" + (i * 1000 + i + 1 - boardSize + j * 2));
                    currentHorcontDivM.append(hexDivM);
                    const hexDivB = document.createElement('div');
                    hexDivB.setAttribute('class', 'bhex');
                    hexDivB.setAttribute('id', "b" + (i * 1000 + i + 1 - boardSize + j * 2));
                    currentHorcontDivB.append(hexDivB);
                }   
            }
        }
    }

    function displayScore() {
        const scoreP = document.createElement('p');
        scoreP.setAttribute('id', 'scoreP')
        const scoreText = document.createTextNode('Score: ' + score);
        scoreP.append(scoreText);
        const scoreDiv = document.getElementById('score');
        scoreDiv.append(scoreP);
    }

    function placeBombs() {
        bombObject = {};
        const bombTimersDiv = document.getElementById('bomb-timers');
        let bombTimerLastValue = moveTimer + 1;
        for (let i = numberOfBombs - 1; i >= 0; i--) {
            const chosenIndex = Math.floor(Math.random() * numberOfHexs);
            const chosenHexId = hexIdArray[chosenIndex];
            //Check to make sure that hex doesn't already have bomb on it:
            if (hexObject[chosenHexId].bombIfSoOrder < 0) {
                hexObject[chosenHexId].bombIfSoOrder = i;

                //Calculate Bomb Timer:
                const consistencyVariable = 0.9; 
                    //range: generally 0 - 1 but can be above 1;
                    //adjust to create consistent spread among board sizes;
                    //higher number makes higher # hex boards more spread apart compared to lower;
                const spreadVariable = 1.2;
                    //larger = larger spread for;
                const countDownFrom = 3 + ((numberOfBombs - 4) * consistencyVariable);
                const countDownIncrement = countDownFrom / (numberOfBombs - 1);
                const inverseCounter = countDownFrom - countDownIncrement * i;
                console.log(inverseCounter);
                const bombTimerTestValue = Math.round(moveTimer - (inverseCounter) ** spreadVariable);
                if (bombTimerTestValue < bombTimerLastValue) {
                    bombTimerLastValue = bombTimerTestValue;
                } else {
                    bombTimerLastValue = bombTimerLastValue - 1;
                }

                //create entry in bombObject:
                bombObject[i] = {
                    placedOn: chosenHexId,
                    explosionOrder: i,
                    timeUntilExplosion: bombTimerLastValue,
                    accessibilityScore: 0
                };

                //create bomb timer visual:
                const createdP = document.createElement ('p');
                createdP.setAttribute('id', 'bombTimeDisplay' + i);
                const bombTimerText = document.createTextNode('Bomb #' + (i + 1) + ": " + bombObject[i].timeUntilExplosion);
                createdP.append(bombTimerText);
                bombTimersDiv.prepend(createdP);
            } else {
                i++;
            }
        }
        console.log(hexObject);
        console.log(numberOfHexs);
        console.log(bombObject);
    } 

    function findBombDistances() {
        for (let i = 0; i < numberOfHexs; i++) {
            const currentHexId = hexIdArray[i];
            for (let j = 0; j < numberOfBombs; j++) {
                const currentBombId = bombObject[j].placedOn;
                const dist = calculateDist(currentBombId, currentHexId);
                hexObject[currentHexId].bombDists[j] = dist;
            }
            calculateAccessibilityPoints(currentHexId);
        }
    }

    function calculateAccessibilityPoints(hexId) {
        const bombDistArray = Object.values(hexObject[hexId].bombDists);
        const nearestBombDist = Math.min(...bombDistArray);
        for (let i = 0; i < numberOfBombs; i++) {
            if (bombDistArray[i] === nearestBombDist) {
                bombObject[i].accessibilityScore++;
            }
        }
    }
    
    function calculateDist(hex1, hex2) {
        const verticalDist = Math.abs(Math.floor(hex1 / 1000) - Math.floor(hex2 / 1000));
        const horizontalDist = Math.abs((hex1-(Math.floor(hex1 / 1000) * 1000)) - (hex2-(Math.floor(hex2 / 1000) * 1000)));
        if (verticalDist >= horizontalDist) {
            return verticalDist;
        } else {
             return (horizontalDist - verticalDist) / 2 + verticalDist;
        }
    }

    function activateBoard() {
        for (let i = 0; i < numberOfHexs; i++) {
            const currentHexId = hexIdArray[i];
            const currentMhexDiv = document.getElementById("m" + currentHexId);
            currentMhexDiv.addEventListener("click", () => {
                onHexClick(currentHexId);
            }, { once: true });
        }
    }

    function onHexClick(clickedHexId) {
        console.log(clickedHexId);
         //make hex unclickable
        document.getElementById("m" + clickedHexId).style.pointerEvents = "none";
        const bombIfSoOrder = hexObject[clickedHexId].bombIfSoOrder;
        //If not a bomb
        if (bombIfSoOrder < 0) {
        //turn purple and display bomb distance
            document.getElementById("f" + clickedHexId).style.backgroundColor = "purple";
            displayBombDistance(hexObject[clickedHexId].bombDists, clickedHexId);
            hexObject[clickedHexId].numberVisible = 1;
        //else (if a bomb)
        } else {
            document.getElementById("f" + clickedHexId).style.backgroundColor = "#CCCFBC";
            const bonus = bombObject[bombIfSoOrder].timeUntilExplosion;
            console.log('bonus: ' + bonus);
            score = score + 5 + bonus;
            updateScore();
        //change bomb timer display
            const pElementForChange = document.getElementById('bombTimeDisplay' + bombIfSoOrder);
            pElementForChange.textContent = 'Bomb #' + (bombIfSoOrder + 1) + ': disarmed';
            delete bombObject[bombIfSoOrder];
            console.log(bombObject);
            //if found bomb not last one
            if (Object.keys(bombObject).length > 0) {
                for (let i = 0; i < numberOfHexs; i++) {
                    const currentHexId = hexIdArray[i];
                    delete hexObject[currentHexId].bombDists[bombIfSoOrder];
                    if (hexObject[currentHexId].numberVisible == 1) {
                        //remove old Bomb Distance
                        const oldBombDistanceDiv = document.getElementById('n' + currentHexId);
                        oldBombDistanceDiv.remove();
                        //display new Bomb Distance
                        displayBombDistance(hexObject[currentHexId].bombDists, currentHexId);
                    }
                }
            //else (if found bomb is last one)
            } else {
                gameOver(1);
            }
        }
        updateBombTimes();
    }

    function displayBombDistance(bombDistsObject, hexId) {
        const bombDistValuesArray = Object.values(bombDistsObject);
        const dist = Math.min(...bombDistValuesArray);
        const appearsOnHex = document.getElementById("f" + hexId);
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'number-div');
        newDiv.setAttribute('id', 'n' + hexId);
        const pElement = document.createElement ("p");
        const Number = document.createTextNode (dist);
        pElement.append(Number);
        newDiv.append(pElement);
        if (dist !== bombDistValuesArray[0]) {
            pElement.setAttribute('class', 'numbers');
            appearsOnHex.append(newDiv);
        } else {
            pElement.classList.add('numbers', 'red');
            appearsOnHex.append(newDiv);
        }
    }

    function updateBombTimes() {
        for (let i = 0; i < numberOfBombs; i++) {
            if (bombObject[i] !== undefined) {
                bombObject[i].timeUntilExplosion--;
                const pElementForChange = document.getElementById('bombTimeDisplay' + i);
                if (bombObject[i].timeUntilExplosion < 1) {
                    pElementForChange.textContent = 'Bomb #' + (i + 1) + ': exploded!';
                    gameOver(0);
                } else {
                pElementForChange.textContent = 'Bomb #' + (i + 1) + ': ' + bombObject[i].timeUntilExplosion;
                }
            }
        }
    }

    function updateScore() {
        const scoreP = document.getElementById('scoreP');
        scoreP.textContent = 'Score: ' + score;
    }

    function gameOver(result) {
        let resultText;
        if (result == 1) {
            console.log("You Won!");
            score = score + 10;
            console.log ('win bonus: 10');
            updateScore();
            resultText = 'You Won!';
        } else {
            console.log("You Lost!");
            if (score <= 10) {
                score = 0;
            } else {
                score = score - 10;
            }
            updateScore();
            console.log('score = ' + score);
            resultText = 'You Lost!';
        }

        for (let i = 0; i < boardSize * 2 - 1; i++) {
            document.getElementById('horcont-m' + i).style.pointerEvents = "none";
        }

        resultElement = document.getElementById('result');
        resultElement.textContent = resultText;
        scoreElement = document.getElementById('final-score');
        scoreElement.textContent = 'score: ' + score;
        const gameOverPopup = document.getElementById('popup-game-over');
        gameOverPopup.classList.add('popup-visible-animate');
        console.log("Board Size =" + boardSize);
    }

    /*Trying to use forEach for onHexClick but have no clue what I'm doing
    function onHexClick() {
        const fhexList = document.querySelectorAll('.fhex');
        console.log(fhexList);
        fhexList.forEach(fhex => {
            fhex.addEventListener('click', () => {
                this.style.display = "";
                this.style.display = "none"; 
            })
        })
    }
    */
})