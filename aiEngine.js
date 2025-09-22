class AIEngine {
  constructor() {
    this.stockfish = null
    this.isReady = false
    this.currentLevel = 1
    this.isThinking = false
    this.onMoveCallback = null
    this.moveQueue = []
  }

  async initialize() {
    try {
      // Import Stockfish dynamically
      const { default: Stockfish } = await import('stockfish.js')
      
      this.stockfish = new Stockfish()
      
      return new Promise((resolve) => {
        this.stockfish.onmessage = (event) => {
          const message = event.data || event
          console.log('Stockfish:', message)
          
          if (message === 'uciok') {
            this.stockfish.postMessage('isready')
          } else if (message === 'readyok') {
            this.isReady = true
            this.setLevel(this.currentLevel)
            resolve()
          } else if (message.startsWith('bestmove')) {
            this.handleBestMove(message)
          }
        }
        
        this.stockfish.postMessage('uci')
      })
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error)
      // Fallback to simple random AI
      this.isReady = true
      return Promise.resolve()
    }
  }

  setLevel(level) {
    this.currentLevel = level
    
    if (!this.stockfish) return
    
    // Configure Stockfish based on level
    const configs = {
      1: { depth: 1, skill: 0, time: 100 },    // Beginner
      2: { depth: 3, skill: 5, time: 500 },    // Amateur  
      3: { depth: 5, skill: 10, time: 1000 },  // Experienced
      4: { depth: 8, skill: 15, time: 2000 },  // Expert
      5: { depth: 12, skill: 20, time: 3000 }  // Master
    }
    
    const config = configs[level] || configs[1]
    
    this.stockfish.postMessage('ucinewgame')
    this.stockfish.postMessage(`setoption name Skill Level value ${config.skill}`)
    this.stockfish.postMessage(`setoption name Depth value ${config.depth}`)
    this.stockfish.postMessage('isready')
  }

  async getBestMove(fen, callback) {
    this.onMoveCallback = callback
    
    if (!this.isReady || this.isThinking) {
      // Fallback to random move if Stockfish not ready
      setTimeout(() => {
        this.getRandomMove(fen, callback)
      }, 500 + Math.random() * 1500)
      return
    }

    this.isThinking = true
    
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`)
      
      const config = {
        1: { depth: 1, time: 100 },
        2: { depth: 3, time: 500 },
        3: { depth: 5, time: 1000 },
        4: { depth: 8, time: 2000 },
        5: { depth: 12, time: 3000 }
      }[this.currentLevel] || { depth: 1, time: 100 }
      
      this.stockfish.postMessage(`go depth ${config.depth} movetime ${config.time}`)
    } else {
      // Fallback to random move
      setTimeout(() => {
        this.getRandomMove(fen, callback)
      }, 500 + Math.random() * 1500)
    }
  }

  handleBestMove(message) {
    this.isThinking = false
    
    const parts = message.split(' ')
    const move = parts[1]
    
    if (move && move !== '(none)' && this.onMoveCallback) {
      // Convert UCI format to chess.js format
      const from = move.substring(0, 2)
      const to = move.substring(2, 4)
      const promotion = move.length > 4 ? move.substring(4, 5) : undefined
      
      const moveObj = {
        from,
        to,
        promotion
      }
      
      this.onMoveCallback(moveObj)
    }
  }

  getRandomMove(fen, callback) {
    // Simple fallback AI using chess.js
    import('chess.js').then(({ Chess }) => {
      const game = new Chess(fen)
      const moves = game.moves({ verbose: true })
      
      if (moves.length > 0) {
        // Add some basic strategy for different levels
        let selectedMove
        
        if (this.currentLevel === 1) {
          // Level 1: Completely random
          selectedMove = moves[Math.floor(Math.random() * moves.length)]
        } else if (this.currentLevel === 2) {
          // Level 2: Prefer captures
          const captures = moves.filter(move => move.captured)
          selectedMove = captures.length > 0 && Math.random() > 0.5 
            ? captures[Math.floor(Math.random() * captures.length)]
            : moves[Math.floor(Math.random() * moves.length)]
        } else {
          // Level 3+: Prefer captures and checks
          const captures = moves.filter(move => move.captured)
          const checks = moves.filter(move => {
            const testGame = new Chess(fen)
            testGame.move(move)
            return testGame.isCheck()
          })
          
          const goodMoves = [...captures, ...checks]
          selectedMove = goodMoves.length > 0 && Math.random() > 0.3
            ? goodMoves[Math.floor(Math.random() * goodMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)]
        }
        
        callback({
          from: selectedMove.from,
          to: selectedMove.to,
          promotion: selectedMove.promotion
        })
      }
    })
  }

  stop() {
    if (this.stockfish) {
      this.stockfish.postMessage('stop')
    }
    this.isThinking = false
  }

  quit() {
    if (this.stockfish) {
      this.stockfish.postMessage('quit')
      this.stockfish = null
    }
    this.isReady = false
    this.isThinking = false
  }
}

// Singleton instance
let aiEngineInstance = null

export const getAIEngine = () => {
  if (!aiEngineInstance) {
    aiEngineInstance = new AIEngine()
  }
  return aiEngineInstance
}

export default AIEngine
