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

  // INFO: Speed is calculated based on the horse's condition, the higher the condition, the faster the horse
  const calculateHorseSpeed = (condition: number): number => {
    // INFO: Base speed in m/s (range 8-12 m/s)
    const baseSpeed = 8 + (condition / 100) * 4;
    const randomness = 10 + (Math.random() - 0.5) * 0.2;
    return baseSpeed * randomness;
  };

  const initializePositions = (horses: RaceHorse[]) => {
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
      const speed = calculateHorseSpeed(pos.horse.condition);
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

    const updateInterval = config.updateInterval || 50;

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
