// ==========================================
// ABRSM Grade 5 Music Theory Quiz Application
// Version 2.0
// ==========================================

// ===================
// CONFIGURATION
// ===================

const CONFIG = {
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL_HERE',
    TEACHER_PASSWORD: 'teacher123',
    
    AVAILABLE_PAPERS: {
        '2020': ['Paper O'],
        '2021': ['Paper A', 'Paper B'],
        '2022': ['Paper A', 'Paper B', 'Paper C'],
        '2023': ['Paper A', 'Paper B'],
        '2024': ['Paper A', 'Paper B']
    },
    
    QUESTION_TYPES: [
        { id: '1.1', name: 'Time Signatures', section: 'rhythm' },
        { id: '1.2', name: 'Simple/Compound', section: 'rhythm' },
        { id: '1.3', name: 'Note Values', section: 'rhythm' },
        { id: '1.4', name: 'Grouping', section: 'rhythm' },
        { id: '1.5', name: 'Rests', section: 'rhythm' },
        { id: '2.1', name: 'Note Names', section: 'pitch' },
        { id: '2.2', name: 'Enharmonic', section: 'pitch' },
        { id: '2.3', name: 'Transposition', section: 'pitch' },
        { id: '2.4', name: 'Octave Comparison', section: 'pitch' },
        { id: '3.1', name: 'Key Sig (Major)', section: 'keys' },
        { id: '3.2', name: 'Key Sig (Minor)', section: 'keys' },
        { id: '3.3', name: 'Identify Key', section: 'keys' },
        { id: '3.4', name: 'Complete Scale', section: 'keys' },
        { id: '3.5', name: 'Scale Types', section: 'keys' },
        { id: '3.6', name: 'Chromatic', section: 'keys' },
        { id: '3.7', name: 'Technical Names', section: 'keys' },
        { id: '4.1', name: 'Name Intervals', section: 'intervals' },
        { id: '4.2', name: 'Interval Types', section: 'intervals' },
        { id: '4.3', name: 'Write Intervals', section: 'intervals' },
        { id: '5.1', name: 'Progressions', section: 'chords' },
        { id: '5.2', name: 'Cadences', section: 'chords' },
        { id: '5.3', name: 'Chord Names', section: 'chords' },
        { id: '6.1', name: 'Terms', section: 'terms' },
        { id: '6.2', name: 'Ornaments', section: 'terms' },
        { id: '6.3', name: 'Instruments', section: 'terms' },
        { id: '7.x', name: 'Context', section: 'context' }
    ],
    
    EXAM_DURATION: 7200
};

// ===================
// STATE
// ===================

let state = {
    mode: null,
    currentQuestion: 0,
    questions: [],
    answers: {},
    questionResults: {},
    session: { startTime: null, attempted: 0, correct: 0, byType: {} },
    selectedType: null,
    selectedYear: null,
    selectedPaper: null,
    timeRemaining: CONFIG.EXAM_DURATION,
    timerInterval: null,
    currentUser: null,
    pendingMode: null,
    userRole: null
};

// ===================
// QUESTIONS DATABASE
// ===================

