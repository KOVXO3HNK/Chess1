import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Users, 
  Plus, 
  Search, 
  Clock, 
  Globe, 
  Lock,
  Copy,
  RefreshCw,
  Play,
  UserCheck,
  Wifi,
  WifiOff
} from 'lucide-react'
import ChessBoard from './ChessBoard.jsx'
import useGameStore from '../store/gameStore.js'

const MultiplayerSystem = ({ onBack }) => {
  const { setCurrentView, setGameMode } = useGameStore()
  const [currentTab, setCurrentTab] = useState('lobby')
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('Игрок')
  const [isConnected, setIsConnected] = useState(false)
  const [gameRooms, setGameRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const [isInGame, setIsInGame] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching available rooms
    const mockRooms = [
      {
        id: 'room_1',
        name: 'Быстрая игра',
        players: 1,
        maxPlayers: 2,
        timeControl: '10+0',
        rating: '1200-1400',
        status: 'waiting',
        host: 'Мастер123'
      },
      {
        id: 'room_2',
        name: 'Блиц турнир',
        players: 2,
        maxPlayers: 2,
        timeControl: '5+3',
        rating: '1400-1600',
        status: 'playing',
        host: 'ШахматныйГений'
      },
      {
        id: 'room_3',
        name: 'Дружеская партия',
        players: 1,
        maxPlayers: 2,
        timeControl: '15+10',
        rating: 'Любой',
        status: 'waiting',
        host: 'НовичокПро'
      }
    ]
    setGameRooms(mockRooms)
    
    // Simulate connection status
    setTimeout(() => setIsConnected(true), 1000)
  }, [])

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = () => {
    const newRoomCode = generateRoomCode()
    setRoomCode(newRoomCode)
    setCurrentRoom({
      id: newRoomCode,
      name: `Комната ${playerName}`,
      players: 1,
      maxPlayers: 2,
      timeControl: '10+0',
      rating: 'Любой',
      status: 'waiting',
      host: playerName,
      code: newRoomCode
    })
    setCurrentTab('room')
  }

  const joinRoom = (room) => {
    setCurrentRoom(room)
    setCurrentTab('room')
  }

  const joinByCode = () => {
    if (roomCode.length === 6) {
      // Simulate joining room by code
      setCurrentRoom({
        id: roomCode,
        name: `Комната ${roomCode}`,
        players: 2,
        maxPlayers: 2,
        timeControl: '10+0',
        rating: 'Любой',
        status: 'ready',
        host: 'Другой игрок',
        code: roomCode
      })
      setCurrentTab('room')
    }
  }

  const startGame = () => {
    setGameMode('multiplayer')
    setIsInGame(true)
  }

  const leaveRoom = () => {
    setCurrentRoom(null)
    setCurrentTab('lobby')
    setRoomCode('')
  }

  const copyRoomCode = () => {
    if (currentRoom?.code) {
      navigator.clipboard.writeText(currentRoom.code)
      // Could add toast notification here
    }
  }

  if (isInGame) {
    return (
      <ChessBoard 
        gameMode="multiplayer"
        onBack={() => {
          setIsInGame(false)
          setCurrentTab('lobby')
        }}
        onGameEnd={(result, winner) => {
          console.log('Multiplayer game ended:', result, winner)
          setIsInGame(false)
          setCurrentTab('lobby')
        }}
      />
    )
  }

  const renderLobby = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white">
                {isConnected ? 'Подключено к серверу' : 'Подключение...'}
              </span>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Онлайн' : 'Офлайн'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
          <CardContent className="pt-6" onClick={createRoom}>
            <div className="text-center">
              <Plus className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Создать комнату</h3>
              <p className="text-gray-300">Создайте новую игровую комнату и пригласите друзей</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Search className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Присоединиться по коду</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Введите код комнаты"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  maxLength={6}
                />
                <Button 
                  onClick={joinByCode}
                  disabled={roomCode.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Присоединиться
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Rooms */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Доступные комнаты
            </CardTitle>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gameRooms.map((room) => (
              <div 
                key={room.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-medium">{room.name}</h4>
                    <Badge variant={room.status === 'waiting' ? 'default' : 'secondary'}>
                      {room.status === 'waiting' ? 'Ожидание' : 'В игре'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.players}/{room.maxPlayers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {room.timeControl}
                    </span>
                    <span>Рейтинг: {room.rating}</span>
                    <span>Хост: {room.host}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => joinRoom(room)}
                  disabled={room.status !== 'waiting'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {room.status === 'waiting' ? 'Присоединиться' : 'Занято'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRoom = () => (
    <div className="space-y-6">
      {/* Room Info */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-2xl">
              {currentRoom?.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {currentRoom?.code && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyRoomCode}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {currentRoom.code}
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={leaveRoom}
              >
                Покинуть
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {currentRoom?.players}/{currentRoom?.maxPlayers}
              </div>
              <div className="text-sm text-gray-300">Игроки</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {currentRoom?.timeControl}
              </div>
              <div className="text-sm text-gray-300">Контроль времени</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {currentRoom?.rating}
              </div>
              <div className="text-sm text-gray-300">Рейтинг</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Игроки в комнате</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">{currentRoom?.host}</span>
                <Badge className="bg-yellow-500 text-black">Хост</Badge>
              </div>
              <div className="text-sm text-gray-300">Готов</div>
            </div>
            
            {currentRoom?.players === 2 ? (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">{playerName}</span>
                </div>
                <div className="text-sm text-gray-300">Готов</div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 bg-white/5 rounded-lg border-2 border-dashed border-white/20">
                <div className="text-center">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300">Ожидание второго игрока...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      {currentRoom?.players === 2 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Button 
                onClick={startGame}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Начать игру
              </Button>
              <p className="text-sm text-gray-300 mt-2">
                Все игроки готовы. Можно начинать партию!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onBack}
            >
              ← Назад
            </Button>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-400" />
              Мультиплеер
            </h1>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-medium text-white">
              {playerName}
            </div>
            <div className="text-sm text-gray-300">
              Рейтинг: 1200
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="lobby" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              Лобби
            </TabsTrigger>
            <TabsTrigger 
              value="room" 
              className="data-[state=active]:bg-white/20 text-white"
              disabled={!currentRoom}
            >
              Комната
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lobby" className="mt-6">
            {renderLobby()}
          </TabsContent>
          
          <TabsContent value="room" className="mt-6">
            {currentRoom ? renderRoom() : renderLobby()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MultiplayerSystem
