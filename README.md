# codebase-stats-cli

CLI wrapper around https://github.com/anton-107/codebase-stats-collector

## Usage

### hot-spots

Identifies high-churn areas in your codebase by analyzing file modification patterns.
This command helps teams discover files that require frequent changes, potentially indicating design issues,
technical debt, or areas needing refactoring.
It analyzes your repository's history to highlight files with the highest number of changes.
These frequently modified files often represent:

- Areas of code that may be unstable or poorly designed
- Features that experience constant requirement changes
- Components that might benefit from refactoring
- Potential technical debt that needs attention

To run:

```
npm run cli -- hot-spots <PATH TO LOCAL GIT REPO>
```

### knowledge-gaps

Identifies potential knowledge gaps in your codebase by analyzing file-level contribution patterns.
This command helps teams identify files that may represent single points of failure due to limited contributor coverage.
It scans your repository and generates a report of files sorted by their last modification date,
highlighting those with the fewest unique contributors.

This helps identify:

- Files that may become maintenance bottlenecks
- Code that could benefit from knowledge sharing
- Areas where code reviews and pair programming should be prioritized

To run:

```
npm run cli -- knowledge-gaps <PATH TO LOCAL GIT REPO> --ignoreFiles /path/to/ignored/folder
```
