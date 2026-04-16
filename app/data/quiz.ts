export const solagreeQuizShellContent = {
  heading: 'Find the right Solagree divorce plan in minutes.',
  intro: 'Answer a few questions and we’ll suggest a plan to fit your unique needs.'
} as const

export const solagreeQuizCompletionContent = {
  title: 'Thanks. Your answers are saved locally.',
  body:
    'This finishes the question flow and persistence slice. Result routing and recommendation screens will be connected in the next implementation step.',
  actionLabel: 'Start again'
} as const

export const solagreeQuizLabels = {
  backLabel: 'Back',
  next: 'Next',
  finish: 'Finish'
} as const

export const solagreeQuizStorageKey = 'solagree.quiz.session.v1'
