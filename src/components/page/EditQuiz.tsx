import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, CheckCircle, XCircle, Trash2, Edit } from "lucide-react";
import { MagicCard } from "../ui/magic-card";
import { useTheme } from "../dark-mode/theme-provider";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function EditQuiz() {
  const { quizId } = useParams(); // Get the quiz ID from the URL
  const navigate = useNavigate();
  const { theme } = useTheme();

  // State for quiz information
  const [quizInfo, setQuizInfo] = useState({
    id: quizId, // Use the passed quiz ID
    title: "",
    description: "",
    randomizeQuestions: true,
    randomizeAnswers: false,
    timeLimit: 0,
    image: "", // Base64 string for the quiz image
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: uuidv4(), // Unique ID for the question
    text: "",
    type: "multiple_choice",
    explanation: "",
    image: "", // Base64 string for the image
    answers: [],
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState({
    id: uuidv4(), // Unique ID for the answer
    text: "",
    isCorrect: false,
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null); // Track the question being edited

  const [errors, setErrors] = useState({
    quizTitle: "",
    timeLimit: "",
    questionText: "",
    answers: "",
    answerText: "",
    noQuestions: "", // New error for no questions
  });

  // Fetch the quiz data from localStorage on component mount
  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quizToUpdate = savedQuizzes.find((quiz) => quiz.id === quizId);

    if (quizToUpdate) {
      setQuizInfo(quizToUpdate);
      setQuestions(quizToUpdate.questions);
    } else {
      console.error("Quiz not found");
      navigate("/quizzes"); // Redirect if the quiz is not found
    }
  }, [quizId, navigate]);

  // Handle Quiz Image Upload
  const handleQuizImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuizInfo({ ...quizInfo, image: reader.result }); // Store Base64 string
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  };

  // Remove Quiz Image
  const handleRemoveQuizImage = () => {
    setQuizInfo({ ...quizInfo, image: "" }); // Clear the image
  };

  // Handle Question Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion({ ...currentQuestion, image: reader.result }); // Store Base64 string
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  };

  // Remove Question Image
  const handleRemoveImage = () => {
    setCurrentQuestion({ ...currentQuestion, image: "" }); // Clear the image
  };

  // Validate Quiz Information
  const validateQuizInfo = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!quizInfo.title.trim()) {
      newErrors.quizTitle = "Quiz title is required.";
      isValid = false;
    } else {
      newErrors.quizTitle = "";
    }

    if (quizInfo.timeLimit <= 0) {
      newErrors.timeLimit = "Time limit must be greater than 0.";
      isValid = false;
    } else {
      newErrors.timeLimit = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate Question
  const validateQuestion = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!currentQuestion.text.trim()) {
      newErrors.questionText = "Question text is required.";
      isValid = false;
    } else {
      newErrors.questionText = "";
    }

    if (currentQuestion.answers.length < 2 || currentQuestion.answers.length > 5) {
      newErrors.answers = "A question must have between 2 and 5 answers.";
      isValid = false;
    } else if (!currentQuestion.answers.some((answer) => answer.isCorrect)) {
      newErrors.answers = "At least one answer must be correct.";
      isValid = false;
    } else {
      newErrors.answers = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate Answer
  const validateAnswer = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!newAnswer.text.trim()) {
      newErrors.answerText = "Answer text is required.";
      isValid = false;
    } else {
      newErrors.answerText = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Question Type Change
  const handleQuestionTypeChange = (type) => {
    if (type === "true_false") {
      setCurrentQuestion({
        ...currentQuestion,
        type: "true_false",
        answers: [
          { id: uuidv4(), text: "True", isCorrect: false },
          { id: uuidv4(), text: "False", isCorrect: false },
        ],
      });
      setIsAddingAnswer(false);
    } else {
      setCurrentQuestion({
        ...currentQuestion,
        type: "multiple_choice",
        answers: [],
      });
    }
  };

  // Add Question
  const handleAddQuestion = () => {
    setIsAddingQuestion(true); // Show the "Add Question" section
    setEditingQuestionId(null); // Reset editing state
    setCurrentQuestion({
      id: uuidv4(), // Generate a new ID for the question
      text: "",
      type: "multiple_choice",
      explanation: "",
      image: "", // Reset the image
      answers: [],
    });
  };

  // Edit Question
  const handleEditQuestion = (questionId) => {
    const questionToEdit = questions.find((q) => q.id === questionId);
    if (questionToEdit) {
      setCurrentQuestion(questionToEdit); // Load the question into the form
      setEditingQuestionId(questionId); // Set the editing state
      setIsAddingQuestion(true); // Show the "Add Question" section
    }
  };

  // Save Question
  const handleSaveQuestion = () => {
    if (validateQuestion()) {
      if (editingQuestionId) {
        // Update the existing question
        const updatedQuestions = questions.map((q) =>
          q.id === editingQuestionId ? currentQuestion : q
        );
        setQuestions(updatedQuestions);
      } else {
        // Add a new question
        setQuestions([
          ...questions,
          {
            ...currentQuestion,
            id: uuidv4(), // Generate a new ID for the question
            answers: currentQuestion.answers.map((answer) => ({
              ...answer,
              id: uuidv4(), // Generate new IDs for answers
            })),
          },
        ]);
      }

      // Reset the form
      setCurrentQuestion({
        id: uuidv4(), // Reset with a new ID
        text: "",
        type: "multiple_choice",
        explanation: "",
        image: "", // Reset the image
        answers: [],
      });
      setIsAddingQuestion(false); // Hide the "Add Question" section after saving
      setEditingQuestionId(null); // Reset editing state
    }
  };

  // Cancel Adding/Editing Question
  const handleCancelQuestion = () => {
    setCurrentQuestion({
      id: uuidv4(), // Reset with a new ID
      text: "",
      type: "multiple_choice",
      explanation: "",
      image: "", // Reset the image
      answers: [],
    });
    setIsAddingQuestion(false); // Hide the "Add Question" section
    setEditingQuestionId(null); // Reset editing state
  };

  // Delete Question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Add Answer
  const handleAddAnswer = () => {
    setIsAddingAnswer(true);
  };

  // Save Answer
  const handleSaveAnswer = () => {
    if (validateAnswer() && currentQuestion.answers.length < 5) {
      const updatedAnswers = currentQuestion.answers.map((answer) => ({
        ...answer,
        isCorrect: newAnswer.isCorrect ? false : answer.isCorrect,
      }));

      setCurrentQuestion({
        ...currentQuestion,
        answers: [
          ...updatedAnswers,
          {
            ...newAnswer,
            id: uuidv4(), // Generate a new ID for the answer
          },
        ],
      });
      setNewAnswer({
        id: uuidv4(), // Reset with a new ID
        text: "",
        isCorrect: false,
      });
      setIsAddingAnswer(false);
    }
  };

  // Cancel Adding Answer
  const handleCancelAnswer = () => {
    setNewAnswer({
      id: uuidv4(), // Reset with a new ID
      text: "",
      isCorrect: false,
    });
    setIsAddingAnswer(false);
  };

  // Delete Answer
  const handleDeleteAnswer = (index) => {
    const updatedAnswers = currentQuestion.answers.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
  };

  // Mark Answer as Correct
  const handleMarkCorrectAnswer = (index) => {
    const updatedAnswers = currentQuestion.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));
    setCurrentQuestion({ ...currentQuestion, answers: updatedAnswers });
  };

  // Save Quiz
  const handleSaveQuiz = () => {
    const newErrors = { ...errors };

    if (!validateQuizInfo()) {
      return; // Stop if quiz info is invalid
    }

    if (questions.length === 0) {
      newErrors.noQuestions = "At least one question is required.";
      setErrors(newErrors);
      return; // Stop if no questions are added
    } else {
      newErrors.noQuestions = ""; // Clear the error if questions are added
      setErrors(newErrors);
    }

    const updatedQuiz = {
      ...quizInfo,
      questions: questions,
    };

    // Update localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const updatedQuizzes = savedQuizzes.map((quiz) =>
      quiz.id === quizId ? updatedQuiz : quiz
    );
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));

    console.log("Quiz Updated:", updatedQuiz);
    navigate("/quizzes"); // Navigate to the quizzes list after saving
  };

  // Cancel Quiz Update
  const handleCancelQuiz = () => {
    navigate("/quizzes"); // Navigate to the quizzes list
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Section 1: Quiz Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Information Section */}
        <MagicCard
          className="flex flex-col rounded-lg md:rounded-xl lg:p-4"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
            <CardDescription>Update details about your quiz.</CardDescription>
            {errors.noQuestions && <p className="text-red-500 text-sm">{errors.noQuestions}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Title</Label>
              <Input
                id="quiz-title"
                placeholder="Enter quiz title"
                value={quizInfo.title}
                onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
              />
              {errors.quizTitle && <p className="text-red-500 text-sm">{errors.quizTitle}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-description">Description</Label>
              <Input
                id="quiz-description"
                placeholder="Enter quiz description"
                value={quizInfo.description}
                onChange={(e) => setQuizInfo({ ...quizInfo, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-image">Image (Optional)</Label>
              <Input
                id="quiz-image"
                type="file"
                accept="image/*"
                onChange={handleQuizImageUpload}
              />
              {quizInfo.image && (
                <div className="mt-2">
                  <img src={quizInfo.image} alt="Quiz" className="w-20 h-20" />
                  <Button variant="destructive" size="sm" onClick={handleRemoveQuizImage} className="mt-2">
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Switch
                id="randomize-questions"
                checked={quizInfo.randomizeQuestions}
                onCheckedChange={(checked) => setQuizInfo({ ...quizInfo, randomizeQuestions: checked })}
              />
              <Label htmlFor="randomize-questions">Randomize Questions</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch
                id="randomize-answers"
                checked={quizInfo.randomizeAnswers}
                onCheckedChange={(checked) => setQuizInfo({ ...quizInfo, randomizeAnswers: checked })}
              />
              <Label htmlFor="randomize-answers">Randomize Answers</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input
                id="time-limit"
                type="number"
                placeholder="Enter time limit"
                value={quizInfo.timeLimit}
                min={1}
                onChange={(e) => setQuizInfo({ ...quizInfo, timeLimit: e.target.value })}
              />
              {errors.timeLimit && <p className="text-red-500 text-sm">{errors.timeLimit}</p>}
            </div>
          </CardContent>
        </MagicCard>

        {/* Questions List Section */}
        {!isAddingQuestion && (
          <MagicCard
            className="flex flex-col rounded-lg md:rounded-xl lg:p-4"
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Manage your quiz questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="p-4 flex justify-between items-center">
                  <div>
                    <CardTitle>{question.text}</CardTitle>
                    <CardDescription>{question.type}</CardDescription>
                    {question.image && (
                      <img src={question.image} alt="Question" className="w-20 h-20 mt-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(question.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button onClick={handleAddQuestion} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelQuiz}>
                Cancel
              </Button>
              <Button onClick={handleSaveQuiz}>Update Quiz</Button>
            </CardFooter>
          </MagicCard>
        )}

        {/* Add/Edit Question Section */}
        {isAddingQuestion && (
          <MagicCard
            className="flex flex-col rounded-lg md:rounded-xl lg:p-4"
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <CardHeader>
              <CardTitle>{editingQuestionId ? "Edit Question" : "Add Question"}</CardTitle>
              <CardDescription>Enter question details.</CardDescription>
              {errors.answers && <p className="text-red-500 text-sm">{errors.answers}</p>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Input
                  id="question-text"
                  placeholder="Enter question text"
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                />
                {errors.questionText && <p className="text-red-500 text-sm">{errors.questionText}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="question-type">Question Type</Label>
                <select
                  id="question-type"
                  className="w-full p-2 border rounded bg-background text-foreground"
                  value={currentQuestion.type}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question-explanation">Explanation</Label>
                <Input
                  id="question-explanation"
                  placeholder="Enter explanation"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="question-image">Image (Optional)</Label>
                <Input
                  id="question-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {currentQuestion.image && (
                  <div className="mt-2">
                    <img src={currentQuestion.image} alt="Question" className="w-20 h-20" />
                    <Button variant="destructive" size="sm" onClick={handleRemoveImage} className="mt-2">
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>

              {/* Answers List */}
              <div className="space-y-4">
                <Label>Answers</Label>
                {currentQuestion.answers.map((answer, index) => (
                  <Card key={answer.id} className="p-4 flex justify-between items-center">
                    <div>{answer.text}</div>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle className="h-5 w-5" />
                          <span>Correct</span>
                        </div>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleMarkCorrectAnswer(index)}
                        >
                          Mark as Correct
                        </Button>
                      )}
                      {currentQuestion.type !== "true_false" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAnswer(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {/* Add Answer Section */}
                {currentQuestion.type === "multiple_choice" && !isAddingAnswer && currentQuestion.answers.length < 5 && (
                  <Button onClick={handleAddAnswer} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
                  </Button>
                )}

                {isAddingAnswer && (
                  <MagicCard
                    className="flex flex-col rounded-lg md:rounded-xl lg:p-4"
                    gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                  >
                    <CardHeader>
                      <CardTitle>Add Answer</CardTitle>
                      <CardDescription>Enter answer details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="answer-text">Answer Text</Label>
                        <Input
                          id="answer-text"
                          placeholder="Enter answer text"
                          value={newAnswer.text}
                          onChange={(e) => setNewAnswer({ ...newAnswer, text: e.target.value })}
                        />
                        {errors.answerText && <p className="text-red-500 text-sm">{errors.answerText}</p>}
                      </div>
                      <div className="flex items-center space-x-4">
                        <Switch
                          id="is-correct"
                          checked={newAnswer.isCorrect}
                          onCheckedChange={(checked) => setNewAnswer({ ...newAnswer, isCorrect: checked })}
                        />
                        <Label htmlFor="is-correct">Is Correct</Label>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancelAnswer}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAnswer}>Save Answer</Button>
                    </CardFooter>
                  </MagicCard>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelQuestion}>
                Cancel
              </Button>
              <Button onClick={handleSaveQuestion}>
                {editingQuestionId ? "Update Question" : "Save Question"}
              </Button>
            </CardFooter>
          </MagicCard>
        )}
      </div>
    </div>
  );
}