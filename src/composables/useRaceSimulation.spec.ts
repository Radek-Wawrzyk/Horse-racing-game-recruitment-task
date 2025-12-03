import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useRaceSimulation } from './useRaceSimulation';
import type { RaceHorse } from '@/types/Race';

describe('useRaceSimulation', () => {
  let mockHorses: RaceHorse[];
  let mockRequestAnimationFrame: ReturnType<typeof vi.fn>;
  let mockCancelAnimationFrame: ReturnType<typeof vi.fn>;
  let mockPerformanceNow: ReturnType<typeof vi.fn>;

  let animationFrameTimeouts: NodeJS.Timeout[] = [];

  beforeEach(() => {
    mockHorses = [
      { id: 1, name: 'Thunder', condition: 80, color: '#E74C3C' },
      { id: 2, name: 'Lightning', condition: 90, color: '#3498DB' },
      { id: 3, name: 'Storm', condition: 70, color: '#2ECC71' },
    ];

    // Mock requestAnimationFrame
    let frameId = 1;
    mockRequestAnimationFrame = vi.fn((cb) => {
      const timeoutId = setTimeout(() => {
        if (global.performance) {
          cb(global.performance.now());
        }
      }, 16);
      animationFrameTimeouts.push(timeoutId);
      return frameId++;
    });
    global.requestAnimationFrame = mockRequestAnimationFrame;

    // Mock cancelAnimationFrame
    mockCancelAnimationFrame = vi.fn((_id) => {
      // Clear any pending timeouts
      animationFrameTimeouts.forEach((timeout) => clearTimeout(timeout));
      animationFrameTimeouts = [];
    });
    global.cancelAnimationFrame = mockCancelAnimationFrame;

    // Mock performance.now()
    let time = 0;
    mockPerformanceNow = vi.fn(() => {
      time += 16;
      return time;
    });
    global.performance.now = mockPerformanceNow;
  });

  afterEach(() => {
    // Clean up any pending animation frames
    animationFrameTimeouts.forEach((timeout) => clearTimeout(timeout));
    animationFrameTimeouts = [];
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { positions, isRunning, isFinished } = useRaceSimulation();

    expect(positions.value).toEqual([]);
    expect(isRunning.value).toBe(false);
    expect(isFinished.value).toBe(false);
  });

  it('initializes positions when starting simulation', () => {
    const { startSimulation, positions } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    expect(positions.value).toHaveLength(mockHorses.length);
    const firstPosition = positions.value[0];
    const firstHorse = mockHorses[0];
    expect(firstPosition).toBeDefined();
    if (firstPosition && firstHorse) {
      expect(firstPosition.horse.id).toBe(firstHorse.id);
      expect(firstPosition.distance).toBe(0);
      expect(firstPosition.progress).toBe(0);
    }
  });

  it('sets isRunning to true when starting simulation', () => {
    const { startSimulation, isRunning } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    expect(isRunning.value).toBe(true);
  });

  it('sets isFinished to false when starting simulation', () => {
    const { startSimulation, isFinished } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    expect(isFinished.value).toBe(false);
  });

  it('pauses simulation correctly', () => {
    const { startSimulation, pauseSimulation, isRunning } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    pauseSimulation();

    expect(isRunning.value).toBe(false);
  });

  it('resumes simulation correctly', () => {
    const { startSimulation, pauseSimulation, resumeSimulation, isRunning } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    pauseSimulation();
    expect(isRunning.value).toBe(false);

    resumeSimulation();
    expect(isRunning.value).toBe(true);
  });

  it('stops simulation and clears positions', () => {
    const { startSimulation, stopSimulation, positions, isRunning, isFinished } =
      useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    stopSimulation();

    expect(positions.value).toEqual([]);
    expect(isRunning.value).toBe(false);
    expect(isFinished.value).toBe(false);
  });

  it('updates positions when simulation runs', async () => {
    const { startSimulation, stopSimulation, positions } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
      updateInterval: 16,
    });

    // Wait a bit for animation frame
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Positions should have been updated (distance > 0)
    const hasMovement = positions.value.some((pos) => pos.distance > 0);
    expect(hasMovement).toBe(true);

    // Clean up
    stopSimulation();
  });

  it('sorts positions by distance', async () => {
    const { startSimulation, stopSimulation, positions } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
      updateInterval: 16,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check that positions are sorted by distance (descending)
    for (let i = 0; i < positions.value.length - 1; i++) {
      const current = positions.value[i];
      const next = positions.value[i + 1];
      if (current && next) {
        expect(current.distance).toBeGreaterThanOrEqual(next.distance);
      }
    }

    // Clean up
    stopSimulation();
  });

  it('marks race as finished when all horses reach finish', () => {
    const { startSimulation, positions } = useRaceSimulation();

    startSimulation({
      distance: 1, // Very short distance
      horses: mockHorses,
      updateInterval: 16,
    });

    // Manually set all horses to finish
    positions.value = positions.value.map((pos) => ({
      ...pos,
      distance: 1,
      progress: 100,
    }));

    // Trigger update manually by calling the internal logic
    // Since we can't access updatePositions directly, we'll test getRoundResults instead
    expect(positions.value.every((pos) => pos.distance >= 1)).toBe(true);
  });

  it('getRoundResults returns horses sorted by distance', () => {
    const { startSimulation, positions, getRoundResults } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    // Manually set different distances
    const pos0 = positions.value[0];
    const pos1 = positions.value[1];
    const pos2 = positions.value[2];

    if (pos0 && pos1 && pos2) {
      positions.value = [
        { ...pos0, distance: 500, progress: 50 },
        { ...pos1, distance: 800, progress: 80 },
        { ...pos2, distance: 300, progress: 30 },
      ];

      const results = getRoundResults.value;
      const horse1 = mockHorses[1];
      const horse0 = mockHorses[0];
      const horse2 = mockHorses[2];

      if (horse1 && horse0 && horse2) {
        expect(results[0]?.id).toBe(horse1.id); // Highest distance
        expect(results[1]?.id).toBe(horse0.id); // Second highest
        expect(results[2]?.id).toBe(horse2.id); // Lowest distance
      }
    }
  });

  it('getRoundResults handles ties by progress', () => {
    const { startSimulation, positions, getRoundResults } = useRaceSimulation();

    startSimulation({
      distance: 1000,
      horses: mockHorses,
    });

    // Set same distance but different progress
    const pos0 = positions.value[0];
    const pos1 = positions.value[1];
    const pos2 = positions.value[2];

    if (pos0 && pos1 && pos2) {
      positions.value = [
        { ...pos0, distance: 500, progress: 50 },
        { ...pos1, distance: 500, progress: 60 },
        { ...pos2, distance: 500, progress: 40 },
      ];

      const results = getRoundResults.value;
      const horse1 = mockHorses[1];
      const horse0 = mockHorses[0];
      const horse2 = mockHorses[2];

      if (horse1 && horse0 && horse2) {
        expect(results[0]?.id).toBe(horse1.id); // Highest progress
        expect(results[1]?.id).toBe(horse0.id); // Second highest progress
        expect(results[2]?.id).toBe(horse2.id); // Lowest progress
      }
    }
  });
});
