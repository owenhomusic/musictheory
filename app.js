// ==========================================
// ABRSM Grade 5 Music Theory Quiz Application
// ==========================================

// Global State
let state = {
    mode: null, // 'practice' or 'exam'
    currentQuestion: 0,
    questions: [],
    answers: {},
    score: 0,
    totalMarks: 75,
    timeRemaining: 7200, // 2 hours in seconds
    timerInterval: null,
    selectedSections: ['all'],
    currentUser: null,
    userRole: null, // 'student' or 'teacher'
    questionResults: {} // Track correct/incorrect for each question
};

// Sample Questions Database (based on uploaded ABRSM Grade 5 paper)
const questionsDB = [
    // ===== SECTION 1: RHYTHM =====
    {
        id: '1.1a',
        section: 'rhythm',
        type: 'multiple-choice',
        marks: 1,
        question: 'Select the correct time signature for this bar:',
        notation: '♩ ♪ ♩. ♪ ♩ (with triplet marking)',
        description: 'A bar containing quavers and dotted rhythms with a triplet',
        options: ['9/8', '4/4', '7/8'],
        correctAnswer: '9/8'
    },
    {
        id: '1.1b',
        section: 'rhythm',
        type: 'multiple-choice',
        marks: 1,
        question: 'Select the correct time signature for this bar:',
        notation: '♩ ♩ ♩ ♩',
        description: 'A bar with four crotchets',
        options: ['5/4', '9/8', '4/4'],
        correctAnswer: '4/4'
    },
    {
        id: '1.1c',
        section: 'rhythm',
        type: 'multiple-choice',
        marks: 1,
        question: 'Select the correct time signature for this bar:',
        notation: '♩ ♪ ♩ ♪ ♩ ♪',
        description: 'A bar in compound time',
        options: ['6/8', '7/8', '5/8'],
        correctAnswer: '7/8'
    },
    {
        id: '1.2',
        section: 'rhythm',
        type: 'multiple-choice',
        marks: 1,
        question: 'A bar in 12/8 compound time needs to be rewritten in simple time. Which shows the correct conversion using triplets?',
        notation: '12/8: ♩. ♩. ♩. ♩.',
        options: [
            'Common time with triplet groupings and dotted rest',
            'Common time with triplet groupings and crotchet rest',
            'Common time with duplet groupings'
        ],
        correctAnswer: 'Common time with triplet groupings and dotted rest'
    },
    {
        id: '1.3a',
        section: 'rhythm',
        type: 'fill-blank',
        marks: 1,
        question: 'In 6/8 time, there are ___ dotted-quaver beats in a bar.',
        correctAnswer: '2'
    },
    {
        id: '1.3b',
        section: 'rhythm',
        type: 'fill-blank',
        marks: 1,
        question: 'A breve is equal to ___ crotchet(s).',
        correctAnswer: '8'
    },
    {
        id: '1.4',
        section: 'rhythm',
        type: 'multiple-choice',
        marks: 1,
        question: 'In 9/4 time, which bar shows correct note grouping?',
        options: [
            'Notes grouped in three groups of 3 crotchets, ending with dotted minim',
            'Notes grouped irregularly, ending with semibreve',
            'Notes grouped in three groups of 3 crotchets, ending with semibreve'
        ],
        correctAnswer: 'Notes grouped in three groups of 3 crotchets, ending with dotted minim'
    },
    {
        id: '1.5',
        section: 'rhythm',
        type: 'true-false-multi',
        marks: 3,
        question: 'In this 3/4 bar, indicate whether each rest grouping is correct or incorrect:',
        notation: '3/4: ≈♯♩. ♩♯ ≈‿ ♪ ♪‿≈ ♩ ♩ ♩ | ♩ ♩ Œ ≈♯♩ ♩ ♩',
        statements: [
            { text: 'Rest 1 (semiquaver rest + dotted semiquaver rest)', correct: true },
            { text: 'Rest 2 (quaver rest + semiquaver rest)', correct: false },
            { text: 'Rest 3 (crotchet rest + semiquaver rest)', correct: true }
        ]
    },

    // ===== SECTION 2: PITCH =====
    {
        id: '2.1',
        section: 'pitch',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this note written on the alto clef (middle line):',
        notation: 'Alto clef with whole note on middle line',
        options: ['G', 'B', 'F', 'A'],
        correctAnswer: 'B'
    },
    {
        id: '2.2',
        section: 'pitch',
        type: 'multiple-choice',
        marks: 1,
        question: 'What is the enharmonic equivalent of C♯?',
        options: ['D', 'D♭', 'B♯', 'C'],
        correctAnswer: 'D♭'
    },
    {
        id: '2.3',
        section: 'pitch',
        type: 'true-false-multi',
        marks: 5,
        question: 'A bar written for clarinet in A (in D major, 6/8) has been transposed down a minor 3rd to concert pitch. Check if each element is correct:',
        statements: [
            { text: 'The key signature (B major/2 sharps)', correct: true },
            { text: 'Note 1: B♭', correct: false },
            { text: 'Note 2: G', correct: true },
            { text: 'Note 3: F♮', correct: false },
            { text: 'Note 4: E', correct: true }
        ]
    },
    {
        id: '2.4',
        section: 'pitch',
        type: 'true-false-multi',
        marks: 3,
        question: 'Compare bars A, B and C (same melody in treble, bass, and alto clefs):',
        statements: [
            { text: 'A and B are at the same pitch', correct: false },
            { text: 'B is one octave lower than C', correct: true },
            { text: 'C is one octave higher than A', correct: false }
        ]
    },

    // ===== SECTION 3: KEYS AND SCALES =====
    {
        id: '3.1',
        section: 'keys',
        type: 'multiple-choice',
        marks: 1,
        question: 'Which shows the correctly written key signature of B major?',
        options: [
            'Alto clef: F♯, C♯, G♯, D♯, A♯',
            'Treble clef: F♯, C♯, G♯, D♯, A♯',
            'Bass clef: F♯, C♯, G♯, D♯, A♯',
            'Tenor clef: F♯, C♯, G♯, D♯, A♯'
        ],
        correctAnswer: 'Bass clef: F♯, C♯, G♯, D♯, A♯'
    },
    {
        id: '3.2',
        section: 'keys',
        type: 'multiple-choice',
        marks: 1,
        question: 'Which shows the correctly written key signature of E♭ minor?',
        options: [
            'Treble clef: B♭, E♭, A♭, D♭, G♭, C♭',
            'Bass clef: B♭, E♭, A♭, D♭, G♭, C♭',
            'Alto clef: B♭, E♭, A♭, D♭, G♭, C♭',
            'Tenor clef: B♭, E♭, A♭, D♭, G♭, C♭'
        ],
        correctAnswer: 'Bass clef: B♭, E♭, A♭, D♭, G♭, C♭'
    },
    {
        id: '3.3a',
        section: 'keys',
        type: 'multiple-choice',
        marks: 1,
        question: 'What is the key of this melody? (2/4, one sharp, melody: E-D-C♯-D-E | F-E-D-E)',
        options: ['G minor', 'D major', 'G major', 'F♯ major'],
        correctAnswer: 'G major'
    },
    {
        id: '3.3b',
        section: 'keys',
        type: 'multiple-choice',
        marks: 1,
        question: 'What is the key of this melody? (3/4, two sharps, melody with C♯s and F♯s, ending on B)',
        options: ['D major', 'B minor', 'F♯ minor', 'A major'],
        correctAnswer: 'B minor'
    },
    {
        id: '3.3c',
        section: 'keys',
        type: 'multiple-choice',
        marks: 1,
        question: 'What is the key of this melody? (4/4, four sharps, melody with D♯s, ending on E)',
        options: ['A major', 'G♯ minor', 'B major', 'E major'],
        correctAnswer: 'E major'
    },
    {
        id: '3.4',
        section: 'keys',
        type: 'matching',
        marks: 2,
        question: 'Complete the scale of B♭ harmonic minor by selecting the correct notes:',
        pairs: [
            { item: 'Note X (between B♭ and C)', options: ['A♭', 'B♮', 'A', 'A𝄫'], correct: 'A' },
            { item: 'Note Y (between E♭ and F)', options: ['G', 'G♭', 'G𝄫', 'F♭'], correct: 'G♭' }
        ]
    },
    {
        id: '3.5',
        section: 'keys',
        type: 'matching',
        marks: 3,
        question: 'Select the correct clef for each scale to form minor scales:',
        pairs: [
            { item: 'Scale: D E F G A B♭ C♯ D', options: ['Treble', 'Bass', 'Alto'], correct: 'Treble' },
            { item: 'Scale: F♯ G♯ A B C♯ D E♯ F♯', options: ['Treble', 'Bass', 'Alto'], correct: 'Bass' },
            { item: 'Scale: C D E♭ F G A♭ B C', options: ['Treble', 'Bass', 'Alto'], correct: 'Alto' }
        ]
    },
    {
        id: '3.6',
        section: 'keys',
        type: 'true-false-multi',
        marks: 2,
        question: 'Are these chromatic scales written correctly?',
        statements: [
            { text: 'C chromatic ascending: C-C♯-D-D♯-E-F-F♯-G-G♯-A-A♯-B-C', correct: true },
            { text: 'E♭ chromatic descending: E♭-D-D♭-C-C♭-B♭-A-A♭-G-G♭-F-E♭', correct: false }
        ]
    },
    {
        id: '3.7',
        section: 'keys',
        type: 'true-false-multi',
        marks: 3,
        question: 'Identify if these technical degree names are correct:',
        statements: [
            { text: 'A♯ is the leading note in B major', correct: true },
            { text: 'D is the subdominant in A minor', correct: false },
            { text: 'D is the submediant in F♯ minor', correct: true }
        ]
    },

    // ===== SECTION 4: INTERVALS =====
    {
        id: '4.1a',
        section: 'intervals',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this interval: E to A (with 4 sharps in key signature), spanning more than an octave',
        options: ['Major 10th', 'Compound perfect 4th', 'Augmented 11th', 'Compound diminished 4th'],
        correctAnswer: 'Compound perfect 4th'
    },
    {
        id: '4.1b',
        section: 'intervals',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this interval: D to A♭ (bass clef)',
        options: ['Diminished 5th', 'Perfect 5th', 'Augmented 4th', 'Major 4th'],
        correctAnswer: 'Diminished 5th'
    },
    {
        id: '4.1c',
        section: 'intervals',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this interval: E to F♯ spanning more than an octave',
        options: ['Compound minor 2nd', 'Major 2nd', 'Major 9th', 'Minor 10th'],
        correctAnswer: 'Major 9th'
    },
    {
        id: '4.2a',
        section: 'intervals',
        type: 'multiple-choice',
        marks: 1,
        question: 'What type is this interval? C to E (in bass clef)',
        options: ['Perfect', 'Major', 'Minor', 'Diminished', 'Augmented'],
        correctAnswer: 'Minor'
    },
    {
        id: '4.2b',
        section: 'intervals',
        type: 'multiple-choice',
        marks: 1,
        question: 'What type is this interval? B♭ to D (in bass clef with 2 flats)',
        options: ['Perfect', 'Major', 'Minor', 'Diminished', 'Augmented'],
        correctAnswer: 'Major'
    },
    {
        id: '4.2c',
        section: 'intervals',
        type: 'multiple-choice',
        marks: 1,
        question: 'What type is this interval? G♯ to D♭',
        options: ['Perfect', 'Major', 'Minor', 'Diminished', 'Augmented'],
        correctAnswer: 'Diminished'
    },
    {
        id: '4.3',
        section: 'intervals',
        type: 'matching',
        marks: 4,
        question: 'Match each interval with the correct upper note (given lower note):',
        pairs: [
            { item: 'G♯ + compound perfect 5th = ?', options: ['D♯', 'E♯', 'D', 'E'], correct: 'D♯' },
            { item: 'B♭ + minor 7th = ?', options: ['A♭', 'A', 'G♯', 'G'], correct: 'A♭' },
            { item: 'C + augmented 12th = ?', options: ['G♯', 'G', 'F♯', 'A♭'], correct: 'G♯' },
            { item: 'A + minor 3rd = ?', options: ['C', 'C♯', 'B', 'D'], correct: 'C' }
        ]
    },

    // ===== SECTION 5: CHORDS =====
    {
        id: '5.1',
        section: 'chords',
        type: 'chord-progression',
        marks: 5,
        question: 'Indicate suitable chords (I, II, IV, or V) for the cadences in this G major melody:',
        notation: '3/4 in G major: 8 bars with two cadence points',
        chordSlots: [
            { position: 'Bar 3-4 (first cadence)', options: ['I', 'II', 'IV', 'V'] },
            { position: 'Bar 4 beat 1', options: ['I', 'II', 'IV', 'V'] },
            { position: 'Bar 7 beat 3', options: ['I', 'II', 'IV', 'V'] },
            { position: 'Bar 8 beat 1', options: ['I', 'II', 'IV', 'V'] },
            { position: 'Bar 8 beat 3 (final)', options: ['I', 'II', 'IV', 'V'] }
        ],
        correctAnswers: ['II', 'V', 'I', 'IV', 'I']
    },
    {
        id: '5.2a',
        section: 'chords',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this cadence in D major: V - I (ending on tonic chord)',
        options: ['Imperfect', 'Plagal', 'Perfect'],
        correctAnswer: 'Perfect'
    },
    {
        id: '5.2b',
        section: 'chords',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this cadence in F major: IV - I',
        options: ['Perfect', 'Plagal', 'Imperfect'],
        correctAnswer: 'Plagal'
    },
    {
        id: '5.3',
        section: 'chords',
        type: 'matching',
        marks: 3,
        question: 'Name each marked chord in C minor:',
        pairs: [
            { item: 'Chord A (G in bass, G-C-E♭ notes)', options: ['Va', 'Ic', 'IVb', 'Ib'], correct: 'Ic' },
            { item: 'Chord B (A♭ in bass, F-A♭-C notes)', options: ['Ic', 'Vb', 'IVb', 'IVc'], correct: 'IVb' },
            { item: 'Chord C (G in bass, B♮-D-G notes)', options: ['Ic', 'IIa', 'Vb', 'Va'], correct: 'Va' }
        ]
    },

    // ===== SECTION 6: TERMS, SIGNS AND INSTRUMENTS =====
    {
        id: '6.1',
        section: 'terms',
        type: 'matching',
        marks: 3,
        question: 'Match each musical term with its meaning:',
        pairs: [
            { item: 'morendo', options: ['Dying away', 'Gradually getting louder', 'Playful, merry', 'Agitated'], correct: 'Dying away' },
            { item: 'largamente', options: ['Majestic', 'Broadly', 'Very slow, solemn', 'Expressive'], correct: 'Broadly' },
            { item: 'mesto', options: ['Rather slow', 'Less', 'Calm', 'Sad'], correct: 'Sad' }
        ]
    },
    {
        id: '6.2a',
        section: 'terms',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this written-out ornament: A note with rapid alternation between main note and note above',
        options: ['Appoggiatura', 'Upper turn', 'Trill', 'Upper mordent'],
        correctAnswer: 'Trill'
    },
    {
        id: '6.2b',
        section: 'terms',
        type: 'multiple-choice',
        marks: 1,
        question: 'Name this written-out ornament: Main note → note above → note below → main note',
        options: ['Acciaccatura', 'Upper turn', 'Trill', 'Lower mordent'],
        correctAnswer: 'Upper turn'
    },
    {
        id: '6.3',
        section: 'terms',
        type: 'true-false-multi',
        marks: 5,
        question: 'Are these statements about instruments true or false?',
        statements: [
            { text: 'The flute usually plays at a higher pitch than the bassoon', correct: true },
            { text: 'The trumpet is a woodwind instrument', correct: false },
            { text: 'Cymbals produce sounds of definite pitch', correct: false },
            { text: 'The horn uses a double reed', correct: false },
            { text: 'A mezzo-soprano voice has a lower range than a soprano voice', correct: true }
        ]
    },

    // ===== SECTION 7: MUSIC IN CONTEXT =====
    {
        id: '7.1',
        section: 'context',
        type: 'multiple-choice',
        marks: 1,
        question: 'Comparing bars A, B, and C to bar 2 of the melody (right hand), which is correctly written one octave lower?',
        options: [
            'Only A is correctly written one octave lower',
            'Only B and C are correctly written one octave lower',
            'A, B and C are correctly written one octave lower',
            'Only A and B are correctly written one octave lower'
        ],
        correctAnswer: 'Only A is correctly written one octave lower'
    },
    {
        id: '7.2',
        section: 'context',
        type: 'true-false-multi',
        marks: 5,
        question: 'Study the Vivace piano piece in F♯ minor (2/4 time) and answer:',
        statements: [
            { text: 'The beginning of the music should be played lightly (pp leggiero)', correct: true },
            { text: 'The music ends on the subdominant chord of F♯ minor', correct: false },
            { text: 'The largest melodic interval in the left-hand part of bar 7 is a major 3rd', correct: true },
            { text: 'The highest note in the music is a C♯', correct: false },
            { text: 'The music gets quieter in bar 7', correct: false }
        ]
    },
    {
        id: '7.3',
        section: 'context',
        type: 'multiple-choice',
        marks: 1,
        question: 'Which instrument is best suited to play the right-hand phrase in bars 3-4 at the same pitch?',
        options: ['Bassoon', 'Oboe', 'Trombone', 'Double bass'],
        correctAnswer: 'Oboe'
    },
    {
        id: '7.4',
        section: 'context',
        type: 'multiple-choice',
        marks: 1,
        question: 'How many times does the mediant note of F♯ minor (A) appear in the left-hand part?',
        options: ['4', '5', '6', '8'],
        correctAnswer: '6'
    },
    {
        id: '7.5a',
        section: 'context',
        type: 'fill-blank',
        marks: 1,
        question: 'Bar 3 has the same rhythm and articulation as bar ___.',
        correctAnswer: '2'
    },
    {
        id: '7.5b',
        section: 'context',
        type: 'fill-blank',
        marks: 1,
        question: 'There is a diminuendo in bar ___.',
        correctAnswer: '5'
    }
];

