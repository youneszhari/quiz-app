import { useEffect, useState } from "react";
import { getAllResultsFromDB } from "@/utils/indexedDB"; // Import IndexedDB utility
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // shadcn Accordion components
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react"; // Icons for correct/incorrect answers
import { MagicCard } from "../ui/magic-card";
import { useTheme } from "../dark-mode/theme-provider";

export default function HistoryQuiz() {
  const [results, setResults] = useState([]);
    const { theme } = useTheme();

  // Fetch results from IndexedDB on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const results = await getAllResultsFromDB("QuizResultsDB", "results");
        setResults(results);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Quiz History</h1>
      {results.length === 0 ? (
        <p>No quiz results found.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {results.map((result, index) => (
            <AccordionItem key={result.id} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div>
                    <h2 className="text-xl font-semibold">{result.quizTitle}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.studentInfo.name} ({result.studentInfo.email})
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    Score: {result.score} / {result.totalQuestions}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="mt-4">
                  <CardHeader>
                    <CardTitle>Detailed Results</CardTitle>
                    <CardDescription>
                      Date: {new Date(result.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.studentAnswers.map((answer, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="text-lg font-semibold">Question {idx + 1}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {answer.questionText}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Your Answer:</span>
                          {answer.answerText}
                          {answer.isCorrect ? (
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
                        {!answer.isCorrect && (
                          <p>
                            <span className="font-semibold">Correct Answer:</span>{" "}
                            {answer.correctAnswer}
                          </p>
                        )}
                        <p>
                          <span className="font-semibold">Explanation:</span>{" "}
                          {answer.explanation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </MagicCard>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}