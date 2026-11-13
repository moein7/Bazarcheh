# Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | CSV schema does not clearly identify answered messages | Medium | Critical | Inspect data/docs; ask or document conservative assumption | Auditor |
| R-02 | Severity is not explicitly labeled | Medium | High | Define and evaluate deterministic/LLM approach; disclose limitations | Orchestrator |
| R-03 | Persian holiday conversion error | Medium | High | Validate exact Jalali dates with reliable conversion and test fixtures | Business Logic |
| R-04 | LLM quota or provider unavailable | High | Medium | Rules fallback for classification; blocked draft response | AI |
| R-05 | LLM produces unsafe promise | Medium | Critical | Output validation, fail closed, adversarial tests | AI/Security |
| R-06 | Frontend/backend SLA calculations diverge | Medium | High | Shared fixtures and parity tests | Frontend/QA |
| R-07 | Existing CLI regression | Medium | Critical | Exact command contract test | Backend/QA |
| R-08 | Time budget consumed by polish/refactor | High | High | P0-first cut line and strict time boxes | Orchestrator |
| R-09 | Evaluation timestamp parsed incorrectly | Medium | High | Verify EXPORT_INFO and record UTC/local conversion | Auditor |
