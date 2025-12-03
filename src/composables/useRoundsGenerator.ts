const useRoundGenerator = () => {
  const generateRound = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  return {
    generateRound,
  };
};

export { useRoundGenerator };
