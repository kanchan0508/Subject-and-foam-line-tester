export function useSubjectAnalysis() {
  const spamKeywords = ["free", "win", "discount", "limited", "offer", "100%", "click"];
  const analyze = (subject: string) =>
    new Promise<{ score: number; feedback: string[] }>((resolve) => {
      setTimeout(() => {
        let score = 0;
        let feedback: string[] = [];
        if (subject.length < 10) {
          feedback.push("⚠️ Subject is too short, may not attract readers.");
          score += 2;
        } else if (subject.length > 70) {
          feedback.push("⚠️ Subject is too long, may get truncated.");
          score += 2;
        } else {
          feedback.push("✅ Subject length is good.");
        }
        let foundSpamWords = spamKeywords.filter((word) =>
          subject.toLowerCase().includes(word)
        );
        if (foundSpamWords.length > 0) {
          feedback.push(
            `⚠️ Contains spammy words: ${foundSpamWords.join(", ")}. This may lower deliverability.`
          );
          score += 3;
        } else {
          feedback.push("✅ No spammy words detected.");
        }
        if (subject === subject.toUpperCase()) {
          feedback.push("⚠️ Avoid using all CAPS, it looks spammy.");
          score += 2;
        }
        if (!/[\uD800-\uDFFF]/.test(subject)) {
          feedback.push("💡 Try adding an emoji to make it more engaging.");
        }
        resolve({ score, feedback });
      }, 1200); // Simulate API delay
    });
  return { analyze };
}