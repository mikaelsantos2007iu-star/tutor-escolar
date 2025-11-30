import React, { useState } from 'react';
import { Gamepad2, CheckCircle, XCircle, Trophy, ArrowRight, Play } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { Quiz as QuizType } from '../types';
import { Button } from '../components/Button';

export const Quiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const handleStartQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setQuiz(null);
    setGameFinished(false);
    setCurrentQuestion(0);
    setScore(0);
    
    try {
      const data = await generateQuiz(topic);
      setQuiz(data);
    } catch (e) {
      alert("Erro ao gerar quiz. Tente outro tópico.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quiz?.questions[currentQuestion].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameFinished(true);
    }
  };

  const resetGame = () => {
    setQuiz(null);
    setTopic('');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Gamepad2 className="text-indigo-600 dark:text-purple-400" size={36} />
            Quiz Educativo IA
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Teste seus conhecimentos com perguntas geradas na hora.</p>
        </div>

        {/* Start Screen */}
        {!quiz && !isLoading && (
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/10 text-center">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Sobre o que você quer aprender?</label>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Tabela Periódica, Revolução Francesa..."
                className="flex-1 rounded-xl border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleStartQuiz()}
              />
              <Button onClick={handleStartQuiz} variant="glow">
                <Play size={20} />
              </Button>
            </div>
            {/* Quick topics */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Matemática Básica', 'Biologia Celular', 'História do Brasil', 'Inglês'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="animate-pulse text-indigo-400 font-medium">Gerando desafios...</p>
          </div>
        )}

        {/* Quiz Game */}
        {quiz && !gameFinished && !isLoading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden relative">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-slate-800 h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Questão {currentQuestion + 1}/{quiz.questions.length}</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Score: {score}</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
                {quiz.questions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option, idx) => {
                  let buttonStyle = "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500";
                  
                  if (selectedAnswer !== null) {
                    if (idx === quiz.questions[currentQuestion].correctAnswerIndex) {
                      buttonStyle = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400";
                    } else if (idx === selectedAnswer) {
                      buttonStyle = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400";
                    } else {
                      buttonStyle = "opacity-50 grayscale";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg ${buttonStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer !== null && idx === quiz.questions[currentQuestion].correctAnswerIndex && <CheckCircle className="text-green-500" />}
                        {selectedAnswer === idx && idx !== quiz.questions[currentQuestion].correctAnswerIndex && <XCircle className="text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {showExplanation && (
                <div className="mt-8 animate-fade-in">
                   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-6">
                      <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                        <strong>Explicação:</strong> {quiz.questions[currentQuestion].explanation}
                      </p>
                   </div>
                   <Button onClick={nextQuestion} className="w-full" variant="glow">
                     {currentQuestion === quiz.questions.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta'} <ArrowRight className="ml-2" />
                   </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameFinished && (
          <div className="text-center bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={48} className="text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completado!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Você dominou o tema {topic}?</p>
            
            <div className="text-6xl font-display font-bold text-indigo-600 dark:text-cyan-400 mb-8">
              {score}/{quiz?.questions.length}
            </div>

            <Button onClick={resetGame} variant="primary">
              Jogar Novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};