// Local Storage Keys
const STORAGE_KEYS = {
    RESULTS: 'musicTheoryResults',
    QUESTIONS: 'musicTheoryQuestions',
    USERS: 'musicTheoryUsers'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedQuestions();
    setupSectionChips();
});

// Section chip selection
function setupSectionChips() {
    document.querySelectorAll('.section-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const section = chip.dataset.section;
            
            if (section === 'all') {
                document.querySelectorAll('.section-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                state.selectedSections = ['all'];
            } else {
                document.querySelector('[data-section="all"]').classList.remove('active');
                chip.classList.toggle('active');
                
                const activeChips = document.querySelectorAll('.section-chip.active:not([data-section="all"])');
                state.selectedSections = Array.from(activeChips).map(c => c.dataset.section);
                
                if (state.selectedSections.length === 0) {
                    document.querySelector('[data-section="all"]').classList.add('active');
                    state.selectedSections = ['all'];
                }
            }
        });
    });
}

// Load saved custom questions
function loadSavedQuestions() {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (saved) {
        const customQuestions = JSON.parse(saved);
        // Merge with default questions (custom questions take precedence by ID)
        const customIds = new Set(customQuestions.map(q => q.id));
        const filteredDefaults = questionsDB.filter(q => !customIds.has(q.id));
        state.questions = [...filteredDefaults, ...customQuestions];
    }
}

