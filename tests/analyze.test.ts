import { analyzePrompt } from "../src/index";

const FULL_PROMPT = `Task name: Summarize a report
Input: A 2,000 word quarterly report as plain text
Output: A bullet summary of at most 10 sentences
Context: The audience is executives with 2 minutes
Constraints: Keep financial figures exact; do not invent facts
Examples: Step 1 read the report, Step 2 extract key metrics
Tone: formal`;

describe("analyzePrompt", () => {
  test("scores a complete prompt high and yields no structural recommendations", () => {
    const r = analyzePrompt(FULL_PROMPT);
    expect(r.score).toBeGreaterThan(70);
    expect(r.completeness).toBeGreaterThan(60);
    expect(r.recommendations.length).toBe(0);
  });

  test("penalizes a vague, incomplete prompt and explains why", () => {
    const r = analyzePrompt("write something good about maybe data stuff");
    expect(r.score).toBeLessThan(50);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  test("is monotonic: adding structure never lowers the score", () => {
    const weak = analyzePrompt("do a task");
    const better = analyzePrompt("Task name: do a task\nInput: raw text\nOutput: JSON");
    expect(better.score).toBeGreaterThan(weak.score);
  });
});
