import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { MagicCard } from "../ui/magic-card";
import { useTheme } from "../dark-mode/theme-provider";
import { ConfettiButton } from "../ui/confetti";
import { CheckCircle, XCircle } from "lucide-react";
import { saveResultToDB } from "@/utils/indexedDB";
import AiExplanationPopover from "@/functions/AiExplanationPopover";

export default function PassQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
  });

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submittedAnswer, setSubmittedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState([]);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quizToPass = savedQuizzes.find((quiz) => quiz.id === quizId);

    if (quizToPass) {
      setQuiz(quizToPass);
      setTimeLeft(quizToPass.timeLimit * 60); // Set initial time in seconds
    } else {
      console.error("Quiz not found");
      navigate("/quizzes");
    }
  }, [quizId, navigate]);

  const handleStudentInfoSubmit = (e) => {
    e.preventDefault();
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answers.find((answer) => answer.id === selectedAnswer)?.isCorrect;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setSubmittedAnswer(selectedAnswer);

    setStudentAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answerId: selectedAnswer,
        answerText: currentQuestion.answers.find((answer) => answer.id === selectedAnswer)?.text,
        isCorrect,
        correctAnswer: currentQuestion.answers.find((answer) => answer.isCorrect)?.text,
        explanation: currentQuestion.explanation,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setSubmittedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setQuizFinished(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizFinished]);

  useEffect(() => {
    if (quiz) {
      let randomizedQuestions = [...quiz.questions];
      if (quiz.randomizeQuestions) {
        randomizedQuestions = randomizedQuestions.sort(() => Math.random() - 0.5);
      }

      randomizedQuestions = randomizedQuestions.map((question) => {
        let randomizedAnswers = [...question.answers];
        if (quiz.randomizeAnswers) {
          randomizedAnswers = randomizedAnswers.sort(() => Math.random() - 0.5);
        }
        return { ...question, answers: randomizedAnswers };
      });

      setQuestions(randomizedQuestions);
    }
  }, [quiz]);

  useEffect(() => {
    if (quizFinished) {
      const result = {
        studentInfo,
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        totalQuestions: questions.length,
        studentAnswers,
        timestamp: new Date().toISOString(),
      };

      saveResultToDB("QuizResultsDB", "results", result)
        .then(() => {
          console.log("Result saved to IndexedDB");
        })
        .catch((error) => {
          console.error("Failed to save result:", error);
        });
    }
  }, [quizFinished]);

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setSubmittedAnswer(null);
    setScore(0);
    setTimeLeft(quiz.timeLimit * 60);
    setStudentAnswers([]);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!quiz) return <div>Loading...</div>;

  // Helper function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Student Information Section */}
      {!quizStarted && (
        <MagicCard
          className="flex flex-col rounded-lg md:rounded-xl lg:p-6"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Student Information</CardTitle>
            <CardDescription className="text-lg">
              Please enter your details to start the quiz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStudentInfoSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-lg">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className="text-lg p-4"
                  required
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                  className="text-lg p-4"
                  required
                />
              </div>
              <Button type="submit" className="w-full text-lg p-6">
                Start Quiz
              </Button>
            </form>
          </CardContent>
        </MagicCard>
      )}

      {/* Quiz Section */}
      {quizStarted && !quizFinished && (
        <MagicCard
          className="flex flex-col rounded-lg md:rounded-xl lg:p-6"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <CardHeader>
            <div className="flex justify-between p-4 items-center">
              <CardTitle className="text-3xl font-bold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              {/* Timer Button */}
              <Button
                variant="secondary"
                className={`text-4xl h-16 font-bold ${
                  timeLeft <= 30 ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
              >
                {formatTime(timeLeft)}
              </Button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions[currentQuestionIndex].image && (
              <div className="flex justify-center">
                <img
                  src={questions[currentQuestionIndex].image}
                  alt="Question"
                  className="max-w-full h-48 object-contain rounded-lg"
                />
              </div>
            )}
            <h3 className="text-2xl font-semibold">
              {questions[currentQuestionIndex].text}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestionIndex].answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer.id;
                const isSubmitted = submittedAnswer !== null;
                const isCorrect = answer.isCorrect;

                return (
                  <Button
                    key={answer.id}
                    variant={
                      isSubmitted
                        ? isCorrect
                          ? "default"
                          : isSelected
                          ? "destructive"
                          : "outline"
                        : isSelected
                        ? "default"
                        : "outline"
                    }
                    className={`w-full text-left justify-start text-lg p-6 ${
                      isSubmitted && isCorrect
                        ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                        : isSubmitted && isSelected && !isCorrect
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(answer.id)}
                    disabled={isSubmitted}
                  >
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="secondary"
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                      >
                        <span className="text-lg font-bold uppercase">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </Button>
                      <span className="text-xl">{answer.text}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {submittedAnswer === null ? (
              <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null} className="text-lg p-6">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="text-lg p-6">
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </CardFooter>
        </MagicCard>
      )}

      {/* Quiz Finished Section */}
      {quizFinished && (
        <MagicCard
          className="flex flex-col rounded-lg md:rounded-xl lg:p-6"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Quiz Finished</CardTitle>
            <CardDescription className="text-lg">
              Your score: {score} out of {questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col justify-center">
            <p className="text-center text-2xl">Thank you for completing the quiz!</p>
            {score === questions.length && (
              <ConfettiButton
                options={{
                  get angle() {
                    return Math.random() * 360;
                  },
                }}
                className="text-lg p-6"
              >
                Click to celebrate 🎉
              </ConfettiButton>
            )}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Detailed Results</h3>
              {questions.map((question, index) => {
                const studentAnswer = studentAnswers.find(
                  (answer) => answer.questionId === question.id
                );
                const correctAnswer = question.answers.find((answer) => answer.isCorrect);

                return (
                  <Card key={question.id} className="p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      {question.image && (
                        <img
                          src={question.image}
                          alt="Question"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">Question {index + 1}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{question.text}</p>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Your Answer:</span>
                            {studentAnswer?.answerText}
                            {studentAnswer?.isCorrect ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="h-4 w-4" />
                                <span>Correct</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-500">
                                <XCircle className="h-4 w-4" />
                                <span>Incorrect</span>
                              </div>
                            )}
                          </div>
                          {!studentAnswer?.isCorrect && (
                            <p>
                              <span className="font-semibold">Correct Answer:</span>{" "}
                              {correctAnswer?.text}
                            </p>
                          )}
                          <p>
                            <span className="font-semibold">Explanation:</span>{" "}
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                      {/* Replace the "Ask AI" button with the AiExplanationPopover */}
                      <AiExplanationPopover
                        question={question.text}
                        correctAnswer={correctAnswer?.text}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button onClick={handleRestartQuiz} className="text-lg p-6">
              Restart Quiz
            </Button>
            <Button onClick={() => navigate('/quizzes')} className="text-lg p-6">
              Back to All Quizzes
            </Button>
          </CardFooter>
        </MagicCard>
      )}
    </div>
  );
}