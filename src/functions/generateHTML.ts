// Function to generate and download HTML file
export const handleDownloadHTML = (quiz) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quiz.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .quiz-container {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 90%;
      max-width: 600px;
      text-align: center;
    }
    .quiz-header h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .quiz-header p {
      font-size: 16px;
      color: #666;
    }
    .question {
      margin: 20px 0;
    }
    .question h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .answers {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .answer-button {
      background-color: #f0f0f0;
      border: none;
      border-radius: 5px;
      padding: 10px;
      font-size: 16px;
      cursor: pointer;
      text-align: left;
    }
    .answer-button.correct {
      background-color: #d4edda;
    }
    .answer-button.incorrect {
      background-color: #f8d7da;
    }
    .timer {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .score {
      font-size: 18px;
      margin-top: 20px;
    }
    .restart-button {
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>${quiz.title}</h1>
      <p>${quiz.description}</p>
    </div>
    <div class="timer">Time Left: <span id="time-left">${quiz.timeLimit}:00</span></div>
    <div id="quiz-content">
      <!-- Questions will be dynamically inserted here -->
    </div>
    <div class="score">Score: <span id="score">0</span> / ${quiz.questions.length}</div>
    <button class="restart-button" onclick="restartQuiz()">Restart Quiz</button>
  </div>

  <script>
    const quizData = ${JSON.stringify(quiz)};
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = ${quiz.timeLimit * 60};
    let timerInterval;

    function startTimer() {
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endQuiz();
        }
      }, 1000);
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return \`\${minutes}:\${remainingSeconds < 10 ? '0' : ''}\${remainingSeconds}\`;
    }

    function loadQuestion() {
      const quizContent = document.getElementById('quiz-content');
      const question = quizData.questions[currentQuestionIndex];
      quizContent.innerHTML = \`
        <div class="question">
          <h3>\${question.text}</h3>
          <div class="answers">
            \${question.answers.map((answer, index) => \`
              <button class="answer-button" onclick="selectAnswer(\${index})">
                \${String.fromCharCode(65 + index)}. \${answer.text}
              </button>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function selectAnswer(answerIndex) {
      const question = quizData.questions[currentQuestionIndex];
      const isCorrect = question.answers[answerIndex].isCorrect;
      const answerButtons = document.querySelectorAll('.answer-button');

      answerButtons.forEach((button, index) => {
        button.disabled = true;
        if (question.answers[index].isCorrect) {
          button.classList.add('correct');
        } else if (index === answerIndex) {
          button.classList.add('incorrect');
        }
      });

      if (isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
      }

      if (currentQuestionIndex < quizData.questions.length - 1) {
        setTimeout(() => {
          currentQuestionIndex++;
          loadQuestion();
        }, 2000);
      } else {
        setTimeout(endQuiz, 2000);
      }
    }

    function endQuiz() {
      clearInterval(timerInterval);
      document.getElementById('quiz-content').innerHTML = \`
        <h3>Quiz Finished!</h3>
        <p>Your score: \${score} / \${quizData.questions.length}</p>
      \`;
    }

    function restartQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      timeLeft = ${quiz.timeLimit * 60};
      document.getElementById('score').textContent = score;
      document.getElementById('time-left').textContent = formatTime(timeLeft);
      loadQuestion();
      startTimer();
    }

    // Start the quiz
    loadQuestion();
    startTimer();
  </script>
</body>
</html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quiz.title.replace(/ /g, "_")}_quiz.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };