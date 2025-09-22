import { useState, useCallback, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { RotateCcw, Flag, Crown, Clock, Brain } from 'lucide-react'
import { getAIEngine } from '../utils/aiEngine.js'
import useGameStore from '../store/gameStore.js'

const ChessBoard = ({ onGameEnd, onBack }) => {
  const {
    gameMode,
    aiLevel,
    game,
    gamePosition,
    moveHistory,
    gameStatus,
    currentPlayer,
    capturedPieces,
    moveCount,
    gameTime,
    isThinking,
    makeMove,
    resetGame: storeResetGame,
    updateGameTime,
    setIsThinking,
    setGameStatus,
    updatePlayerStats,
    updateQuestProgress
  } = useGameStore()
  
  const [aiEngine] = useState(() => getAIEngine())

  // Initialize AI Engine
  useEffect(() => {
    aiEngine.initialize().then(() => {
      aiEngine.setLevel(aiLevel)
    })
    
    return () => {
      aiEngine.stop()
    }
  }, [aiEngine, aiLevel])

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        const newTime = Math.max(0, gameTime[currentPlayer] - 1)
        updateGameTime(currentPlayer, newTime)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStatus, currentPlayer, gameTime, updateGameTime])

  // Check for time out
  useEffect(() => {
    if (gameTime.white <= 0) {
      setGameStatus('timeout-black-wins')
      updatePlayerStats('loss')
      onGameEnd?.('timeout', 'black')
    } else if (gameTime.black <= 0) {
      setGameStatus('timeout-white-wins')
      updatePlayerStats('win')
      onGameEnd?.('timeout', 'white')
    }
  }, [gameTime, onGameEnd, setGameStatus, updatePlayerStats])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const makeAMove = useCallback((move) => {
    const result = makeMove(move)
    
    if (result) {
      // Handle game end and update stats
      if (gameStatus.includes('wins')) {
        const winner = gameStatus.includes('white') ? 'white' : 'black'
        if (winner === 'white') {
          updatePlayerStats('win')
          updateQuestProgress('win')
          if (gameMode === 'ai') {
            updateQuestProgress('beat_ai_level', aiLevel)
          }
        } else {
          updatePlayerStats('loss')
        }
        onGameEnd?.(gameStatus.includes('checkmate') ? 'checkmate' : 'timeout', winner)
      } else if (gameStatus === 'draw' || gameStatus === 'stalemate') {
        updatePlayerStats('draw')
        onGameEnd?.(gameStatus, null)
      }

      // Update quest progress
      updateQuestProgress('games_played')
      if (result.captured) {
        updateQuestProgress('capture_pieces')
      }
    }
    
    return result
  }, [makeMove, gameStatus, updatePlayerStats, updateQuestProgress, onGameEnd, gameMode, aiLevel])

  const onDrop = useCallback((sourceSquare, targetSquare, piece) => {
    // Prevent moves when it's AI's turn or game is over
    if (gameMode === 'ai' && currentPlayer === 'black') return false
    if (gameStatus !== 'playing') return false

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? 'q'
    })

    return move !== null
  }, [makeAMove, gameMode, currentPlayer, gameStatus])

  // AI move using Stockfish or fallback
  const makeAIMove = useCallback(() => {
    if (gameMode !== 'ai' || currentPlayer !== 'black' || gameStatus !== 'playing') return

    setIsThinking(true)
    
    aiEngine.getBestMove(gamePosition, (move) => {
      if (move && gameStatus === 'playing') {
        makeAMove(move)
      }
      setIsThinking(false)
    })
  }, [aiEngine, gameMode, currentPlayer, gameStatus, gamePosition, makeAMove, setIsThinking])

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'black' && gameStatus === 'playing') {
      makeAIMove()
    }
  }, [gameMode, currentPlayer, gameStatus, makeAIMove])

  const resetGame = () => {
    aiEngine.stop()
    storeResetGame()
    aiEngine.setLevel(aiLevel)
  }

  const resignGame = () => {
    const winner = currentPlayer === 'white' ? 'black' : 'white'
    setGameStatus(`resign-${winner}-wins`)
    updatePlayerStats(winner === 'white' ? 'win' : 'loss')
    onGameEnd?.('resign', winner)
  }

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'playing':
        if (isThinking) return `ИИ (Уровень ${aiLevel}) думает...`
        return game.isCheck() ? 'Шах!' : `Ход ${currentPlayer === 'white' ? 'белых' : 'черных'}`
      case 'checkmate-white-wins':
        return 'Мат! Белые победили!'
      case 'checkmate-black-wins':
        return 'Мат! Черные победили!'
      case 'draw':
        return 'Ничья!'
      case 'stalemate':
        return 'Пат!'
      case 'timeout-white-wins':
        return 'Время вышло! Белые победили!'
      case 'timeout-black-wins':
        return 'Время вышло! Черные победили!'
      case 'resign-white-wins':
        return 'Белые победили! (сдача)'
      case 'resign-black-wins':
        return 'Черные победили! (сдача)'
      default:
        return 'Игра'
    }
  }

  const renderCapturedPieces = (color) => {
    const pieces = capturedPieces[color]
    const pieceSymbols = {
      'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚'
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, index) => (
          <span key={index} className="text-lg">
            {pieceSymbols[piece]}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onBack}
            >
              ← Назад
            </Button>
            <h1 className="text-3xl font-bold text-white">
              {gameMode === 'ai' ? `Игра против ИИ (Уровень ${aiLevel})` : 'Мультиплеер'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/10 text-white">
              {getStatusMessage()}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Info Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Player Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Игроки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Black Player */}
                <div className={`p-3 rounded-lg ${currentPlayer === 'black' ? 'bg-white/20' : 'bg-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {gameMode === 'ai' ? `ИИ (${aiLevel})` : 'Черные'}
                      </span>
                      {isThinking && gameMode === 'ai' && (
                        <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(gameTime.black)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    Взято: {renderCapturedPieces('black')}
                  </div>
                </div>

                {/* White Player */}
                <div className={`p-3 rounded-lg ${currentPlayer === 'white' ? 'bg-white/20' : 'bg-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Вы (Белые)</span>
                    <div className="flex items-center gap-1 text-white">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(gameTime.white)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    Взято: {renderCapturedPieces('white')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Управление</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={resetGame}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isThinking}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Новая игра
                </Button>
                
                {gameStatus === 'playing' && (
                  <Button 
                    onClick={resignGame}
                    variant="destructive"
                    className="w-full"
                    disabled={isThinking}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Сдаться
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Ходов:</span>
                  <span>{moveCount}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Статус:</span>
                  <span className="text-sm">{gameStatus === 'playing' ? 'В игре' : 'Завершена'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chess Board */}
          <div className="lg:col-span-3">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <div className="aspect-square max-w-2xl mx-auto">
                <Chessboard
                  position={gamePosition}
                  onPieceDrop={onDrop}
                  boardOrientation="white"
                  customBoardStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                  }}
                  customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                  customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                  arePiecesDraggable={gameStatus === 'playing' && !(gameMode === 'ai' && currentPlayer === 'black')}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Move History */}
        {moveHistory.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="text-white">История ходов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                {moveHistory.map((move, index) => (
                  <div key={index} className="text-white text-sm font-mono bg-white/5 p-2 rounded">
                    {Math.floor(index / 2) + 1}.{index % 2 === 0 ? '' : '..'} {move.san}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ChessBoard