// Show home/landing page
function showHome() {
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    
    // Reset state
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
    state.currentQuestion = 0;
    state.answers = {};
    state.questionResults = {};
}

// Show login modal
function showLogin(role) {
    state.userRole = role;
    document.getElementById('loginTitle').textContent = role === 'teacher' ? 'Teacher Login' : 'Student Login';
    document.getElementById('passwordGroup').classList.toggle('hidden', role === 'student');
    document.getElementById('loginModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('loginModal').classList.remove('show');
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;
    
    if (state.userRole === 'teacher') {
        // Simple password check (in real app, use proper authentication)
        if (password === 'teacher123') {
            state.currentUser = { name, role: 'teacher' };
            closeModal();
            showDashboard();
        } else {
            alert('Invalid password. Hint: teacher123');
        }
    } else {
        state.currentUser = { name, role: 'student' };
        closeModal();
    }
}

// Show teacher dashboard
function showDashboard() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    loadStudentResults();
}

// Load student results into dashboard
function loadStudentResults() {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    const tbody = document.getElementById('studentResults');
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--ink-light);">No results yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = results.map((r, idx) => {
        const percentage = Math.round((r.score / r.totalMarks) * 100);
        const badgeClass = percentage >= 70 ? 'high' : percentage >= 50 ? 'medium' : 'low';
        
        return `
            <tr>
                <td>${r.studentName}</td>
                <td>${new Date(r.date).toLocaleDateString()}</td>
                <td>${r.mode}</td>
                <td><span class="score-badge ${badgeClass}">${r.score}/${r.totalMarks} (${percentage}%)</span></td>
                <td>${r.timeTaken || 'N/A'}</td>
                <td><button class="btn btn-secondary" onclick="viewStudentDetails(${idx})">View</button></td>
            </tr>
        `;
    }).join('');
}

