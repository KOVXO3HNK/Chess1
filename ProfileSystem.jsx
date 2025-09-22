import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Crown, 
  Star,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Shield,
  Sword
} from 'lucide-react'
import useGameStore from '../store/gameStore.js'

const ProfileSystem = ({ onBack }) => {
  const { 
    playerStats, 
    getCompletedQuests,
    quests
  } = useGameStore()

  const [selectedTab, setSelectedTab] = useState('overview')

  const completedQuests = getCompletedQuests()
  const totalXP = completedQuests.reduce((sum, quest) => sum + quest.reward, 0)
  
  // Calculate level based on XP
  const getLevel = (xp) => {
    return Math.floor(xp / 100) + 1
  }
  
  const getXPForNextLevel = (xp) => {
    const currentLevel = getLevel(xp)
    return currentLevel * 100
  }
  
  const getXPProgress = (xp) => {
    const currentLevelXP = (getLevel(xp) - 1) * 100
    const nextLevelXP = getLevel(xp) * 100
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  }

  const getRankTitle = (rating) => {
    if (rating < 800) return { title: 'Новичок', color: 'bg-gray-500', icon: User }
    if (rating < 1200) return { title: 'Любитель', color: 'bg-green-500', icon: Target }
    if (rating < 1600) return { title: 'Опытный', color: 'bg-blue-500', icon: Star }
    if (rating < 2000) return { title: 'Эксперт', color: 'bg-purple-500', icon: Award }
    if (rating < 2400) return { title: 'Мастер', color: 'bg-orange-500', icon: Crown }
    return { title: 'Гроссмейстер', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: Trophy }
  }

  const getWinRate = () => {
    const total = playerStats.wins + playerStats.losses + playerStats.draws
    return total > 0 ? Math.round((playerStats.wins / total) * 100) : 0
  }

  const getRecentGames = () => {
    // Mock recent games data
    return [
      { id: 1, opponent: 'ИИ (Уровень 3)', result: 'win', date: '2024-09-20', duration: '12:34' },
      { id: 2, opponent: 'Мастер123', result: 'loss', date: '2024-09-19', duration: '18:45' },
      { id: 3, opponent: 'ИИ (Уровень 2)', result: 'win', date: '2024-09-19', duration: '8:22' },
      { id: 4, opponent: 'НовичокПро', result: 'draw', date: '2024-09-18', duration: '25:11' },
      { id: 5, opponent: 'ИИ (Уровень 4)', result: 'loss', date: '2024-09-18', duration: '15:33' }
    ]
  }

  const getAchievements = () => {
    const achievements = []
    
    if (playerStats.wins >= 1) achievements.push({ 
      title: 'Первая победа', 
      description: 'Выиграйте свою первую партию',
      icon: Trophy,
      color: 'bg-green-500'
    })
    
    if (playerStats.wins >= 10) achievements.push({ 
      title: 'Победитель', 
      description: 'Выиграйте 10 партий',
      icon: Crown,
      color: 'bg-blue-500'
    })
    
    if (completedQuests.length >= 5) achievements.push({ 
      title: 'Искатель приключений', 
      description: 'Выполните 5 квестов',
      icon: Target,
      color: 'bg-purple-500'
    })
    
    if (playerStats.rating >= 1500) achievements.push({ 
      title: 'Восходящая звезда', 
      description: 'Достигните рейтинга 1500',
      icon: Star,
      color: 'bg-yellow-500'
    })
    
    return achievements
  }

  const rankInfo = getRankTitle(playerStats.rating)
  const RankIcon = rankInfo.icon
  const level = getLevel(totalXP)
  const xpProgress = getXPProgress(totalXP)
  const recentGames = getRecentGames()
  const achievements = getAchievements()

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Player Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${rankInfo.color} rounded-full flex items-center justify-center`}>
                <RankIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Игрок</h2>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${rankInfo.color} text-white`}>
                  {rankInfo.title}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white">
                  Уровень {level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Опыт до следующего уровня</span>
                  <span className="text-white">{totalXP} / {getXPForNextLevel(totalXP)} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {playerStats.rating}
            </div>
            <div className="text-sm text-gray-300">Рейтинг</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {getWinRate()}%
            </div>
            <div className="text-sm text-gray-300">Процент побед</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {completedQuests.length}
            </div>
            <div className="text-sm text-gray-300">Квестов выполнено</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {totalXP}
            </div>
            <div className="text-sm text-gray-300">Общий опыт</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Stats */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Статистика игр
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {playerStats.wins}
              </div>
              <div className="text-sm text-gray-300">Победы</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {playerStats.losses}
              </div>
              <div className="text-sm text-gray-300">Поражения</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {playerStats.draws}
              </div>
              <div className="text-sm text-gray-300">Ничьи</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Последние игры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentGames.map((game) => (
              <div 
                key={game.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    game.result === 'win' ? 'bg-green-400' : 
                    game.result === 'loss' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium">
                      vs {game.opponent}
                    </div>
                    <div className="text-sm text-gray-300">
                      {game.date} • {game.duration}
                    </div>
                  </div>
                </div>
                <Badge variant={
                  game.result === 'win' ? 'default' : 
                  game.result === 'loss' ? 'destructive' : 'secondary'
                }>
                  {game.result === 'win' ? 'Победа' : 
                   game.result === 'loss' ? 'Поражение' : 'Ничья'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAchievements = () => (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const AchievementIcon = achievement.icon
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <div className={`p-3 rounded-lg ${achievement.color}`}>
                      <AchievementIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Пока нет достижений
              </h3>
              <p className="text-gray-300">
                Играйте и выполняйте квесты, чтобы получить первые достижения!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
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
              <User className="w-10 h-10 text-orange-400" />
              Профиль
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              Обзор
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              История
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              Достижения
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            {renderHistory()}
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-6">
            {renderAchievements()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfileSystem
