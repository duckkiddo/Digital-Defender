"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import quizData from '@/data/quiz.json';
import { useWindowSize } from 'react-use';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  tag: string;
}

interface QuizCategory {
  [key: string]: Question[];
}

const QUIZ_LENGTH = 5; 
const QUESTION_TIME_LIMIT = 20; 

export default function QuizPage() {
  const [dailyQuizQuestions, setDailyQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizSessionSuccess, setQuizSessionSuccess] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [characterEmotion, setCharacterEmotion] = useState<'happy' | 'sad' | 'neutral' | 'thinking' | 'celebrate'>('neutral');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupEmoji, setPopupEmoji] = useState<string>('');
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { width, height } = useWindowSize();

  const loadDailyStreak = useCallback(() => {
    const lastQuizDate = localStorage.getItem('lastQuizDate');
     const streak = localStorage.getItem('dailyStreak');
     const today = new Date().toDateString();
 
     if (lastQuizDate === today) {
      setDailyStreak(streak ? parseInt(streak) : 0);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastQuizDate === yesterday.toDateString()) {
        setDailyStreak(streak ? parseInt(streak) : 0);
      } else {
        setDailyStreak(0);
      }
    }
  }, []);

  const updateDailyStreak = useCallback((correct: boolean) => {
    const today = new Date().toDateString();
    const lastQuizDate = localStorage.getItem('lastQuizDate');
    let currentStreak = dailyStreak;

    if (correct) {
      if (lastQuizDate !== today) {
        currentStreak += 1;
      }
    } else {
      currentStreak = 0;
    }

    localStorage.setItem('dailyStreak', currentStreak.toString());
    localStorage.setItem('lastQuizDate', today);
    setDailyStreak(currentStreak);
  }, [dailyStreak]);

  const generateDailyQuiz = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const dailyQuizCompleted = localStorage.getItem(`dailyQuizCompleted_${today}`);
    if (dailyQuizCompleted) {
      return []; // Quiz already completed for today
    }

    const categories = Object.keys(quizData as QuizCategory);
    let newDailyQuiz: Question[] = [];

    // Ensure we pick one question from each of the first QUIZ_LENGTH categories
    for (let i = 0; i < Math.min(QUIZ_LENGTH, categories.length); i++) {
      const categoryName = categories[i];
      const questionsInCategory = (quizData as QuizCategory)[categoryName];
      if (questionsInCategory && questionsInCategory.length > 0) {
        const randomIndex = Math.floor(Math.random() * questionsInCategory.length);
        newDailyQuiz.push(questionsInCategory[randomIndex]);
      }
    }

    // If there are more questions needed than categories, pick randomly from all remaining questions
    if (newDailyQuiz.length < QUIZ_LENGTH) {
      const allRemainingQuestions: Question[] = [];
      for (let i = QUIZ_LENGTH; i < categories.length; i++) {
        allRemainingQuestions.push(...(quizData as QuizCategory)[categories[i]]);
      }
      // Add questions from categories already used, but not the one already picked
      for (let i = 0; i < Math.min(QUIZ_LENGTH, categories.length); i++) {
        const categoryName = categories[i];
        const questionsInCategory = (quizData as QuizCategory)[categoryName];
        questionsInCategory.forEach(q => {
          if (!newDailyQuiz.some(dq => dq.id === q.id)) {
            allRemainingQuestions.push(q);
          }
        });
      }

      // Take questions serially
      newDailyQuiz = allRemainingQuestions.slice(0, QUIZ_LENGTH);
    }

    return newDailyQuiz;
  }, []);

  useEffect(() => {
    loadDailyStreak();
    const quiz = generateDailyQuiz();
    setDailyQuizQuestions(quiz);
    if (quiz.length > 0) {
      setCurrentQuestion(quiz[0]);
      setTimerActive(true);
      setTimeLeft(QUESTION_TIME_LIMIT);
    }
  }, [loadDailyStreak, generateDailyQuiz]);





  useEffect(() => {
    if (!timerActive || quizCompleted) {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit if time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, quizCompleted]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(null); // Reset correctness feedback on new selection
  };

  const handleSubmit = (timeRanOut: boolean = false) => {
    setTimerActive(false);
    if (currentQuestion && selectedOption !== null) {
      const correct = selectedOption === currentQuestion.answer;
      setIsCorrect(correct);
      setQuizCompleted(true);
      if (correct) {
        setPopupEmoji('🥳');
        setCharacterEmotion('celebrate');
      } else {
        setPopupEmoji('😔'); // Re-add this line
        setCharacterEmotion('sad');
        setQuizSessionSuccess(false);
      }
      setShowPopup(true); // Ensure this is called once after setting emoji and emotion
      setPopupPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

      setTimeout(() => {
        setShowPopup(false);
      }, 1500); // Hide pop-up after 1.5 seconds
    } else if (timeRanOut) {
      setIsCorrect(false);
      setQuizSessionSuccess(false);
      updateDailyStreak(false);
      setQuizCompleted(true);
      setCharacterEmotion('sad');
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < dailyQuizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(dailyQuizQuestions[nextIndex]);
      setSelectedOption(null);
      setIsCorrect(null);
      setQuizCompleted(false);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setTimerActive(true);
      setCharacterEmotion('neutral');
    } else {
      // All daily questions completed
      setCurrentQuestion(null);
       setQuizCompleted(true);
       setTimerActive(false);
       console.log('handleNextQuestion: Quiz completed. quizSessionSuccess:', quizSessionSuccess);
      if (quizSessionSuccess) {
        updateDailyStreak(true);
        console.log('handleNextQuestion: Calling updateDailyStreak(true)');
      } else {
        updateDailyStreak(false);
        console.log('handleNextQuestion: Calling updateDailyStreak(false)');
      }
      localStorage.setItem(`dailyQuizCompleted_${new Date().toISOString().slice(0, 10)}`, 'true');
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Daily Quiz</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-semibold">Quiz Completed for Today!</p>
            <p>Come back tomorrow for more questions.</p>
            <p>Your current streak: {dailyStreak} 🔥</p>

          </CardContent>
        </Card>

        {/* Daily Streak Display */}
        <div className="fixed bottom-4 left-4 flex items-center space-x-2 bg-card p-3 rounded-lg shadow-lg">
            <span className="text-lg font-bold">{dailyStreak} Days 🔥</span>
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
            <CardTitle className="text-center">Daily Quiz</CardTitle>
            <p className="text-center text-sm text-muted-foreground">Daily Streak: {dailyStreak}</p>
            <p className="text-center text-sm text-muted-foreground">Category: {currentQuestion.tag}</p>
            <p className="text-center text-sm font-bold">Time Left: {timeLeft}s</p>

          </CardHeader>
          <CardContent className="space-y-4">

          {showPopup && popupEmoji === '🥳' && (
              <div className="fixed inset-0 bg-transparent flex items-center justify-center z-40 animate-fade-in">
                <div className="flex flex-col items-center justify-center h-full w-full">
              <div
                className="relative text-8xl animate-pop-in-bounce"
              >
                {popupEmoji}
              </div>
            </div>
            </div>
          )}

          <style jsx global>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes pop-in-bounce {
              0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
              50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(1); }
            }
          `}</style>
          <p className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {dailyQuizQuestions.length}:</p>
          <p>{currentQuestion.question}</p>
          <div className="flex flex-col space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedOption === option ? (isCorrect === true ? "success" : isCorrect === false ? "destructive" : "default") : (quizCompleted && option === currentQuestion.answer ? "success" : "outline")}
                onClick={() => handleOptionSelect(option)}
                disabled={quizCompleted || !timerActive}
              >
                {option}
              </Button>
            ))}
          </div>
          {isCorrect !== null && (
            <p className={`text-center font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'Correct!' : `Incorrect. The answer was: ${currentQuestion.answer}`}
            </p>
          )}
        </CardContent>
        <CardFooter>
          {!quizCompleted ? (
            <Button className="w-full" onClick={() => handleSubmit()} disabled={selectedOption === null || !timerActive}>
              Submit Answer
            </Button>
          ) : (
            <Button className="w-full" onClick={handleNextQuestion}>
              {currentQuestionIndex + 1 < dailyQuizQuestions.length ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}