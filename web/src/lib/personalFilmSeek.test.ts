import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FilmSeekCoordinator, type FilmSeekRequest } from "./personalFilmSeek";

function createHarness() {
  const requests: FilmSeekRequest[] = [];
  const timers = new Map<number, () => void>();
  let timerId = 0;
  const coordinator = new FilmSeekCoordinator({
    duration: 14.2,
    threshold: 1 / 48,
    watchdogMs: 250,
    issueSeek: (request) => requests.push(request),
    scheduleWatchdog: (callback) => {
      const id = ++timerId;
      timers.set(id, callback);
      return id;
    },
    cancelWatchdog: (handle) => timers.delete(handle as number),
  });
  return {
    coordinator,
    requests,
    runNextTimer() {
      const entry = timers.entries().next().value as [number, () => void] | undefined;
      if (!entry) return false;
      timers.delete(entry[0]);
      entry[1]();
      return true;
    },
    timerCount: () => timers.size,
  };
}

describe("FilmSeekCoordinator", () => {
  it("keeps the latest target until metadata and a frame are ready", () => {
    const { coordinator, requests } = createHarness();
    coordinator.setTarget(3);
    coordinator.setTarget(7.1);
    assert.equal(requests.length, 0);
    coordinator.setReady(0);
    assert.deepEqual(requests.map(({ targetTime }) => targetTime), [7.1]);
  });

  it("drains a newer target after the active frame is presented", () => {
    const { coordinator, requests } = createHarness();
    coordinator.setReady(0);
    coordinator.setTarget(4);
    coordinator.setTarget(11);
    assert.equal(requests.length, 1);
    assert.equal(coordinator.settle(requests[0].id, 4), true);
    assert.deepEqual(requests.map(({ targetTime }) => targetTime), [4, 11]);
  });

  it("retries the latest target when Safari omits the completion event", () => {
    const { coordinator, requests, runNextTimer } = createHarness();
    coordinator.setReady(0);
    coordinator.setTarget(8);
    coordinator.setTarget(9);
    assert.equal(runNextTimer(), true);
    assert.deepEqual(requests.map(({ targetTime }) => targetTime), [8, 9]);
    assert.notEqual(requests[0].id, requests[1].id);
  });

  it("supports reverse scrubbing and ignores stale frame callbacks", () => {
    const { coordinator, requests } = createHarness();
    coordinator.setReady(10);
    coordinator.setTarget(3);
    const reverse = requests[0];
    coordinator.setTarget(1);
    assert.equal(coordinator.settle(reverse.id + 100, 12), false);
    assert.equal(coordinator.settle(reverse.id, 3), true);
    assert.equal(requests.at(-1)?.targetTime, 1);
  });

  it("clamps times and cancels pending work when disabled or destroyed", () => {
    const { coordinator, requests, timerCount, runNextTimer } = createHarness();
    coordinator.setReady(0);
    coordinator.setTarget(99);
    assert.equal(requests[0].targetTime, 14.2);
    assert.equal(timerCount(), 1);
    coordinator.setEnabled(false);
    assert.equal(timerCount(), 0);
    coordinator.setTarget(-4);
    coordinator.setEnabled(true);
    assert.equal(requests.length, 1);
    coordinator.setTarget(4);
    assert.equal(requests.at(-1)?.targetTime, 4);
    coordinator.destroy();
    assert.equal(timerCount(), 0);
    assert.equal(runNextTimer(), false);
  });
});
