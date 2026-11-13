# Final verification report

## Executed successfully

| Check | Result |
|---|---|
| Backend pytest suite | 29 passed |
| Frontend TS/TSX syntax transpilation | 13 files passed |
| CLI analysis | Passed locally with the required arguments and export timestamp |
| Evaluation row parity | 332 non-empty message records / 332 prediction rows (one empty record in the CSV is not a message) |
| Predictions header | `message_id,category,is_urgent` |
| Unique message count | 310 |
| Urgent count at export time | 14 |
| Six category keys | All present, including zero-count categories |
| Configuration scan | Root `.env` contains only local Ollama defaults and a placeholder key (`ollama`); no real provider credential is included |

## Not run / blocked by environment

| Check | Status | Reason |
|---|---|---|
| Docker Compose clean build/start | Not run | Docker executable is not installed. |
| Frontend test suite | Not run | npm dependencies are unavailable offline. |
| Frontend TypeScript/Vite production build | Blocked | Type definitions and Vite dependencies are not installed; registry access is unavailable. |
| Browser smoke/fake-clock tests | Not run | No browser automation runtime is installed. |
| Live Ollama/provider adversarial tests | Not run | Ollama runs on the target Mac and is not reachable from this build environment. |

Frontend TS/TSX syntax transpilation was repeated after the AI workspace changes and still passes for all 13 source files. No blocked or unrun check is represented as passed.
