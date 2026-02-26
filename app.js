let exercises = [];
let currentIndex = 0;
let userAnswers = [];

const elements = {
    loading: document.getElementById('loading-state'),
    app: document.getElementById('app-container'),
    content: document.getElementById('exercise-content'),
    answer: document.getElementById('user-answer'),
    nextBtn: document.getElementById('next-btn'),
    submitBtn: document.getElementById('submit-btn'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    results: document.getElementById('results-container'),
    resultsList: document.getElementById('results-list')
};

async function init() {
    elements.loading.classList.remove('hidden');
    
    try {
        const response = await fetch('/.netlify/functions/generate');
        const data = await response.json();
        
        // Flatten exercises into a single array
        exercises = [
            ...data.part1.map(ex => ({ ...ex, type: 'completion' })),
            ...data.part2.map(ex => ({ ...ex, type: 'open' }))
        ];
        
        elements.loading.classList.add('hidden');
        elements.app.classList.remove('hidden');
        renderExercise();
    } catch (error) {
        console.error('Error fetching exercises:', error);
        alert('Failed to load exercises. Please refresh the page.');
    }
}

function renderExercise() {
    const ex = exercises[currentIndex];
    elements.answer.value = '';
    
    let html = '';
    if (ex.type === 'completion') {
        html = `
            <p class="instruction">Part 1: Analogy Completion</p>
            <div class="analogy-prompt">${ex.a} : ${ex.b} :: ${ex.c} : ?</div>
        `;
    } else {
        html = `
            <p class="instruction">Part 2: Open-Ended Far Analogy</p>
            <div class="analogy-prompt">Connect <strong>${ex.domainA}</strong> and <strong>${ex.domainB}</strong></div>
            <p class="instruction">Describe the deep relational structure linking these two concepts.</p>
        `;
    }
    
    elements.content.innerHTML = html;
    updateProgress();
    
    // Toggle buttons
    if (currentIndex === exercises.length - 1) {
        elements.nextBtn.classList.add('hidden');
        elements.submitBtn.classList.remove('hidden');
    }
}

function updateProgress() {
    const progress = ((currentIndex + 1) / exercises.length) * 100;
    elements.progressBar.style.setProperty('--progress', `${progress}%`);
    elements.progressText.innerText = `Exercise ${currentIndex + 1}/${exercises.length}`;
}

function handleNext() {
    userAnswers.push(elements.answer.value);
    currentIndex++;
    renderExercise();
}

function handleSubmit() {
    userAnswers.push(elements.answer.value);
    elements.app.classList.add('hidden');
    elements.results.classList.remove('hidden');
    
    let resultsHtml = '';
    exercises.forEach((ex, i) => {
        const questionText = ex.type === 'completion' 
            ? `${ex.a}:${ex.b} :: ${ex.c}:?` 
            : `Connection between ${ex.domainA} and ${ex.domainB}`;
            
        resultsHtml += `
            <div class="result-item">
                <div class="result-q">Q: ${questionText}</div>
                <div class="result-a">Your Answer: ${userAnswers[i] || '<i>No answer provided</i>'}</div>
            </div>
        `;
    });
    
    elements.resultsList.innerHTML = resultsHtml;
}

elements.nextBtn.addEventListener('click', handleNext);
elements.submitBtn.addEventListener('click', handleSubmit);

init();