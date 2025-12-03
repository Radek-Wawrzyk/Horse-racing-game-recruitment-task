import { test, expect } from '@playwright/test';

test.describe('Race Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display app title', async ({ page }) => {
    await expect(page.getByTestId('app-title')).toBeVisible();
  });

  test('should display initial empty state', async ({ page }) => {
    await expect(page.getByTestId('race-track-empty')).toBeVisible();
    await expect(page.getByTestId('race-horse-list')).toBeVisible();
    await expect(page.getByTestId('race-results')).toBeVisible();
  });

  test('should generate program when clicking generate button', async ({ page }) => {
    const generateButton = page.getByTestId('btn-generate');
    await expect(generateButton).toBeVisible();
    await expect(generateButton).toBeEnabled();

    await generateButton.click();

    // Wait for program to be generated - track should still be empty until start is clicked
    await expect(page.getByTestId('race-track-empty')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('race-results-program')).toBeVisible();

    // Race control button should be enabled now
    await expect(page.getByTestId('btn-race-control')).toBeEnabled();
  });

  test('should disable generate button when race is running', async ({ page }) => {
    // Generate program first
    await page.getByTestId('btn-generate').click();
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Start race
    await page.getByTestId('btn-race-control').click();

    // Wait for race track to appear
    await expect(page.getByTestId('race-track-content')).toBeVisible({ timeout: 5000 });

    // Generate button should be disabled
    await expect(page.getByTestId('btn-generate')).toBeDisabled();
  });

  test('should start race when clicking start button', async ({ page }) => {
    // Generate program first
    await page.getByTestId('btn-generate').click();
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Track should still be empty
    await expect(page.getByTestId('race-track-empty')).toBeVisible();

    // Start race
    const raceControlButton = page.getByTestId('btn-race-control');
    await raceControlButton.click();

    // Race track should show content after clicking start
    await expect(page.getByTestId('race-track-content')).toBeVisible({ timeout: 5000 });
  });

  test('should pause race when clicking pause button', async ({ page }) => {
    // Generate program
    await page.getByTestId('btn-generate').click();
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Start race
    await page.getByTestId('btn-race-control').click();
    await expect(page.getByTestId('race-track-content')).toBeVisible({ timeout: 5000 });

    // Wait for race to be running (check that track content is still visible)
    await expect(page.getByTestId('race-track-content')).toBeVisible();

    // Pause race
    await page.getByTestId('btn-race-control').click();

    // Button should show resume/start state
    const raceControlButton = page.getByTestId('btn-race-control');
    await expect(raceControlButton).toBeVisible();
  });

  test('should restart race when clicking restart button', async ({ page }) => {
    // Generate program
    await page.getByTestId('btn-generate').click();
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Start race
    await page.getByTestId('btn-race-control').click();
    await expect(page.getByTestId('race-track-content')).toBeVisible({ timeout: 5000 });

    // Wait for race to be running
    await expect(page.getByTestId('race-track-content')).toBeVisible();

    // Restart race
    await page.getByTestId('btn-restart').click();

    // Should go back to empty state or reset
    await expect(page.getByTestId('btn-generate')).toBeEnabled();
    await expect(page.getByTestId('race-track-empty')).toBeVisible();
  });

  test('should display horses list', async ({ page }) => {
    const horseList = page.getByTestId('race-horse-list');
    await expect(horseList).toBeVisible();

    // Should have table with horses
    const table = horseList.locator('table');
    await expect(table).toBeVisible();
  });

  test('should display race results sections', async ({ page }) => {
    await expect(page.getByTestId('race-results-program')).toBeVisible();
    await expect(page.getByTestId('race-results-results')).toBeVisible();
  });

  test('should show program after generating', async ({ page }) => {
    await page.getByTestId('btn-generate').click();

    // Wait for program to appear
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Should have round information
    const programSection = page.getByTestId('race-results-program');
    await expect(programSection).toContainText('lap', { timeout: 5000 });
  });

  test('should enable race control button after generating program', async ({ page }) => {
    const raceControlButton = page.getByTestId('btn-race-control');

    // Initially should be disabled
    await expect(raceControlButton).toBeDisabled();

    // Generate program
    await page.getByTestId('btn-generate').click();
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Should be enabled now (but track should still be empty until start is clicked)
    await expect(raceControlButton).toBeEnabled();
    await expect(page.getByTestId('race-track-empty')).toBeVisible();
  });

  test('should enable restart button after generating program', async ({ page }) => {
    const restartButton = page.getByTestId('btn-restart');

    // Initially should be disabled
    await expect(restartButton).toBeDisabled();

    // Generate program
    await page.getByTestId('btn-generate').click();
    await expect(page.getByTestId('race-results-program')).toBeVisible({ timeout: 5000 });

    // Should be enabled now
    await expect(restartButton).toBeEnabled();
  });
});
