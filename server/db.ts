import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../shared/schema.js';

const sqlite = new Database('./database.db');
export const db = drizzle(sqlite, { schema });

export const {
  users,
  productionActivities,
  maintenanceSchedules,
  securityAlerts,
  notifications
} = schema;