import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TRAFFIC_PRESETS,
  calculateResilienceTelemetry,
} from "./edgeResilienceData";

describe("edge resilience data model", () => {
  it("publishes 4 distinct traffic presets with realistic request volumes", () => {
    assert.equal(TRAFFIC_PRESETS.length, 4);
    assert.equal(TRAFFIC_PRESETS[0].id, "baseline");
    assert.equal(TRAFFIC_PRESETS[3].id, "blackfriday");
    assert.ok(TRAFFIC_PRESETS[0].requestsPerSec < TRAFFIC_PRESETS[1].requestsPerSec);
    assert.ok(TRAFFIC_PRESETS[1].requestsPerSec < TRAFFIC_PRESETS[2].requestsPerSec);
    assert.ok(TRAFFIC_PRESETS[2].requestsPerSec < TRAFFIC_PRESETS[3].requestsPerSec);
  });

  it("handles baseline traffic (350 rps) with healthy metrics across both stacks", () => {
    const telemetry = calculateResilienceTelemetry(350, true, "es");
    assert.equal(telemetry.requestsPerSec, 350);
    assert.equal(telemetry.legacy.status, "healthy");
    assert.equal(telemetry.legacy.errorRatePercent, 0);
    assert.ok(telemetry.legacy.latencyMs < 300);

    assert.equal(telemetry.edge.status, "healthy");
    assert.ok(telemetry.edge.latencyMs < 30);
    assert.equal(telemetry.edge.errorRatePercent, 0);
  });

  it("demonstrates server degradation under active campaigns (2400 rps)", () => {
    const telemetry = calculateResilienceTelemetry(2400, true, "es");
    assert.equal(telemetry.legacy.status, "degraded");
    assert.ok(telemetry.legacy.cpuUsage > 70);
    assert.ok(telemetry.legacy.latencyMs > 1000);
    assert.ok(telemetry.legacy.errorRatePercent > 5);

    // Edge stays rock solid
    assert.equal(telemetry.edge.status, "healthy");
    assert.ok(telemetry.edge.cpuUsage < 25);
    assert.ok(telemetry.edge.latencyMs < 30);
    assert.equal(telemetry.edge.errorRatePercent, 0);
  });

  it("demonstrates catastrophic legacy collapse under viral spikes (15000 rps)", () => {
    const telemetry = calculateResilienceTelemetry(15000, true, "en");
    assert.equal(telemetry.legacy.status, "critical");
    assert.equal(telemetry.legacy.cpuUsage, 100);
    assert.ok(telemetry.legacy.latencyMs > 4000);
    assert.ok(telemetry.legacy.errorRatePercent > 50);
    assert.ok(telemetry.estimatedLostRevenuePerHour > 1000);

    // Edge retains flat latency and zero errors
    assert.equal(telemetry.edge.status, "healthy");
    assert.ok(telemetry.edge.latencyMs <= 32);
    assert.equal(telemetry.edge.errorRatePercent, 0);
    assert.ok(telemetry.edge.cacheHitRatePercent > 97);
  });

  it("clamps extreme out-of-bounds input safely", () => {
    const telemetryLow = calculateResilienceTelemetry(10, true, "es");
    assert.equal(telemetryLow.requestsPerSec, 100);

    const telemetryHigh = calculateResilienceTelemetry(999999, true, "es");
    assert.equal(telemetryHigh.requestsPerSec, 60000);
  });
});
