import { ref, computed } from 'vue';
import config from '../config.js';

// Validate config structure
const validateConfig = (config) => {
  const errors = [];
  
  if (!config.aiName || typeof config.aiName !== 'string') {
    errors.push('aiName must be a non-empty string');
  }
  
  if (!config.shortAiName || typeof config.shortAiName !== 'string') {
    errors.push('shortAiName must be a non-empty string');
  }
  
  if (!config.copyright || typeof config.copyright !== 'string') {
    errors.push('copyright must be a non-empty string');
  }
  
  if (!config.alertAIText || typeof config.alertAIText !== 'string') {
    errors.push('alertAIText must be a non-empty string');
  }
  
  if (!Array.isArray(config.models) || config.models.length === 0) {
    errors.push('models must be a non-empty array');
  } else {
    config.models.forEach((model, index) => {
      if (!model.id || typeof model.id !== 'string') {
        errors.push(`models[${index}].id must be a non-empty string`);
      }
      if (!model.name || typeof model.name !== 'string') {
        errors.push(`models[${index}].name must be a non-empty string`);
      }
      if (!model.endpoint || typeof model.endpoint !== 'string') {
        errors.push(`models[${index}].endpoint must be a non-empty string`);
      }
      if (!model.model || typeof model.model !== 'string') {
        errors.push(`models[${index}].model must be a non-empty string`);
      }
    });
  }
  
  return errors;
};

// Validate the config on import
const configErrors = validateConfig(config);
if (configErrors.length > 0) {
  console.error('Configuration validation errors:', configErrors);
  throw new Error(`Invalid configuration: ${configErrors.join(', ')}`);
}

// Create reactive config
const configState = ref(config);

export const useConfig = () => {
  // Basic config properties
  const aiName = computed(() => configState.value.aiName);
  const shortAiName = computed(() => configState.value.shortAiName);
  const copyright = computed(() => configState.value.copyright);
  const alertAIText = computed(() => configState.value.alertAIText);
  const models = computed(() => configState.value.models);
  
  // Helper methods
  const getModelById = (modelId) => {
    return configState.value.models.find(m => m.id === modelId);
  };
  
  const getModelEndpoint = (modelId) => {
    const model = getModelById(modelId);
    return model ? model.endpoint : null;
  };
  
  const getAllModelIds = () => {
    return configState.value.models.map(m => m.id);
  };
  
  const getFirstModelId = () => {
    return configState.value.models.length > 0 ? configState.value.models[0].id : null;
  };
  
  // Update configuration (for potential future use)
  const updateConfig = (newConfig) => {
    const errors = validateConfig(newConfig);
    if (errors.length > 0) {
      throw new Error(`Invalid configuration: ${errors.join(', ')}`);
    }
    configState.value = { ...newConfig };
  };
  
  return {
    // Properties
    aiName,
    shortAiName,
    copyright,
    alertAIText,
    models,
    
    // Methods
    getModelById,
    getModelEndpoint,
    getAllModelIds,
    getFirstModelId,
    updateConfig,
    
    // Raw config access (for edge cases)
    config: computed(() => configState.value)
  };
};