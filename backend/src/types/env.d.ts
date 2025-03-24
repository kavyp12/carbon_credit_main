declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_HOST?: string;
      DB_PORT?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      JWT_SECRET?: string;
    }
  }
  
  export {};