export function gradeAnswers(userAnswers: string[], correctAnswers: (number | null)[]): boolean[] {
  return userAnswers.map((ans, i) => {
    if (correctAnswers[i] === null) return false;
    if (ans.trim() === '') return false;
    return parseInt(ans, 10) === correctAnswers[i];
  });
}
