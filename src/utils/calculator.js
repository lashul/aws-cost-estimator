export const calculateCosts = (inputs, pricing) => {
  const {
    storageConsumedTB,
    averageFileSizeMB,
    dailyChangeRatePercent,
    retentionDays,
    monthlyDataRetrievedGB,
    multipartSizeMB = 16
  } = inputs;

  const storageConsumedGB = storageConsumedTB * 1024;

  const {
    s3StandardStorage, s3StandardPut, s3StandardGet,
    s3StandardIAStorage, s3StandardIAPut, s3StandardIAGet, s3StandardIARetrieval,
    glacierInstantStorage, glacierInstantPut, glacierInstantRetrieval,
    glacierFlexibleStorage, glacierFlexiblePut, glacierFlexibleRetrieval,
    glacierDeepStorage, glacierDeepPut, glacierDeepRetrieval,
    dataEgress
  } = pricing;

  // 1. Storage Calculation
  // Steady state storage assumes initial storage is the baseline "full backup".
  // Daily changes are incremental backups retained for retentionDays.
  const dailyChangeGB = storageConsumedGB * (dailyChangeRatePercent / 100);
  const totalSteadyStateStorageGB = storageConsumedGB + (dailyChangeGB * retentionDays);

  // 2. API Requests Calculation
  // Estimate number of files changed daily
  const dailyChangedFiles = (dailyChangeGB * 1024) / averageFileSizeMB;
  // Account for Multipart Uploads (files are split into chunks, each is a PUT request)
  // AWS minimum part size is 5MB.
  const actualPartSize = Math.max(5, multipartSizeMB);
  const putsPerFile = Math.ceil(averageFileSizeMB / actualPartSize);
  const monthlyPutRequests = (dailyChangedFiles * 30) * putsPerFile;
  
  // Base cost per 1000 requests
  const s3PutCost = (monthlyPutRequests / 1000) * s3StandardPut;
  const s3IAPutCost = (monthlyPutRequests / 1000) * s3StandardIAPut;
  const glacierInstantPutCost = (monthlyPutRequests / 1000) * glacierInstantPut;
  const glacierFlexPutCost = (monthlyPutRequests / 1000) * glacierFlexiblePut;
  const glacierDeepPutCost = (monthlyPutRequests / 1000) * glacierDeepPut;

  // 3. Retrieval & Egress Calculation
  // Assuming basic GET requests for the retrieved data
  const retrievedFiles = (monthlyDataRetrievedGB * 1024) / averageFileSizeMB;
  const s3GetCost = (retrievedFiles / 1000) * s3StandardGet;
  const s3IAGetCost = (retrievedFiles / 1000) * s3StandardIAGet;

  const egressCost = monthlyDataRetrievedGB * dataEgress;

  // Specific retrieval costs per tier (Glacier charges per GB for retrieval)
  const s3RetrievalCost = 0; // standard has no per GB retrieval fee
  const s3IARetrievalCost = monthlyDataRetrievedGB * s3StandardIARetrieval;
  const glacierInstantRetrievalCost = monthlyDataRetrievedGB * glacierInstantRetrieval;
  const glacierFlexRetrievalCost = monthlyDataRetrievedGB * glacierFlexibleRetrieval;
  const glacierDeepRetrievalCost = monthlyDataRetrievedGB * glacierDeepRetrieval;

  return {
    storage: {
      steadyStateGB: totalSteadyStateStorageGB,
      monthlyNewDataGB: dailyChangeGB * 30,
    },
    apiCalls: {
      monthlyPuts: monthlyPutRequests,
      monthlyGets: retrievedFiles,
    },
    tiers: {
      s3Standard: {
        storageFee: totalSteadyStateStorageGB * s3StandardStorage,
        apiFee: s3PutCost + s3GetCost,
        retrievalFee: s3RetrievalCost,
        egressFee: egressCost,
        total: (totalSteadyStateStorageGB * s3StandardStorage) + s3PutCost + s3GetCost + s3RetrievalCost + egressCost
      },
      s3StandardIA: {
        storageFee: totalSteadyStateStorageGB * s3StandardIAStorage,
        apiFee: s3IAPutCost + s3IAGetCost,
        retrievalFee: s3IARetrievalCost,
        egressFee: egressCost,
        total: (totalSteadyStateStorageGB * s3StandardIAStorage) + s3IAPutCost + s3IAGetCost + s3IARetrievalCost + egressCost
      },
      glacierInstant: {
        storageFee: totalSteadyStateStorageGB * glacierInstantStorage,
        apiFee: glacierInstantPutCost + s3GetCost,
        retrievalFee: glacierInstantRetrievalCost,
        egressFee: egressCost,
        total: (totalSteadyStateStorageGB * glacierInstantStorage) + glacierInstantPutCost + s3GetCost + glacierInstantRetrievalCost + egressCost
      },
      glacierFlexible: {
        storageFee: totalSteadyStateStorageGB * glacierFlexibleStorage,
        apiFee: glacierFlexPutCost + s3GetCost, // Uses standard get for simplicity or specific
        retrievalFee: glacierFlexRetrievalCost,
        egressFee: egressCost,
        total: (totalSteadyStateStorageGB * glacierFlexibleStorage) + glacierFlexPutCost + s3GetCost + glacierFlexRetrievalCost + egressCost
      },
      glacierDeepArchive: {
        storageFee: totalSteadyStateStorageGB * glacierDeepStorage,
        apiFee: glacierDeepPutCost + s3GetCost,
        retrievalFee: glacierDeepRetrievalCost,
        egressFee: egressCost,
        total: (totalSteadyStateStorageGB * glacierDeepStorage) + glacierDeepPutCost + s3GetCost + glacierDeepRetrievalCost + egressCost
      }
    }
  };
};

export const defaultPricing = {
  s3StandardStorage: 0.023,    // $ per GB/month
  s3StandardPut: 0.005,        // $ per 1000 requests
  s3StandardGet: 0.0004,       // $ per 1000 requests

  s3StandardIAStorage: 0.0125, // $ per GB/month
  s3StandardIAPut: 0.01,       // $ per 1000 requests
  s3StandardIAGet: 0.001,      // $ per 1000 requests
  s3StandardIARetrieval: 0.01, // $ per GB retrieval
  
  glacierInstantStorage: 0.004, // $ per GB/month
  glacierInstantPut: 0.02,      // $ per 1000 requests
  glacierInstantRetrieval: 0.03, // $ per GB retrieval
  
  glacierFlexibleStorage: 0.0036, // $ per GB/month
  glacierFlexiblePut: 0.03,       // $ per 1000 requests (Actually lifecycle transition cost)
  glacierFlexibleRetrieval: 0.003, // $ per GB standard retrieval
  
  glacierDeepStorage: 0.00099, // $ per GB/month
  glacierDeepPut: 0.05,        // $ per 1000 requests
  glacierDeepRetrieval: 0.02,  // $ per GB standard retrieval

  dataEgress: 0.09             // $ per GB internet egress
};

export const defaultInputs = {
  storageConsumedTB: 1,         // 1 TB
  averageFileSizeMB: 2,         // 2 MB average file
  dailyChangeRatePercent: 2,    // 2% daily change
  retentionDays: 30,            // 30 days retention
  monthlyDataRetrievedGB: 10,   // 10 GB restored per month
  multipartSizeMB: 16           // 16 MB multipart chunk size
};
