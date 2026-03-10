/* =============================================
   数学クエスト - JavaScriptアプリロジック
   ============================================= */
'use strict';

// ===================== ゲーム設定 =====================
const CONFIG = {
    MAX_LEVEL: 10,
    TIMER_SECONDS: 30,
    COMBO_BONUS_THRESHOLD: 3,    // 何問連続でボーナス発動
    COMBO_BONUS_RATE: 0.2,       // 20%増
    WRONG_EXP_BONUS: 3,          // 不正解でも少し経験値
    SAVE_KEY: 'mathquest_save_v1',
    PARTNER_MESSAGES_CORRECT: [
        "すごい！正解だ！やったね！",
        "かっこいい！その調子！",
        "完璧！頭いいな〜！",
        "天才じゃん！さすが！",
        "最高！どんどん強くなってるよ！"
    ],
    PARTNER_MESSAGES_WRONG: [
        "大丈夫！次は絶対できる！",
        "一緒に考えよう！あと少しだよ！",
        "失敗しても大丈夫、解説を読んでみよう！",
        "気にしないで！また挑戦しよう！",
        "みんな最初は間違えるよ。頑張れ！"
    ]
};

// ===================== キャラクターデータ =====================
const CHARACTERS = [
    { id: 'warrior', name: '勇者アレク', emoji: '⚔️', type: '見習い勇者', atkBonus: 1.2, expBonus: 1.0, color: '#f5c842', description: '攻撃力が高い！正解時のダメージがUP', stats: { atk: 80, mag: 40, def: 60 } },
    { id: 'mage', name: '魔法使いリラ', emoji: '🔮', type: '魔法使い', atkBonus: 1.0, expBonus: 1.3, color: '#ce93d8', description: '経験値が多くもらえる！レベルアップが早い', stats: { atk: 40, mag: 90, def: 30 } },
    { id: 'scholar', name: '学者ノア', emoji: '📚', type: '天才学者', atkBonus: 1.0, expBonus: 1.1, color: '#4fc3f7', description: 'ヒントが得意！ヒント回数が1回増える', stats: { atk: 50, mag: 60, def: 70 } },
    { id: 'archer', name: '弓使いセナ', emoji: '🏹', type: '疾風の射手', atkBonus: 1.1, expBonus: 1.0, color: '#81c784', description: 'バランス型。コンボが続きやすい', stats: { atk: 70, mag: 50, def: 50 } }
];

// ===================== ステージデータ =====================
const STAGES = [
    { id: 1, name: '迷いの森', emoji: '🌲', unit: '正負の数', difficulty: 'easy', qCount: 5, desc: '正と負の数を学ぼう', minLevel: 1, questIds: [1, 2, 3, 4, 5] },
    { id: 2, name: '古代遺跡', emoji: '🏛️', unit: '正負の数', difficulty: 'easy', qCount: 5, desc: '正負の数の応用問題', minLevel: 1, questIds: [6, 7, 8, 9, 10] },
    { id: 3, name: '炎の峠', emoji: '🔥', unit: '正負の数', difficulty: 'normal', qCount: 1, desc: '気温差の計算に挑戦', minLevel: 2, questIds: [11] },
    { id: 4, name: '文字の迷宮', emoji: '🔤', unit: '文字式', difficulty: 'easy', qCount: 6, desc: '文字式の基本を習得', minLevel: 2, questIds: [12, 13, 14, 15, 16, 17] },
    { id: 5, name: '魔法学校', emoji: '✨', unit: '文字式', difficulty: 'normal', qCount: 4, desc: '文字式の応用に挑戦', minLevel: 4, questIds: [18, 19, 20, 21] },
    { id: 6, name: '封印の神殿', emoji: '⛩️', unit: '1次方程式', difficulty: 'easy', qCount: 5, desc: '方程式を解いて封印を解け', minLevel: 3, questIds: [22, 23, 24, 25, 26] },
    { id: 7, name: 'ドラゴンの巣', emoji: '🐉', unit: '1次方程式', difficulty: 'normal', qCount: 5, desc: '移項・展開に挑戦', minLevel: 5, questIds: [27, 28, 29, 30, 31] },
    { id: 8, name: '竜王の城', emoji: '🏯', unit: '1次方程式', difficulty: 'hard', qCount: 2, desc: 'ドラゴンを倒せ', minLevel: 7, questIds: [32, 33] },
    { id: 9, name: '海の王国', emoji: '🌊', unit: '比例と反比例', difficulty: 'easy', qCount: 4, desc: '比例の国を冒険しよう', minLevel: 4, questIds: [34, 35, 36, 37] },
    { id: 10, name: '嵐の海峡', emoji: '⛈️', unit: '比例と反比例', difficulty: 'normal', qCount: 4, desc: '反比例の謎を解け', minLevel: 6, questIds: [38, 39, 40, 41] },
    { id: 11, name: '神秘の島', emoji: '🏝️', unit: '比例と反比例', difficulty: 'hard', qCount: 2, desc: '座標と比例の最終決戦', minLevel: 8, questIds: [42, 43] },
    { id: 12, name: '霊峰の頂', emoji: '⛰️', unit: '図形', difficulty: 'easy', qCount: 3, desc: '図形の基本を学ぼう', minLevel: 3, questIds: [44, 45, 46] },
    { id: 13, name: '魔王の城', emoji: '🏰', unit: '図形', difficulty: 'normal', qCount: 3, desc: '体積・面積に挑戦', minLevel: 5, questIds: [47, 48, 49] },
    { id: 14, name: '最終決戦の間', emoji: '👑', unit: '図形', difficulty: 'hard', qCount: 1, desc: '魔王に立ち向かえ！', minLevel: 10, questIds: [50] }
];

