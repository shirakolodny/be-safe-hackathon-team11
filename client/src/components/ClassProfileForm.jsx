// client/src/components/ClassProfileForm.jsx
import { useState } from "react";

export default function ClassProfileForm({ onQuestionsReceived }) {
  const [focus, setFocus] = useState("Cyberbullying");
  const [issues, setIssues] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profile = {
      focus,
      issues: issues.split(",").map((i) => i.trim())
    };

    // שינוי: כאן תעשי fetch לענף שלך בלבד, אם השרת לא מחובר
    try {
      const res = await fetch("http://localhost:5000/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      if (!res.ok) throw new Error("Server not ready");

      const data = await res.json();
      onQuestionsReceived(data.questions);
    } catch (err) {
      console.log("Error fetching questions:", err.message);
      onQuestionsReceived([
        { id: 0, question: "השרת שלך לא מחובר עדיין – תעבוד רק בענף שלך" }
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        נושא עיקרי:
        <select value={focus} onChange={(e) => setFocus(e.target.value)}>
          <option value="Cyberbullying">Cyberbullying</option>
          <option value="Phishing">Phishing</option>
          <option value="Privacy">Privacy</option>
          <option value="Stranger Danger">Stranger Danger</option>
          <option value="Digital Literacy">Digital Literacy</option>
        </select>
      </label>
      <br />
      <label>
        סוגיות נוספות (מופרדות בפסיק):
        <input type="text" value={issues} onChange={(e) => setIssues(e.target.value)} />
      </label>
      <br />
      <button type="submit">קבל שאלות מותאמות</button>
    </form>
  );
}
