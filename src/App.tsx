import { useState } from 'react'
import StartScreen from './components/StartScreen'
import QuestionScreen from './components/QuestionScreen'
import FreeInputScreen from './components/FreeInputScreen'
import ResultScreen from './components/ResultScreen'
import type { Screen } from './types'

function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [freeText, setFreeText] = useState<string>('')

  const handleStart = () => {
    setScreen('questions')
  }

  const handleQuestionsComplete = (completedAnswers: Record<string, number>) => {
    setAnswers(completedAnswers)
    setScreen('free-input')
  }

  const handleFreeInputComplete = (text: string) => {
    setFreeText(text)
    setScreen('result')
  }

  const handleBackToQuestions = () => {
    setScreen('questions')
  }

  const handleRestart = () => {
    setAnswers({})
    setFreeText('')
    setScreen('start')
  }

  return (
    <>
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'questions' && <QuestionScreen onComplete={handleQuestionsComplete} />}
      {screen === 'free-input' && (
        <FreeInputScreen
          onComplete={handleFreeInputComplete}
          onBack={handleBackToQuestions}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          answers={answers}
          freeText={freeText}
          onRestart={handleRestart}
        />
      )}
    </>
  )
}

export default App
