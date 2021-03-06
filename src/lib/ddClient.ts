import fetch from "node-fetch";
import { AuditsResult } from "../@types/lighthouse";

export class DDClient {
  private apiUrl: string;

  constructor(apiKey: string) {
    this.apiUrl = `https://api.datadoghq.com/api/v1/series?api_key=${apiKey}`;
  }

  async sendMetrics(metricsName: string, data: AuditsResult) {
    const requestBody = JSON.stringify({
      series: [
        {
          metric: metricsName,
          points: [
            [
              `${Math.floor(Date.now() / 1000)}`,
              `${Math.round(data.numericValue / 10) * 10}`,
            ],
          ],
          type: "gauge",
        },
      ],
    });
    //TODO: errorハンドリングを考える
    return await this.post(requestBody);
  }

  private async post(requestBody: string) {
    return await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  }
}
