import { create } from 'zustand'
import { Chess } from 'chess.js'

const useGameStore = create((set, get) => ({
  // Game state
  currentView: 'menu',
  gameMode: null,
  aiLevel: 1,
  game: new Chess(),
  gamePosition: new Chess().fen(),
  moveHistory: [],
  gameStatus: 'playing',
  currentPlayer: 'white',
  capturedPieces: { white: [], black: [] },
  moveCount: 0,
  gameTime: { white: 600, black: 600 },
  isThinking: false,

  // Player stats
  playerStats: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDraw: 0,
    questsCompleted: 0,
    rating: 1200,
    totalPlayTime: 0
  },

  // Quests
  quests: [
    {
      id: 1,
      title: 'Первая победа',
      description: 'Выиграйте вашу первую партию',
      type: 'win',
      target: 1,
      progress: 0,
      completed: false,
      reward: 50
    },
    {
      id: 2,
      title: 'Мат в 3 хода',
      description: 'Поставьте мат противнику за 3 хода или меньше',
      type: 'quick_mate',
      target: 1,
      progress: 0,
      completed: false,
      reward: 100
    },
    {
      id: 3,
      title: 'Серия побед',
      description: 'Выиграйте 3 партии подряд',
      type: 'win_streak',
      target: 3,
      progress: 0,
      completed: false,
      reward: 150
    },
    {
      id: 4,
      title: 'Защитник',
      description: 'Выиграйте партию, находясь под шахом 5 раз',
      type: 'survive_checks',
      target: 5,
      progress: 0,
      completed: false,
      reward: 75
    },
    {
      id: 5,
      title: 'Жертва ферзя',
      description: 'Выиграйте партию, пожертвовав ферзем',
      type: 'queen_sacrifice',
      target: 1,
      progress: 0,
      completed: false,
      reward: 200
    },
    {
      id: 6,
      title: 'Марафонец',
      description: 'Сыграйте 10 партий',
      type: 'games_played',
      target: 10,
      progress: 0,
      completed: false,
      reward: 100
    },
    {
      id: 7,
      title: 'Тактик',
      description: 'Выиграйте партию против ИИ уровня 3',
      type: 'beat_ai_level',
      target: 3,
      progress: 0,
      completed: false,
      reward: 125
    },
    {
      id: 8,
      title: 'Мастер эндшпиля',
      description: 'Выиграйте партию, имея только короля и пешку',
      type: 'endgame_master',
      target: 1,
      progress: 0,
      completed: false,
      reward: 175
    },
    {
      id: 9,
      title: 'Быстрая игра',
      description: 'Выиграйте партию за 5 минут или быстрее',
      type: 'quick_win',
      target: 1,
      progress: 0,
      completed: false,
      reward: 90
    },
    {
      id: 10,
      title: 'Коллекционер',
      description: 'Взять все типы фигур противника в одной партии',
      type: 'capture_all_types',
      target: 1,
      progress: 0,
      completed: false,
      reward: 110
    },
    {
      id: 11,
      title: 'Рокировка мастер',
      description: 'Сделайте рокировку в 5 разных партиях',
      type: 'castling_master',
      target: 5,
      progress: 0,
      completed: false,
      reward: 80
    },
    {
      id: 12,
      title: 'Пешечный прорыв',
      description: 'Проведите пешку в ферзи 3 раза',
      type: 'pawn_promotion',
      target: 3,
      progress: 0,
      completed: false,
      reward: 120
    },
    {
      id: 13,
      title: 'Непобедимый',
      description: 'Сыграйте 5 партий без поражений',
      type: 'undefeated_streak',
      target: 5,
      progress: 0,
      completed: false,
      reward: 160
    },
    {
      id: 14,
      title: 'Шахматный гений',
      description: 'Достигните рейтинга 1500',
      type: 'rating_milestone',
      target: 1500,
      progress: 1200,
      completed: false,
      reward: 250
    },
    {
      id: 15,
      title: 'Многозадачность',
      description: 'Играйте одновременно в 3 мультиплеерные партии',
      type: 'simultaneous_games',
      target: 3,
      progress: 0,
      completed: false,
      reward: 140
    },
    {
      id: 16,
      title: 'Время - деньги',
      description: 'Выиграйте партию на последних 10 секундах',
      type: 'time_pressure_win',
      target: 1,
      progress: 0,
      completed: false,
      reward: 180
    },
    {
      id: 17,
      title: 'Дебютный мастер',
      description: 'Изучите 5 различных дебютов',
      type: 'opening_master',
      target: 5,
      progress: 0,
      completed: false,
      reward: 130
    },
    {
      id: 18,
      title: 'Социальный игрок',
      description: 'Сыграйте 20 мультиплеерных партий',
      type: 'multiplayer_games',
      target: 20,
      progress: 0,
      completed: false,
      reward: 150
    },
    {
      id: 19,
      title: 'Легенда',
      description: 'Выиграйте против ИИ максимального уровня',
      type: 'beat_max_ai',
      target: 1,
      progress: 0,
      completed: false,
      reward: 300
    },
    {
      id: 20,
      title: 'Шахматный император',
      description: 'Завершите все остальные квесты',
      type: 'complete_all_quests',
      target: 19,
      progress: 0,
      completed: false,
      reward: 500
    }
  ],

  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  
  setGameMode: (mode, level = 1) => set({ 
    gameMode: mode, 
    aiLevel: level,
    currentView: 'game'
  }),

  resetGame: () => {
    const newGame = new Chess()
    set({
      game: newGame,
      gamePosition: newGame.fen(),
      moveHistory: [],
      gameStatus: 'playing',
      currentPlayer: 'white',
      capturedPieces: { white: [], black: [] },
      moveCount: 0,
      gameTime: { white: 600, black: 600 },
      isThinking: false
    })
  },

  makeMove: (move) => {
    const { game } = get()
    const gameCopy = new Chess(game.fen())
    const result = gameCopy.move(move)
    
    if (result) {
      const newCapturedPieces = { ...get().capturedPieces }
      if (result.captured) {
        const capturedBy = result.color === 'w' ? 'white' : 'black'
        newCapturedPieces[capturedBy] = [...newCapturedPieces[capturedBy], result.captured]
      }

      let newGameStatus = 'playing'
      if (gameCopy.isGameOver()) {
        if (gameCopy.isCheckmate()) {
          const winner = gameCopy.turn() === 'w' ? 'black' : 'white'
          newGameStatus = `checkmate-${winner}-wins`
        } else if (gameCopy.isDraw()) {
          newGameStatus = 'draw'
        } else if (gameCopy.isStalemate()) {
          newGameStatus = 'stalemate'
        }
      }

      set({
        game: gameCopy,
        gamePosition: gameCopy.fen(),
        moveHistory: [...get().moveHistory, result],
        moveCount: get().moveCount + 1,
        currentPlayer: gameCopy.turn() === 'w' ? 'white' : 'black',
        capturedPieces: newCapturedPieces,
        gameStatus: newGameStatus
      })

      return result
    }
    return null
  },

  updateGameTime: (color, time) => set(state => ({
    gameTime: { ...state.gameTime, [color]: time }
  })),

  setIsThinking: (thinking) => set({ isThinking: thinking }),

  setGameStatus: (status) => set({ gameStatus: status }),

  updatePlayerStats: (gameResult) => {
    const { playerStats } = get()
    const newStats = { ...playerStats }
    
    newStats.gamesPlayed += 1
    
    if (gameResult === 'win') {
      newStats.gamesWon += 1
      newStats.rating += 25
    } else if (gameResult === 'loss') {
      newStats.gamesLost += 1
      newStats.rating = Math.max(800, newStats.rating - 20)
    } else if (gameResult === 'draw') {
      newStats.gamesDraw += 1
      newStats.rating += 5
    }

    set({ playerStats: newStats })
  },

  updateQuestProgress: (questType, value = 1) => {
    const { quests } = get()
    const updatedQuests = quests.map(quest => {
      if (quest.type === questType && !quest.completed) {
        const newProgress = Math.min(quest.progress + value, quest.target)
        return {
          ...quest,
          progress: newProgress,
          completed: newProgress >= quest.target
        }
      }
      return quest
    })

    // Check if all other quests are completed for the final quest
    const completedCount = updatedQuests.filter(q => q.completed && q.id !== 20).length
    const finalQuest = updatedQuests.find(q => q.id === 20)
    if (finalQuest && !finalQuest.completed) {
      finalQuest.progress = completedCount
      finalQuest.completed = completedCount >= finalQuest.target
    }

    set({ quests: updatedQuests })
  },

  getCompletedQuests: () => {
    const { quests } = get()
    return quests.filter(quest => quest.completed)
  },

  getActiveQuests: () => {
    const { quests } = get()
    return quests.filter(quest => !quest.completed)
  }
}))

export default useGameStore
