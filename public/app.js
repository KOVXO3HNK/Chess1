import { Chess } from './chess.js';

(function () {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const pieceSymbols = {
    wp: '♙',
    wn: '♘',
    wb: '♗',
    wr: '♖',
    wq: '♕',
    wk: '♔',
    bp: '♟',
    bn: '♞',
    bb: '♝',
    br: '♜',
    bq: '♛',
    bk: '♚',
  };

  const defaultState = {
    rating: 1200,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    questsCompleted: {},
    xp: 0,
    history: [],
    aiLevel: 1,
  };

  const TelegramWebApp = window.TelegramWebApp || {
    isAvailable: false,
    setupTheme: () => {},
    setupBackButton: () => {},
    hideBackButton: () => {},
    sendGameData: () => {},
    user: null,
  };

  const storageKey = 'telegram-chess-state-v1';

  const aiLevelConfig = {
    1: { depth: 1, randomness: 0.9, label: 'Уровень 1' },
    2: { depth: 1, randomness: 0.35, label: 'Уровень 2' },
    3: { depth: 2, randomness: 0.15, label: 'Уровень 3' },
    4: { depth: 3, randomness: 0.05, label: 'Уровень 4' },
    5: { depth: 3, randomness: 0, label: 'Уровень 5' },
  };

  const quests = [
    {
      id: 'mate-in-one',
      title: 'Мат в один ход',
      description: 'Белые начинают и ставят мат в один ход.',
      fen: 'k7/ppp2ppp/8/4Q3/8/8/PP3PPP/6K1 w - - 0 1',
      solution: ['Qe8#'],
      reward: 25,
      hint: 'Используйте силу ферзя на открытой линии.',
    },
    {
      id: 'mate-in-two',
      title: 'Мат в два хода',
      description: 'Проведите точную атаку и завершите партию в два хода.',
      fen: '5rk1/8/6Q1/8/8/8/8/4R1K1 w - - 0 1',
      solution: ['Re7+', 'Kh8', 'Qxg7#'],
      reward: 40,
      hint: 'Подключите ладью к атаке, чтобы зажать короля.',
    },
    {
      id: 'find-fork',
      title: 'Конь в засаде',
      description: 'Выиграйте ферзя соперника эффектной комбинацией.',
      fen: 'r2q1rk1/ppp1bppp/2n1pn2/3p4/3P4/2N1PN2/PPQ1BPPP/R1B2RK1 w - - 0 1',
      solution: ['Nxd5', 'exd5', 'Qxc6'],
      reward: 30,
      hint: 'Начните с хода конём, чтобы раскрыть удар ферзя.',
    },
  ];

  const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

  const pieceSquareTables = {
    p: [
       0,   0,   0,   0,   0,   0,   0,   0,
      50,  50,  50,  50,  50,  50,  50,  50,
      10,  10,  20,  35,  35,  20,  10,  10,
       5,   5,  10,  27,  27,  10,   5,   5,
       0,   0,   0,  25,  25,   0,   0,   0,
       5,  -5, -10,   0,   0, -10,  -5,   5,
       5,  10,  10, -25, -25,  10,  10,   5,
       0,   0,   0,   0,   0,   0,   0,   0,
    ],
    n: [
      -50, -40, -30, -30, -30, -30, -40, -50,
      -40, -20,   0,   0,   0,   0, -20, -40,
      -30,   0,  10,  15,  15,  10,   0, -30,
      -30,   5,  15,  20,  20,  15,   5, -30,
      -30,   0,  15,  20,  20,  15,   0, -30,
      -30,   5,  10,  15,  15,  10,   5, -30,
      -40, -20,   0,   5,   5,   0, -20, -40,
      -50, -40, -30, -30, -30, -30, -40, -50,
    ],
    b: [
      -20, -10, -10, -10, -10, -10, -10, -20,
      -10,   0,   0,   0,   0,   0,   0, -10,
      -10,   0,   5,  10,  10,   5,   0, -10,
      -10,   5,   5,  10,  10,   5,   5, -10,
      -10,   0,  10,  10,  10,  10,   0, -10,
      -10,  10,  10,  10,  10,  10,  10, -10,
      -10,   5,   0,   0,   0,   0,   5, -10,
      -20, -10, -10, -10, -10, -10, -10, -20,
    ],
    r: [
        0,   0,   0,   5,   5,   0,   0,   0,
        5,  10,  10,  10,  10,  10,  10,   5,
       -5,   0,   0,   0,   0,   0,   0,  -5,
       -5,   0,   0,   0,   0,   0,   0,  -5,
       -5,   0,   0,   0,   0,   0,   0,  -5,
       -5,   0,   0,   0,   0,   0,   0,  -5,
       -5,   0,   0,   0,   0,   0,   0,  -5,
        0,   0,   0,   5,   5,   0,   0,   0,
    ],
    q: [
      -20, -10, -10,  -5,  -5, -10, -10, -20,
      -10,   0,   0,   0,   0,   0,   0, -10,
      -10,   0,   5,   5,   5,   5,   0, -10,
       -5,   0,   5,   5,   5,   5,   0,  -5,
        0,   0,   5,   5,   5,   5,   0,  -5,
      -10,   5,   5,   5,   5,   5,   0, -10,
      -10,   0,   5,   0,   0,   0,   0, -10,
      -20, -10, -10,  -5,  -5, -10, -10, -20,
    ],
    k: [
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -20, -30, -30, -40, -40, -30, -30, -20,
      -10, -20, -20, -20, -20, -20, -20, -10,
       20,  20,   0,   0,   0,   0,  20,  20,
       20,  30,  10,   0,   0,  10,  30,  20,
    ],
  };

  let state = loadState();

  const notificationEl = document.getElementById('notification');
  const screens = Array.from(document.querySelectorAll('.screen'));
  // --- Карточки навигации и универсальные кнопки "назад" ---
  const cards = document.querySelectorAll('.card');
  const backButtons = document.querySelectorAll('[data-back]');
  const homeStatsEl = document.getElementById('home-stats');
  const aiBoardEl = document.getElementById('ai-board');
  const multiBoardEl = document.getElementById('multi-board');
  const questBoardEl = document.getElementById('quest-board');

  const aiStatusEl = document.getElementById('ai-status');
  const aiPlayersEl = document.getElementById('ai-players');
  const aiStatsEl = document.getElementById('ai-stats');
  const aiHintEl = document.getElementById('ai-hint');
  const aiLevelLabelEl = document.getElementById('ai-level-label');
  const levelSelectorEl = document.getElementById('level-selector');

  const multiStatusEl = document.getElementById('multi-status');
  const multiHistoryEl = document.getElementById('multi-history');

  const questListEl = document.getElementById('quest-list');
  const questProgressEl = document.getElementById('quest-progress');
  const questActivePanel = document.getElementById('quest-active-panel');
  const questActiveTitle = document.getElementById('quest-active-title');
  const questActiveHint = document.getElementById('quest-active-hint');
  const questActionsEl = document.getElementById('quest-actions');

  const profileRatingEl = document.getElementById('profile-rating');
  const profileWinrateEl = document.getElementById('profile-winrate');
  const profileWinsEl = document.getElementById('profile-wins');
  const profileLossesEl = document.getElementById('profile-losses');
  const profileDrawsEl = document.getElementById('profile-draws');
  const profileRankEl = document.getElementById('profile-rank');
  const profileHistoryEl = document.getElementById('profile-history');
  const xpProgressEl = document.getElementById('xp-progress');

  const settingsTabsEl = document.getElementById('settings-tabs');
  const settingsContentEl = document.getElementById('settings-content');

  const aiNewGameBtn = document.getElementById('new-ai-game');
  const aiUndoBtn = document.getElementById('ai-undo');
  const aiResignBtn = document.getElementById('ai-resign');

  const localGameBtn = document.getElementById('local-game');
  const shareGameBtn = document.getElementById('share-game');

  const multiMinutesInput = document.getElementById('multi-minutes');
  const multiIncrementInput = document.getElementById('multi-increment');

  const profileNameEl = document.getElementById('profile-name');
  const profileTitleEl = document.getElementById('profile-title');

  const aiGame = {
    chess: new Chess(),
    selected: null,
    movesFromSelected: [],
    timers: { w: 600, b: 600 },
    interval: null,
    lastMove: null,
    level: state.aiLevel || 1,
    result: null,
  };

  const multiGame = {
    chess: new Chess(),
    selected: null,
    movesFromSelected: [],
    timers: { w: 600, b: 600 },
    interval: null,
    lastMove: null,
    increment: 0,
    minutes: 10,
    result: null,
  };

  const questGame = {
    chess: new Chess(),
    active: null,
    selected: null,
    solutionIndex: 0,
    movesFromSelected: [],
  };

  const aiBoardView = createBoard(aiBoardEl, handleAiSquareClick);
  const multiBoardView = createBoard(multiBoardEl, handleMultiSquareClick);
  const questBoardView = createBoard(questBoardEl, handleQuestSquareClick);

  // --- Инициализация основных подсистем интерфейса ---
  setupNavigation();
  setupLevelSelector();
  setupAIControls();
  setupMultiplayerControls();
  setupSettings();
  renderQuests();
  updateStatsViews();
  renderAIView();
  renderMultiplayerView();
  renderQuestView();

  showNotification('Приложение готово к игре!');

  TelegramWebApp.setupTheme();

  function loadState() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Не удалось загрузить состояние', error);
    }
    return { ...defaultState };
  }

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Не удалось сохранить состояние', error);
    }
  }

  function createBoard(container, onSquareClick) {
    container.innerHTML = '';
    const squares = {};
    for (let rank = 8; rank >= 1; rank--) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        const squareName = `${file}${rank}`;
        const squareEl = document.createElement('div');
        const isLight = (fileIndex + rank) % 2 === 1;
        squareEl.className = `square ${isLight ? 'light' : 'dark'}`;
        squareEl.dataset.square = squareName;
        squareEl.addEventListener('click', () => onSquareClick(squareName));
        container.appendChild(squareEl);
        squares[squareName] = squareEl;
      }
    }
    return { container, squares };
  }

  // --- Навигация по экранам приложения ---
  function setupNavigation() {
    // Карточка переводит пользователя на нужный раздел
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const target = card.dataset.target;
        if (target) {
          showScreen(target);
        }
      });
    });

    // Все кнопки "назад" возвращают к главному экрану
    backButtons.forEach((button) => {
      button.addEventListener('click', () => {
        showScreen('home-screen');
        TelegramWebApp.hideBackButton();
      });
    });
  }

  // --- Переключение экрана с учётом алиасов ---
  function showScreen(id) {
    const normalizedTarget = normalizeScreenId(id);

    screens.forEach((screen) => {
      const currentId = normalizeScreenId(screen.id || screen.dataset.screen);
      screen.classList.toggle('active', currentId === normalizedTarget);
    });

    if (normalizedTarget !== 'home-screen') {
      TelegramWebApp.setupBackButton(() => showScreen('home-screen'));
    } else {
      TelegramWebApp.hideBackButton();
    }
  }

  // --- Приведение идентификатора экрана к единому виду ---
  function normalizeScreenId(value) {
    if (!value) return '';
    return value === 'home' ? 'home-screen' : value;
  }

  function setupLevelSelector() {
    levelSelectorEl.innerHTML = '';
    Object.keys(aiLevelConfig).forEach((level) => {
      const button = document.createElement('button');
      button.className = 'level-button';
      button.textContent = level;
      if (Number(level) === aiGame.level) {
        button.classList.add('active');
      }
      button.addEventListener('click', () => {
        const nextLevel = Number(level);
        if (aiGame.level === nextLevel) {
          return;
        }

        aiGame.level = nextLevel;
        state.aiLevel = aiGame.level;
        document.querySelectorAll('.level-button').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        aiLevelLabelEl.textContent = aiLevelConfig[aiGame.level].label;
        saveState();
        resetAIGame();
        showNotification(`Сложность изменена: ${aiLevelConfig[aiGame.level].label}`);
      });
      levelSelectorEl.appendChild(button);
    });
    aiLevelLabelEl.textContent = aiLevelConfig[aiGame.level].label;
  }

  function setupAIControls() {
    aiNewGameBtn.addEventListener('click', () => {
      resetAIGame();
      showNotification('Начата новая партия против ИИ');
    });

    aiUndoBtn.addEventListener('click', () => {
      if (aiGame.result) return;
      undoAIMoves();
    });

    aiResignBtn.addEventListener('click', () => {
      if (aiGame.result) return;
      finishAIGame('loss', 'Вы сдались');
    });

    resetAIGame();
  }

  function resetAIGame() {
    aiGame.chess.reset();
    aiGame.selected = null;
    aiGame.movesFromSelected = [];
    aiGame.timers = { w: 600, b: 600 };
    aiGame.lastMove = null;
    aiGame.result = null;
    clearInterval(aiGame.interval);
    aiGame.interval = setInterval(() => {
      if (aiGame.result) return;
      const turn = aiGame.chess.turn();
      aiGame.timers[turn] = Math.max(0, aiGame.timers[turn] - 1);
      renderAIView();
      if (aiGame.timers[turn] === 0) {
        const result = turn === 'w' ? 'loss' : 'win';
        finishAIGame(result, 'Время истекло');
      }
    }, 1000);
    renderAIView();
    updateAIHint();
  }

  function undoAIMoves() {
    aiGame.chess.undo();
    aiGame.chess.undo();
    aiGame.lastMove = null;
    renderAIView();
    updateAIHint();
  }

  function handleAiSquareClick(square) {
    if (aiGame.result) return;
    if (aiGame.chess.turn() !== 'w') return;

    if (aiGame.selected === square) {
      aiGame.selected = null;
      aiGame.movesFromSelected = [];
      renderAIView();
      return;
    }

    const moves = aiGame.chess.moves({ square, verbose: true });
    if (aiGame.selected && aiGame.movesFromSelected.some((move) => move.to === square)) {
      makePlayerMove(square);
      return;
    }

    const piece = aiGame.chess.get(square);
    if (piece && piece.color === 'w') {
      aiGame.selected = square;
      aiGame.movesFromSelected = moves;
      renderAIView();
    }
  }

  function makePlayerMove(targetSquare) {
    const moveData = aiGame.movesFromSelected.find((move) => move.to === targetSquare);
    if (!moveData) return;
    const move = aiGame.chess.move({ from: aiGame.selected, to: targetSquare, promotion: 'q' });
    if (!move) return;
    aiGame.lastMove = move;
    aiGame.selected = null;
    aiGame.movesFromSelected = [];
    renderAIView();
    updateAIHint();

    if (aiGame.chess.game_over()) {
      resolveAIGameOutcome();
      return;
    }

    setTimeout(() => {
      makeAIMove();
    }, 350);
  }

  function makeAIMove() {
    if (aiGame.result) return;
    if (aiGame.chess.turn() !== 'b') return;

    const move = chooseAIMove(aiGame.chess, aiGame.level);
    if (move) {
      aiGame.chess.move(move);
      aiGame.lastMove = move;
      renderAIView();
      if (aiGame.chess.game_over()) {
        resolveAIGameOutcome();
      } else {
        updateAIHint();
      }
    }
  }

  function resolveAIGameOutcome() {
    if (aiGame.chess.in_checkmate()) {
      const result = aiGame.chess.turn() === 'w' ? 'win' : 'loss';
      finishAIGame(result, 'Мат на доске');
    } else if (aiGame.chess.in_draw() || aiGame.chess.in_stalemate() || aiGame.chess.in_threefold_repetition()) {
      finishAIGame('draw', 'Ничья');
    }
  }

  function finishAIGame(result, reason) {
    if (aiGame.result) return;
    aiGame.result = result;
    clearInterval(aiGame.interval);

    state.gamesPlayed += 1;
    if (result === 'win') {
      state.wins += 1;
      state.rating += 10;
      state.xp += 20;
      showNotification('Победа! +10 рейтинга, +20 XP');
    } else if (result === 'loss') {
      state.losses += 1;
      state.rating = Math.max(800, state.rating - 8);
      showNotification('Поражение. Рейтинг -8');
    } else {
      state.draws += 1;
      state.rating += 2;
      state.xp += 5;
      showNotification('Ничья. +2 рейтинга, +5 XP');
    }

    const historyEntry = {
      mode: 'AI',
      opponent: `ИИ · ${aiLevelConfig[aiGame.level].label}`,
      result,
      reason,
      moves: aiGame.chess.history(),
      timestamp: Date.now(),
    };
    state.history.unshift(historyEntry);
    state.history = state.history.slice(0, 20);

    saveState();
    updateStatsViews();
    renderAIView();
  }

  function renderAIView() {
    renderBoard(aiBoardView, aiGame.chess, {
      selected: aiGame.selected,
      lastMove: aiGame.lastMove,
      moves: aiGame.movesFromSelected,
    });

    aiStatusEl.textContent = aiGame.result
      ? aiGame.result === 'win'
        ? 'Победа'
        : aiGame.result === 'loss'
          ? 'Поражение'
          : 'Ничья'
      : aiGame.chess.turn() === 'w'
        ? 'Ход белых'
        : 'Ход чёрных';

    aiPlayersEl.innerHTML = `
      <div class="timer">ИИ · ${aiLevelConfig[aiGame.level].label}<span>${formatTime(aiGame.timers.b)}</span></div>
      <div class="timer">Вы (Белые)<span>${formatTime(aiGame.timers.w)}</span></div>
    `;

    aiStatsEl.innerHTML = `
      <div>Ходов: ${aiGame.chess.history().length}</div>
      <div>Фигур у вас: ${countMaterial(aiGame.chess, 'w')}</div>
      <div>Фигур у ИИ: ${countMaterial(aiGame.chess, 'b')}</div>
    `;
  }

  function updateAIHint() {
    if (aiGame.result) {
      aiHintEl.textContent = 'Партия завершена.';
      return;
    }
    if (aiGame.chess.turn() !== 'w') {
      aiHintEl.textContent = 'Ожидайте ход ИИ.';
      return;
    }
    const move = chooseAIMove(aiGame.chess, Math.max(1, aiGame.level - 1));
    if (move) {
      const san = aiGame.chess.move(move).san;
      aiGame.chess.undo();
      aiHintEl.textContent = `Подсказка: ${san}`;
    } else {
      aiHintEl.textContent = 'Нет доступных ходов.';
    }
  }

  function setupMultiplayerControls() {
    localGameBtn.addEventListener('click', () => {
      resetMultiplayerGame();
      showNotification('Начата новая локальная партия');
    });

    shareGameBtn.addEventListener('click', () => {
      const linkText = 'Приглашаю сыграть в шахматы в моём Telegram приложении!';
      if (navigator.share) {
        navigator.share({ title: 'Шахматы', text: linkText }).catch(() => {});
      } else if (TelegramWebApp.isAvailable) {
        TelegramWebApp.sendGameData({ type: 'invite', text: linkText });
        showNotification('Приглашение отправлено через Telegram');
      } else {
        showNotification('Поделитесь ссылкой вручную: ' + linkText);
      }
    });

    multiMinutesInput.addEventListener('change', () => {
      const value = Math.min(60, Math.max(1, Number(multiMinutesInput.value) || 10));
      multiGame.minutes = value;
      resetMultiplayerGame();
    });

    multiIncrementInput.addEventListener('change', () => {
      const value = Math.min(60, Math.max(0, Number(multiIncrementInput.value) || 0));
      multiGame.increment = value;
    });

    resetMultiplayerGame();
  }

  function resetMultiplayerGame() {
    multiGame.chess.reset();
    multiGame.selected = null;
    multiGame.movesFromSelected = [];
    multiGame.lastMove = null;
    multiGame.result = null;
    multiGame.timers = { w: multiGame.minutes * 60, b: multiGame.minutes * 60 };
    clearInterval(multiGame.interval);
    multiGame.interval = setInterval(() => {
      if (multiGame.result) return;
      const turn = multiGame.chess.turn();
      multiGame.timers[turn] = Math.max(0, multiGame.timers[turn] - 1);
      renderMultiplayerView();
      if (multiGame.timers[turn] === 0) {
        multiGame.result = turn === 'w' ? 'Черные победили по времени' : 'Белые победили по времени';
        finishMultiplayerGame(turn === 'w' ? 'b' : 'w', 'Время истекло');
      }
    }, 1000);
    renderMultiplayerView();
  }

  function handleMultiSquareClick(square) {
    if (multiGame.result) return;

    if (multiGame.selected === square) {
      multiGame.selected = null;
      multiGame.movesFromSelected = [];
      renderMultiplayerView();
      return;
    }

    if (multiGame.selected && multiGame.movesFromSelected.some((move) => move.to === square)) {
      const move = multiGame.chess.move({ from: multiGame.selected, to: square, promotion: 'q' });
      if (move) {
        multiGame.lastMove = move;
        multiGame.selected = null;
        multiGame.movesFromSelected = [];
        multiGame.timers[move.color] += multiGame.increment;
        renderMultiplayerView();
        if (multiGame.chess.game_over()) {
          finishMultiplayerGame(move.color === 'w' ? 'w' : 'b', 'Мат или ничья');
        }
      }
      return;
    }

    const piece = multiGame.chess.get(square);
    if (piece && piece.color === multiGame.chess.turn()) {
      multiGame.selected = square;
      multiGame.movesFromSelected = multiGame.chess.moves({ square, verbose: true });
      renderMultiplayerView();
    }
  }

  function finishMultiplayerGame(winnerColor, reason) {
    if (multiGame.result) return;
    if (multiGame.chess.in_checkmate()) {
      multiGame.result = winnerColor === 'w' ? 'Победа белых' : 'Победа чёрных';
    } else if (multiGame.chess.in_draw()) {
      multiGame.result = 'Ничья';
    } else {
      multiGame.result = reason;
    }

    clearInterval(multiGame.interval);

    state.history.unshift({
      mode: 'Мультплеер',
      result: multiGame.result,
      reason,
      moves: multiGame.chess.history(),
      timestamp: Date.now(),
    });
    state.history = state.history.slice(0, 20);
    saveState();
    updateStatsViews();
    renderMultiplayerView();
  }

  function renderMultiplayerView() {
    renderBoard(multiBoardView, multiGame.chess, {
      selected: multiGame.selected,
      lastMove: multiGame.lastMove,
      moves: multiGame.movesFromSelected,
    });

    multiStatusEl.textContent = multiGame.result || (multiGame.chess.turn() === 'w' ? 'Ход белых' : 'Ход чёрных');

    const moves = multiGame.chess.history();
    if (!moves.length) {
      multiHistoryEl.textContent = 'Ходы появятся здесь.';
    } else {
      multiHistoryEl.innerHTML = moves
        .map((move, index) => `${Math.floor(index / 2) + 1}. ${move}`)
        .join('<br>');
    }
  }

  function renderBoard(view, chessInstance, options = {}) {
    const { selected, moves, lastMove } = options;
    const highlights = new Set();
    if (lastMove) {
      highlights.add(lastMove.from);
      highlights.add(lastMove.to);
    }

    Object.entries(view.squares).forEach(([square, squareEl]) => {
      const piece = chessInstance.get(square);
      squareEl.textContent = piece ? pieceSymbols[`${piece.color}${piece.type}`] : '';
      squareEl.classList.remove('piece-white', 'piece-black');
      if (piece) {
        squareEl.classList.add(piece.color === 'w' ? 'piece-white' : 'piece-black');
      }
      squareEl.classList.toggle('highlight', square === selected);
      squareEl.classList.toggle('last-move', highlights.has(square));
      squareEl.classList.remove('move-option', 'capture');
    });

    if (selected && Array.isArray(moves)) {
      moves.forEach((move) => {
        const squareEl = view.squares[move.to];
        if (!squareEl) return;
        squareEl.classList.add('move-option');
        if (move.flags.includes('c')) {
          squareEl.classList.add('capture');
        }
      });
    }
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function countMaterial(chessInstance, color) {
    return chessInstance
      .board()
      .flat()
      .filter((piece) => piece && piece.color === color)
      .length;
  }

  function chooseAIMove(chessInstance, level) {
    const config = aiLevelConfig[level] || aiLevelConfig[1];
    const moves = chessInstance.moves({ verbose: true });
    if (!moves.length) return null;

    if (config.randomness > 0.75) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    const depth = config.depth;
    let bestScore = -Infinity;
    const bestMoves = [];

    orderMoves(moves).forEach((move) => {
      chessInstance.move(move);
      const score = -negamax(chessInstance, depth - 1, -Infinity, Infinity, -1);
      chessInstance.undo();
      if (score > bestScore + 1e-6) {
        bestScore = score;
        bestMoves.length = 0;
        bestMoves.push(move);
      } else if (Math.abs(score - bestScore) <= 1e-6) {
        bestMoves.push(move);
      }
    });

    if (!bestMoves.length) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    if (config.randomness > 0) {
      const threshold = Math.max(1, Math.floor(bestMoves.length * config.randomness));
      const choice = bestMoves[Math.floor(Math.random() * threshold)];
      return choice;
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  function orderMoves(moves) {
    return moves.slice().sort((a, b) => {
      const scoreA = (a.flags.includes('c') ? 10 : 0) + pieceValues[a.piece] || 0;
      const scoreB = (b.flags.includes('c') ? 10 : 0) + pieceValues[b.piece] || 0;
      return scoreB - scoreA;
    });
  }

  function negamax(chessInstance, depth, alpha, beta, color) {
    if (depth === 0 || chessInstance.game_over()) {
      return color * evaluateBoard(chessInstance);
    }

    let max = -Infinity;
    const moves = chessInstance.moves({ verbose: true });
    if (!moves.length) {
      return color * evaluateBoard(chessInstance);
    }

    for (const move of orderMoves(moves)) {
      chessInstance.move(move);
      const score = -negamax(chessInstance, depth - 1, -beta, -alpha, -color);
      chessInstance.undo();
      if (score > max) {
        max = score;
      }
      if (max > alpha) {
        alpha = max;
      }
      if (alpha >= beta) {
        break;
      }
    }

    return max;
  }

  function evaluateBoard(chessInstance) {
    if (chessInstance.in_checkmate()) {
      return chessInstance.turn() === 'w' ? -100000 : 100000;
    }
    if (chessInstance.in_draw() || chessInstance.in_stalemate()) {
      return 0;
    }

    let total = 0;
    const board = chessInstance.board();
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (!piece) continue;
        const base = pieceValues[piece.type];
        const table = pieceSquareTables[piece.type];
        const index = rank * 8 + file;
        const tableScore = table ? table[piece.color === 'w' ? index : 63 - index] : 0;
        const score = base + tableScore;
        total += piece.color === 'w' ? score : -score;
      }
    }
    return total;
  }

  function renderQuests() {
    questListEl.innerHTML = '';
    const completed = Object.keys(state.questsCompleted).filter((id) => state.questsCompleted[id]);
    questProgressEl.textContent = `${completed.length} / ${quests.length} выполнено`;

    quests.forEach((quest) => {
      const card = document.createElement('article');
      card.className = 'quest-card';
      const done = state.questsCompleted[quest.id];
      card.innerHTML = `
        <div class="quest-status ${done ? 'completed' : ''}">
          ${done ? '✅ Выполнено' : '🧠 В процессе'}
        </div>
        <h4>${quest.title}</h4>
        <p>${quest.description}</p>
        <div class="quest-status">Награда: ${quest.reward} XP</div>
        <div class="quest-status">Подсказка: ${quest.hint || 'Используйте лучшие ходы.'}</div>
        <button class="button ${done ? 'secondary' : ''}">${done ? 'Повторить' : 'Решить'}</button>
      `;
      card.querySelector('button').addEventListener('click', () => startQuest(quest));
      questListEl.appendChild(card);
    });
  }

  function startQuest(quest) {
    questGame.active = quest;
    questGame.chess.load(quest.fen);
    questGame.selected = null;
    questGame.movesFromSelected = [];
    questGame.solutionIndex = 0;
    questActivePanel.hidden = false;
    questActiveTitle.textContent = quest.title;
    questActiveHint.textContent = quest.hint || 'Выполните последовательность ходов, указанную в описании.';
    questActionsEl.innerHTML = '';

    const hintButton = document.createElement('button');
    hintButton.className = 'button secondary';
    hintButton.textContent = 'Подсказка';
    hintButton.addEventListener('click', () => showQuestHint());

    const restartButton = document.createElement('button');
    restartButton.className = 'button secondary';
    restartButton.textContent = 'Сбросить позицию';
    restartButton.addEventListener('click', () => startQuest(quest));

    questActionsEl.appendChild(hintButton);
    questActionsEl.appendChild(restartButton);

    renderQuestView();
  }

  function showQuestHint() {
    if (!questGame.active) return;
    const nextMove = questGame.active.solution[questGame.solutionIndex];
    questActiveHint.textContent = `Подсказка: ${nextMove || 'Все ходы выполнены'}`;
  }

  function handleQuestSquareClick(square) {
    if (!questGame.active) return;

    if (questGame.selected === square) {
      questGame.selected = null;
      questGame.movesFromSelected = [];
      renderQuestView();
      return;
    }

    if (questGame.selected && questGame.movesFromSelected.some((move) => move.to === square)) {
      const move = questGame.chess.move({ from: questGame.selected, to: square, promotion: 'q' });
      if (!move) return;
      questGame.selected = null;
      questGame.movesFromSelected = [];
      validateQuestMove(move);
      renderQuestView();
      return;
    }

    const piece = questGame.chess.get(square);
    if (piece && piece.color === questGame.chess.turn()) {
      questGame.selected = square;
      questGame.movesFromSelected = questGame.chess.moves({ square, verbose: true });
      renderQuestView();
    }
  }

  function validateQuestMove(move) {
    const quest = questGame.active;
    if (!quest) return;
    const expectedSan = quest.solution[questGame.solutionIndex];
    if (move.san !== expectedSan) {
      questActiveHint.textContent = 'Ход не совпадает с решением. Попробуйте ещё раз.';
      questGame.chess.undo();
      return;
    }

    questGame.solutionIndex += 1;
    questActiveHint.textContent = `Отлично! Осталось ходов: ${Math.max(0, quest.solution.length - questGame.solutionIndex)}`;

    if (questGame.solutionIndex >= quest.solution.length) {
      state.questsCompleted[quest.id] = true;
      state.xp += quest.reward;
      saveState();
      showNotification(`Квест выполнен! +${quest.reward} XP`);
      questActiveHint.textContent = 'Задание выполнено! Выберите следующий квест на панели слева.';
      renderQuests();
      renderQuestView();
      return;
    }

    const opponentMoveSan = quest.solution[questGame.solutionIndex];
    if (opponentMoveSan) {
      questGame.solutionIndex += 1;
      try {
        const opponentMove = questGame.chess.move(opponentMoveSan, { sloppy: true });
        if (opponentMove) {
          questActiveHint.textContent = `Соперник ответил: ${opponentMove.san}. Ваш ход.`;
        }
      } catch (error) {
        console.warn('Не удалось выполнить ход квеста', error);
      }
    }
  }

  function renderQuestView() {
    renderBoard(questBoardView, questGame.chess, {
      selected: questGame.selected,
      moves: questGame.movesFromSelected,
    });
  }

  function updateStatsViews() {
    homeStatsEl.innerHTML = `
      <div class="stat"><div class="stat-label">Игр сыграно</div><div class="stat-value">${state.gamesPlayed}</div></div>
      <div class="stat"><div class="stat-label">Квестов выполнено</div><div class="stat-value">${Object.values(state.questsCompleted).filter(Boolean).length}</div></div>
      <div class="stat"><div class="stat-label">Рейтинг</div><div class="stat-value">${state.rating}</div></div>
      <div class="stat"><div class="stat-label">XP</div><div class="stat-value">${state.xp}</div></div>
    `;

    profileRatingEl.textContent = state.rating;
    profileWinsEl.textContent = state.wins;
    profileLossesEl.textContent = state.losses;
    profileDrawsEl.textContent = state.draws;
    profileWinrateEl.textContent = state.gamesPlayed
      ? `${Math.round((state.wins / state.gamesPlayed) * 100)}%`
      : '0%';

    const level = Math.floor(state.xp / 100) + 1;
    const xpInLevel = state.xp % 100;
    profileRankEl.textContent = `Уровень ${level} · ${xpInLevel} XP`;
    xpProgressEl.style.width = `${xpInLevel}%`;

    profileHistoryEl.innerHTML = state.history.length
      ? state.history
          .map((entry) => {
            const date = new Date(entry.timestamp);
            return `<div class="history-item"><div>${entry.mode}</div><div>${entry.result}</div><div>${date.toLocaleDateString()}</div></div>`;
          })
          .join('')
      : '<div class="history-item">История будет заполняться по мере игр.</div>';

    const user = TelegramWebApp.user;
    if (user) {
      profileNameEl.textContent = user.firstName || 'Игрок';
      profileTitleEl.textContent = user.username ? `@${user.username}` : 'Telegram пользователь';
    }
  }

  function setupSettings() {
    const tabs = [
      { id: 'about', label: 'О приложении', icon: '♔' },
      { id: 'game', label: 'Игра', icon: '🎯' },
      { id: 'view', label: 'Вид', icon: '🎨' },
      { id: 'time', label: 'Время', icon: '⏱' },
      { id: 'privacy', label: 'Приватность', icon: '🔒' },
      { id: 'about-app', label: 'О программе', icon: 'ℹ️' },
    ];

    tabs.forEach((tab, index) => {
      const button = document.createElement('button');
      button.className = `tab-button ${index === 0 ? 'active' : ''}`;
      button.innerHTML = `<span>${tab.icon}</span><span>${tab.label}</span>`;
      button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        renderSettingsTab(tab.id);
      });
      settingsTabsEl.appendChild(button);
    });

    renderSettingsTab(tabs[0].id);
  }

  function renderSettingsTab(tabId) {
    const content = document.createElement('div');
    content.className = 'tab-content active';
    switch (tabId) {
      case 'about':
        content.innerHTML = `
          <div class="info-card">
            <h3>Шахматы · версия 1.0</h3>
            <p>Полнофункциональное приложение для игры в шахматы внутри Telegram. Играйте против ИИ, решайте задачи и ведите статистику.</p>
            <div class="badge success">Стабильная версия</div>
          </div>
          <div class="info-card">
            <strong>Возможности:</strong>
            <ul>
              <li>5 уровней сложности ИИ</li>
              <li>Локальный мультплеер с таймером</li>
              <li>Система квестов и прогресса</li>
              <li>Интеграция с Telegram WebApp API</li>
            </ul>
          </div>
        `;
        break;
      case 'game':
        content.innerHTML = `
          <div class="toggle"><span>Автосохранение партий</span><input type="checkbox" checked disabled /></div>
          <div class="toggle"><span>Подсказки ходов</span><input type="checkbox" checked /></div>
          <div class="toggle"><span>Подтверждение сдачи</span><input type="checkbox" checked /></div>
        `;
        break;
      case 'view':
        content.innerHTML = `
          <div class="toggle"><span>Адаптация под тему Telegram</span><input type="checkbox" checked /></div>
          <div class="toggle"><span>Показывать координаты доски</span><input type="checkbox" /></div>
        `;
        break;
      case 'time':
        content.innerHTML = `
          <div class="toggle"><span>Стандартный контроль</span><input type="text" value="${multiGame.minutes} мин" readonly /></div>
          <div class="toggle"><span>Инкремент</span><input type="text" value="${multiGame.increment} с" readonly /></div>
        `;
        break;
      case 'privacy':
        content.innerHTML = `
          <div class="info-card">
            <p>Мы не передаём ваши данные третьим лицам. Вся статистика хранится локально в вашем Telegram Web App.</p>
          </div>
        `;
        break;
      case 'about-app':
        content.innerHTML = `
          <div class="info-card">
            <p>Команда разработки: Chess Team.</p>
            <p>Поддержка: <a href="mailto:chess-app@example.com">chess-app@example.com</a></p>
          </div>
        `;
        break;
    }
    settingsContentEl.innerHTML = '';
    settingsContentEl.appendChild(content);
  }

  // --- Ненавязчивые уведомления поверх интерфейса ---
  function showNotification(message) {
    notificationEl.textContent = message;
    notificationEl.classList.add('show');
    setTimeout(() => notificationEl.classList.remove('show'), 2500);
  }

})();
