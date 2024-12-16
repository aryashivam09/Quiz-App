const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const timerElement = document.getElementById("timer");
const questionNumberElement = document.getElementById("question-number");
const loadingElement = document.getElementById("loading");

let currentQuestionIndex = 0;
let score = 0;
let timer;
const totalQuestions = 10;
let questions = [];

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
    const data = await response.json();
    return data.results;
}

function startQuiz() {
    loadingElement.style.display = "block"; 
    fetchQuestions().then(fetchedQuestions => {
        questions = fetchedQuestions;
        currentQuestionIndex = 0;
        score = 0;
        nextButton.style.display = "none";
        loadQuestion(questions[currentQuestionIndex]);
    });
}

function loadQuestion(question) {
    questionElement.innerText = question.question;
    optionsElement.innerHTML = "";
    questionNumberElement.innerText = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    loadingElement.style.display = "none";
    const options = [...question.incorrect_answers, question.correct_answer];
    options.sort(() => Math.random() - 0.5); 
    options.forEach(option => {
        const button = document.createElement("div");
        button.innerText = option;
        button.classList.add("option");
        button.addEventListener("click", () => selectOption(button, option, question.correct_answer));
        optionsElement.appendChild(button);
    });

    startTimer();
}

function selectOption(selectedButton, selectedOption, correctAnswer) {
    clearTimeout(timer);
    loadingElement.style.display = "none"; 
    if (selectedOption === correctAnswer) {
        score++;
        selectedButton.classList.add("correct");
    } else {
        selectedButton.classList.add("incorrect");
    
        highlightCorrectAnswer(correctAnswer);
    }
    nextButton.style.display = "block";
}

function highlightCorrectAnswer(correctAnswer) {
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach(option => {
        if (option.innerText === correctAnswer) {
            option.classList.add("correct");
        }
    });
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    nextButton.style.display = "none";
    loadNextQuestion();
});

function loadNextQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        loadingElement.style.display = "block";
        setTimeout(() => {
            loadQuestion(questions[currentQuestionIndex]);
        }, ); 
    } else {
        displayScore();
    }
}

function displayScore() {
    quizContainer.innerHTML = `
        <div class="score-board">
            <h2>Your Score: ${score} / ${totalQuestions}</h2>
            <button onclick="location.reload()">Retry Quiz</button>
        </div>`;
}

function startTimer() {
    let timeLeft = 15;
    timerElement.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextButton.style.display = "block"; 
            loadingElement.style.display = "none"; 
            highlightCorrectAnswer(questions[currentQuestionIndex].correct_answer);
            loadNextQuestion();
        }
    }, 1000);
}

startQuiz(); 