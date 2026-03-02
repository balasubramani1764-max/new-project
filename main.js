// --- CONFIGURATION ---
const ADMIN_PASS = "admin123"; // The secret password
let questions = JSON.parse(localStorage.getItem('quiz_questions')) || [];
let userScores = JSON.parse(localStorage.getItem('quiz_scores')) || [];
let currentUser = "";
let currentIdx = 0;
let score = 0;
let isAdminAuth = false;

// --- PANEL NAVIGATION ---
function showPanel(type) {
    document.getElementById('user-panel').classList.toggle('hidden', type !== 'user');
    document.getElementById('admin-panel').classList.toggle('hidden', type !== 'admin');
    if(type === 'admin' && isAdminAuth) renderAdminData();
}

function switchTab(tab) {
    document.getElementById('tab-manage').classList.toggle('hidden', tab !== 'manage');
    document.getElementById('tab-results').classList.toggle('hidden', tab !== 'results');
}

// --- USER LOGIC ---
function loginUser() {
    const name = document.getElementById('userName').value;
    if(!name) return alert("Enter your name");
    currentUser = name;
    document.getElementById('user-login-box').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = "Student: " + currentUser;
    startQuiz();
}

function startQuiz() {
    if(questions.length === 0) {
        document.getElementById('display-question').innerText = "No questions available.";
        return;
    }
    currentIdx = 0; score = 0;
    document.getElementById('quiz-finished-msg').classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentIdx];
    const oBox = document.getElementById('options-container');
    if(currentIdx < questions.length) {
        document.getElementById('display-question').innerText = q.q;
        oBox.innerHTML = q.options.map((opt, i) => 
            `<button class="option-btn" onclick="checkAns(${i})">${opt}</button>`).join('');
    } else {
        finishQuiz();
    }
}

function checkAns(i) {
    if(i === questions[currentIdx].correct) score++;
    currentIdx++;
    showQuestion();
}

function finishQuiz() {
    userScores.push({ name: currentUser, score: `${score}/${questions.length}`, date: new Date().toLocaleDateString() });
    localStorage.setItem('quiz_scores', JSON.stringify(userScores));
    document.getElementById('display-question').innerText = "";
    document.getElementById('options-container').innerHTML = "";
    document.getElementById('quiz-finished-msg').classList.remove('hidden');
}

function logoutUser() {
    currentUser = "";
    document.getElementById('userName').value = "";
    document.getElementById('user-login-box').classList.remove('hidden');
    document.getElementById('quiz-area').classList.add('hidden');
}

// --- ADMIN LOGIC ---
function checkAdminPassword() {
    if(document.getElementById('adminPassInput').value === ADMIN_PASS) {
        isAdminAuth = true;
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        renderAdminData();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function addQuestion() {
    const text = document.getElementById('questText').value;
    const opts = [document.getElementById('opt1').value, document.getElementById('opt2').value, document.getElementById('opt3').value];
    const corr = parseInt(document.getElementById('correctIndex').value);
    if(text && opts[0]) {
        questions.push({ q: text, options: opts, correct: corr });
        localStorage.setItem('quiz_questions', JSON.stringify(questions));
        renderAdminData();
        document.getElementById('questText').value = "";
    }
}

function renderAdminData() {
    // Render Questions
    document.getElementById('admin-quest-list').innerHTML = questions.map((q, i) => 
        `<li>${q.q} <button onclick="deleteQ(${i})">X</button></li>`).join('');
    // Render Results
    document.getElementById('results-body').innerHTML = userScores.map(s => 
        `<tr><td>${s.name}</td><td><b>${s.score}</b></td><td>${s.date}</td></tr>`).join('');
}

function deleteQ(i) { questions.splice(i, 1); localStorage.setItem('quiz_questions', JSON.stringify(questions)); renderAdminData(); }
function clearResults() { if(confirm("Clear all scores?")) { userScores = []; localStorage.setItem('quiz_scores', JSON.stringify(userScores)); renderAdminData(); } }
function logoutAdmin() { isAdminAuth = false; document.getElementById('adminPassInput').value = ""; showPanel('admin'); }