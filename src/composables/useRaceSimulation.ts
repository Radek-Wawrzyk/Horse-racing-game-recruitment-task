import { ref, computed } from 'vue';
import type { RaceHorse } from '@/types/Race';
import type { RaceHorsePosition } from '@/types/Race';

interface SimulationConfig {
  distance: number;
  horses: RaceHorse[];
  updateInterval?: number;
}

const useRaceSimulation = () => {
  const positions = ref<RaceHorsePosition[]>([]);
  const isRunning = ref(false);
  const isFinished = ref(false);
  const currentConfig = ref<SimulationConfig | null>(null);

  let animationFrameId: number | null = null;
  let startTime: number = 0;
  let lastUpdateTime: number = 0;
  const horseMomentum = new Map<number, number>();

  // INFO: Speed is calculated based on the horse's condition, the higher the condition, the faster the horse
  // INFO: Added significant randomness to make races more unpredictable
  const calculateHorseSpeed = (condition: number, horseId: number): number => {
    // INFO: Base speed in m/s (range 50-100 m/s) - very fast for exciting races
    const baseSpeed = 80 + (condition / 100) * 50;

    // INFO: Momentum changes randomly over time (0.85-1.15) to simulate form fluctuations
    if (!horseMomentum.has(horseId)) {
      horseMomentum.set(horseId, 0.85 + Math.random() * 0.3);
    } else {
      // INFO: Momentum can change slightly each update (5% chance to change)
      if (Math.random() < 0.05) {
        const currentMomentum = horseMomentum.get(horseId) || 1;
        const change = (Math.random() - 0.5) * 0.1;
        horseMomentum.set(horseId, Math.max(0.7, Math.min(1.3, currentMomentum + change)));
      }
    }

    const momentum = horseMomentum.get(horseId) || 1;

    // INFO: Additional per-update randomness (0.9-1.1) for more unpredictability
    const instantRandomness = 0.9 + Math.random() * 0.2;

    return baseSpeed * momentum * instantRandomness;
  };

  const initializePositions = (horses: RaceHorse[]) => {
    // INFO: Reset momentum for new race
    horseMomentum.clear();

    positions.value = horses.map((horse, index) => ({
      horse,
      position: index + 1,
      lane: index + 1,
      progress: 0,
      distance: 0,
    }));

    isFinished.value = false;
  };

  const updatePositions = (deltaTime: number, totalDistance: number) => {
    if (isFinished.value) return;
    let allFinished = true;

    positions.value = positions.value.map((pos) => {
      if (pos.distance >= totalDistance) {
        return { ...pos, progress: 100, distance: totalDistance };
      }

      allFinished = false;
      const speed = calculateHorseSpeed(pos.horse.condition, pos.horse.id);
      const newDistance = pos.distance + (speed * deltaTime) / 1000; // INFO: deltaTime in ms, so we divide by 1000
      const newProgress = Math.min((newDistance / totalDistance) * 100, 100);
      const finalDistance = Math.min(newDistance, totalDistance);

      return {
        ...pos,
        progress: newProgress,
        distance: finalDistance,
      };
    });

    positions.value.sort((a, b) => b.distance - a.distance);

    if (allFinished) {
      isFinished.value = true;
    }
  };

  const startSimulation = (config: SimulationConfig) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    currentConfig.value = config;
    initializePositions(config.horses);
    isRunning.value = true;
    isFinished.value = false;
    startTime = performance.now();
    lastUpdateTime = startTime;

    const updateInterval = config.updateInterval || 16;

    const animate = (currentTime: number) => {
      if (!isRunning.value) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      const deltaTime = currentTime - lastUpdateTime;

      if (deltaTime >= updateInterval) {
        updatePositions(deltaTime, config.distance);
        lastUpdateTime = currentTime;
      }

      if (!isFinished.value) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);
  };

  const pauseSimulation = () => {
    isRunning.value = false;
  };

  const resumeSimulation = () => {
    if (!isFinished.value && currentConfig.value) {
      isRunning.value = true;
      lastUpdateTime = performance.now();

      const animate = (currentTime: number) => {
        if (!isRunning.value || !currentConfig.value) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          return;
        }

        const deltaTime = currentTime - lastUpdateTime;
        lastUpdateTime = currentTime;

        updatePositions(deltaTime, currentConfig.value.distance);

        if (!isFinished.value) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  const stopSimulation = () => {
    isRunning.value = false;
    isFinished.value = false;
    currentConfig.value = null;
    horseMomentum.clear();

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    positions.value = [];
  };

  const getRoundResults = computed(() => {
    return [...positions.value]
      .sort((a, b) => {
        if (Math.abs(b.distance - a.distance) < 0.001) {
          return b.progress - a.progress;
        }
        return b.distance - a.distance;
      })
      .map((pos) => pos.horse);
  });

  return {
    positions,
    isRunning,
    isFinished,
    getRoundResults,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
  };
};

export { useRaceSimulation };
