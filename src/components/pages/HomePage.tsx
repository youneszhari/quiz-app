import { Button } from '@/components/ui/button'; // Import shadcn button
import { useNavigate } from 'react-router-dom'; // For navigation
import { FaPlus, FaList } from 'react-icons/fa'; // Import icons
import { motion } from 'framer-motion'; // For animations

const HomePage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br rounded-md from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        QUIZZIIIFY
      </h1>
      <div className="space-y-4 w-full max-w-md">
        {/* Create Quiz Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: 'spring', bounce: 0.5 },
          }}
        >
          <Button
            className="w-full py-8 text-xl bg-gold-500 hover:bg-gold-600 text-gray-900 dark:text-gold-500 dark:bg-black dark:border dark:border-gold-500 shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => navigate('/create-quiz')} // Navigate to Create Quiz page
          >
            <FaPlus /> Create Quiz
          </Button>
        </motion.div>

        {/* View Quizzes Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: 'spring', bounce: 0.5 },
          }}
        >
          <Button
            className="w-full py-8 text-xl bg-gray-900 hover:bg-gray-800 text-gray-100 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => navigate('/view-quizzes')} // Navigate to View Quizzes page
          >
            <FaList /> View Quizzes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;