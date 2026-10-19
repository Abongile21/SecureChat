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

export default function LearningCenter() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get<{ quizzes: Quiz[] }>('/quizzes'),
      apiClient.get<{ lessons: Lesson[] }>('/quizzes/lessons'),
    ])
      .then(([quizResponse, lessonResponse]) => {
        setQuizzes(quizResponse.data.quizzes);
        setLessons(lessonResponse.data.lessons);
      })
      .catch(() => setError('Learning content is temporarily unavailable.'))
      .finally(() => setIsLoading(false));
  }, []);

  const chooseQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedLesson(null);
    setAnswers(Array(quiz.questions.length).fill(-1));
    setResult(null);
    setError('');
  };

  const chooseLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedQuiz(null);
    setLessonCompleted(false);
    setError('');
  };

  const completeLesson = async () => {
    if (!selectedLesson) return;
    try {
      setIsCompleting(true);
      await apiClient.post(`/quizzes/lessons/${selectedLesson.id}/complete`);
      setLessonCompleted(true);
      window.dispatchEvent(new Event('securechat:data-updated'));
    } catch {
      setError('This lesson could not be marked complete.');
    } finally {
      setIsCompleting(false);
    }
  };

  const submit = async () => {
    if (!selectedQuiz || answers.some((answer) => answer < 0)) {
      setError('Answer every question before submitting.');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await apiClient.post<Result>(`/quizzes/${selectedQuiz.id}/submit`, { answers });
      setResult(response.data);
      window.dispatchEvent(new Event('securechat:data-updated'));
    } catch {
      setError('Your quiz could not be submitted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePanel = () => {
    setSelectedLesson(null);
    setSelectedQuiz(null);
    setError('');
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Learning center</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Learn, practice, improve</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Everything you need to build safer digital habits is available on this page.</p>
      </div>
      {error && !selectedLesson && !selectedQuiz && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {isLoading ? <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading your learning center...</div> : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">Lessons</h3>
            <div className="space-y-4">
              {lessons.map((lesson) => <button key={lesson.id} onClick={() => chooseLesson(lesson)} className="group w-full rounded-3xl border border-emerald-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"><div className="flex items-start justify-between gap-3"><h4 className="text-xl font-semibold text-slate-900">{lesson.title}</h4><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">+10 pts</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p><p className="mt-4 text-sm font-semibold text-emerald-700 group-hover:underline">Open lesson →</p></button>)}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">Quizzes</h3>
            <div className="space-y-4">
              {quizzes.map((quiz) => <button key={quiz.id} onClick={() => chooseQuiz(quiz)} className="group w-full rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"><div className="flex items-start justify-between gap-3"><h4 className="text-xl font-semibold text-slate-900">{quiz.title}</h4><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{quiz.questions.length} questions</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{quiz.description}</p><p className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">Start quiz →</p></button>)}
            </div>
          </div>
        </div>
      )}

      {selectedLesson && <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Selected lesson</p><h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedLesson.title}</h3><p className="mt-2 text-slate-600">{selectedLesson.summary}</p></div><button onClick={closePanel} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Close</button></div><div className="mt-6 grid gap-4 md:grid-cols-2">{selectedLesson.sections.map((section) => <article key={section.heading} className="rounded-2xl bg-white p-4"><h4 className="font-semibold text-slate-900">{section.heading}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{section.content}</p></article>)}</div>{lessonCompleted && <p className="mt-5 rounded-xl bg-emerald-100 p-3 text-sm text-emerald-800">Lesson completed. Your points were added.</p>}{error && <p role="alert" className="mt-5 text-sm text-rose-600">{error}</p>}<div className="mt-6 flex flex-wrap gap-3">{!lessonCompleted && <button disabled={isCompleting} onClick={() => void completeLesson()} className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{isCompleting ? 'Saving progress...' : 'Mark lesson complete'}</button>}{quizzes.some((quiz) => quiz.id === selectedLesson.quizId) && <button onClick={() => { const quiz = quizzes.find((item) => item.id === selectedLesson.quizId); if (quiz) chooseQuiz(quiz); }} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Take lesson quiz</button>}</div></div>}

      {selectedQuiz && <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Selected quiz</p><h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedQuiz.title}</h3><p className="mt-2 text-slate-600">{selectedQuiz.description}</p></div><button onClick={closePanel} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Close</button></div><div className="mt-6 space-y-6">{selectedQuiz.questions.map((question, questionIndex) => <fieldset key={question.id}><legend className="font-semibold text-slate-900">{questionIndex + 1}. {question.prompt}</legend><div className="mt-3 space-y-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${answers[questionIndex] === optionIndex ? 'border-blue-500 bg-blue-100 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:bg-slate-50'}`}><input type="radio" name={question.id} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer))} /><span>{option}</span></label>)}</div></fieldset>)}</div>{error && <p role="alert" className="mt-5 text-sm text-rose-600">{error}</p>}{result ? <div className="mt-6 rounded-2xl bg-emerald-100 p-4 text-emerald-800">Score: {result.score}% ({result.correctAnswers}/{result.totalQuestions}). Points earned: {result.pointsAwarded}.</div> : <button disabled={isSubmitting} onClick={() => void submit()} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? 'Checking answers...' : 'Submit quiz'}</button>}</div>}
    </section>
  );
}
