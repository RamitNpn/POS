import cron from "node-cron";
import { generateDailyReport } from "../module/daily-report/report.mutation";

cron.schedule(
  "30 22 * * *",
  async () => {
    try {
      await generateDailyReport({
        body: undefined,
        params: undefined,
        query: undefined,
      } as any);

      console.log("Daily report generated.");
    } catch (error) {
      console.error(error);
    }
  },
  {
    timezone: "Asia/Kathmandu",
  },
);
