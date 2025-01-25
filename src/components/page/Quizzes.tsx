import { useTheme } from "@/components/dark-mode/theme-provider";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trash2, Play, Edit, MoreVertical, Download } from "lucide-react"; // Import icons
import { FaPlay } from "react-icons/fa";
import logo from "../../assets/logo.png";

import { MagicCard } from "@/components/ui/magic-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import dropdown components

import { handleDownloadHTML } from "@/functions/generateHTML";
import { handleDownloadPDF } from "@/functions/generatePDF";

// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

export function Quizzes() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes

  // Fetch quizzes from localStorage on component mount
  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    setQuizzes(savedQuizzes);
  }, []);

  // Function to delete a quiz
  const handleDeleteQuiz = (quizId) => {
    const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Increased stagger delay for slower animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8, // Increased duration for slower animation
        ease: "easeOut", // Use easeOut for a smoother transition
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }, // Exit animation for deleting a quiz
  };

  return (
    <>
      {/* Header Section */}
      <MagicCard
        className="flex flex-col items-center rounded-lg p-8 text-center md:rounded-xl lg:p-16"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
          All Quizzes
        </h3>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis!
        </p>
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
          <Button className="w-full sm:w-auto" onClick={() => navigate("/new-quiz")}>
            Create a new quiz
          </Button>
        </div>
      </MagicCard>

      {/* Quizzes Grid Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 rounded-lg shadow-sm w-full gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {quizzes.length === 0 ? (
            <motion.div
              className="col-span-full text-center text-muted-foreground"
              variants={itemVariants}
            >
              <p className="text-lg">No quizzes available. Create a new quiz to get started!</p>
            </motion.div>
          ) : (
            quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit" // Exit animation for deleting a quiz
              >
                <MagicCard
                  className="flex flex-col justify-between h-full p-4"
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                >
                  {/* Top Section: Title and Dropdown Menu */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1 overflow-hidden h-20">
                      <h4 className="text-xl font-semibold truncate" title={quiz.title}>
                        {quiz.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2" title={quiz.description}>
                        {quiz.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" /> {/* Ellipsis icon */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadHTML(quiz)}>
                          <Download className="mr-2 h-4 w-4" /> Download HTML
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadPDF(quiz)}>
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Image Placeholder */}
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center my-4">
                    {quiz.image ? (
                      <img
                        src={quiz.image}
                        alt={quiz.title}
                        className=" h-28  rounded-lg"
                      />
                    ) : (
                      <img
                        src={logo}
                        alt="Logo"
                        className="h-28"
                      />
                    )}
                  </div>

                  {/* Bottom Section: Question Count and Buttons */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {quiz.questions.length} {quiz.questions.length === 1 ? "Question" : "Questions"}
                    </span>
                    <div className="flex gap-2">
                      {/* Play Button */}
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full p-4 bg-green-500 hover:bg-green-600 dark:hover:bg-green-700 dark:bg-green-600 " // Rounded button
                        onClick={() => navigate(`/quiz/${quiz.id}/play`)} // Navigate to play quiz
                      >
                        <FaPlay className="ml-1 h-4 w-4 dark:text-white" /> {/* Play icon */}
                      </Button>

                      {/* Update Button */}
                      <Button
                        variant="default"
                        className="  bg-orange-500 hover:bg-orange-600 dark:hover:bg-orange-700 dark:bg-orange-600 "
                        size="sm"
                        onClick={() => navigate(`/quiz/${quiz.id}/update`)} // Navigate to update quiz
                      >
                        <Edit className="h-4 w-4 dark:text-white" /> {/* Edit icon */}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.id)} // Delete the quiz
                      >
                        <Trash2 className="h-4 w-4" /> {/* Trash icon */}
                      </Button>
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}