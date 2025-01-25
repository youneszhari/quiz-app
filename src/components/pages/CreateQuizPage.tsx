import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HiTrash, HiPlusCircle } from 'react-icons/hi';
import { createQuiz, createQuestion, createAnswer, fetchQuizzes, fetchQuestions } from '@/services/api';

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    title: '',
    description: '',
    randomize_questions: false,
    randomize_answers: false,
    time_limit: null,
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([{ text: '', is_correct: false }]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentQuiz) {
      fetchQuestions(currentQuiz.id).then(setQuestions);
    }
  }, [currentQuiz]);

  const handleChange = (field: string, value: any) => {
    setFormValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    setAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    setAnswers((prev) => [...prev, { text: '', is_correct: false }]);
  };

  const removeAnswer = (index: number) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const quiz = await createQuiz(formValue);
      setCurrentQuiz(quiz);
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
      alert('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const questionData = {
        ...currentQuestion,
        quiz_id: currentQuiz.id,
      };
      const question = await createQuestion(currentQuiz.id, questionData);
      setCurrentQuestion(question);
      fetchQuestions(currentQuiz.id).then(setQuestions);
    } catch (err) {
      setError('Failed to create question. Please try again.');
      alert('Failed to create question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const answer of answers) {
        const answerData = {
          ...answer,
          question_id: currentQuestion.id,
        };
        await createAnswer(currentQuestion.id, answerData);
      }
      fetchQuestions(currentQuiz.id).then(setQuestions);
    } catch (err) {
      setError('Failed to create answers. Please try again.');
      alert('Failed to create answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      {!currentQuiz ? (
        <form onSubmit={handleSubmitQuiz} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formValue.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formValue.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="randomize-questions"
              checked={formValue.randomize_questions}
              onCheckedChange={(checked) => handleChange('randomize_questions', !!checked)}
            />
            <Label htmlFor="randomize-questions">Randomize Questions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="randomize-answers"
              checked={formValue.randomize_answers}
              onCheckedChange={(checked) => handleChange('randomize_answers', !!checked)}
            />
            <Label htmlFor="randomize-answers">Randomize Answers</Label>
          </div>
          <div>
            <Label htmlFor="time-limit">Time Limit (in minutes)</Label>
            <Input
              id="time-limit"
              type="number"
              value={formValue.time_limit || ''}
              onChange={(e) => handleChange('time_limit', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quiz'}
          </Button>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Add Questions</h2>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            <div>
              <Label htmlFor="question-text">Question Text</Label>
              <Input
                id="question-text"
                value={currentQuestion?.text || ''}
                onChange={(e) => handleQuestionChange('text', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="explanation">Explanation (optional)</Label>
              <Input
                id="explanation"
                value={currentQuestion?.explanation || ''}
                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="image">Image (optional)</Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => handleQuestionChange('image', e.target.files[0])}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Question'}
            </Button>
          </form>
          {currentQuestion && (
            <>
              <h2 className="text-xl font-bold mb-4">Add Answers</h2>
              <form onSubmit={handleSubmitAnswers} className="space-y-4">
                {error && <div className="text-red-500">{error}</div>}
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                      placeholder={`Answer ${index + 1}`}
                      required
                    />
                    <Checkbox
                      checked={answer.is_correct}
                      onCheckedChange={(checked) => handleAnswerChange(index, 'is_correct', checked)}
                    />
                    <Label>Correct</Label>
                    <Button variant="ghost" onClick={() => removeAnswer(index)}>
                      <HiTrash className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" onClick={addAnswer} className="flex items-center space-x-2">
                  <HiPlusCircle className="h-5 w-5" />
                  <span>Add Answer</span>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Answers'}
                </Button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CreateQuizPage;