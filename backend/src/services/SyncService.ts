import { SyncJob } from '../models/SyncJob';
import { logger } from '../utils/logger';
import { SPAPIClient } from './amazon/SPAPIClient';

export class SyncService {
    /**
     * Create a new sync job
     */
    async createJob(accountId: string, jobType: 'FULL_SYNC' | 'CAMPAIGNS' | 'REPORTS') {
        // Map 'REPORTS' to specific report types or default to FULL_SYNC behavior
        const dbJobType = jobType === 'REPORTS' ? 'PERFORMANCE' : jobType;

        return await SyncJob.query().insert({
            account_id: accountId,
            job_type: dbJobType,
            status: 'PENDING',
            created_at: new Date(),
            updated_at: new Date()
        });
    }

    /**
     * Process all pending jobs (Worker Loop)
     * This should be called by a cron or interval
     */
    async processPendingJobs() {
        // 1. Fetch pending jobs (limit 5 to avoid overloading)
        const jobs = await SyncJob.query()
            .where('status', 'PENDING')
            .orderBy('created_at', 'asc')
            .limit(5);

        if (jobs.length === 0) return;

        logger.info(`Found ${jobs.length} pending sync jobs. Starting processing...`);

        for (const job of jobs) {
            await this.processJob(job);
        }
    }

    /**
     * Process a single job
     */
    private async processJob(job: SyncJob) {
        // Mark as RUNNING
        await job.$query().patch({
            status: 'RUNNING',
            started_at: new Date(),
            updated_at: new Date()
        });

        try {
            logger.info(`Starting Job ${job.id} (${job.job_type}) for Account ${job.account_id}`);

            const client = new SPAPIClient(job.account_id);

            // --- JOB LOGIC ---
            if (job.job_type === 'CAMPAIGNS') {
                // Mocking Layout: In real impl, we would:
                // 1. requestReport('GET_SP_CAMPAIGNS', ...)
                // 2. Poll until DONE
                // 3. Download and Insert into DB

                // Simulating delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                logger.info('Fetched campaigns (simulated)');
            }
            // -----------------

            // Mark as COMPLETED
            await job.$query().patch({
                status: 'COMPLETED',
                completed_at: new Date(),
                updated_at: new Date()
            });
            logger.info(`Job ${job.id} COMPLETED successfully.`);

        } catch (error: any) {
            logger.error(`Job ${job.id} FAILED`, error);

            // Mark as FAILED
            await job.$query().patch({
                status: 'FAILED',
                error_message: error.message,
                completed_at: new Date(),
                updated_at: new Date()
            });
        }
    }
}

export const syncService = new SyncService();
