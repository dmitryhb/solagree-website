# Solagree Website Agent Standards

These standards apply to coding agents working in this repository.

## Workspace Guard

- This project belongs to Hirebrains/Solagree only.
- Use the authenticated Hirebrains Linear workspace at `linear.app/hirebrains-io` through the `hirebrains_linear` connector.
- Linear team: `Hirebrains` (`HIR`); implementation issue keys begin with `HIR-`.
- Authoritative Linear project for all new and active Solagree website and portal tasks: [`SOL — Solagree`](https://linear.app/hirebrains-io/project/sol-solagree-a4e74b5a28ac/overview).
- The legacy Linear projects `Solagree` and `Solagree Portal` are historical only. Do not create or move new work there unless the user explicitly requests it.
- If a connector search returns mixed workspaces or projects, stop and narrow it to the Hirebrains workspace, `HIR` team, and `SOL — Solagree` project before reading or mutating data.

## Git And Linear

- Start task work from `develop` and use a task branch with the bare lowercase Linear issue id when available, for example `hir-242`.
- Reference the Linear issue in handoff comments and leave the issue in the correct workflow state.
- Do not merge, close, or mark Linear issues Done until implementation checks have passed and the user has asked for that action.