// Handle question file upload
function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let questions;
            if (file.name.endsWith('.json')) {
                questions = JSON.parse(e.target.result);
            } else if (file.name.endsWith('.csv')) {
                questions = parseCSV(e.target.result);
            }
            
            // Validate and save questions
            if (Array.isArray(questions) && questions.length > 0) {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
                const merged = [...saved, ...questions];
                localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(merged));
                alert(`Successfully uploaded ${questions.length} questions!`);
                loadSavedQuestions();
            } else {
                alert('Invalid question format');
            }
        } catch (err) {
            alert('Error parsing file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Parse CSV to questions
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        const q = {};
        headers.forEach((h, i) => {
            q[h] = values[i]?.trim();
        });
        return {
            id: q.id || `custom_${Date.now()}_${Math.random()}`,
            section: q.section || 'general',
            type: q.type || 'multiple-choice',
            marks: parseInt(q.marks) || 1,
            question: q.question,
            options: q.options ? q.options.split('|') : [],
            correctAnswer: q.correctAnswer
        };
    });
}

// Start quiz
function startQuiz(mode) {
    if (!state.currentUser) {
        showLogin('student');
        // Store intended mode for after login
        state.pendingMode = mode;
        return;
    }
    
    state.mode = mode;
    state.currentQuestion = 0;
    state.answers = {};
    state.questionResults = {};
    state.score = 0;
    
    // Filter questions by selected sections
    let filteredQuestions = questionsDB;
    if (!state.selectedSections.includes('all')) {
        filteredQuestions = questionsDB.filter(q => state.selectedSections.includes(q.section));
    }
    state.questions = filteredQuestions;
    
    // Calculate total marks
    state.totalMarks = state.questions.reduce((sum, q) => sum + q.marks, 0);
    
    // Show/hide UI elements based on mode
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('timer').classList.toggle('hidden', mode !== 'exam');
    document.getElementById('checkBtn').classList.toggle('hidden', mode === 'exam');
    document.getElementById('scoreText').classList.toggle('hidden', mode === 'exam');
    document.getElementById('submitBtn').classList.toggle('hidden', mode !== 'exam' || state.currentQuestion < state.questions.length - 1);
    
    // Initialize timer for exam mode
    if (mode === 'exam') {
        state.timeRemaining = 7200; // 2 hours
        startTimer();
    }
    
    // Build question navigation dots
    buildQuestionDots();
    
    // Show first question
    showQuestion(0);
}

