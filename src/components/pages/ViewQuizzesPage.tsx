import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, deleteQuiz } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const ViewQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const handleDelete = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      const data = await fetchQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const handleUpdate = (quizId: string) => {
    navigate(`/update-quiz/${quizId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View Quizzes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow-lg">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{quiz.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleUpdate(quiz.id)}>Update</Button>
                <Button onClick={() => handleDelete(quiz.id)} variant="destructive">
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewQuizzesPage;