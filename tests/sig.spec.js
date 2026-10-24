import { test, expect } from '@playwright/test';
test('signature', async ({ page }) => {
  const logs = [];
  page.on('console', m => logs.push(m.text()));
  await page.goto('http://127.0.0.1:8765/index.html');
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const s = document.querySelector('.signature');
    return { src: s.getAttribute('src'), dataSrc: s.dataset.src, classes: s.className, opacity: getComputedStyle(s).opacity, naturalWidth: s.naturalWidth };
  });
  console.log('HOME SIG', JSON.stringify(info));
  await page.evaluate(() => { const w=document.querySelector('.wrapper'); w.scrollTo(0, w.scrollHeight); });
  await page.waitForTimeout(2000);
  const info2 = await page.evaluate(() => {
    const s = document.querySelector('.contact-signature');
    return { src: s.getAttribute('src'), dataSrc: s.dataset.src, classes: s.className, opacity: getComputedStyle(s).opacity, naturalWidth: s.naturalWidth };
  });
  console.log('CONTACT SIG', JSON.stringify(info2));
  console.log('LOGS', logs.join(' | '));
});