// Build question navigation dots
function buildQuestionDots() {
    const container = document.getElementById('questionDots');
    container.innerHTML = state.questions.map((_, idx) => 
        `<div class="question-dot" data-idx="${idx}" onclick="goToQuestion(${idx})">${idx + 1}</div>`
    ).join('');
}

// Update question dots
function updateQuestionDots() {
    document.querySelectorAll('.question-dot').forEach((dot, idx) => {
        dot.classList.remove('current', 'answered', 'correct', 'incorrect');
        
        if (idx === state.currentQuestion) {
            dot.classList.add('current');
        } else if (state.questionResults[idx] !== undefined) {
            dot.classList.add(state.questionResults[idx] ? 'correct' : 'incorrect');
        } else if (state.answers[idx] !== undefined) {
            dot.classList.add('answered');
        }
    });
}

// Go to specific question
function goToQuestion(idx) {
    if (idx >= 0 && idx < state.questions.length) {
        showQuestion(idx);
    }
}

// Start exam timer
function startTimer() {
    state.timerInterval = setInterval(() => {
        state.timeRemaining--;
        
        const hours = Math.floor(state.timeRemaining / 3600);
        const minutes = Math.floor((state.timeRemaining % 3600) / 60);
        const seconds = state.timeRemaining % 60;
        
        const display = document.getElementById('timerDisplay');
        display.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Warning when 10 minutes left
        if (state.timeRemaining <= 600) {
            display.classList.add('warning');
        }
        
        // Auto-submit when time runs out
        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            submitExam();
        }
    }, 1000);
}

// Show question
function showQuestion(idx) {
    state.currentQuestion = idx;
    const question = state.questions[idx];
    
    // Update progress
    document.getElementById('progressText').textContent = `Question ${idx + 1} of ${state.questions.length}`;
    document.getElementById('progressFill').style.width = `${((idx + 1) / state.questions.length) * 100}%`;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = idx === 0;
    document.getElementById('nextBtn').classList.toggle('hidden', idx === state.questions.length - 1 && state.mode === 'exam');
    document.getElementById('submitBtn').classList.toggle('hidden', !(idx === state.questions.length - 1 && state.mode === 'exam'));
    
    // Update dots
    updateQuestionDots();
    
    // Build question HTML
    const container = document.getElementById('questionContainer');
    container.innerHTML = buildQuestionHTML(question, idx);
    
    // Restore previous answer if exists
    if (state.answers[idx] !== undefined) {
        restoreAnswer(question, idx);
    }
}

