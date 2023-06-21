const getRequestPriority = (priority: string): {color: string, icon: string} => {
  const PRIORITY = {
    "HIGH": { color: "#C8102E", icon: "arrowup" },
    "MEDIUM": { color: "#FFB300", icon: "minus" },
    "LOW": {color: "#76B82A", icon: "arrowdown" }
  };

  return PRIORITY[priority];
};

export { 
  getRequestPriority
};
