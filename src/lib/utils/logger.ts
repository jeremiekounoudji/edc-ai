// /utils/logger.ts
// Centralized logger for the application following EDC-AI logging guidelines

/**
 * Log information messages for lifecycle events
 */
export const logInfo = (msg: string, meta?: object) => {
  if (typeof window !== 'undefined') {
    // Client-side logging
    console.info(JSON.stringify({ 
      level: "info", 
      msg, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};

/**
 * Log action messages for user interactions
 */
export const logAction = (msg: string, meta?: object) => {
  if (typeof window !== 'undefined') {
    console.info(JSON.stringify({ 
      level: "action", 
      msg, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};

/**
 * Log API calls
 */
export const logAPI = (endpoint: string, status: string, meta?: object) => {
  if (typeof window !== 'undefined') {
    console.log(JSON.stringify({ 
      level: "api", 
      endpoint, 
      status, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};

/**
 * Log AI-driven actions
 */
export const logAI = (msg: string, meta?: object) => {
  if (typeof window !== 'undefined') {
    console.info(JSON.stringify({ 
      level: "ai", 
      msg, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};

/**
 * Log error messages
 */
export const logError = (msg: string, meta?: object) => {
  if (typeof window !== 'undefined') {
    console.error(JSON.stringify({ 
      level: "error", 
      msg, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};

/**
 * Log warning messages
 */
export const logWarn = (msg: string, meta?: object) => {
  if (typeof window !== 'undefined') {
    console.warn(JSON.stringify({ 
      level: "warn", 
      msg, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};

/**
 * Debug logging - only in development
 */
export const logDebug = (msg: string, meta?: object) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.debug(JSON.stringify({ 
      level: "debug", 
      msg, 
      ...meta, 
      ts: new Date().toISOString() 
    }));
  }
};