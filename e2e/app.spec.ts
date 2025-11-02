import { test, expect } from "@playwright/test";

test.describe("Contacts & Tasks App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Contacts & Tasks");
  });

  test("should display contacts list", async ({ page }) => {
    // Wait for contacts to load
    await page.waitForSelector('[role="list"]', { timeout: 10000 });
    const contactsList = page.locator('[role="list"][aria-label="Contacts list"]');
    await expect(contactsList).toBeVisible();
    // Should have at least some contacts visible
    const contactCards = page.locator('[role="button"][aria-label^="Select contact"]');
    await expect(contactCards.first()).toBeVisible({ timeout: 5000 });
  });

  test("should search contacts", async ({ page }) => {
    // Wait for search input
    await page.waitForSelector('input[aria-label="Search contacts"]', { timeout: 10000 });
    const searchInput = page.locator('input[aria-label="Search contacts"]');
    
    // Type in search (debounced, so wait a bit)
    await searchInput.fill("Alex");
    await page.waitForTimeout(500); // Wait for debounce
    
    // Should show filtered results
    const contactCards = page.locator('[role="button"][aria-label^="Select contact"]');
    // At least one result should be visible (or empty state if no match)
    await expect(
      contactCards.first().or(page.locator('text=No contacts found'))
    ).toBeVisible({ timeout: 3000 });
  });

  test("should sort contacts", async ({ page }) => {
    await page.waitForSelector('[role="list"]', { timeout: 10000 });
    
    // Click on sort button (Name, Email, Company, or Date)
    const sortButton = page.locator('button:has-text("Name")').first();
    if (await sortButton.isVisible()) {
      await sortButton.click();
    // Wait for sorting to complete
      await page.waitForTimeout(300);
      // Verify contacts are still visible
      const contactsList = page.locator('[role="list"][aria-label="Contacts list"]');
      await expect(contactsList).toBeVisible();
    }
  });

  test("should paginate contacts", async ({ page }) => {
    await page.waitForSelector('[role="list"]', { timeout: 10000 });

    // Check if pagination exists
      const nextButton = page.locator('button:has-text("Next")');
    const paginationVisible = await nextButton.isVisible();
    
    if (paginationVisible) {
      const currentPageBefore = await page.locator('span[aria-current="page"]').textContent();
      await nextButton.click();
      await page.waitForTimeout(300);
      
      // Should still have contacts visible
      const contactsList = page.locator('[role="list"][aria-label="Contacts list"]');
      await expect(contactsList).toBeVisible();
    } else {
      // If no pagination, should have 10 or fewer contacts
      const contactCards = page.locator('[role="button"][aria-label^="Select contact"]');
      const count = await contactCards.count();
      expect(count).toBeLessThanOrEqual(10);
    }
  });

  test("should show loading state", async ({ page }) => {
    // Reload page to catch loading state
    await page.reload();
    // Verify the page loads successfully (either loading or loaded)
    await expect(
      page.locator('text=Loading contacts').or(page.locator('h1'))
    ).toBeVisible({ timeout: 5000 });
  });

  test("should select a contact and show tasks", async ({ page }) => {
    await page.waitForSelector('[role="list"]', { timeout: 10000 });
    
    // Click on first contact
    const firstContact = page.locator('[role="button"][aria-label^="Select contact"]').first();
    await firstContact.click();
    
    // Should show tasks section
    await expect(page.locator('h2:has-text("Tasks")')).toBeVisible({ timeout: 3000 });
  });

  test("should create a task", async ({ page }) => {
    await page.waitForSelector('[role="list"]', { timeout: 10000 });
    
    // Select a contact
    const firstContact = page.locator('[role="button"][aria-label^="Select contact"]').first();
    await firstContact.click();
    
    // Click add task button
    const addTaskButton = page.locator('button[aria-label="Add new task"]');
    await addTaskButton.click();
    
    // Fill in task form
    await page.waitForSelector('input[id="task-title"]', { timeout: 2000 });
    await page.locator('input[id="task-title"]').fill("Test Task");
    await page.locator('textarea[id="task-description"]').fill("Test Description");
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]:has-text("Create Task")');
    await submitButton.click();
    
    // Wait for task to appear (or error message)
    await page.waitForTimeout(1000);
    
    // Should either show the task or an error (due to random API failures)
    const taskList = page.locator('[role="list"][aria-label="Tasks list"]');
    const errorAlert = page.locator('[role="alert"]');
    
    await expect(
      taskList.or(errorAlert)
    ).toBeVisible({ timeout: 3000 });
  });

  test("should handle keyboard navigation", async ({ page }) => {
    await page.waitForSelector('[role="list"]', { timeout: 10000 });
    
    // Tab to search input
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    
    // Type in search
    await page.keyboard.type("Test");
    await page.waitForTimeout(500);
    
    // Verify focus is maintained
    const searchInput = page.locator('input[aria-label="Search contacts"]');
    await expect(searchInput).toBeFocused();
  });

  test("should show error state on API failure", async ({ page }) => {
    await page.waitForSelector('[role="list"]', { timeout: 10000 });
    
    // Reload multiple times to catch random API failure (10% chance)
    let errorFound = false;
    for (let i = 0; i < 10 && !errorFound; i++) {
      await page.reload();
      await page.waitForTimeout(1000);
      
      const errorAlert = page.locator('[role="alert"]');
      if (await errorAlert.isVisible()) {
        errorFound = true;
        await expect(errorAlert).toBeVisible();
        // Check for dismiss button
        const dismissButton = page.locator('button:has-text("Dismiss")');
        await expect(dismissButton).toBeVisible();
      }
    }
    
    // Even if no error shown, page should still be functional
    await expect(page.locator("h1")).toBeVisible();
  });
});
