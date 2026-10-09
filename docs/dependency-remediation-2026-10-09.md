# Dependency remediation — HIR-660

Nuxt 4.6 requires Node ^22.22.3, ^24.15.0, or a supported newer major.
The repository .nvmrc selects 22.22.3. Local upgrade gates used the already
installed Node 24.19.0 without changing the shell default. Update build agents
and the Portal server runtime before deploying this dependency change.

Keep the Sharp, framework, email renderer, and mail transport updates in
separate review phases so each dependency change can be assessed and reverted.
Source commits alone do not authorize staging or production deployment.
