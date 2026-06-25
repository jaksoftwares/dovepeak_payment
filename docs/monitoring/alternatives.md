# Monitoring Alternatives Analysis

This document evaluates alternative approaches to scheduling the Supabase health check endpoint (`/api/health`). It compares the current GitHub Actions implementation against other viable options.

## Option A: GitHub Actions Scheduler (Current Implementation)
Uses a `.yml` workflow with a cron trigger to `fetch` the health endpoint.

*   **Cost:** Free for up to 2,000 minutes/month on private repos (Unlimited on public). Running every 3 days consumes < 1 minute/month, which is well within the free tier.
*   **Reliability:** High, but GitHub automatically disables cron jobs if the repository has no commits for 60 days.
*   **Ease of Maintenance:** Excellent. Configuration lives directly in the repository alongside the code.
*   **Scalability:** Perfect for single-endpoint checks.
*   **Production Readiness:** High. Commonly used for synthetic monitoring.

## Option B: UptimeRobot Monitoring
Using a dedicated uptime monitoring SaaS like [UptimeRobot](https://uptimerobot.com/).

*   **Cost:** Free tier allows checking every 5 minutes for up to 50 monitors.
*   **Reliability:** Very High. Dedicated infrastructure for monitoring.
*   **Ease of Maintenance:** Requires managing an external dashboard and account.
*   **Scalability:** Excellent. Provides dashboards, SMS alerts, and email notifications out-of-the-box.
*   **Production Readiness:** Very High. **Recommended if GitHub Actions minutes become a constraint or if SMS/Email alerting is required.**
*   **How to setup:** Create a free account, add an "HTTP(s)" monitor pointing to `https://payment.dovepeakdigital.com/api/health`, and set the interval to 3 days (or as desired).

## Option C: Cron Job on VPS
Using standard Linux `cron` on a Virtual Private Server (e.g., DigitalOcean, AWS EC2, or an existing company server).

*   **Cost:** Effectively free if you already own the VPS. $4-5/month if spinning up a new one just for this.
*   **Reliability:** Dependent on the VPS stability and network.
*   **Ease of Maintenance:** Low. Requires SSH access, manual log rotation, and OS patching. Configuration is decoupled from the codebase.
*   **Scalability:** Moderate. You must write custom bash scripts to parse JSON and send alerts (e.g., Slack webhooks) on failure.
*   **Production Readiness:** Moderate. Can be fragile if the server runs out of disk space or memory.
*   **Example Setup:** `0 0 */3 * * curl -sSf https://payment.dovepeakdigital.com/api/health > /var/log/health.log 2>&1`

## Option D: Cloudflare Scheduled Workers
Using a Cloudflare Worker triggered by a Cron Trigger to hit the endpoint.

*   **Cost:** Free tier includes 100,000 requests/day.
*   **Reliability:** Extremely High (runs on Cloudflare's edge network).
*   **Ease of Maintenance:** Moderate. Requires maintaining a separate Worker script in the Cloudflare dashboard or via Wrangler CLI.
*   **Scalability:** Very High. Can execute complex logic and alert via Fetch APIs.
*   **Production Readiness:** Very High.

## Option E: External Monitoring Services (Datadog, New Relic, BetterStack)
Enterprise-grade observability platforms.

*   **Cost:** High. Typically requires paid subscriptions.
*   **Reliability:** Maximum.
*   **Ease of Maintenance:** High, but steep learning curve for configuration.
*   **Scalability:** Maximum. Built for complex, multi-service architectures.
*   **Production Readiness:** Maximum.

## Final Recommendation
1. **Short-term / Zero-Setup:** Stick with the implemented **Option A (GitHub Actions)**. It is free, lives in the repo, and fulfills the requirement immediately. If the repository is private and you exceed 2,000 minutes, reduce the frequency to every 30 minutes (`*/30 * * * *`).
2. **Long-term / Better Alerting:** Adopt **Option B (UptimeRobot)**. It offloads the scheduling, provides a beautiful status page, supports email alerting on failure, and avoids GitHub's 60-day inactivity suspension.