const questionsDB = {
    '2020-papero': {
        '1.1': [
            { id: '2020-a-1.1a', type: 'multiple-choice', marks: 1, question: 'Select the correct time signature for this bar:', image: '2020/paper-o/q1.1a.png', options: ['9/8', '4/4', '7/8'], correctAnswer: '9/8' },
            { id: '2020-a-1.1b', type: 'multiple-choice', marks: 1, question: 'Select the correct time signature for this bar:', image: '2020/paper-o/q1.1b.png', options: ['5/4', '9/8', '4/4'], correctAnswer: '4/4' },
            { id: '2020-a-1.1c', type: 'multiple-choice', marks: 1, question: 'Select the correct time signature for this bar:', image: '2020/paper-o/q1.1c.png', options: ['6/8', '7/8', '5/8'], correctAnswer: '7/8' }
        ],
        '1.2': [
            { id: '2020-a-1.2', type: 'multiple-choice', marks: 1, question: 'Which shows this 12/8 bar correctly rewritten in simple time?', image: '2020/paper-o/q1.2.png', options: ['Option A (with triplets and dotted rest)', 'Option B (with triplets and crotchet rest)', 'Option C (without triplets)'], correctAnswer: 'Option A (with triplets and dotted rest)' }
        ],
        '1.3': [
            { id: '2020-a-1.3a', type: 'fill-blank', marks: 1, question: 'In 6/8 time, there are ___ dotted-quaver beats in a bar.', correctAnswer: '2' },
            { id: '2020-a-1.3b', type: 'fill-blank', marks: 1, question: 'A breve is equal to ___ crotchet(s).', correctAnswer: '8' }
        ],
        '1.4': [
            { id: '2020-a-1.4', type: 'multiple-choice', marks: 1, question: 'In 9/4 time, which bar shows correct note grouping?', image: '2020/paper-o/q1.4.png', options: ['Bar 1 (ending with dotted minim)', 'Bar 2 (ending with semibreve)', 'Bar 3'], correctAnswer: 'Bar 1 (ending with dotted minim)' }
        ],
        '1.5': [
            { id: '2020-a-1.5', type: 'tick-boxes', marks: 3, question: 'Tick (✓) or cross (✗) to show whether each rest is correct:', image: '2020/paper-o/q1.5.png', elements: [{ label: 'Rest 1', correct: true }, { label: 'Rest 2', correct: false }, { label: 'Rest 3', correct: true }] }
        ],
        '2.1': [
            { id: '2020-a-2.1', type: 'multiple-choice', marks: 1, question: 'Name this note (alto clef):', image: '2020/paper-o/q2.1.png', options: ['G', 'B', 'F', 'A'], correctAnswer: 'B' }
        ],
        '2.2': [
            { id: '2020-a-2.2', type: 'multiple-choice', marks: 1, question: 'Select the enharmonic equivalent:', image: '2020/paper-o/q2.2.png', options: ['D', 'D♭', 'B♯', 'C'], correctAnswer: 'D♭' }
        ],
        '2.3': [
            { id: '2020-a-2.3', type: 'tick-boxes', marks: 5, question: 'This clarinet in A part has been transposed down a minor 3rd. Check each element:', image: '2020/paper-o/q2.3.png', elements: [{ label: 'Key sig', correct: true }, { label: 'Note 1', correct: false }, { label: 'Note 2', correct: true }, { label: 'Note 3', correct: false }, { label: 'Note 4', correct: true }] }
        ],
        '2.4': [
            { id: '2020-a-2.4', type: 'true-false-multi', marks: 3, question: 'Compare bars A, B and C:', image: '2020/paper-o/q2.4.png', statements: [{ text: 'A and B are at the same pitch', correct: false }, { text: 'B is one octave lower than C', correct: true }, { text: 'C is one octave higher than A', correct: false }] }
        ],
        '3.1': [
            { id: '2020-a-3.1', type: 'multiple-choice', marks: 1, question: 'Which shows B major key signature correctly?', image: '2020/paper-o/q3.1.png', options: ['Alto clef', 'Treble clef', 'Bass clef', 'Tenor clef'], correctAnswer: 'Bass clef' }
        ],
        '3.2': [
            { id: '2020-a-3.2', type: 'multiple-choice', marks: 1, question: 'Which shows E♭ minor key signature correctly?', image: '2020/paper-o/q3.2.png', options: ['Treble clef', 'Bass clef', 'Alto clef', 'Tenor clef'], correctAnswer: 'Bass clef' }
        ],
        '3.3': [
            { id: '2020-a-3.3a', type: 'multiple-choice', marks: 1, question: 'What is the key of this melody?', image: '2020/paper-o/q3.3a.png', options: ['G minor', 'D major', 'G major', 'F♯ major'], correctAnswer: 'G major' },
            { id: '2020-a-3.3b', type: 'multiple-choice', marks: 1, question: 'What is the key of this melody?', image: '2020/paper-o/q3.3b.png', options: ['D major', 'B minor', 'F♯ minor', 'A major'], correctAnswer: 'B minor' },
            { id: '2020-a-3.3c', type: 'multiple-choice', marks: 1, question: 'What is the key of this melody?', image: '2020/paper-o/q3.3c.png', options: ['A major', 'G♯ minor', 'B major', 'E major'], correctAnswer: 'E major' }
        ],
        '3.4': [
            { id: '2020-a-3.4', type: 'matching', marks: 2, question: 'Complete the B♭ harmonic minor scale:', image: '2020/paper-o/q3.4.png', pairs: [{ label: 'Note X', options: ['A♭', 'B♮', 'A', 'A𝄫'], correct: 'A' }, { label: 'Note Y', options: ['G', 'G♭', 'G𝄫', 'F♭'], correct: 'G♭' }] }
        ],
        '3.5': [
            { id: '2020-a-3.5', type: 'matching', marks: 3, question: 'Select the correct clef for each minor scale:', image: '2020/paper-o/q3.5.png', pairs: [{ label: 'Scale (a)', options: ['Treble', 'Bass', 'Alto'], correct: 'Treble' }, { label: 'Scale (b)', options: ['Treble', 'Bass', 'Alto'], correct: 'Bass' }, { label: 'Scale (c)', options: ['Treble', 'Bass', 'Alto'], correct: 'Alto' }] }
        ],
        '3.6': [
            { id: '2020-a-3.6', type: 'true-false-multi', marks: 2, question: 'Are these chromatic scales correct?', image: '2020/paper-o/q3.6.png', statements: [{ text: 'Chromatic scale (a)', correct: true }, { text: 'Chromatic scale (b)', correct: false }] }
        ],
        '3.7': [
            { id: '2020-a-3.7', type: 'true-false-multi', marks: 3, question: 'Are these technical names correct?', statements: [{ text: 'A♯ is the leading note in B major', correct: true }, { text: 'D is the subdominant in A minor', correct: false }, { text: 'D is the submediant in F♯ minor', correct: true }] }
        ],
        '4.1': [
            { id: '2020-a-4.1a', type: 'multiple-choice', marks: 1, question: 'Name this interval:', image: '2020/paper-o/q4.1a.png', options: ['Major 10th', 'Compound perfect 4th', 'Augmented 11th', 'Compound dim 4th'], correctAnswer: 'Compound perfect 4th' },
            { id: '2020-a-4.1b', type: 'multiple-choice', marks: 1, question: 'Name this interval:', image: '2020/paper-o/q4.1b.png', options: ['Diminished 5th', 'Perfect 5th', 'Augmented 4th', 'Major 4th'], correctAnswer: 'Diminished 5th' },
            { id: '2020-a-4.1c', type: 'multiple-choice', marks: 1, question: 'Name this interval:', image: '2020/paper-o/q4.1c.png', options: ['Compound minor 2nd', 'Major 2nd', 'Major 9th', 'Minor 10th'], correctAnswer: 'Major 9th' }
        ],
        '4.2': [
            { id: '2020-a-4.2a', type: 'multiple-choice', marks: 1, question: 'What type is this interval?', image: '2020/paper-o/q4.2a.png', options: ['Perfect', 'Major', 'Minor', 'Diminished', 'Augmented'], correctAnswer: 'Minor' },
            { id: '2020-a-4.2b', type: 'multiple-choice', marks: 1, question: 'What type is this interval?', image: '2020/paper-o/q4.2b.png', options: ['Perfect', 'Major', 'Minor', 'Diminished', 'Augmented'], correctAnswer: 'Major' },
            { id: '2020-a-4.2c', type: 'multiple-choice', marks: 1, question: 'What type is this interval?', image: '2020/paper-o/q4.2c.png', options: ['Perfect', 'Major', 'Minor', 'Diminished', 'Augmented'], correctAnswer: 'Diminished' }
        ],
        '4.3': [
            { id: '2020-a-4.3', type: 'matching', marks: 4, question: 'Match intervals with upper notes:', pairs: [{ label: 'Compound P5 above G♯', options: ['D♯', 'E♯', 'D', 'E'], correct: 'D♯' }, { label: 'Minor 7th above B♭', options: ['A♭', 'A', 'G♯', 'G'], correct: 'A♭' }, { label: 'Aug 12th above C', options: ['G♯', 'G', 'F♯', 'A♭'], correct: 'G♯' }, { label: 'Minor 3rd above A', options: ['C', 'C♯', 'B', 'D'], correct: 'C' }] }
        ],
        '5.1': [
            { id: '2020-a-5.1', type: 'chord-progression', marks: 5, question: 'Select chords (I, II, IV, V) for the cadences:', image: '2020/paper-o/q5.1.png', slots: ['Chord 1', 'Chord 2', 'Chord 3', 'Chord 4', 'Chord 5'], options: ['I', 'II', 'IV', 'V'], correctAnswers: ['II', 'V', 'I', 'IV', 'I'] }
        ],
        '5.2': [
            { id: '2020-a-5.2a', type: 'multiple-choice', marks: 1, question: 'Name this cadence (D major):', image: '2020/paper-o/q5.2a.png', options: ['Imperfect', 'Plagal', 'Perfect'], correctAnswer: 'Perfect' },
            { id: '2020-a-5.2b', type: 'multiple-choice', marks: 1, question: 'Name this cadence (F major):', image: '2020/paper-o/q5.2b.png', options: ['Perfect', 'Plagal', 'Imperfect'], correctAnswer: 'Plagal' }
        ],
        '5.3': [
            { id: '2020-a-5.3', type: 'matching', marks: 3, question: 'Name each chord in C minor:', image: '2020/paper-o/q5.3.png', pairs: [{ label: 'Chord A', options: ['Va', 'Ic', 'IVb', 'Ib'], correct: 'Ic' }, { label: 'Chord B', options: ['Ic', 'Vb', 'IVb', 'IVc'], correct: 'IVb' }, { label: 'Chord C', options: ['Ic', 'IIa', 'Vb', 'Va'], correct: 'Va' }] }
        ],
        '6.1': [
            { id: '2020-a-6.1', type: 'matching', marks: 3, question: 'Match terms with meanings:', pairs: [{ label: 'morendo', options: ['Dying away', 'Getting louder', 'Playful', 'Agitated'], correct: 'Dying away' }, { label: 'largamente', options: ['Majestic', 'Broadly', 'Very slow', 'Expressive'], correct: 'Broadly' }, { label: 'mesto', options: ['Rather slow', 'Less', 'Calm', 'Sad'], correct: 'Sad' }] }
        ],
        '6.2': [
            { id: '2020-a-6.2a', type: 'multiple-choice', marks: 1, question: 'Name this ornament:', image: '2020/paper-o/q6.2a.png', options: ['Appoggiatura', 'Upper turn', 'Trill', 'Upper mordent'], correctAnswer: 'Trill' },
            { id: '2020-a-6.2b', type: 'multiple-choice', marks: 1, question: 'Name this ornament:', image: '2020/paper-o/q6.2b.png', options: ['Acciaccatura', 'Upper turn', 'Trill', 'Lower mordent'], correctAnswer: 'Upper turn' }
        ],
        '6.3': [
            { id: '2020-a-6.3', type: 'true-false-multi', marks: 5, question: 'Are these statements true or false?', statements: [{ text: 'Flute plays higher than bassoon', correct: true }, { text: 'Trumpet is a woodwind', correct: false }, { text: 'Cymbals have definite pitch', correct: false }, { text: 'Horn uses double reed', correct: false }, { text: 'Mezzo-soprano is lower than soprano', correct: true }] }
        ],
        '7.x': [
            { id: '2020-a-7.1', type: 'multiple-choice', marks: 1, question: 'Which is correctly written one octave lower?', image: '2020/paper-o/q7.1.png', options: ['Only A', 'Only B and C', 'A, B and C', 'Only A and B'], correctAnswer: 'Only A' },
            { id: '2020-a-7.2', type: 'true-false-multi', marks: 5, question: 'Study the Vivace piece:', image: '2020/paper-o/q7.2.png', statements: [{ text: 'Beginning should be played lightly', correct: true }, { text: 'Ends on subdominant of F♯ minor', correct: false }, { text: 'Largest interval in bar 7 LH is major 3rd', correct: true }, { text: 'Highest note is C♯', correct: false }, { text: 'Gets quieter in bar 7', correct: false }] },
            { id: '2020-a-7.3', type: 'multiple-choice', marks: 1, question: 'Which instrument suits bars 3-4?', options: ['Bassoon', 'Oboe', 'Trombone', 'Double bass'], correctAnswer: 'Oboe' },
            { id: '2020-a-7.4', type: 'multiple-choice', marks: 1, question: 'How many times does mediant appear in LH?', options: ['4', '5', '6', '8'], correctAnswer: '6' },
            { id: '2020-a-7.5a', type: 'fill-blank', marks: 1, question: 'Bar 3 has same rhythm as bar ___.', correctAnswer: '2' },
            { id: '2020-a-7.5b', type: 'fill-blank', marks: 1, question: 'There is a diminuendo in bar ___.', correctAnswer: '5' }
        ]
    }
};