// ===================== 敵キャラ設定 =====================
const ENEMY_SPRITES = {
    'スライム': { emoji: '🟢', maxHp: 30, color: '#4fc3f7' },
    'コウモリ': { emoji: '🦇', maxHp: 40, color: '#9b59b6' },
    'ゴブリン': { emoji: '👺', maxHp: 50, color: '#e74c3c' },
    'オーク': { emoji: '🗡️', maxHp: 60, color: '#e67e22' },
    'トロール': { emoji: '🧌', maxHp: 80, color: '#27ae60' },
    'アイスドラゴン': { emoji: '🐲', maxHp: 100, color: '#85c1e9' },
    'スライムキング': { emoji: '💚', maxHp: 70, color: '#1abc9c' },
    'ゴブリン魔導士': { emoji: '🧙', maxHp: 60, color: '#8e44ad' },
    'オークウォーリア': { emoji: '🪓', maxHp: 80, color: '#d35400' },
    'マジシャン': { emoji: '🎩', maxHp: 90, color: '#6c3483' },
    'ダークナイト': { emoji: '🖤', maxHp: 100, color: '#2c3e50' },
    'バンディット': { emoji: '🗡️', maxHp: 70, color: '#7f8c8d' },
    'ゾンビ': { emoji: '🧟', maxHp: 60, color: '#2ecc71' },
    'スケルトン': { emoji: '💀', maxHp: 65, color: '#ecf0f1' },
    'ウルフ': { emoji: '🐺', maxHp: 70, color: '#aab7b8' },
    'ウェアウルフ': { emoji: '🌕', maxHp: 90, color: '#f0b27a' },
    'サイクロプス': { emoji: '👁️', maxHp: 100, color: '#922b21' },
    'ドラゴン': { emoji: '🐉', maxHp: 130, color: '#e74c3c' },
    'マーマン': { emoji: '🧜', maxHp: 80, color: '#5dade2' },
    'シーサーペント': { emoji: '🐍', maxHp: 90, color: '#117a65' },
    'ネプチューン': { emoji: '🔱', maxHp: 110, color: '#1a5276' },
    'ゴーレム': { emoji: '🪨', maxHp: 120, color: '#935116' },
    'フェニックス': { emoji: '🦅', maxHp: 140, color: '#e74c3c' },
    'ゴーストナイト': { emoji: '👻', maxHp: 80, color: '#7fb3d3' },
    'スフィンクス': { emoji: '🦁', maxHp: 100, color: '#d4ac0d' },
    'ジャイアント': { emoji: '🔨', maxHp: 120, color: '#7f8c8d' },
    '魔王': { emoji: '😈', maxHp: 200, color: '#8e44ad' },
    'default': { emoji: '👾', maxHp: 50, color: '#95a5a6' }
};

