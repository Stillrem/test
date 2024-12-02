let acceptCount = parseInt(localStorage.getItem('acceptCount')) || 0;
let declineCount = parseInt(localStorage.getItem('declineCount')) || 0;
const cellColors = JSON.parse(localStorage.getItem('cellColors')) || Array(100).fill('#00FF00');
let acceptedCount = cellColors.filter(color => color === '#00FF00').length;
let declinedCount = cellColors.filter(color => color === '#FF0000').length;
let isLocked = localStorage.getItem('isLocked') === 'true';

// Переменная для отслеживания номера
let currentNumber = parseInt(localStorage.getItem('currentNumber')) || 1;
let cellTexts = JSON.parse(localStorage.getItem('cellTexts')) || Array(100).fill('');

let undoStack = [];
let redoStack = [];

// Функция для сохранения текущего состояния
function saveState() {
    const state = {
        cellColors: [...cellColors],
        cellTexts: [...cellTexts],
        acceptCount,
        declineCount,
        currentNumber,
        acceptedCount,
        declinedCount
    };
    undoStack.push(state);
    if (undoStack.length > 100) {
        undoStack.shift(); // Ограничение на 100 шагов
    }
    redoStack = []; // Очистка стека redo при новом изменении
}

// Функция обновления UI
function updateUI() {
    for (let i = 0; i < cellColors.length; i++) {
        const cell = document.getElementById(`cell-${i}`);
        cell.style.backgroundColor = cellColors[i];
        cell.textContent = cellTexts[i];
    }

    updateDisplayCounts();
    updateAcceptanceRate();

    // Сохранение состояния
    localStorage.setItem('cellColors', JSON.stringify(cellColors));
    localStorage.setItem('cellTexts', JSON.stringify(cellTexts));
    localStorage.setItem('acceptCount', acceptCount);
    localStorage.setItem('declineCount', declineCount);
    localStorage.setItem('currentNumber', currentNumber);
}

// Функция для отмены действия
function undo() {
    if (undoStack.length > 1) {
        const currentState = undoStack.pop();
        redoStack.push(currentState);
        const prevState = undoStack[undoStack.length - 1];
        restoreState(prevState);
    }
}

// Функция для повтора действия
function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(nextState);
        restoreState(nextState);
    }
}

