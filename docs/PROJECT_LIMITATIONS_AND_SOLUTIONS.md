# 🚧 Project Limitations & Solutions Analysis

You asked to check the project's current limitations. Based on a deep code audit of your **Local/Native PERN setup**, here is the breakdown of risks and recommended solutions.

## 1. Reliability & Data Integrity (CRITICAL)

### 🔴 Limitation: "In-Memory" Sync Queue
**Context**: In Phase 3, we are building a "Sync Engine" to fetch Amazon data. Without Redis (which you removed to avoid Docker), we must use Node.js memory (Variables/Arrays) to manage these jobs.
*   **Risk**: If the server restarts (or crashes), **ALL pending data sync jobs are lost forever**.
*   **Impact**: A user clicks "Sync", the server reboots for an update, and the user thinks data is syncing but it never arrives.

### ✅ Solution: Persistent Job Table
Instead of just RAM, we will write job status to the **PostgreSQL Database**.
*   **Implementation**: Create a `sync_jobs` table.
*   **Flow**:
    1.  User clicks "Sync".
    2.  Backend inserts row into `sync_jobs` (Status: PENDING).
    3.  Worker picks up PENDING jobs from DB.
    4.  If server crashes, the job stays PENDING and is picked up on restart.

---

## 2. API Security & Stability

### 🔴 Limitation: Missing Rate Limiting
**Context**: I checked `backend/src/middleware/` and found **no `rateLimiter.ts`**.
*   **Risk**: A malicious user (or a bug in the frontend) can spam your API with 10,000 requests/second, crashing the server.
*   **Impact**: Server downtime (Denial of Service).

### ✅ Solution: `express-rate-limit`
We implement a middleware that limits IP addresses to ~100 requests per 15 minutes.
*   **Effort**: Low (npm install package).

---

## 3. Amazon API Handling

### 🔴 Limitation: No Throttling/Retry Logic
**Context**: Amazon SP-API is very strict with limits (leaky bucket algorithm).
*   **Risk**: The `OAuthService.ts` and `errorHandler.ts` do not currently have specific logic to handle Amazon `429 Too Many Requests`.
*   **Impact**: Amazon will block your app temporarily if you fetch data too fast.

### ✅ Solution: "Backoff" Interceptor
Add an Axios interceptor to the `SPAPIClient` we are about to build.
*   **Logic**: If Amazon returns 429, wait 2 seconds, then retry. Increase wait time exponentially (2s, 4s, 8s).

---

## 4. Scalability (Future Proofing)

### 🔴 Limitation: Single Server Dependency
**Context**: The "Native" setup couples the API and Database on `localhost`.
*   **Risk**: If your app grows to 10,000 users, a single server cannot handle the load.
*   **Impact**: Slow dashboard loading.

### ✅ Solution: Easy Horizontal Scale
Since we are using **Statesless JWTs** (good decision!), scaling is easy later.
1.  Move Postgres to a managed service (AWS RDS / Google Cloud SQL).
2.  Run multiple copies of the Backend on different servers behind a Load Balancer.
*   **Current Action**: None needed yet, but keeping the app stateless is key.

---

## 5. Development Workflow

### 🔴 Limitation: "it works on my machine"
**Context**: Moving away from Docker means your local Node version (`v22`) might differ from the Production server's version.
*   **Risk**: A feature works locally but fails in production due to version mismatch.

### ✅ Solution: Strict Engines
Add this to `package.json` to warn you if versions mismatch:
```json
"engines": {
  "node": ">=20.0.0"
}
```

## Summary Recommendation
For **Phase 3**, our immediate priority is **Solution #1 (DB-based Sync)** and **Solution #3 (Retry Logic)**. These are essential for the "Real-Time Data" feature you want next.
