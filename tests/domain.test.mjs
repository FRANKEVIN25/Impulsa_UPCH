import test from "node:test";
import assert from "node:assert/strict";
import {
  calendarDays,
  filterJobs,
  matchingSkills,
  answerTips,
} from "../src/utils/domain.mjs";
test("calendar aligns Monday and crosses year boundaries", () => {
  const days = calendarDays(2026, 10);
  assert.equal(days[0].date, "2026-10-26");
  assert.equal(days[6].date, "2026-11-01");
  assert.equal(days.filter((d) => d.current).length, 30);
  assert.equal(calendarDays(2027, 0)[0].date, "2026-12-28");
});
test("calendar respects leap years", () => {
  assert.equal(calendarDays(2028, 1).filter((d) => d.current).length, 29);
  assert.equal(calendarDays(2027, 1).filter((d) => d.current).length, 28);
});
test("job search combines case insensitive text and modality", () => {
  const jobs = [
    {
      title: "Desarrollo",
      company: "Alicorp",
      location: "Lima",
      mode: "Híbrido",
    },
    {
      title: "Ciberseguridad",
      company: "NTT",
      location: "Lima",
      mode: "Remoto",
    },
  ];
  assert.equal(filterJobs(jobs, "  ALICORP  ", "Para ti").length, 1);
  assert.equal(filterJobs(jobs, "Lima", "Remoto")[0].company, "NTT");
  assert.equal(filterJobs(jobs, "inexistente", "Para ti").length, 0);
});
test("skill matching ignores case and whitespace", () => {
  assert.deepEqual(
    matchingSkills(["SQL", "Python", "Git"], [" sql ", "PYTHON"]),
    ["SQL", "Python"],
  );
});
test("interview guidance does not mistake whitespace for answers", () => {
  assert.equal(answerTips("  \n ").count, 0);
  assert.equal(answerTips(Array(25).fill("palabra").join(" ")).complete, true);
  assert.equal(answerTips("Una respuesta breve").complete, false);
});
