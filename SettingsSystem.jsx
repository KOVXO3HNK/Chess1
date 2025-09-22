import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Palette, 
  Clock, 
  Gamepad2,
  Shield,
  Globe,
  Download,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react'

const SettingsSystem = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('game')
  
  // Game Settings
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState([70])
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [showCoordinates, setShowCoordinates] = useState(true)
  const [highlightMoves, setHighlightMoves] = useState(true)
  const [autoQueen, setAutoQueen] = useState(false)
  const [confirmMoves, setConfirmMoves] = useState(false)
  
  // Display Settings
  const [theme, setTheme] = useState('dark')
  const [boardTheme, setBoardTheme] = useState('classic')
  const [pieceSet, setPieceSet] = useState('classic')
  const [language, setLanguage] = useState('ru')
  
  // Time Settings
  const [defaultTimeControl, setDefaultTimeControl] = useState('10+0')
  const [autoSave, setAutoSave] = useState(true)
  
  // Privacy Settings
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [allowChallenges, setAllowChallenges] = useState(true)
  const [shareStats, setShareStats] = useState(false)

  const renderGameSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            Игровые настройки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-blue-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <Label className="text-white">Звуковые эффекты</Label>
                  <p className="text-sm text-gray-300">Звуки ходов и уведомлений</p>
                </div>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled}
              />
            </div>
            
            {soundEnabled && (
              <div className="ml-8 space-y-2">
                <Label className="text-white">Громкость: {soundVolume[0]}%</Label>
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Анимации</Label>
                <p className="text-sm text-gray-300">Плавные движения фигур</p>
              </div>
              <Switch 
                checked={animationsEnabled} 
                onCheckedChange={setAnimationsEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Показывать координаты</Label>
                <p className="text-sm text-gray-300">Буквы и цифры на доске</p>
              </div>
              <Switch 
                checked={showCoordinates} 
                onCheckedChange={setShowCoordinates}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Подсветка ходов</Label>
                <p className="text-sm text-gray-300">Выделение возможных ходов</p>
              </div>
              <Switch 
                checked={highlightMoves} 
                onCheckedChange={setHighlightMoves}
              />
            </div>
          </div>

          {/* Game Behavior */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Автопревращение в ферзя</Label>
                <p className="text-sm text-gray-300">Автоматически превращать пешку в ферзя</p>
              </div>
              <Switch 
                checked={autoQueen} 
                onCheckedChange={setAutoQueen}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Подтверждение ходов</Label>
                <p className="text-sm text-gray-300">Требовать подтверждение каждого хода</p>
              </div>
              <Switch 
                checked={confirmMoves} 
                onCheckedChange={setConfirmMoves}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Внешний вид
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Тема приложения</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Темная</SelectItem>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="auto">Автоматическая</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Тема доски</Label>
              <Select value={boardTheme} onValueChange={setBoardTheme}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Классическая</SelectItem>
                  <SelectItem value="wood">Деревянная</SelectItem>
                  <SelectItem value="marble">Мраморная</SelectItem>
                  <SelectItem value="neon">Неоновая</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Набор фигур</Label>
              <Select value={pieceSet} onValueChange={setPieceSet}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Классический</SelectItem>
                  <SelectItem value="modern">Современный</SelectItem>
                  <SelectItem value="medieval">Средневековый</SelectItem>
                  <SelectItem value="minimalist">Минималистичный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Язык</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTimeSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Время и сохранение
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white mb-2 block">Контроль времени по умолчанию</Label>
            <Select value={defaultTimeControl} onValueChange={setDefaultTimeControl}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1+0">Пуля (1 мин)</SelectItem>
                <SelectItem value="3+0">Блиц (3 мин)</SelectItem>
                <SelectItem value="5+0">Блиц (5 мин)</SelectItem>
                <SelectItem value="10+0">Быстрые (10 мин)</SelectItem>
                <SelectItem value="15+10">Быстрые (15+10)</SelectItem>
                <SelectItem value="30+0">Классические (30 мин)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Автосохранение</Label>
              <p className="text-sm text-gray-300">Автоматически сохранять игры</p>
            </div>
            <Switch 
              checked={autoSave} 
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Приватность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Показывать статус онлайн</Label>
              <p className="text-sm text-gray-300">Другие игроки видят, когда вы в сети</p>
            </div>
            <Switch 
              checked={showOnlineStatus} 
              onCheckedChange={setShowOnlineStatus}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Разрешить вызовы</Label>
              <p className="text-sm text-gray-300">Другие игроки могут приглашать вас в игру</p>
            </div>
            <Switch 
              checked={allowChallenges} 
              onCheckedChange={setAllowChallenges}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Делиться статистикой</Label>
              <p className="text-sm text-gray-300">Показывать статистику в профиле</p>
            </div>
            <Switch 
              checked={shareStats} 
              onCheckedChange={setShareStats}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Управление данными</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспортировать данные
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Сбросить настройки
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить все данные
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderAbout = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            О приложении
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="text-6xl mb-4">♔</div>
            <h2 className="text-2xl font-bold text-white mb-2">Шахматы</h2>
            <p className="text-gray-300 mb-4">Версия 1.0</p>
            <Badge className="bg-green-500 text-white">
              Стабильная версия
            </Badge>
          </div>
          
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              Полнофункциональное шахматное приложение с ИИ-соперниками, 
              системой квестов и мультиплеерным режимом.
            </p>
            
            <div className="pt-4 border-t border-white/20">
              <h3 className="text-white font-medium mb-2">Возможности:</h3>
              <ul className="space-y-1 ml-4">
                <li>• 5 уровней ИИ-соперников</li>
                <li>• 20 увлекательных квестов</li>
                <li>• Мультиплеерные партии онлайн</li>
                <li>• Система достижений и рейтингов</li>
                <li>• Настраиваемый интерфейс</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <h3 className="text-white font-medium mb-2">Технологии:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/20 text-white">React</Badge>
                <Badge variant="outline" className="border-white/20 text-white">Chess.js</Badge>
                <Badge variant="outline" className="border-white/20 text-white">Stockfish</Badge>
                <Badge variant="outline" className="border-white/20 text-white">WebSocket</Badge>
                <Badge variant="outline" className="border-white/20 text-white">Tailwind CSS</Badge>
              </div>
            </div>
          </div>
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
              <Settings className="w-10 h-10 text-gray-400" />
              Настройки
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="game" 
              className="data-[state=active]:bg-white/20 text-white text-xs"
            >
              Игра
            </TabsTrigger>
            <TabsTrigger 
              value="display" 
              className="data-[state=active]:bg-white/20 text-white text-xs"
            >
              Вид
            </TabsTrigger>
            <TabsTrigger 
              value="time" 
              className="data-[state=active]:bg-white/20 text-white text-xs"
            >
              Время
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-white/20 text-white text-xs"
            >
              Приватность
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className="data-[state=active]:bg-white/20 text-white text-xs"
            >
              О программе
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="game" className="mt-6">
            {renderGameSettings()}
          </TabsContent>
          
          <TabsContent value="display" className="mt-6">
            {renderDisplaySettings()}
          </TabsContent>
          
          <TabsContent value="time" className="mt-6">
            {renderTimeSettings()}
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-6">
            {renderPrivacySettings()}
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            {renderAbout()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SettingsSystem
