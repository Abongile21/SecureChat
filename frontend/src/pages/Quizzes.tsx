import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Array<{ id: string; prompt: string; options: string[] }>;
};
type Lesson = {
  id: string;
  title: string;
  summary: string;
  sections: Array<{ heading: string; content: string }>;
  quizId: string;
};

type Result = { score: number; correctAnswers: number; totalQuestions: number; pointsAwarded: number };

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [selected, setSelected] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get<{ quizzes: Quiz[] }>('/quizzes'),
      apiClient.get<{ lessons: Lesson[] }>('/quizzes/lessons'),
    ])
      .then(([quizResponse, lessonResponse]) => {
        setQuizzes(quizResponse.data.quizzes);
        setLessons(lessonResponse.data.lessons);
      })
      .catch(() => setError('Quizzes are temporarily unavailable.'));
  }, []);

  const chooseQuiz = (quiz: Quiz) => {
    setSelected(quiz);
    setAnswers(Array(quiz.questions.length).fill(-1));
    setResult(null);
    setError('');
  };

  const completeLesson = async () => {
    if (!selectedLesson) return;
    try {
      await apiClient.post(`/quizzes/lessons/${selectedLesson.id}/complete`);
      setLessonCompleted(true);
      window.dispatchEvent(new Event('securechat:data-updated'));
    } catch {
      setError('This lesson could not be marked complete.');
    }
  };

  const submit = async () => {
    if (!selected || answers.some((answer) => answer < 0)) {
      setError('Answer every question before submitting.');
      return;
    }
    try {
      const response = await apiClient.post<Result>(`/quizzes/${selected.id}/submit`, { answers });
      setResult(response.data);
      window.dispatchEvent(new Event('securechat:data-updated'));
    } catch {
      setError('Your quiz could not be submitted.');
    }
  };

  if (selectedLesson && !selected) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <button onClick={() => setSelectedLesson(null)} className="text-sm font-medium text-blue-600 hover:underline">Back to lessons</button>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{selectedLesson.title}</h2>
          <p className="mt-2 text-slate-600">{selectedLesson.summary}</p>
          <div className="mt-6 space-y-5">
            {selectedLesson.sections.map((section) => <article key={section.heading} className="rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">{section.heading}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{section.content}</p></article>)}
          </div>
          {lessonCompleted && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Lesson completed. Your points were added.</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {!lessonCompleted && <button onClick={() => void completeLesson()} className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">Mark lesson complete</button>}
            {quizzes.some((quiz) => quiz.id === selectedLesson.quizId) && <button onClick={() => { const quiz = quizzes.find((item) => item.id === selectedLesson.quizId); if (quiz) { setSelectedLesson(null); chooseQuiz(quiz); } }} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Take lesson quiz</button>}
          </div>
        </div>
      </section>
    );
  }

  if (selected) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <button onClick={() => setSelected(null)} className="text-sm font-medium text-blue-600 hover:underline">Back to quizzes</button>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{selected.title}</h2>
          <p className="mt-2 text-slate-600">{selected.description}</p>
          <div className="mt-6 space-y-6">
            {selected.questions.map((question, questionIndex) => (
              <fieldset key={question.id}>
                <legend className="font-semibold text-slate-900">{questionIndex + 1}. {question.prompt}</legend>
                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                      <input type="radio" name={question.id} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer))} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          {error && <p role="alert" className="mt-5 text-sm text-rose-600">{error}</p>}
          {result ? (
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-800">Score: {result.score}% ({result.correctAnswers}/{result.totalQuestions}). Points earned: {result.pointsAwarded}.</div>
          ) : (
            <button onClick={() => void submit()} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Submit quiz</button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div><h2 className="text-3xl font-bold text-slate-900">Cybersecurity quizzes</h2><p className="mt-2 text-slate-600">Test your knowledge and earn points that count toward your rank.</p></div>
      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      <h3 className="text-xl font-semibold text-slate-900">Lessons</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => <button key={lesson.id} onClick={() => { setSelectedLesson(lesson); setLessonCompleted(false); }} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><h3 className="text-xl font-semibold text-slate-900">{lesson.title}</h3><p className="mt-2 text-sm text-slate-600">{lesson.summary}</p><p className="mt-4 text-sm font-medium text-emerald-700">Read lesson and earn points</p></button>)}
      </div>
      <h3 className="text-xl font-semibold text-slate-900">Quizzes</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => <button key={quiz.id} onClick={() => chooseQuiz(quiz)} className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"><h3 className="text-xl font-semibold text-slate-900">{quiz.title}</h3><p className="mt-2 text-sm text-slate-600">{quiz.description}</p><p className="mt-4 text-sm font-medium text-blue-600">{quiz.questions.length} questions</p></button>)}
      </div>
    </section>
  );
}
