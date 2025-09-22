import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Crown, Users, Trophy, Play, Settings, User, Bot } from 'lucide-react'
import ChessBoard from './components/ChessBoard.jsx'
import QuestSystem from './components/QuestSystem.jsx'
import MultiplayerSystem from './components/MultiplayerSystem.jsx'
import ProfileSystem from './components/ProfileSystem.jsx'
import SettingsSystem from './components/SettingsSystem.jsx'
import useGameStore from './store/gameStore.js'
import './App.css'

function App() {
  const { 
    currentView, 
    setCurrentView, 
    setGameMode, 
    playerStats,
    getCompletedQuests 
  } = useGameStore()

  const menuItems = [
    {
      id: 'ai',
      title: 'Игра против ИИ',
      description: 'Играйте против компьютера различных уровней сложности',
      icon: Crown,
      color: 'bg-blue-500'
    },
    {
      id: 'multiplayer',
      title: 'Мультиплеер',
      description: 'Играйте с друзьями или случайными соперниками онлайн',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'quests',
      title: 'Квесты',
      description: 'Решайте шахматные задачи и головоломки',
      icon: Trophy,
      color: 'bg-purple-500'
    },
    {
      id: 'profile',
      title: 'Профиль',
      description: 'Просматривайте статистику и достижения',
      icon: User,
      color: 'bg-orange-500'
    }
  ]

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ♔ Шахматы ♛
          </h1>
          <p className="text-xl text-gray-300">
            Играйте, учитесь и совершенствуйтесь в королевской игре
          </p>
          <Badge variant="secondary" className="mt-4">
            Версия 1.0
          </Badge>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Card 
                key={item.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => {
                  if (item.id === 'ai') {
                    setCurrentView('ai-select')
                  } else {
                    setCurrentView(item.id)
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">{playerStats.gamesPlayed}</div>
              <div className="text-sm text-gray-300">Игр сыграно</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">{getCompletedQuests().length}</div>
              <div className="text-sm text-gray-300">Квестов выполнено</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">{playerStats.rating}</div>
              <div className="text-sm text-gray-300">Рейтинг</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setCurrentView('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Настройки
          </Button>
        </div>
      </div>
    </div>
  )

  const renderAISelect = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Выберите уровень ИИ</h1>
          <Button 
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setCurrentView('menu')}
          >
            ← Назад в меню
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((level) => (
            <Card 
              key={level}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => setGameMode('ai', level)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    level === 1 ? 'bg-green-500' :
                    level === 2 ? 'bg-blue-500' :
                    level === 3 ? 'bg-yellow-500' :
                    level === 4 ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    Уровень {level}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-3">
                  {level === 1 && 'Новичок - Легкий противник для начинающих'}
                  {level === 2 && 'Любитель - Умеренная сложность'}
                  {level === 3 && 'Опытный - Хорошая тактика'}
                  {level === 4 && 'Эксперт - Сильная игра'}
                  {level === 5 && 'Мастер - Максимальная сложность'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Сила:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div 
                        key={star}
                        className={`w-3 h-3 rounded-full ${
                          star <= level ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPlaceholder = (title) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <Button 
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setCurrentView('menu')}
          >
            ← Назад в меню
          </Button>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-4">В разработке</h2>
            <p className="text-gray-300 mb-6">
              Этот раздел находится в процессе разработки и будет доступен в следующих версиях.
            </p>
            <Button 
              onClick={() => setCurrentView('menu')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Вернуться в меню
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Render different views based on currentView state
  switch (currentView) {
    case 'menu':
      return renderMenu()
    case 'ai-select':
      return renderAISelect()
    case 'game':
      return (
        <ChessBoard 
          onBack={() => setCurrentView('menu')}
          onGameEnd={(result, winner) => {
            // Handle game end logic here
            console.log('Game ended:', result, winner)
          }}
        />
      )
    case 'multiplayer':
      return <MultiplayerSystem onBack={() => setCurrentView('menu')} />
    case 'quests':
      return <QuestSystem onBack={() => setCurrentView('menu')} />
    case 'profile':
      return <ProfileSystem onBack={() => setCurrentView('menu')} />
    case 'settings':
      return <SettingsSystem onBack={() => setCurrentView('menu')} />
    default:
      return renderMenu()
  }
}

export default App