// ===================
// INITIALIZATION
// ===================

document.addEventListener('DOMContentLoaded', () => {
    checkSavedLogin();
    buildTypeSelector();
    buildYearPaperSelector();
});

function checkSavedLogin() {
    const saved = localStorage.getItem('musicTheoryUser');
    if (saved) {
        state.currentUser = JSON.parse(saved);
        updateUserDisplay();
    }
}

function updateUserDisplay() {
    const display = document.getElementById('userDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (state.currentUser) {
        display.textContent = state.currentUser.name;
        display.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        display.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

// ===================
// LOGIN/LOGOUT
// ===================

function showLogin(role) {
    state.userRole = role;
    document.getElementById('loginTitle').textContent = role === 'teacher' ? 'Teacher Login' : 'Student Login';
    document.getElementById('passwordGroup').classList.toggle('hidden', role === 'student');
    document.getElementById('loginModal').classList.add('show');
}

function closeModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginName').value = '';
    document.getElementById('loginPassword').value = '';
}

function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!name) return alert('Please enter your name');
    
    if (state.userRole === 'teacher') {
        if (password === CONFIG.TEACHER_PASSWORD) {
            state.currentUser = { name, role: 'teacher' };
            localStorage.setItem('musicTheoryUser', JSON.stringify(state.currentUser));
            updateUserDisplay();
            closeModal();
            showDashboard();
        } else {
            alert('Invalid password');
        }
    } else {
        state.currentUser = { name, role: 'student' };
        localStorage.setItem('musicTheoryUser', JSON.stringify(state.currentUser));
        updateUserDisplay();
        closeModal();
        if (state.pendingMode) {
            selectMode(state.pendingMode);
            state.pendingMode = null;
        }
    }
}

