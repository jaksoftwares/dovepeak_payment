# Dovepeak Payment Portal

> A professional, minimal, and secure M-Pesa STK Push payment portal for **Dovepeak Digital Solutions**.

This repository contains the Next.js frontend and API routes that power the official Dovepeak Digital Solutions payment experience (`https://payment.dovepeakdigital.com`). It handles standard service payments as well as a dedicated donations portal.

---

## ⚡ Features

- **Seamless M-Pesa STK Push:** Direct integration with Safaricom's Daraja API for frictionless checkout.
- **Dedicated Donation Portal:** Separate UI and flow at `/donations` for accepting contributions.
- **Real-time Status Tracking:** Continuous polling to automatically redirect users upon successful payment.
- **Enterprise-Grade UX:** Clean, professional, and accessible UI writing and design.
- **Database Persistence:** Stores transaction records and statuses securely in Supabase.
- **Automated Health Monitoring:** Built-in endpoints and GitHub Actions to prevent Supabase inactivity pausing.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Payment Gateway:** Safaricom Daraja API (M-Pesa)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

- Node.js 18+ and npm installed
- A [Supabase](https://supabase.com) account and project
- A [Safaricom Daraja API](https://developer.safaricom.co.ke/) developer account (for Sandbox or Production credentials)

### 1. Database Setup
Execute the SQL script located in `supabase_schema.sql` within your Supabase SQL Editor to provision the required `payments` table and Row Level Security (RLS) policies.

### 2. Environment Variables
Create a `.env.local` file in the root directory by copying the structure of `.env.example` (or using the table below):

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `MPESA_CONSUMER_KEY` | Daraja App Consumer Key |
| `MPESA_CONSUMER_SECRET` | Daraja App Consumer Secret |
| `MPESA_SHORTCODE` | Business Shortcode (Sandbox default: `174379`) |
| `MPESA_PASSKEY` | Business Passkey |
| `MPESA_PARTY_B` | The Party B shortcode (often same as Shortcode) |
| `MPESA_CALLBACK_URL` | Your public-reaching URL for the callback endpoint |

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the portal.

---

## 📂 Project Structure

```text
├── .github/workflows/   # CI/CD and automated monitoring actions
├── app/                 # Next.js App Router pages and API endpoints
├── components/          # Reusable React UI components
├── docs/                # Architecture and operations documentation
├── lib/                 # Utilities and external API integrations
├── styles/              # Global CSS and Tailwind configuration
└── utils/               # Helper functions and clients (e.g., Supabase)
```

---

## 🛡️ Security & Monitoring

- **Row Level Security (RLS):** Enabled on Supabase to ensure clients can only insert requests, while webhook callbacks securely update statuses.
- **Activity Monitoring:** Includes a `/api/health` endpoint and a GitHub Actions scheduler (`supabase-health-check.yml`) that runs every 3 days to ensure the Supabase instance remains active and never pauses. See `docs/monitoring` for more details.

---

*Branded and developed for **Dovepeak Digital Solutions**.*