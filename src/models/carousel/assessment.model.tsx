export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}


export interface AssessmentProps {
  questions: Question[];
}
