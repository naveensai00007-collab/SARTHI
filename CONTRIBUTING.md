# Contributing to Sarthi

Thank you for your interest in contributing to **Sarthi** (National Road Safety & RTO Licensing Platform for India)! We welcome contributions from developers, designers, road safety advocates, and educators across India and worldwide.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful and constructive in all discussions, issues, and code reviews.

---

## How to Contribute

### 1. Reporting Bugs
- Search existing issues before creating a new one.
- Provide a clear title and description.
- Include steps to reproduce, expected behavior, actual behavior, and environment details (browser, OS, screen size).

### 2. Suggesting Enhancements & Content Additions
- Suggestions for new traffic signs adhering to the Indian Road Congress (IRC) standards or Central Motor Vehicles Rules (CMVR) updates are welcome.
- Questions added to the mock test or quiz bank must cite authentic Motor Vehicles Act (MVA) sections or official RTO syllabus topics.

### 3. Submitting Pull Requests (PRs)
1. **Fork** the repository and clone it locally.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server and test changes:
   ```bash
   npm run dev
   ```
5. Ensure TypeScript compilation passes:
   ```bash
   npm run lint
   ```
6. Commit changes with clear, semantic commit messages:
   ```bash
   git commit -m "feat(signs): add IRC-compliant overtaking prohibited sign"
   ```
7. Push to your fork and submit a Pull Request targeting the `main` branch.

---

## Design & Engineering Standards

- **Zero Fake UI:** Every button, toggle, and link must work reliably. No non-functional placeholders.
- **Pure SVG Assets:** All traffic signs and road diagrams must be 100% vector SVG without external image dependencies to ensure crisp rendering at all DPIs and offline operation.
- **Radical Simplicity:** Respect Steve Jobs' philosophy of clean visual hierarchy, generous touch targets (min 44px), instant feedback, and zero cognitive bloat.
- **Accessibility & Contrast:** High contrast text, keyboard-navigable dialogs, and support for high-contrast light and warm dark modes.
- **Offline & Local-First:** All lessons, quizzes, and verification logic must work without an active internet connection.

---

## License

By contributing to Sarthi, you agree that your contributions will be licensed under the project's [Apache-2.0 License](./LICENSE).
