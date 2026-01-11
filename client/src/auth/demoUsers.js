export const DEMO_USERS = [
  { username: "admin1", password: "1234", role: "teacher", displayName: "מנהל/ת 1" },
  { username: "admin2", password: "Admin123!", role: "teacher", displayName: "מנהל/ת 2" },
  { username: "admin3", password: "Admin123!", role: "teacher", displayName: "מנהל/ת 3" },

  { username: "student1", password: "12345", role: "student", displayName: "תלמיד/ה 1" },
  { username: "student2", password: "Student123!", role: "student", displayName: "תלמיד/ה 2" },
  { username: "student3", password: "Student123!", role: "student", displayName: "תלמיד/ה 3" },
];

export function findUser(username, password) {
  return DEMO_USERS.find(
    (u) =>
      u.username.toLowerCase() === String(username).toLowerCase().trim() &&
      u.password === String(password).trim()
  );
}
