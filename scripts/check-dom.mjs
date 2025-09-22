import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// --- Вспомогательные переменные для работы с путями относительно корня репозитория ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// --- Пути к ключевым файлам, которые мы валидируем ---
const htmlPath = path.join(projectRoot, 'public', 'index.html');
const appScriptPath = path.join(projectRoot, 'public', 'app.js');
const chessModulePath = path.join(projectRoot, 'public', 'chess.js');

// --- Утилита для вычисления номера строки по индексу символа ---
function getLineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

// --- Считываем HTML и собираем перечень всех объявленных id ---
const htmlSource = fs.readFileSync(htmlPath, 'utf8');
const declaredIds = new Set();
const idRegex = /id=["']([^"']+)["']/g;
let match;
while ((match = idRegex.exec(htmlSource)) !== null) {
  declaredIds.add(match[1]);
}

// --- Разбираем JS-логику и проверяем, что каждый getElementById попадает в существующий id ---
const appSource = fs.readFileSync(appScriptPath, 'utf8');
const usageRegex = /getElementById\(\s*["']([^"']+)["']\s*\)/g;
const missingIds = [];
while ((match = usageRegex.exec(appSource)) !== null) {
  const requestedId = match[1];
  if (!declaredIds.has(requestedId)) {
    missingIds.push({ id: requestedId, line: getLineNumber(appSource, match.index) });
  }
}

if (missingIds.length > 0) {
  console.error('Не найдены элементы с ожидаемыми id:');
  for (const { id, line } of missingIds) {
    console.error(` - ${id} (строка ${line})`);
  }
  process.exit(1);
}

// --- Импортируем chess.js как ES-модуль и выполняем пару базовых ходов для smoke-теста ---
const chessModuleUrl = pathToFileURL(chessModulePath).href;
const { Chess } = await import(chessModuleUrl);
const testGame = new Chess();

const expectedStartFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
if (testGame.fen() !== expectedStartFen) {
  console.error('Стартовая позиция шахматного движка не совпала с ожидаемой.');
  process.exit(1);
}

// --- Выполняем короткую комбинацию ходов и проверяем валидность позиции ---
testGame.move('e4');
testGame.move('e5');
testGame.move('Nf3');
testGame.move('Nc6');

testGame.move('Bb5');
if (!testGame.fen().startsWith('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R')) {
  console.error('После серии ходов позиция получилась неожиданной, проверьте модуль chess.js.');
  process.exit(1);
}

console.log('Проверка прошла успешно: все id присутствуют, chess.js отдаёт корректную позицию.');
