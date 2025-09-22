// Telegram Web App Integration
(function() {
  'use strict';

  // Проверка доступности Telegram Web App API
  if (!window.Telegram || !window.Telegram.WebApp) {
    console.warn('Telegram Web App API не доступен');
    return;
  }

  const tg = window.Telegram.WebApp;
  
  // Инициализация приложения
  tg.ready();
  tg.expand();
  
  // Настройка темы
  function setupTheme() {
    const root = document.documentElement;
    
    // Применение цветов Telegram
    if (tg.themeParams) {
      root.style.setProperty('--tg-bg-color', tg.themeParams.bg_color || '#1a1a2e');
      root.style.setProperty('--tg-text-color', tg.themeParams.text_color || '#ffffff');
      root.style.setProperty('--tg-hint-color', tg.themeParams.hint_color || '#999999');
      root.style.setProperty('--tg-link-color', tg.themeParams.link_color || '#3390ec');
      root.style.setProperty('--tg-button-color', tg.themeParams.button_color || '#3390ec');
      root.style.setProperty('--tg-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    }
    
    // Добавление класса для Telegram стилей
    document.body.classList.add('telegram-web-app');
  }
  
  // Получение данных пользователя
  function getTelegramUser() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      return {
        id: tg.initDataUnsafe.user.id,
        firstName: tg.initDataUnsafe.user.first_name,
        lastName: tg.initDataUnsafe.user.last_name,
        username: tg.initDataUnsafe.user.username,
        languageCode: tg.initDataUnsafe.user.language_code,
        isPremium: tg.initDataUnsafe.user.is_premium
      };
    }
    return null;
  }
  
  // Отправка данных обратно в Telegram
  function sendGameData(data) {
    try {
      tg.sendData(JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка отправки данных в Telegram:', error);
    }
  }
  
  // Показ уведомлений
  function showNotification(message, type = 'info') {
    if (type === 'alert') {
      tg.showAlert(message);
    } else if (type === 'confirm') {
      return new Promise((resolve) => {
        tg.showConfirm(message, resolve);
      });
    } else {
      tg.showPopup({
        title: 'Шахматы',
        message: message,
        buttons: [{ type: 'ok' }]
      });
    }
  }
  
  // Настройка главной кнопки
  function setupMainButton(text, onClick) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  }
  
  function hideMainButton() {
    tg.MainButton.hide();
  }
  
  // Настройка кнопки "Назад"
  function setupBackButton(onClick) {
    tg.BackButton.onClick(onClick);
    tg.BackButton.show();
  }
  
  function hideBackButton() {
    tg.BackButton.hide();
  }
  
  // Вибрация (если поддерживается)
  function vibrate(type = 'light') {
    if (tg.HapticFeedback) {
      switch (type) {
        case 'light':
          tg.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          tg.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          tg.HapticFeedback.impactOccurred('heavy');
          break;
        case 'success':
          tg.HapticFeedback.notificationOccurred('success');
          break;
        case 'error':
          tg.HapticFeedback.notificationOccurred('error');
          break;
        case 'warning':
          tg.HapticFeedback.notificationOccurred('warning');
          break;
        default:
          tg.HapticFeedback.selectionChanged();
      }
    }
  }
  
  // Открытие ссылок
  function openLink(url) {
    tg.openLink(url);
  }
  
  // Закрытие приложения
  function closeApp() {
    tg.close();
  }
  
  // Экспорт функций в глобальную область
  window.TelegramWebApp = {
    isAvailable: true,
    user: getTelegramUser(),
    setupTheme,
    sendGameData,
    showNotification,
    setupMainButton,
    hideMainButton,
    setupBackButton,
    hideBackButton,
    vibrate,
    openLink,
    closeApp,
    
    // События
    onViewportChanged: (callback) => tg.onEvent('viewportChanged', callback),
    onThemeChanged: (callback) => tg.onEvent('themeChanged', callback),
    onMainButtonClicked: (callback) => tg.onEvent('mainButtonClicked', callback),
    onBackButtonClicked: (callback) => tg.onEvent('backButtonClicked', callback),
    
    // Утилиты
    isExpanded: tg.isExpanded,
    viewportHeight: tg.viewportHeight,
    viewportStableHeight: tg.viewportStableHeight,
    platform: tg.platform,
    colorScheme: tg.colorScheme,
    version: tg.version
  };
  
  // Инициализация темы при загрузке
  setupTheme();
  
  // Обработка изменения темы
  tg.onEvent('themeChanged', setupTheme);
  
  console.log('Telegram Web App инициализирован');
  
})();

// Fallback для случаев, когда Telegram Web App API недоступен
if (!window.TelegramWebApp) {
  window.TelegramWebApp = {
    isAvailable: false,
    user: null,
    setupTheme: () => {},
    sendGameData: () => {},
    showNotification: (message) => alert(message),
    setupMainButton: () => {},
    hideMainButton: () => {},
    setupBackButton: () => {},
    hideBackButton: () => {},
    vibrate: () => {},
    openLink: (url) => window.open(url, '_blank'),
    closeApp: () => window.close(),
    onViewportChanged: () => {},
    onThemeChanged: () => {},
    onMainButtonClicked: () => {},
    onBackButtonClicked: () => {},
    isExpanded: false,
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,
    platform: 'unknown',
    colorScheme: 'dark',
    version: '0.0'
  };
}
