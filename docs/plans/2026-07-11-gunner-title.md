# Gunner Title Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename the visible game and browser-tab titles to `GUNNER`.

**Architecture:** Update the menu bitmap-text literal and source HTML title without changing internal identifiers.

**Tech Stack:** JavaScript, HTML, Node assertion tests, Gulp

---

### Task 1: Rename and test

**Files:**
- Modify: `src/js/menu.js`
- Modify: `src/index.html`
- Modify: `test/menu-input-test.js`

1. Add failing source assertions for both `GUNNER` titles.
2. Replace both old title literals.
3. Run focused and complete tests.

### Task 2: Verify and deploy

1. Run `npm test`, lint, and build.
2. Browser-check the menu and document title.
3. Commit, push `gh-pages`, and confirm Pages deployment.
