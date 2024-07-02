function logger(...args) {
  args.unshift("[stream.new]");
  console.log(...args);
}

logger.warn = function loggerWarn(...args) {
  args.unshift("[stream.new]");
  console.warn(...args);
};

logger.error = function loggerError(...args) {
  args.unshift("[stream.new]");
  console.warn(...args);
};

export default logger;