function logout() {
    if (state.session.startTime) endSession();
    state.currentUser = null;
    localStorage.removeItem('musicTheoryUser');
    updateUserDisplay();
    showHome();
}

// ===================
// NAVIGATION
// ===================

function showHome() {
    hideAll();
    document.getElementById('landing').classList.remove('hidden');
    if (state.timerInterval) clearInterval(state.timerInterval);
}

function hideAll() {
    ['landing', 'intensiveSelect', 'examSelect', 'quiz', 'results', 'dashboard'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

function selectMode(mode) {
    if (!state.currentUser) {
        state.pendingMode = mode;
        showLogin('student');
        return;
    }
    state.mode = mode;
    hideAll();
    document.getElementById(mode === 'intensive' ? 'intensiveSelect' : 'examSelect').classList.remove('hidden');
}

// ===================
// SELECTORS
// ===================

function buildTypeSelector() {
    document.getElementById('typeGrid').innerHTML = CONFIG.QUESTION_TYPES.map(t => `
        <div class="type-chip" data-type="${t.id}" onclick="toggleTypeSelection('${t.id}')">
            <span class="type-name">${t.id}</span>
            <span class="type-desc">${t.name}</span>
        </div>
    `).join('');
}

function toggleTypeSelection(typeId) {
    document.querySelectorAll('.type-chip').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.type-chip[data-type="${typeId}"]`).classList.add('selected');
    state.selectedType = typeId;
    document.getElementById('startIntensiveBtn').disabled = false;
}

function buildYearPaperSelector() {
    document.getElementById('yearPaperGrid').innerHTML = Object.entries(CONFIG.AVAILABLE_PAPERS).map(([year, papers]) => `
        <div class="year-group">
            <h4>${year}</h4>
            <div class="paper-buttons">
                ${papers.map(p => `<button class="paper-btn" onclick="selectPaper('${year}','${p}')">${p}</button>`).join('')}
            </div>
        </div>
    `).join('');
}

function selectPaper(year, paper) {
    document.querySelectorAll('.paper-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    state.selectedYear = year;
    state.selectedPaper = paper;
    document.getElementById('startExamBtn').disabled = false;
}

// ===================
// START QUIZ
// ===================

function startIntensive() {
    state.questions = [];
    Object.values(questionsDB).forEach(types => {
        if (types[state.selectedType]) state.questions.push(...types[state.selectedType]);
    });
    if (!state.questions.length) return alert('No questions for this type yet');
    
    shuffle(state.questions);
    initSession();
    
    hideAll();
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('sessionStats').classList.remove('hidden');
    document.getElementById('questionDots').classList.add('hidden');
    document.getElementById('progressContainer').classList.add('hidden');
    document.getElementById('checkBtn').classList.remove('hidden');
    document.getElementById('prevBtn').classList.add('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
    
    showQuestion(0);
}

function startExam() {
    const key = `${state.selectedYear}-${state.selectedPaper.toLowerCase().replace(' ', '')}`;
    if (!questionsDB[key]) return alert('Paper not available yet');
    
    state.questions = [];
    Object.values(questionsDB[key]).forEach(qs => state.questions.push(...qs));
    
    initSession();
    
    hideAll();
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('timer').classList.remove('hidden');
    document.getElementById('sessionStats').classList.add('hidden');
    document.getElementById('questionDots').classList.remove('hidden');
    document.getElementById('progressContainer').classList.remove('hidden');
    document.getElementById('checkBtn').classList.add('hidden');
    document.getElementById('prevBtn').classList.remove('hidden');
    
    buildQuestionDots();
    state.timeRemaining = CONFIG.EXAM_DURATION;
    startTimer();
    showQuestion(0);
}

function initSession() {
    state.currentQuestion = 0;
    state.answers = {};
    state.questionResults = {};
    state.session = { startTime: new Date(), attempted: 0, correct: 0, byType: {} };
    updateSessionStats();
}

// ===================
// TIMER
// ===================

function startTimer() {
    updateTimerDisplay();
    state.timerInterval = setInterval(() => {
        state.timeRemaining--;
        updateTimerDisplay();
        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const h = Math.floor(state.timeRemaining / 3600);
    const m = Math.floor((state.timeRemaining % 3600) / 60);
    const s = state.timeRemaining % 60;
    const display = document.getElementById('timerDisplay');
    display.textContent = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    display.classList.toggle('warning', state.timeRemaining <= 600);
}

// ===================
// QUESTIONS
// ===================

function showQuestion(idx) {
    state.currentQuestion = idx;
    const q = state.questions[idx];
    
    if (state.mode === 'exam') {
        document.getElementById('progressText').textContent = `Question ${idx+1} of ${state.questions.length}`;
        document.getElementById('progressFill').style.width = `${((idx+1)/state.questions.length)*100}%`;
        updateQuestionDots();
        document.getElementById('nextBtn').classList.toggle('hidden', idx === state.questions.length-1);
        document.getElementById('submitBtn').classList.toggle('hidden', idx !== state.questions.length-1);
    }
    
    document.getElementById('questionContainer').innerHTML = buildQuestionHTML(q, idx);
    if (state.answers[idx] !== undefined) restoreAnswer(q, idx);
}

function buildQuestionHTML(q, idx) {
    let html = `<div class="question-card">
        <div class="question-header">
            <span class="question-number">${q.id}</span>
            <span class="question-marks">${q.marks} mark${q.marks>1?'s':''}</span>
        </div>
        <p class="question-text">${q.question}</p>`;
    
    if (q.image) html += `<div class="music-notation"><img src="images/grade5/${q.image}" alt="Notation" onerror="this.parentElement.classList.add('placeholder');this.parentElement.innerHTML='🎵 ${q.image}'"></div>`;
    
    html += buildAnswerHTML(q, idx);
    html += `<div class="feedback" id="feedback-${idx}"><div class="feedback-title"></div><div class="feedback-text"></div></div></div>`;
    return html;
}

function buildAnswerHTML(q, idx) {
    const letters = ['A','B','C','D','E'];
    switch(q.type) {
        case 'multiple-choice':
            return `<div class="options">${q.options.map((o,i) => `<div class="option" data-value="${o}" onclick="selectOption(this,${idx})"><span class="option-marker">${letters[i]}</span><span>${o}</span></div>`).join('')}</div>`;
        case 'true-false-multi':
            return `<div class="true-false-grid">${q.statements.map((s,i) => `<div class="true-false-item" data-stmt="${i}"><span class="tf-statement">${s.text}</span><button class="tf-btn" onclick="selectTF(this,${idx},${i},true)">True</button><button class="tf-btn" onclick="selectTF(this,${idx},${i},false)">False</button></div>`).join('')}</div>`;
        case 'tick-boxes':
            return `<div class="tick-box-grid">${q.elements.map((e,i) => `<div class="tick-box-column"><span class="tick-box-label">${e.label}</span><div class="tick-box-buttons"><button class="tick-btn" onclick="selectTickBox(this,${idx},${i},true)">✓</button><button class="tick-btn" onclick="selectTickBox(this,${idx},${i},false)">✗</button></div></div>`).join('')}</div>`;
        case 'fill-blank':
            return `<div class="fill-blank"><input type="text" id="blank-${idx}" placeholder="Answer" onchange="saveBlank(${idx},this.value)"></div>`;
        case 'matching':
            return q.pairs.map((p,i) => `<div class="matching-row"><span>${p.label}</span><select onchange="saveMatch(${idx},${i},this.value)"><option value="">Select...</option>${p.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`).join('');
        case 'chord-progression':
            return q.slots.map((s,i) => `<div class="matching-row"><span>${s}</span><select onchange="saveChord(${idx},${i},this.value)"><option value="">Select...</option>${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`).join('');
        default: return '';
    }
}

// ===================
// ANSWER HANDLERS
// ===================

function selectOption(el, idx) {
    el.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    state.answers[idx] = el.dataset.value;
}

function selectTF(el, idx, stmt, val) {
    if (!state.answers[idx]) state.answers[idx] = {};
    el.parentElement.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    state.answers[idx][stmt] = val;
}

function selectTickBox(el, idx, elIdx, val) {
    if (!state.answers[idx]) state.answers[idx] = {};
    el.parentElement.querySelectorAll('.tick-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    state.answers[idx][elIdx] = val;
}

function saveBlank(idx, val) { state.answers[idx] = val.trim(); }
function saveMatch(idx, pair, val) { if (!state.answers[idx]) state.answers[idx] = {}; state.answers[idx][pair] = val; }
function saveChord(idx, slot, val) { if (!state.answers[idx]) state.answers[idx] = []; state.answers[idx][slot] = val; }

function restoreAnswer(q, idx) {
    const a = state.answers[idx];
    if (a === undefined) return;
    switch(q.type) {
        case 'multiple-choice':
            document.querySelector(`.option[data-value="${a}"]`)?.classList.add('selected'); break;
        case 'true-false-multi':
        case 'tick-boxes':
            Object.entries(a).forEach(([i,v]) => {
                document.querySelector(`[data-stmt="${i}"] .tf-btn[onclick*="${v}"]`)?.classList.add('selected') ||
                document.querySelectorAll('.tick-box-column')[i]?.querySelector(`.tick-btn[onclick*="${v}"]`)?.classList.add('selected');
            }); break;
        case 'fill-blank':
            document.getElementById(`blank-${idx}`).value = a; break;
        case 'matching':
        case 'chord-progression':
            document.querySelectorAll('.matching-row select').forEach((s,i) => { if(a[i]) s.value = a[i]; }); break;
    }
}

// ===================
// CHECK ANSWER
// ===================

function checkAnswer() {
    const idx = state.currentQuestion;
    const q = state.questions[idx];
    const a = state.answers[idx];
    
    if (a === undefined || (typeof a === 'object' && !Object.keys(a).length)) return alert('Please answer first');
    if (state.questionResults[idx] !== undefined) return nextQuestion();
    
    const result = evaluate(q, a);
    state.questionResults[idx] = result.correct;
    
    state.session.attempted++;
    if (result.correct) state.session.correct++;
    
    const typeId = q.id.split('-').pop().replace(/[a-z]$/,'');
    if (!state.session.byType[typeId]) state.session.byType[typeId] = {attempted:0,correct:0};
    state.session.byType[typeId].attempted++;
    if (result.correct) state.session.byType[typeId].correct++;
    
    updateSessionStats();
    showFeedback(idx, result);
    highlightAnswers(q, a, result);
    document.getElementById('checkBtn').textContent = 'Next →';
}

function evaluate(q, a) {
    switch(q.type) {
        case 'multiple-choice':
            return { correct: a === q.correctAnswer, message: a === q.correctAnswer ? 'Correct!' : `Answer: ${q.correctAnswer}` };
        case 'true-false-multi':
            const tfr = q.statements.map((s,i) => a[i] === s.correct);
            return { correct: tfr.every(r=>r), results: tfr, message: `${tfr.filter(r=>r).length}/${q.statements.length}` };
        case 'tick-boxes':
            const tbr = q.elements.map((e,i) => a[i] === e.correct);
            return { correct: tbr.every(r=>r), results: tbr, message: `${tbr.filter(r=>r).length}/${q.elements.length}` };
        case 'fill-blank':
            const fb = a.toLowerCase() === q.correctAnswer.toLowerCase();
            return { correct: fb, message: fb ? 'Correct!' : `Answer: ${q.correctAnswer}` };
        case 'matching':
            const mr = q.pairs.map((p,i) => a[i] === p.correct);
            return { correct: mr.every(r=>r), results: mr, message: `${mr.filter(r=>r).length}/${q.pairs.length}` };
        case 'chord-progression':
            const cr = q.correctAnswers.map((c,i) => a[i] === c);
            return { correct: cr.every(r=>r), results: cr, message: `${cr.filter(r=>r).length}/${q.correctAnswers.length}` };
        default: return { correct: false, message: '' };
    }
}

function showFeedback(idx, result) {
    const fb = document.getElementById(`feedback-${idx}`);
    fb.classList.add('show', result.correct ? 'correct' : 'incorrect');
    fb.querySelector('.feedback-title').textContent = result.correct ? '✓ Correct!' : '✗ Incorrect';
    fb.querySelector('.feedback-text').textContent = result.message;
}

function highlightAnswers(q, a, result) {
    if (q.type === 'multiple-choice') {
        document.querySelectorAll('.option').forEach(o => {
            if (o.dataset.value === q.correctAnswer) o.classList.add('correct');
            else if (o.classList.contains('selected')) o.classList.add('incorrect');
        });
    }
}

function updateSessionStats() {
    document.getElementById('statAttempted').textContent = state.session.attempted;
    document.getElementById('statCorrect').textContent = state.session.correct;
    const acc = state.session.attempted ? Math.round((state.session.correct/state.session.attempted)*100) : 0;
    document.getElementById('statAccuracy').textContent = `${acc}%`;
}

// ===================
// NAVIGATION
// ===================

function previousQuestion() { if (state.currentQuestion > 0) showQuestion(state.currentQuestion - 1); }

function nextQuestion() {
    document.getElementById('checkBtn').textContent = 'Check Answer';
    if (state.mode === 'intensive') {
        if (state.currentQuestion < state.questions.length - 1) showQuestion(state.currentQuestion + 1);
        else { shuffle(state.questions); showQuestion(0); }
    } else {
        if (state.currentQuestion < state.questions.length - 1) showQuestion(state.currentQuestion + 1);
    }
}

function buildQuestionDots() {
    document.getElementById('questionDots').innerHTML = state.questions.map((_,i) => 
        `<div class="question-dot" onclick="goToQuestion(${i})">${i+1}</div>`
    ).join('');
}

function updateQuestionDots() {
    document.querySelectorAll('.question-dot').forEach((d,i) => {
        d.classList.remove('current','answered','correct','incorrect');
        if (i === state.currentQuestion) d.classList.add('current');
        else if (state.questionResults[i] !== undefined) d.classList.add(state.questionResults[i] ? 'correct' : 'incorrect');
        else if (state.answers[i] !== undefined) d.classList.add('answered');
    });
}

function goToQuestion(idx) { if (state.mode === 'exam') showQuestion(idx); }

// ===================
// END SESSION
// ===================

function endSession() {
    if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
    const results = calcResults();
    saveSession(results);
    showResults(results);
}

function submitExam() {
    if (!confirm('Submit exam? You cannot change answers after.')) return;
    endSession();
}

function calcResults() {
    let score = 0, max = 0;
    const byType = {};
    
    state.questions.forEach((q,i) => {
        max += q.marks;
        const a = state.answers[i];
        if (a !== undefined) {
            const r = evaluate(q, a);
            if (r.correct) score += q.marks;
            state.questionResults[i] = r.correct;
            
            const t = q.id.split('-').pop().replace(/[a-z]$/,'');
            if (!byType[t]) byType[t] = {attempted:0,correct:0};
            byType[t].attempted++;
            if (r.correct) byType[t].correct++;
        }
    });
    
    return {
        score, maxScore: max,
        percentage: Math.round((score/max)*100),
        duration: Math.round((new Date() - state.session.startTime)/1000),
        byType, mode: state.mode,
        paper: state.mode === 'exam' ? `${state.selectedYear} ${state.selectedPaper}` : null,
        questionType: state.mode === 'intensive' ? state.selectedType : null
    };
}

function saveSession(results) {
    const data = {
        student: state.currentUser?.name || 'Anonymous',
        date: new Date().toISOString(),
        mode: results.mode,
        paper: results.paper,
        questionType: results.questionType,
        duration: formatDur(results.duration),
        questionsAttempted: Object.keys(state.answers).length,
        percentage: results.percentage,
        weakAreas: Object.entries(results.byType).filter(([,d]) => d.attempted >= 2 && d.correct/d.attempted < 0.6).map(([t]) => t)
    };
    
    const sessions = JSON.parse(localStorage.getItem('musicTheorySessions') || '[]');
    sessions.unshift(data);
    localStorage.setItem('musicTheorySessions', JSON.stringify(sessions.slice(0,100)));
    
    if (CONFIG.GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        fetch(CONFIG.GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) }).catch(() => {});
    }
}

function formatDur(s) { return `${Math.floor(s/60)}m ${s%60}s`; }

function showResults(results) {
    hideAll();
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultsTitle').textContent = state.mode === 'exam' ? 'Exam Complete!' : 'Session Complete!';
    document.getElementById('finalScore').textContent = `${results.score}/${results.maxScore}`;
    
    let grade = results.percentage >= 90 ? 'Outstanding! 🌟' : results.percentage >= 75 ? 'Excellent! ✨' : results.percentage >= 60 ? 'Good! 👍' : results.percentage >= 50 ? 'Pass 📚' : 'Keep practicing 💪';
    document.getElementById('scorePercentage').textContent = `${results.percentage}% - ${grade}`;
    
    const names = {}; CONFIG.QUESTION_TYPES.forEach(t => names[t.id] = t.name);
    document.getElementById('scoreBreakdown').innerHTML = Object.entries(results.byType).map(([t,d]) => 
        `<div class="score-item"><div class="score-item-value">${d.correct}/${d.attempted}</div><div class="score-item-label">${t}</div></div>`
    ).join('');
    
    document.getElementById('reviewBtn').classList.toggle('hidden', state.mode === 'intensive');
}

function reviewAnswers() {
    hideAll();
    document.getElementById('quiz').classList.remove('hidden');
    ['timer','sessionStats','checkBtn','submitBtn','endSessionBtn'].forEach(id => document.getElementById(id).classList.add('hidden'));
    ['nextBtn','prevBtn'].forEach(id => document.getElementById(id).classList.remove('hidden'));
    state.mode = 'review';
    showQuestion(0);
}

// ===================
// DASHBOARD
// ===================

function showDashboard() {
    hideAll();
    document.getElementById('dashboard').classList.remove('hidden');
    loadSessions();
}

function showDashboardTab(tab) {
    document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('sessionsTab').classList.toggle('hidden', tab !== 'sessions');
    document.getElementById('questionsTab').classList.toggle('hidden', tab !== 'questions');
}

function loadSessions() {
    const sessions = JSON.parse(localStorage.getItem('musicTheorySessions') || '[]');
    const tbody = document.getElementById('sessionResults');
    
    if (!sessions.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No sessions yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = sessions.map(s => {
        const badge = s.percentage >= 70 ? 'high' : s.percentage >= 50 ? 'medium' : 'low';
        return `<tr>
            <td>${s.student}</td>
            <td>${new Date(s.date).toLocaleDateString()}</td>
            <td>${s.mode === 'exam' ? s.paper : 'Drill: ' + s.questionType}</td>
            <td>${s.duration}</td>
            <td>${s.questionsAttempted}</td>
            <td><span class="score-badge ${badge}">${s.percentage}%</span></td>
            <td class="weak-areas">${s.weakAreas?.join(', ') || '-'}</td>
        </tr>`;
    }).join('');
}

// ===================
// UTILITIES
// ===================

function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }

// Global exports
window.showHome = showHome;
window.selectMode = selectMode;
window.showLogin = showLogin;
window.closeModal = closeModal;
window.handleLogin = handleLogin;
window.logout = logout;
window.toggleTypeSelection = toggleTypeSelection;
window.selectPaper = selectPaper;
window.startIntensive = startIntensive;
window.startExam = startExam;
window.selectOption = selectOption;
window.selectTF = selectTF;
window.selectTickBox = selectTickBox;
window.saveBlank = saveBlank;
window.saveMatch = saveMatch;
window.saveChord = saveChord;
window.checkAnswer = checkAnswer;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.goToQuestion = goToQuestion;
window.endSession = endSession;
window.submitExam = submitExam;
window.reviewAnswers = reviewAnswers;
window.showDashboard = showDashboard;
window.showDashboardTab = showDashboardTab;