// Build question HTML based on type
function buildQuestionHTML(question, idx) {
    let content = `
        <div class="question-card">
            <div class="question-header">
                <span class="question-number">Question ${question.id}</span>
                <span class="question-marks">${question.marks} mark${question.marks > 1 ? 's' : ''}</span>
            </div>
            <p class="question-text">${question.question}</p>
    `;
    
    // Add notation placeholder if present
    if (question.notation) {
        content += `<div class="music-notation">🎵 ${question.notation}</div>`;
    }
    
    // Build answer input based on question type
    switch (question.type) {
        case 'multiple-choice':
            content += buildMultipleChoice(question, idx);
            break;
        case 'true-false-multi':
            content += buildTrueFalseMulti(question, idx);
            break;
        case 'fill-blank':
            content += buildFillBlank(question, idx);
            break;
        case 'matching':
            content += buildMatching(question, idx);
            break;
        case 'chord-progression':
            content += buildChordProgression(question, idx);
            break;
        default:
            content += buildMultipleChoice(question, idx);
    }
    
    // Feedback area (for practice mode)
    content += `
        <div class="feedback" id="feedback-${idx}">
            <div class="feedback-title"></div>
            <div class="feedback-text"></div>
        </div>
    `;
    
    content += '</div>';
    return content;
}

// Build multiple choice options
function buildMultipleChoice(question, idx) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return `
        <div class="options">
            ${question.options.map((opt, i) => `
                <div class="option" data-value="${opt}" onclick="selectOption(this, ${idx})">
                    <span class="option-marker">${letters[i]}</span>
                    <span>${opt}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Build true/false multi-statement questions
function buildTrueFalseMulti(question, idx) {
    return `
        <div class="true-false-grid">
            ${question.statements.map((stmt, i) => `
                <div class="true-false-item" data-stmt-idx="${i}">
                    <span class="tf-statement">${stmt.text}</span>
                    <button class="tf-btn" data-value="true" onclick="selectTF(this, ${idx}, ${i}, true)">True</button>
                    <button class="tf-btn" data-value="false" onclick="selectTF(this, ${idx}, ${i}, false)">False</button>
                </div>
            `).join('')}
        </div>
    `;
}

// Build fill-in-the-blank
function buildFillBlank(question, idx) {
    return `
        <div class="fill-blank">
            <input type="text" id="blank-${idx}" placeholder="Your answer" 
                   onchange="saveBlankAnswer(${idx}, this.value)"
                   onkeyup="saveBlankAnswer(${idx}, this.value)">
        </div>
    `;
}

