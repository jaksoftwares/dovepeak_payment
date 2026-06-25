# Setup & Operations Guide

This guide covers the deployment, configuration, logging, and failure recovery procedures for the Dovepeak Payments Supabase monitoring system.

## 1. Setup & Configuration

### Prerequisites
1. Dovepeak Payments Next.js application deployed to a public environment (e.g., Vercel, Netlify) so the GitHub Actions runner can reach the endpoint.
2. Administrative access to the GitHub repository.

### Configuration Steps
1. **Locate your deployment URL:** Ensure your Next.js application is successfully deployed and you have the production URL (e.g., `https://payment.dovepeakdigital.com`).
2. **Configure GitHub Secrets/Variables:**
   - Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
   - Under the **Variables** or **Secrets** tab, click **New repository variable** (or secret).
   - Name: `HEALTH_CHECK_URL`
   - Value: `https://payment.dovepeakdigital.com/api/health`
3. **Deploy the Code:**
   - Commit and push the `app/api/health/route.ts` and `.github/workflows/supabase-health-check.yml` files to your main branch.
4. **Verify Execution:**
   - Go to the **Actions** tab in your GitHub repository.
   - Select the **Supabase Health Monitoring** workflow.
   - Click **Run workflow** to manually trigger a test run.
   - Expand the "Check Health Endpoint" step to verify the `status: healthy` log output.

## 2. Operations & Logging

The system is designed for autonomous operation. Log data is persisted in GitHub Actions.

### Viewing Logs
1. Navigate to the GitHub repository **Actions** tab.
2. Select the **Supabase Health Monitoring** workflow.
3. You will see a chronological list of runs (one every 3 days).
4. Click any run to inspect the logs. 
   - **Successful check:** Will print a green checkmark and the JSON payload containing the duration in milliseconds.
   - **Failed check:** Will print the error message and the HTTP status code.

### Troubleshooting Failures
If a health check fails, investigate in this order:
1. **GitHub Actions Logs:** Did it fail due to a DNS error, a timeout, or a `50x` response?
2. **Application Logs (e.g., Vercel):** Check the logs for the `GET /api/health` route. Look for exceptions or timeouts in the Next.js execution.
3. **Supabase Dashboard:** Log into Supabase and check if the project status shows "Paused" or "Active". Check the database metrics for CPU or memory spikes.

## 3. Failure Recovery Strategy

The automated workflow is built with transient failure recovery (it will retry 3 times with a 5-second backoff before officially failing). If a hard failure occurs, follow these escalation procedures:

### Scenario A: Supabase Project is Paused
*   **Detection:** GitHub Actions reports consistent `503` or `500` errors. Supabase dashboard shows project as Paused.
*   **Resolution:** Log into the Supabase dashboard and click the **Restore** button on your project. The restore process can take a few minutes. Once active, the health checks will automatically resume succeeding.
*   **Prevention:** Ensure the GitHub Action is not failing silently (e.g., due to disabled actions on inactive repositories). GitHub automatically disables cron jobs if a repository has no commits for 60 days. You must re-enable it manually or commit code periodically.

### Scenario B: Database Connection Limit Exceeded / Unreachable
*   **Detection:** API logs show connection pooling errors (e.g., `pgbouncer` errors) or timeouts when connecting to Supabase.
*   **Resolution:** Review your application's connection pooling settings. Ensure you are using the pooled connection string (port 6543) if you have many concurrent lambda executions. Restarting the Supabase database instance from the dashboard may resolve hung connections.

### Scenario C: Network / Vercel Outage
*   **Detection:** GitHub Actions fails with `fetch` connection refused or timeouts reaching your domain.
*   **Resolution:** Check the Vercel (or hosting provider) status page. If the hosting is down, the Supabase database will not receive traffic from the health check. Supabase allows up to 7 days of inactivity (on free tiers) before pausing, so a temporary hosting outage will not immediately cause a database pause.

## 4. Maintenance Guide

*   **Rotating Secrets:** If your domain name changes, update the `HEALTH_CHECK_URL` repository variable. No application code changes are required.
*   **GitHub Actions Quotas:** The workflow runs lightweight JavaScript (`github-script`) and executes very quickly (typically < 2 seconds). Running every 3 days consumes less than 1 minute per month, which is well within the 2,000 free minutes provided by GitHub for private repos.
