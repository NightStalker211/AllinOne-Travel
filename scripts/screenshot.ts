// Phase 0 evidence: launch the built app under Playwright, assert the
// shell renders with zero page errors, capture dark + light screenshots.
//
//   npm run build && npx tsx scripts/screenshot.ts
import { _electron as electron } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const ROOT = process.cwd();
  const EVIDENCE = path.join(ROOT, "scripts", "evidence");
  fs.mkdirSync(EVIDENCE, { recursive: true });

  const errors: string[] = [];

  const app = await electron.launch({
    args: [".", "--force-prod"],
    env: { ...process.env, ALLINONE_FORCE_PROD: "1" },
  });
  const page = await app.firstWindow();
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.waitForSelector('[data-testid="home"]', { timeout: 15000 });
  await page.waitForTimeout(700); // let the entrance animation settle

  const version =
    (await page.locator('[data-testid="app-version"]').textContent()) ?? "";
  const navLabels = await page.locator("aside nav a").allTextContents();

  await page.screenshot({
    path: path.join(EVIDENCE, "p0-home-dark.png"),
    fullPage: true,
  });

  await page.evaluate(() => {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  });
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(EVIDENCE, "p0-home-light.png"),
    fullPage: true,
  });

  await app.close();

  const checks = {
    homeRendered: true,
    version,
    versionOk: /^v\d+\.\d+\.\d+$/.test(version.trim()),
    navCount: navLabels.length,
    pageErrors: errors.length,
  };

  console.log(JSON.stringify(checks, null, 2));
  console.log(
    "screenshots: scripts/evidence/p0-home-dark.png, p0-home-light.png"
  );

  const pass = checks.versionOk && checks.navCount === 4 && errors.length === 0;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
