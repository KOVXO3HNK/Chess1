import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Trophy, 
  Star, 
  Crown, 
  Target, 
  Zap, 
  Shield, 
  Sword, 
  Clock, 
  Users,
  Brain,
  Award,
  CheckCircle,
  Lock
} from 'lucide-react'
import useGameStore from '../store/gameStore.js'

const QuestSystem = ({ onBack }) => {
  const { 
    quests, 
    getCompletedQuests, 
    getActiveQuests, 
    playerStats 
  } = useGameStore()

  const [selectedTab, setSelectedTab] = useState('active')

  const getQuestIcon = (questType) => {
    const iconMap = {
      'win': Trophy,
      'quick_mate': Zap,
      'win_streak': Crown,
      'survive_checks': Shield,
      'queen_sacrifice': Sword,
      'games_played': Target,
      'beat_ai_level': Brain,
      'endgame_master': Award,
      'quick_win': Clock,
      'capture_all_types': Star,
      'castling_master': Shield,
      'pawn_promotion': Crown,
      'undefeated_streak': Trophy,
      'rating_milestone': Star,
      'simultaneous_games': Users,
      'time_pressure_win': Clock,
      'opening_master': Brain,
      'multiplayer_games': Users,
      'beat_max_ai': Crown,
      'complete_all_quests': Award
    }
    return iconMap[questType] || Target
  }

  const getQuestCategory = (questType) => {
    const categories = {
      'win': 'Победы',
      'quick_mate': 'Тактика',
      'win_streak': 'Достижения',
      'survive_checks': 'Защита',
      'queen_sacrifice': 'Тактика',
      'games_played': 'Активность',
      'beat_ai_level': 'ИИ',
      'endgame_master': 'Эндшпиль',
      'quick_win': 'Скорость',
      'capture_all_types': 'Тактика',
      'castling_master': 'Стратегия',
      'pawn_promotion': 'Эндшпиль',
      'undefeated_streak': 'Достижения',
      'rating_milestone': 'Рейтинг',
      'simultaneous_games': 'Мультиплеер',
      'time_pressure_win': 'Скорость',
      'opening_master': 'Дебют',
      'multiplayer_games': 'Мультиплеер',
      'beat_max_ai': 'ИИ',
      'complete_all_quests': 'Мастер'
    }
    return categories[questType] || 'Общие'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Победы': 'bg-green-500',
      'Тактика': 'bg-red-500',
      'Достижения': 'bg-purple-500',
      'Защита': 'bg-blue-500',
      'Активность': 'bg-orange-500',
      'ИИ': 'bg-cyan-500',
      'Эндшпиль': 'bg-yellow-500',
      'Скорость': 'bg-pink-500',
      'Стратегия': 'bg-indigo-500',
      'Рейтинг': 'bg-emerald-500',
      'Мультиплеер': 'bg-violet-500',
      'Дебют': 'bg-teal-500',
      'Мастер': 'bg-gradient-to-r from-yellow-400 to-orange-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const renderQuestCard = (quest) => {
    const IconComponent = getQuestIcon(quest.type)
    const category = getQuestCategory(quest.type)
    const categoryColor = getCategoryColor(category)
    const progressPercentage = (quest.progress / quest.target) * 100

    return (
      <Card 
        key={quest.id}
        className={`bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-300 hover:bg-white/15 ${
          quest.completed ? 'ring-2 ring-green-400' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${categoryColor}`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  {quest.title}
                  {quest.completed && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </CardTitle>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">
                +{quest.reward} XP
              </div>
              {quest.completed && (
                <Badge className="bg-green-500 text-white mt-1">
                  Выполнено
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            {quest.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Прогресс</span>
              <span className="text-white">
                {quest.progress} / {quest.target}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeQuests = getActiveQuests()
  const completedQuests = getCompletedQuests()
  const totalXP = completedQuests.reduce((sum, quest) => sum + quest.reward, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
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
              <Trophy className="w-10 h-10 text-yellow-400" />
              Квесты
            </h1>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">
              {totalXP} XP
            </div>
            <div className="text-sm text-gray-300">
              Общий опыт
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-400">
                {completedQuests.length}
              </div>
              <div className="text-sm text-gray-300">Выполнено</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-400">
                {activeQuests.length}
              </div>
              <div className="text-sm text-gray-300">Активных</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((completedQuests.length / quests.length) * 100)}%
              </div>
              <div className="text-sm text-gray-300">Прогресс</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-400">
                {playerStats.rating}
              </div>
              <div className="text-sm text-gray-300">Рейтинг</div>
            </CardContent>
          </Card>
        </div>

        {/* Quest Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              Активные ({activeQuests.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              Выполненные ({completedQuests.length})
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              Все ({quests.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {activeQuests.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {activeQuests.map(renderQuestCard)}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Все квесты выполнены!
                  </h2>
                  <p className="text-gray-300">
                    Поздравляем! Вы завершили все доступные квесты.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedQuests.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {completedQuests.map(renderQuestCard)}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-12 text-center">
                  <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Пока нет выполненных квестов
                  </h2>
                  <p className="text-gray-300">
                    Начните играть, чтобы выполнить свои первые квесты!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {quests.map(renderQuestCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default QuestSystem
