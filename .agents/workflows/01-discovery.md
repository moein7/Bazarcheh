# Workflow: Repository Discovery

## Objective
Understand the existing project and identify verified gaps before implementation.

## Instructions
1. Read root `AGENTS.md` and original challenge requirements.
2. Inspect repository tree and all package/configuration files.
3. Inspect backend routes, processing functions, CLI, frontend routes/components, Docker and env.
4. Inspect all supplied data files, including `EXPORT_INFO.txt`.
5. Run existing tests and startup commands where safe.
6. Record actual findings in:
   - `docs/01-discovery/REPOSITORY_AUDIT.md`
   - `docs/01-discovery/EXISTING_ISSUES.md`
   - `docs/01-discovery/DATASET_ANALYSIS.md`
   - `docs/01-discovery/REQUIREMENTS_GAP_ANALYSIS.md`
7. Map every mandatory requirement to implementation status and evidence.
8. Identify unresolved questions, especially answered-status field, severity source, timestamp timezone, and holiday conversion.
9. Propose only necessary ADRs.

## Restrictions
- Do not modify application code during discovery.
- Do not infer bugs from requirements alone.
- Do not fabricate test output, row counts, schema, or model metrics.

## Completion
Return an audit summary, top risks, P0 gaps, commands run, and recommended task order.
