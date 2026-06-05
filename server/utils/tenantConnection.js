import mongoose from 'mongoose';

// Map to store tenant-specific models so we don't re-compile them
const tenantModels = {};

/**
 * Returns a Mongoose connection to a specific tenant database.
 * Uses `useDb` to multiplex over the existing master connection pool.
 */
export const getTenantConnection = (companyId) => {
  // MongoDB limits db names to 38 characters on Atlas.
  // 'tenant_' + 24 char ObjectID = 31 chars (safe).
  const dbName = `tenant_${companyId}`;
  
  // useCache: true ensures that Mongoose reuses the connection object for this dbName
  const tenantDb = mongoose.connection.useDb(dbName, { useCache: true });
  return tenantDb;
};

/**
 * Helper to get a model bound to a specific tenant connection.
 */
export const getTenantModel = (connection, modelName, schema) => {
  // The connection.model() function compiles the model for this specific DB.
  // We check if it's already compiled to avoid OverwriteModelError.
  return connection.models[modelName] || connection.model(modelName, schema);
};