// Восстановление состояния из стека
function restoreState(state) {
    Object.assign({ acceptCount, declineCount, currentNumber, acceptedCount, declinedCount }, state);
    cellColors = [...state.cellColors];
    cellTexts = [...state.cellTexts];
    updateUI();
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('undo-button').addEventListener('click', undo);
    document.getElementById('redo-button').addEventListener('click', redo);
    
function updateAcceptanceRate() {
    saveState();
    const acceptanceRate = (acceptedCount / 100) * 100;
    document.getElementById('acceptance-rate').textContent = `Acceptance Rate: ${acceptanceRate.toFixed(2)}%`;
}

function updateDisplayCounts() {
    saveState();
    document.getElementById('accept-count').textContent = acceptCount;
    document.getElementById('decline-count').textContent = declineCount;
    localStorage.setItem('acceptCount', acceptCount);
    localStorage.setItem('declineCount', declineCount);
}

function paint(color) {
    saveState();
    const colorCode = color === 'red' ? '#FF0000' : '#00FF00';
    
    if (cellColors[99] === '#00FF00') {
        acceptedCount--;
        //acceptCount--;
    } else if (cellColors[99] === '#FF0000') {
        declinedCount--;
        declineCount--;
    }

    for (let i = cellColors.length - 1; i > 0; i--) {
        cellColors[i] = cellColors[i - 1];
        document.getElementById(`cell-${i}`).style.backgroundColor = cellColors[i];
        document.getElementById(`cell-${i}`).textContent = document.getElementById(`cell-${i-1}`).textContent;
    }

    cellColors[0] = colorCode;
    document.getElementById('cell-0').style.backgroundColor = colorCode;

    // Пропуск нумерации красной ячейки
    if (colorCode === '#00FF00') {
        saveState();
        document.getElementById('cell-0').textContent = currentNumber;
        acceptCount++;
        acceptedCount++;
        currentNumber++;
    } else {
        document.getElementById('cell-0').textContent = ''; // Оставить пустым для красной
        declineCount++;
        declinedCount++;
    }

    if (currentNumber > 100) {
        saveState();
        currentNumber = 1;
    }
 
    localStorage.setItem('currentNumber', currentNumber);
    updateDisplayCounts();
    localStorage.setItem('cellColors', JSON.stringify(cellColors));
    // Сохранение текстов ячеек
    const cellTexts = Array.from(document.querySelectorAll('.cell')).map(cell => cell.textContent);
    localStorage.setItem('cellTexts', JSON.stringify(cellTexts));
    updateAcceptanceRate();
    redoStack = [];
    updateUI();
    }

       function toggleCellColor(cellIndex) {
           saveState();
       if (!isLocked) {
           const currentColor = cellColors[cellIndex];
           const newColor = currentColor === '#00FF00' ? '#FF0000' : '#00FF00';

           if (currentColor !== newColor) {
               cellColors[cellIndex] = newColor;
               document.getElementById(`cell-${cellIndex}`).style.backgroundColor = newColor;

               if (newColor === '#00FF00') {
                   acceptedCount++;
                   declinedCount--;
                   // Уменьшить declineCount
                   declineCount--;
               } else { 
                   acceptedCount--;
                   declinedCount++;
                   // Увеличить declineCount
                   declineCount++;
               }

               updateDisplayCounts();
               localStorage.setItem('cellColors', JSON.stringify(cellColors));
               updateAcceptanceRate();
               redoStack = [];
               updateUI();
           }
       }
   }
                
        function resetCount(type) {
            saveState();
            if (type === 'accept') {
                acceptCount = 0;
                currentNumber = 1;
            } else if (type === 'decline') {
                //declineCount = 0;
                acceptCount = 0;
                currentNumber = 1;
                declineCount = cellColors.filter(color => color === '#FF0000').length;
            }
            updateDisplayCounts();
    // Очистка всех ячеек от текста
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.textContent = '';
    });

    // Сохранение изменений в localStorage
    localStorage.setItem('acceptCount', acceptCount);
    localStorage.setItem('declineCount', declineCount);
    localStorage.setItem('currentNumber', currentNumber);
    localStorage.setItem('cellTexts', JSON.stringify(Array(100).fill('')));
         
   }

window.onload = function() {
    saveState();
    const cellsContainer = document.querySelector('.cells');
    const cellTexts = JSON.parse(localStorage.getItem('cellTexts')) || Array(100).fill('');
    for (let i = 0; i < cellColors.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        cell.style.backgroundColor = cellColors[i];
        cell.style.textAlign = 'center';
        cell.textContent = cellTexts[i]; // Восстановление текста ячейки
        //cell.onclick = () => toggleCellColor(i); // Установка обработчика клика
        cell.addEventListener('click', () => toggleCellColor(i));
        cellsContainer.appendChild(cell);
    }
                      
    updateDisplayCounts();
    updateAcceptanceRate();

            document.getElementById('accept-count').addEventListener('click', () => {
                acceptCount++;
                updateDisplayCounts();
            });

            document.getElementById('decline-count').addEventListener('click', () => {
                declineCount++;
                updateDisplayCounts();
            });

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
           }

            document.addEventListener('dblclick', function(event) {
                event.preventDefault();
            }, { passive: false });

        function toggleLock() {
            saveState();
            isLocked = true;
            localStorage.setItem('isLocked', 'true');

            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell) => {
            cell.style.pointerEvents = 'none';
            });

            document.getElementById('toggle-switch').textContent = 'Unlock Cells';
            }

        function toggleUnLock() {
            saveState();
            isLocked = false;
            localStorage.setItem('isLocked', 'false');

            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell) => {
            cell.style.pointerEvents = 'auto';
        });

            document.getElementById('toggle-switch').textContent = 'Lock Cells';
            }

            document.getElementById('toggle-switch').addEventListener('click', () => {
            if (isLocked) {
                toggleUnLock();
            } else {
                toggleLock();
            }
        });

    // Initial setup based on stored state
            if (isLocked) {
                toggleLock();
            } else {
                toggleUnLock();
            }
         };

// Анимация появления страницы
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.body.classList.remove('unloading');
    }
    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 0);
});

document.getElementById('adjustmentButton').addEventListener('click', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        window.location.href = 'adjustment.html';
    }, 300);
});
