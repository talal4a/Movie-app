const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  log: (...args) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (!isProduction) {
      console.error(...args);
    }
    // You can add error reporting service here (e.g., Sentry, LogRocket)
  },
  warn: (...args) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (!isProduction) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },
};

export default logger;