// Build matching question
function buildMatching(question, idx) {
    return `
        <div class="matching-container">
            <div class="matching-column">
                ${question.pairs.map((pair, i) => `
                    <div class="matching-item-row" style="margin-bottom: 1rem;">
                        <p style="margin-bottom: 0.5rem; font-weight: 600;">${pair.item}</p>
                        <select class="matching-select" data-pair-idx="${i}" 
                                onchange="saveMatchingAnswer(${idx}, ${i}, this.value)"
                                style="width: 100%; padding: 0.5rem; border: 2px solid var(--gold-light); border-radius: 6px;">
                            <option value="">Select answer...</option>
                            ${pair.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Build chord progression question
function buildChordProgression(question, idx) {
    return `
        <div class="chord-slots">
            ${question.chordSlots.map((slot, i) => `
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                    <span style="min-width: 150px;">${slot.position}:</span>
                    <select class="chord-select" data-slot-idx="${i}"
                            onchange="saveChordAnswer(${idx}, ${i}, this.value)"
                            style="padding: 0.5rem 1rem; border: 2px solid var(--gold-light); border-radius: 6px;">
                        <option value="">Select...</option>
                        ${slot.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `).join('')}
        </div>
    `;
}

// Select option (multiple choice)
function selectOption(element, qIdx) {
    // Remove previous selection
    element.parentElement.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    // Save answer
    state.answers[qIdx] = element.dataset.value;
    updateQuestionDots();
}

// Select true/false
function selectTF(element, qIdx, stmtIdx, value) {
    // Initialize answer object if needed
    if (!state.answers[qIdx]) {
        state.answers[qIdx] = {};
    }
    
    // Remove selection from sibling buttons
    const parent = element.parentElement;
    parent.querySelectorAll('.tf-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    
    // Save answer
    state.answers[qIdx][stmtIdx] = value;
    updateQuestionDots();
}

// Save fill-blank answer
function saveBlankAnswer(qIdx, value) {
    state.answers[qIdx] = value.trim();
    updateQuestionDots();
}

// Save matching answer
function saveMatchingAnswer(qIdx, pairIdx, value) {
    if (!state.answers[qIdx]) {
        state.answers[qIdx] = {};
    }
    state.answers[qIdx][pairIdx] = value;
    updateQuestionDots();
}

// Save chord progression answer
function saveChordAnswer(qIdx, slotIdx, value) {
    if (!state.answers[qIdx]) {
        state.answers[qIdx] = [];
    }
    state.answers[qIdx][slotIdx] = value;
    updateQuestionDots();
}

// Restore previous answer
function restoreAnswer(question, idx) {
    const answer = state.answers[idx];
    
    switch (question.type) {
        case 'multiple-choice':
            const opt = document.querySelector(`.option[data-value="${answer}"]`);
            if (opt) opt.classList.add('selected');
            break;
            
        case 'true-false-multi':
            Object.entries(answer || {}).forEach(([stmtIdx, value]) => {
                const btn = document.querySelector(`.true-false-item[data-stmt-idx="${stmtIdx}"] .tf-btn[data-value="${value}"]`);
                if (btn) btn.classList.add('selected');
            });
            break;
            
        case 'fill-blank':
            const input = document.getElementById(`blank-${idx}`);
            if (input) input.value = answer || '';
            break;
            
        case 'matching':
            Object.entries(answer || {}).forEach(([pairIdx, value]) => {
                const select = document.querySelector(`.matching-select[data-pair-idx="${pairIdx}"]`);
                if (select) select.value = value;
            });
            break;
            
        case 'chord-progression':
            (answer || []).forEach((value, slotIdx) => {
                const select = document.querySelector(`.chord-select[data-slot-idx="${slotIdx}"]`);
                if (select) select.value = value;
            });
            break;
    }
}

// Check answer (practice mode)
function checkAnswer() {
    const idx = state.currentQuestion;
    const question = state.questions[idx];
    const answer = state.answers[idx];
    
    if (answer === undefined || (typeof answer === 'object' && Object.keys(answer).length === 0)) {
        alert('Please select an answer first');
        return;
    }
    
    const result = evaluateAnswer(question, answer);
    state.questionResults[idx] = result.correct;
    
    // Show feedback
    const feedback = document.getElementById(`feedback-${idx}`);
    feedback.classList.add('show', result.correct ? 'correct' : 'incorrect');
    feedback.querySelector('.feedback-title').textContent = result.correct ? '✓ Correct!' : '✗ Incorrect';
    feedback.querySelector('.feedback-text').textContent = result.message;
    
    // Highlight correct/incorrect options
    highlightAnswers(question, answer, idx);
    
    // Update score display
    if (result.correct) {
        state.score += question.marks;
    }
    document.getElementById('scoreText').textContent = `Score: ${state.score}/${state.totalMarks}`;
    
    // Update dots
    updateQuestionDots();
}

// Evaluate answer
function evaluateAnswer(question, answer) {
    switch (question.type) {
        case 'multiple-choice':
            return {
                correct: answer === question.correctAnswer,
                message: answer === question.correctAnswer 
                    ? 'Well done!' 
                    : `The correct answer is: ${question.correctAnswer}`
            };
            
        case 'true-false-multi':
            const allCorrect = question.statements.every((stmt, i) => answer[i] === stmt.correct);
            const correctCount = question.statements.filter((stmt, i) => answer[i] === stmt.correct).length;
            return {
                correct: allCorrect,
                message: allCorrect 
                    ? 'All answers correct!' 
                    : `${correctCount}/${question.statements.length} correct`
            };
            
        case 'fill-blank':
            const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
            return {
                correct: isCorrect,
                message: isCorrect ? 'Correct!' : `The correct answer is: ${question.correctAnswer}`
            };
            
        case 'matching':
            const matchCorrect = question.pairs.every((pair, i) => answer[i] === pair.correct);
            const matchCount = question.pairs.filter((pair, i) => answer[i] === pair.correct).length;
            return {
                correct: matchCorrect,
                message: matchCorrect 
                    ? 'All matches correct!' 
                    : `${matchCount}/${question.pairs.length} correct`
            };
            
        case 'chord-progression':
            const chordCorrect = question.correctAnswers.every((c, i) => answer[i] === c);
            const chordCount = question.correctAnswers.filter((c, i) => answer[i] === c).length;
            return {
                correct: chordCorrect,
                message: chordCorrect 
                    ? 'All chords correct!' 
                    : `${chordCount}/${question.correctAnswers.length} correct`
            };
            
        default:
            return { correct: false, message: 'Unknown question type' };
    }
}

// Highlight correct/incorrect answers visually
function highlightAnswers(question, answer, idx) {
    switch (question.type) {
        case 'multiple-choice':
            document.querySelectorAll('.option').forEach(opt => {
                if (opt.dataset.value === question.correctAnswer) {
                    opt.classList.add('correct');
                } else if (opt.dataset.value === answer && answer !== question.correctAnswer) {
                    opt.classList.add('incorrect');
                }
            });
            break;
            
        case 'true-false-multi':
            question.statements.forEach((stmt, i) => {
                const item = document.querySelector(`.true-false-item[data-stmt-idx="${i}"]`);
                const selectedBtn = item.querySelector('.tf-btn.selected');
                if (selectedBtn) {
                    if (answer[i] === stmt.correct) {
                        selectedBtn.classList.add('correct');
                    } else {
                        selectedBtn.classList.add('incorrect');
                        // Also highlight the correct answer
                        const correctBtn = item.querySelector(`.tf-btn[data-value="${stmt.correct}"]`);
                        if (correctBtn) correctBtn.classList.add('correct');
                    }
                }
            });
            break;
            
        case 'fill-blank':
            const input = document.getElementById(`blank-${idx}`);
            if (input) {
                input.classList.add(answer.toLowerCase() === question.correctAnswer.toLowerCase() ? 'correct' : 'incorrect');
            }
            break;
    }
}

// Navigate to previous question
function previousQuestion() {
    if (state.currentQuestion > 0) {
        showQuestion(state.currentQuestion - 1);
    }
}

// Navigate to next question
function nextQuestion() {
    if (state.currentQuestion < state.questions.length - 1) {
        showQuestion(state.currentQuestion + 1);
    }
}

// Submit exam
function submitExam() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
    
    // Calculate final score
    let totalScore = 0;
    const sectionScores = {};
    
    state.questions.forEach((q, idx) => {
        const answer = state.answers[idx];
        if (answer !== undefined) {
            const result = evaluateAnswer(q, answer);
            if (result.correct) {
                totalScore += q.marks;
            }
            
            // Track section scores
            if (!sectionScores[q.section]) {
                sectionScores[q.section] = { earned: 0, total: 0 };
            }
            sectionScores[q.section].total += q.marks;
            if (result.correct) {
                sectionScores[q.section].earned += q.marks;
            }
        }
    });
    
    state.score = totalScore;
    
    // Save result
    saveResult(totalScore, sectionScores);
    
    // Show results
    showResults(totalScore, sectionScores);
}

// Save result to localStorage
function saveResult(score, sectionScores) {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    
    results.push({
        studentName: state.currentUser?.name || 'Anonymous',
        date: new Date().toISOString(),
        mode: state.mode,
        score: score,
        totalMarks: state.totalMarks,
        sectionScores: sectionScores,
        answers: state.answers,
        timeTaken: state.mode === 'exam' ? formatTime(7200 - state.timeRemaining) : null
    });
    
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

// Format time
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

// Show results page
function showResults(score, sectionScores) {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    const percentage = Math.round((score / state.totalMarks) * 100);
    document.getElementById('finalScore').textContent = `${score}/${state.totalMarks}`;
    
    let gradeMessage = '';
    if (percentage >= 90) gradeMessage = 'Outstanding! 🌟';
    else if (percentage >= 75) gradeMessage = 'Excellent work! ✨';
    else if (percentage >= 60) gradeMessage = 'Good effort! 👍';
    else if (percentage >= 50) gradeMessage = 'Pass - Keep practicing! 📚';
    else gradeMessage = 'More practice needed 💪';
    
    document.getElementById('scorePercentage').textContent = `${percentage}% - ${gradeMessage}`;
    
    // Build section breakdown
    const sectionNames = {
        rhythm: 'Rhythm',
        pitch: 'Pitch',
        keys: 'Keys & Scales',
        intervals: 'Intervals',
        chords: 'Chords',
        terms: 'Terms & Signs',
        context: 'Music in Context'
    };
    
    const breakdown = document.getElementById('scoreBreakdown');
    breakdown.innerHTML = Object.entries(sectionScores).map(([section, data]) => `
        <div class="score-item">
            <div class="score-item-value">${data.earned}/${data.total}</div>
            <div class="score-item-label">${sectionNames[section] || section}</div>
        </div>
    `).join('');
}

// Review answers after exam
function reviewAnswers() {
    state.mode = 'review';
    document.getElementById('results').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('checkBtn').classList.add('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');
    
    // Mark all answers
    state.questions.forEach((q, idx) => {
        const answer = state.answers[idx];
        if (answer !== undefined) {
            const result = evaluateAnswer(q, answer);
            state.questionResults[idx] = result.correct;
        }
    });
    
    showQuestion(0);
    
    // Auto-check all answers for display
    setTimeout(() => {
        const idx = state.currentQuestion;
        const question = state.questions[idx];
        const answer = state.answers[idx];
        if (answer !== undefined) {
            highlightAnswers(question, answer, idx);
            const result = evaluateAnswer(question, answer);
            const feedback = document.getElementById(`feedback-${idx}`);
            feedback.classList.add('show', result.correct ? 'correct' : 'incorrect');
            feedback.querySelector('.feedback-title').textContent = result.correct ? '✓ Correct!' : '✗ Incorrect';
            feedback.querySelector('.feedback-text').textContent = result.message;
        }
    }, 100);
}

// View student details (teacher dashboard)
function viewStudentDetails(idx) {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    const result = results[idx];
    
    if (result) {
        alert(`
Student: ${result.studentName}
Date: ${new Date(result.date).toLocaleString()}
Mode: ${result.mode}
Score: ${result.score}/${result.totalMarks} (${Math.round(result.score/result.totalMarks*100)}%)
Time: ${result.timeTaken || 'N/A'}
        `);
    }
}

// Make functions available globally
window.showHome = showHome;
window.showLogin = showLogin;
window.closeModal = closeModal;
window.handleLogin = handleLogin;
window.startQuiz = startQuiz;
window.goToQuestion = goToQuestion;
window.selectOption = selectOption;
window.selectTF = selectTF;
window.saveBlankAnswer = saveBlankAnswer;
window.saveMatchingAnswer = saveMatchingAnswer;
window.saveChordAnswer = saveChordAnswer;
window.checkAnswer = checkAnswer;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.submitExam = submitExam;
window.reviewAnswers = reviewAnswers;
window.handleUpload = handleUpload;
window.viewStudentDetails = viewStudentDetails;
