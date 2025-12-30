// server/aiQuestions.js
const allQuestions = [
    { id: 1, category: "Cyberbullying", question: "מה תעשה אם חבר שולח הודעה פוגענית?" },
    { id: 2, category: "Phishing", question: "קיבלת מייל חשוד עם קישור, מה תעשה?" },
    { id: 3, category: "Privacy", question: "מישהו מבקש את הסיסמה שלך, איך תגיב?" },
    { id: 4, category: "Stranger Danger", question: "מישהו לא מוכר מבקש להיפגש, מה תעשה?" },
    { id: 5, category: "Digital Literacy", question: "כיצד תזהה קובץ זדוני?" },
    { id: 6, category: "Cyberbullying", question: "איך תגיב להטרדה בקבוצת ווטסאפ?" }
];

export function getQuestionsForClass(profile) {
    const selectedCategories = [profile.focus, ...(profile.issues || [])];
    const filteredQuestions = allQuestions.filter(q => selectedCategories.includes(q.category));
    return filteredQuestions.length > 0 ? filteredQuestions : allQuestions;
}