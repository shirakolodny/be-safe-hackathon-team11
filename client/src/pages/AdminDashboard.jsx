// client/src/pages/AdminDashboard.jsx
import { useState } from "react";
import ClassProfileForm from "../components/ClassProfileForm";

export default function AdminDashboard() {
  const [questions, setQuestions] = useState([]);

  return (
    <div>
      <h1>לוח מורה – התאמת תוכןי</h1>
      <ClassProfileForm onQuestionsReceived={setQuestions} />
      {questions.length > 0 && (
        <div>
          <h2>השאלות שנבחרו:</h2>
          <ul>
            {questions.map((q) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
