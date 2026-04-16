export interface QuizStaticOption {
  id: string
  label: string
}

export interface QuizStaticScreen {
  heading: string
  intro: string
  progress: number
  backLabel: string
  questionId: string
  question: string
  options: QuizStaticOption[]
  primaryActionLabel: string
  explainerTitle: string
  explainerBody: string
}

export const solagreeQuizStaticScreen: QuizStaticScreen = {
  heading: 'Find the right Solagree divorce plan in minutes.',
  intro: 'Answer a few questions and we’ll suggest a plan to fit your unique needs.',
  progress: 20,
  backLabel: 'Back',
  questionId: 'agreement-level',
  question: 'Do you and your spouse agree on most issues?',
  options: [
    {
      id: 'agree-most',
      label: 'Yes, we agree on most things'
    },
    {
      id: 'significant-disagreements',
      label: 'No, we have significant disagreements'
    }
  ],
  primaryActionLabel: 'Next',
  explainerTitle: 'Why are we asking this?',
  explainerBody:
    'Understanding your level of agreement helps us recommend whether Solagree Expedited or Traditional is the best fit for your situation.'
}