// ===================== アプリ状態 =====================
let state = {
    screen: 'title',
    player: null,        // キャラクターオブジェクト
    playerName: '',
    level: 1,
    exp: 0,
    totalExp: 0,
    currentStage: null,
    currentStageIndex: 0,
    questionQueue: [],   // 今のステージの問題リスト
    currentQIndex: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    wrongQuestions: [],  // 間違えた問題の記録
    stagesCleared: [],   // クリア済みステージID
    hintsUsed: 0,
    timerOn: true,
    timerInterval: null,
    timerSec: CONFIG.TIMER_SECONDS,
    enemyHp: 100,
    enemyMaxHp: 100,
    bgmVolume: 70,
    sfxVolume: 80
};

// ===================== セーブ・ロード =====================
function saveGame() {
    const saveData = {
        playerName: state.playerName,
        playerId: state.player?.id,
        level: state.level,
        exp: state.exp,
        totalExp: state.totalExp,
        stagesCleared: state.stagesCleared,
        wrongQuestions: state.wrongQuestions,
        timerOn: state.timerOn,
        bgmVolume: state.bgmVolume,
        sfxVolume: state.sfxVolume
    };
    try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData)); } catch (e) { }
}

function loadGame() {
    try {
        const raw = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) { return null; }
}

// ===================== パーティクル背景 =====================
function initParticles() {
    const container = document.getElementById('particles-bg');
    const colors = ['#4fc3f7', '#ce93d8', '#f5c842', '#81c784', '#f06292'];
    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 10 + 4;
        p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * -20}s;
    `;
        container.appendChild(p);
    }
}

// ===================== 画面切り替え =====================
function showScreen(screenId, dir = 'right') {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active', 'slide-in-right', 'slide-in-left', 'fade-in');
    });
    const next = document.getElementById('screen-' + screenId);
    if (!next) return;
    next.classList.add('active');
    const animClass = dir === 'fade' ? 'fade-in' : (dir === 'right' ? 'slide-in-right' : 'slide-in-left');
    next.classList.add(animClass);
    state.screen = screenId;
}

// ===================== タイトル画面 =====================
function initTitleScreen() {
    const saved = loadGame();
    document.getElementById('btn-continue').style.opacity = saved ? '1' : '0.4';
    document.getElementById('btn-continue').disabled = !saved;
}

document.getElementById('btn-new-game').addEventListener('click', () => {
    initCharacterScreen();
    showScreen('character');
});
document.getElementById('btn-continue').addEventListener('click', () => {
    const saved = loadGame();
    if (!saved) return;
    // セーブデータから復元
    state.playerName = saved.playerName || '勇者';
    state.player = CHARACTERS.find(c => c.id === saved.playerId) || CHARACTERS[0];
    state.level = saved.level || 1;
    state.exp = saved.exp || 0;
    state.totalExp = saved.totalExp || 0;
    state.stagesCleared = saved.stagesCleared || [];
    state.wrongQuestions = saved.wrongQuestions || [];
    state.timerOn = saved.timerOn !== undefined ? saved.timerOn : true;
    state.bgmVolume = saved.bgmVolume || 70;
    state.sfxVolume = saved.sfxVolume || 80;
    document.getElementById('timer-toggle').checked = state.timerOn;
    document.getElementById('bgm-volume').value = state.bgmVolume;
    document.getElementById('sfx-volume').value = state.sfxVolume;
    initStageScreen();
    showScreen('stage', 'right');
});
document.getElementById('btn-review-title').addEventListener('click', () => {
    initReviewScreen();
    showScreen('review', 'right');
});

// ===================== キャラクター選択 =====================
function initCharacterScreen() {
    const grid = document.getElementById('character-grid');
    grid.innerHTML = '';
    CHARACTERS.forEach(c => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.dataset.id = c.id;
        const statBars = ['atk', 'mag', 'def'].map(s => `
      <div class="char-stat-row"><span>${s.toUpperCase()}</span></div>
      <div class="char-stat-bar"><div class="char-stat-fill" style="width:${c.stats[s]}%;background:${c.color}"></div></div>
    `).join('');
        card.innerHTML = `
      <span class="char-emoji">${c.emoji}</span>
      <div class="char-name" style="color:${c.color}">${c.name}</div>
      <div class="char-type">${c.type}</div>
      <div class="char-stat">${statBars}</div>
      <div style="font-size:10px;color:#9ba0c8;margin-top:.5rem;line-height:1.3">${c.description}</div>
    `;
        card.addEventListener('click', () => selectCharacter(c.id));
        grid.appendChild(card);
    });

    const nameInput = document.getElementById('player-name');
    nameInput.value = '';
    nameInput.addEventListener('input', updateSelectBtn);
}

let selectedCharId = null;
function selectCharacter(id) {
    selectedCharId = id;
    document.querySelectorAll('.char-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.id === id);
    });
    updateSelectBtn();
}
function updateSelectBtn() {
    const name = document.getElementById('player-name').value.trim();
    document.getElementById('btn-select-char').disabled = !selectedCharId || !name;
}

document.getElementById('btn-back-to-title').addEventListener('click', () => showScreen('title', 'left'));
document.getElementById('btn-select-char').addEventListener('click', () => {
    state.player = CHARACTERS.find(c => c.id === selectedCharId);
    state.playerName = document.getElementById('player-name').value.trim() || '勇者';
    state.level = 1;
    state.exp = 0;
    state.totalExp = 0;
    state.stagesCleared = [];
    state.wrongQuestions = [];
    state.combo = 0;
    initStageScreen();
    showScreen('stage', 'right');
});

// ===================== ステージ選択 =====================
function initStageScreen() {
    renderPlayerStatusBar();
    const map = document.getElementById('stage-map');
    map.innerHTML = '';

    // 単元ごとにセクション分け
    const units = [...new Set(STAGES.map(s => s.unit))];
    units.forEach(unit => {
        const secTitle = document.createElement('div');
        secTitle.className = 'stage-section-title';
        secTitle.textContent = `⚡ ${unit}`;
        map.appendChild(secTitle);

        STAGES.filter(s => s.unit === unit).forEach(stage => {
            const card = document.createElement('div');
            const isCleared = state.stagesCleared.includes(stage.id);
            const isLocked = state.level < stage.minLevel;
            card.className = `stage-card${isLocked ? ' locked' : ''}${isCleared ? ' cleared' : ''}`;
            card.innerHTML = `
        <div class="stage-icon">${isLocked ? '🔒' : stage.emoji}</div>
        <div class="stage-info">
          <div class="stage-name">${stage.name}</div>
          <div class="stage-desc">${stage.desc}</div>
          <div class="stage-meta">
            <span class="stage-tag ${stage.difficulty}">${diffLabel(stage.difficulty)}</span>
            <span class="stage-tag">${stage.qCount}問</span>
            <span class="stage-tag">Lv.${stage.minLevel}〜</span>
          </div>
        </div>
        <div class="stage-card-status">${isCleared ? '✅' : isLocked ? '🔒' : '▶'}</div>
      `;
            if (!isLocked) {
                card.addEventListener('click', () => startStage(stage));
            }
            map.appendChild(card);
        });
    });
}

function diffLabel(d) {
    return d === 'easy' ? '⭐ Easy' : d === 'normal' ? '⭐⭐ Normal' : '⭐⭐⭐ Hard';
}

function renderPlayerStatusBar() {
    const bar = document.getElementById('player-status-bar');
    const levelData = LEVEL_TABLE[state.level - 1];
    const nextData = LEVEL_TABLE[state.level] || null;
    const expForNext = nextData ? nextData.expRequired - levelData.expRequired : 999;
    const expProgress = nextData ? ((state.exp - levelData.expRequired) / expForNext * 100) : 100;
    const expDisplay = nextData
        ? `${state.exp - levelData.expRequired} / ${expForNext} EXP`
        : 'MAX';

    bar.innerHTML = `
    <div class="status-char-icon">${state.player?.emoji ?? '⚔️'}</div>
    <div class="status-info">
      <div class="status-name-lv">
        <span class="status-name">${state.playerName}</span>
        <span class="status-lv">Lv.${state.level}</span>
      </div>
      <div class="status-title-name">${levelData?.title ?? ''}</div>
      <div class="status-exp-bar">
        <div class="status-exp-label">EXP</div>
        <div class="exp-bar"><div class="exp-bar-fill" style="width:${Math.min(expProgress, 100)}%"></div></div>
      </div>
      <div class="status-total-exp">累計 ${state.totalExp} EXP</div>
    </div>
    <div class="status-exp-label" style="text-align:right;font-size:10px;color:#9ba0c8">${expDisplay}</div>
  `;
}

document.getElementById('btn-back-to-char').addEventListener('click', () => {
    initCharacterScreen();
    showScreen('character', 'left');
});

// ===================== バトル開始 =====================
function startStage(stage) {
    state.currentStage = stage;
    state.currentStageIndex = 0;
    state.correctCount = 0;
    state.wrongCount = 0;
    state.combo = 0;
    state.maxCombo = 0;

    // 問題キューを作成
    const qs = stage.questIds.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    state.questionQueue = qs;
    state.currentQIndex = 0;

    showScreen('battle', 'right');
    loadQuestion();
}

// ===================== 問題ロード =====================
function loadQuestion() {
    const q = state.questionQueue[state.currentQIndex];
    if (!q) { endStage(); return; }

    // 敵情報
    const enemyKey = q.enemyType || 'default';
    const enemyData = ENEMY_SPRITES[enemyKey] || ENEMY_SPRITES['default'];
    state.enemyMaxHp = enemyData.maxHp;
    state.enemyHp = enemyData.maxHp;

    // ヘッダー
    updateBattleHeader(q);

    // 敵表示
    document.getElementById('enemy-name').textContent = q.enemyType;
    document.getElementById('enemy-sprite').textContent = enemyData.emoji;
    document.getElementById('enemy-sprite').style.filter = `drop-shadow(0 0 20px ${enemyData.color}80)`;
    updateEnemyHpBar();
    document.getElementById('battle-message').textContent = q.battleMessage;

    // ヒント非表示
    document.getElementById('hint-box').classList.add('hidden');

    // 問題メタ
    document.getElementById('q-unit-badge').textContent = q.unit;
    const diffEl = document.getElementById('q-difficulty');
    diffEl.textContent = diffLabel(q.difficulty);
    diffEl.className = 'q-difficulty ' + q.difficulty;
    document.getElementById('q-number').textContent = `${state.currentQIndex + 1}/${state.questionQueue.length}`;

    // 問題テキスト
    document.getElementById('question-text').textContent = q.question;

    // 選択肢
    const grid = document.getElementById('choices-grid');
    grid.innerHTML = '';
    const shuffled = shuffleArray([...q.choices]);
    shuffled.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.addEventListener('click', () => answerQuestion(choice, q));
        grid.appendChild(btn);
    });

    // ヒントボタン
    const hintBtn = document.getElementById('btn-hint');
    hintBtn.disabled = false;
    hintBtn.onclick = () => showHint(q);

    // コンボ表示
    const comboEl = document.getElementById('combo-display');
    if (state.combo >= 2) {
        comboEl.classList.remove('hidden');
        document.getElementById('combo-count').textContent = state.combo;
    } else {
        comboEl.classList.add('hidden');
    }

    // タイマー
    if (state.timerOn) startTimer(q);
    else { document.getElementById('timer-display').textContent = ''; }
}

function updateBattleHeader(q) {
    const levelData = LEVEL_TABLE[state.level - 1];
    const nextData = LEVEL_TABLE[state.level] || null;
    const expProgress = nextData
        ? Math.min(((state.exp - levelData.expRequired) / (nextData.expRequired - levelData.expRequired)) * 100, 100)
        : 100;
    document.getElementById('battle-player-info').innerHTML = `
    <div class="bp-name">${state.player?.emoji} ${state.playerName}</div>
    <div class="bp-lv">Lv.${state.level} ${levelData?.title ?? ''}</div>
    <div class="bp-exp-mini"><div class="bp-exp-fill" style="width:${expProgress}%"></div></div>
  `;
    document.getElementById('battle-stage-info').innerHTML = `
    <div class="bsi-stage">${state.currentStage?.emoji} ${state.currentStage?.name}</div>
    <div class="bsi-q">問題 ${state.currentQIndex + 1}/${state.questionQueue.length}</div>
    ${state.combo >= 2 ? `<div class="bsi-combo">🔥 ${state.combo}コンボ！</div>` : ''}
  `;
}

// ===================== タイマー =====================
function startTimer(q) {
    clearInterval(state.timerInterval);
    state.timerSec = CONFIG.TIMER_SECONDS;
    const timerEl = document.getElementById('timer-display');
    const timerSec = document.getElementById('timer-sec');
    timerEl.className = 'timer-display';
    timerSec.textContent = state.timerSec;

    state.timerInterval = setInterval(() => {
        state.timerSec--;
        timerSec.textContent = state.timerSec;
        if (state.timerSec <= 10) timerEl.classList.add('danger');
        if (state.timerSec <= 0) {
            clearInterval(state.timerInterval);
            // 時間切れ = 不正解扱い
            answerQuestion('__TIMEOUT__', q);
        }
    }, 1000);
}

// ===================== 回答処理 =====================
function answerQuestion(selected, q) {
    clearInterval(state.timerInterval);
    const isTimeout = selected === '__TIMEOUT__';
    const isCorrect = !isTimeout && selected === q.answer;

    // ボタン無効化 & 色付け
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.answer) btn.classList.add('correct');
        else if (!isTimeout && btn.textContent === selected) btn.classList.add('wrong');
    });

    // 経験値計算
    let earnedExp = 0;
    if (isCorrect) {
        state.combo++;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;
        state.correctCount++;
        earnedExp = q.exp;
        // キャラの経験値ボーナス
        earnedExp = Math.floor(earnedExp * (state.player?.expBonus ?? 1));
        // コンボボーナス
        if (state.combo >= CONFIG.COMBO_BONUS_THRESHOLD) {
            earnedExp = Math.floor(earnedExp * (1 + CONFIG.COMBO_BONUS_RATE));
        }
        // 敵にダメージ
        const dmg = Math.floor(earnedExp * (state.player?.atkBonus ?? 1));
        damageEnemy(dmg);
        playAttackEffect(state.player?.emoji ?? '⚔️');
    } else {
        state.combo = 0;
        state.wrongCount++;
        earnedExp = CONFIG.WRONG_EXP_BONUS;
        // 復習リストに追加
        addToReview(q, selected);
        shakeScreen();
    }

    // EXP加算
    const prevLevel = state.level;
    addExp(earnedExp);
    const didLevelUp = state.level > prevLevel;

    // エフェクト画面へ
    setTimeout(() => {
        showResultEffect(isCorrect, isTimeout, q, earnedExp, didLevelUp, prevLevel);
    }, isCorrect ? 600 : 300);
}

function addExp(amount) {
    state.exp += amount;
    state.totalExp += amount;
    // レベルアップチェック
    while (state.level < CONFIG.MAX_LEVEL) {
        const next = LEVEL_TABLE[state.level];
        if (next && state.exp >= next.expRequired) {
            state.level++;
        } else break;
    }
    saveGame();
}

function addToReview(q, yourAnswer) {
    // 既にある場合は更新
    const existing = state.wrongQuestions.findIndex(w => w.id === q.id);
    const entry = { id: q.id, unit: q.unit, difficulty: q.difficulty, question: q.question, answer: q.answer, yourAnswer: yourAnswer || '時間切れ', explanation: q.explanation, choices: q.choices };
    if (existing >= 0) state.wrongQuestions[existing] = entry;
    else state.wrongQuestions.push(entry);
    saveGame();
}

// ===================== 敵HP =====================
function damageEnemy(dmg) {
    state.enemyHp = Math.max(0, state.enemyHp - dmg);
    updateEnemyHpBar();
    const sprite = document.getElementById('enemy-sprite');
    sprite.classList.remove('hit');
    void sprite.offsetWidth;
    sprite.classList.add('hit');
}

function updateEnemyHpBar() {
    const pct = state.enemyHp / state.enemyMaxHp * 100;
    const fill = document.getElementById('enemy-hp-fill');
    fill.style.width = pct + '%';
    fill.className = 'enemy-hp-fill' + (pct <= 30 ? ' hp-low' : pct <= 60 ? ' hp-mid' : '');
    document.getElementById('enemy-hp-text').textContent = `${state.enemyHp}/${state.enemyMaxHp}`;
}

// ===================== 攻撃エフェクト =====================
function playAttackEffect(emoji) {
    const el = document.createElement('div');
    el.className = 'atk-effect';
    el.textContent = emoji;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
}

function shakeScreen() {
    document.getElementById('screen-battle').style.animation = 'none';
    document.getElementById('screen-battle').style.transform = 'translateX(-8px)';
    setTimeout(() => {
        document.getElementById('screen-battle').style.transform = 'translateX(8px)';
        setTimeout(() => { document.getElementById('screen-battle').style.transform = ''; }, 100);
    }, 100);
}

// ===================== 正解/不正解エフェクト画面 =====================
function showResultEffect(isCorrect, isTimeout, q, earnedExp, didLevelUp, prevLevel) {
    const screen = document.getElementById('screen-result-effect');
    screen.className = 'screen active fade-in ' + (isCorrect ? 'correct-bg' : 'wrong-bg');

    const partnerMsg = isCorrect
        ? CONFIG.PARTNER_MESSAGES_CORRECT[Math.floor(Math.random() * CONFIG.PARTNER_MESSAGES_CORRECT.length)]
        : CONFIG.PARTNER_MESSAGES_WRONG[Math.floor(Math.random() * CONFIG.PARTNER_MESSAGES_WRONG.length)];

    const content = document.getElementById('result-effect-content');
    content.innerHTML = `
    <div class="effect-badge">${isCorrect ? '🎉' : (isTimeout ? '⏰' : '💢')}</div>
    <div class="effect-title ${isCorrect ? 'correct' : 'wrong'}">
      ${isCorrect ? 'せいかい！' : (isTimeout ? '時間切れ…' : 'ざんねん…')}
    </div>
    ${isCorrect ? `<div class="effect-exp">+ ${earnedExp} EXP ⭐</div>` : `<div class="effect-exp">+ ${earnedExp} EXP</div>`}
    ${state.combo >= CONFIG.COMBO_BONUS_THRESHOLD && isCorrect ? `<div style="color:#ff9800;font-weight:900;font-size:1.1rem">🔥 ${state.combo}コンボ！ボーナスあり！</div>` : ''}
    <div class="effect-explanation">
      <strong>📖 解説:</strong><br>${q.explanation}
    </div>
    <div class="effect-partner-msg">
      <span class="effect-partner-icon">${isCorrect ? '🧚' : '🤗'}</span>
      <span>${partnerMsg}</span>
    </div>
    <button class="btn-next-q" id="btn-next-q">
      ${state.currentQIndex + 1 >= state.questionQueue.length ? 'ステージクリア！🏆' : '次の問題へ ▶'}
    </button>
  `;

    document.getElementById('btn-next-q').addEventListener('click', () => {
        if (didLevelUp) {
            showLevelUpScreen(state.level, prevLevel);
        } else {
            nextQuestion();
        }
    });
}

// ===================== 次の問題 =====================
function nextQuestion() {
    state.currentQIndex++;
    if (state.currentQIndex >= state.questionQueue.length) {
        endStage();
    } else {
        showScreen('battle', 'right');
        loadQuestion();
    }
}

// ===================== ステージ終了 =====================
function endStage() {
    if (!state.stagesCleared.includes(state.currentStage.id)) {
        state.stagesCleared.push(state.currentStage.id);
    }
    saveGame();

    const acc = state.correctCount / state.questionQueue.length;
    const stars = acc >= 0.9 ? '⭐⭐⭐' : acc >= 0.6 ? '⭐⭐' : '⭐';

    document.getElementById('clear-stars').textContent = stars;
    document.getElementById('clear-stats').innerHTML = `
    <div class="clear-stat-row"><span class="clear-stat-label">正解</span><span class="clear-stat-val">${state.correctCount}問</span></div>
    <div class="clear-stat-row"><span class="clear-stat-label">不正解</span><span class="clear-stat-val">${state.wrongCount}問</span></div>
    <div class="clear-stat-row"><span class="clear-stat-label">最大コンボ</span><span class="clear-stat-val">${state.maxCombo}コンボ</span></div>
    <div class="clear-stat-row"><span class="clear-stat-label">累計EXP</span><span class="clear-stat-val">${state.totalExp} EXP</span></div>
    <div class="clear-stat-row"><span class="clear-stat-label">現在レベル</span><span class="clear-stat-val">Lv.${state.level}</span></div>
  `;
    showScreen('stage-clear', 'fade');
}

// ===================== レベルアップ =====================
function showLevelUpScreen(newLevel, prevLevel) {
    const data = LEVEL_TABLE[newLevel - 1];
    document.getElementById('levelup-level').textContent = `Lv. ${newLevel}`;
    document.getElementById('levelup-title-name').textContent = data?.title ?? '';
    document.getElementById('levelup-bonus').textContent = data?.bonus ?? '';
    document.getElementById('levelup-char').textContent = state.player?.emoji ?? '⚔️';

    // 花火エフェクト
    const fw = document.getElementById('levelup-fireworks');
    fw.innerHTML = '';
    const colors = ['#f5c842', '#ce93d8', '#4fc3f7', '#81c784', '#f06292'];
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'fw-particle';
        const angle = (i / 20) * 360;
        const dist = 80 + Math.random() * 80;
        const tx = Math.cos(angle * Math.PI / 180) * dist;
        const ty = Math.sin(angle * Math.PI / 180) * dist;
        p.style.cssText = `left:50%;top:40%;background:${colors[i % colors.length]};--tx:${tx}px;--ty:${ty}px;animation-delay:${Math.random() * .3}s`;
        fw.appendChild(p);
    }

    showScreen('levelup', 'fade');
}

document.getElementById('btn-levelup-continue').addEventListener('click', () => {
    nextQuestion();
});

// ステージクリア後のボタン
document.getElementById('btn-next-stage').addEventListener('click', () => {
    // 次のステージを自動選択（現在のステージの次）
    const curIdx = STAGES.findIndex(s => s.id === state.currentStage.id);
    const next = STAGES[curIdx + 1];
    if (next && state.level >= next.minLevel) {
        startStage(next);
    } else {
        initStageScreen();
        showScreen('stage', 'left');
    }
});
document.getElementById('btn-back-to-map').addEventListener('click', () => {
    initStageScreen();
    showScreen('stage', 'left');
});

// ===================== ヒント =====================
function showHint(q) {
    const hints = {
        '正負の数': 'プラス×マイナス＝マイナス、マイナス×マイナス＝プラス、を思い出そう！',
        '文字式': '同じ文字がついた項だけをまとめられるよ',
        '1次方程式': '等式の両辺に同じ操作をしても等式は成り立つ！',
        '比例と反比例': 'y＝ax が比例（aは定数）、y＝a/x が反比例だよ',
        '図形': '面積・体積の公式を思い出してみよう'
    };
    const hint = hints[q.unit] || 'もう一度問題を読み直してみよう！';
    document.getElementById('hint-text').textContent = `💡 ${hint}`;
    document.getElementById('hint-box').classList.remove('hidden');
    document.getElementById('btn-hint').disabled = true;
    state.hintsUsed++;
}

// ===================== 復習画面 =====================
function initReviewScreen() {
    const list = document.getElementById('review-list');
    list.innerHTML = '';
    if (state.wrongQuestions.length === 0) {
        list.innerHTML = `<div class="review-empty">📚 まだ間違えた問題はないよ！<br>どんどん冒険を進めよう！</div>`;
        return;
    }
    state.wrongQuestions.forEach(w => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
      <div class="review-q-meta">
        <span class="q-unit-badge">${w.unit}</span>
        <span class="q-difficulty ${w.difficulty}">${diffLabel(w.difficulty)}</span>
      </div>
      <div class="review-q-text">${w.question}</div>
      <div class="review-your-ans">あなたの答え: ${w.yourAnswer || '（未回答）'}</div>
      <div class="review-correct-ans">✅ 正しい答え: ${w.answer}</div>
      <div class="review-explanation">${w.explanation}</div>
    `;
        list.appendChild(card);
    });
}

document.getElementById('btn-back-from-review').addEventListener('click', () => showScreen('title', 'left'));

// ===================== 設定モーダル =====================
document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('modal-settings').classList.remove('hidden');
});
document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('modal-settings').classList.add('hidden');
    saveGame();
});
document.getElementById('timer-toggle').addEventListener('change', e => {
    state.timerOn = e.target.checked;
});
document.getElementById('bgm-volume').addEventListener('input', e => {
    state.bgmVolume = +e.target.value;
});
document.getElementById('sfx-volume').addEventListener('input', e => {
    state.sfxVolume = +e.target.value;
});
document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('セーブデータをリセットしますか？（取り消せません）')) {
        localStorage.removeItem(CONFIG.SAVE_KEY);
        location.reload();
    }
});

// ===================== ユーティリティ =====================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ===================== 初期化 =====================
function init() {
    initParticles();
    initTitleScreen();
    // レベルテーブルを確認・補完
    if (typeof LEVEL_TABLE === 'undefined') {
        console.error('LEVEL_TABLE が見つかりません。questions.js を確認してください。');
    }
    showScreen('title', 'fade');
}

init();
