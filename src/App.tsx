import { ThemeProvider } from "@/components/dark-mode/theme-provider"
import { ModeToggle } from "./components/dark-mode/mode-toggle"
import Header from "./components/layout/Header"
import { Play, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar5 from "./components/layout/NavBar";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/page/Home";
import Layout from "./components/layout/Layout";
import { Quizzes } from "./components/page/Quizzes";
import NewQuiz from "./components/page/NewQuiz";
import NotFound from "./components/page/NotFound";
import EditQuiz from "./components/page/EditQuiz";
import PassQuiz from "./components/page/PassQuiz";
import HistoryQuiz from "./components/page/HistoryQuiz";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />}/>
            <Route path="/quizzes" element={<Quizzes />}/>
            <Route path="/new-quiz" element={<NewQuiz />}/>
            <Route path="/quiz/:quizId/update" element={<EditQuiz />} />
            <Route path="/quiz/:quizId/play" element={<PassQuiz />} />
            <Route path="/quiz-history" element={<HistoryQuiz />} />

            <Route path="*" element={<NotFound/>} />
          </Route>
        </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App
