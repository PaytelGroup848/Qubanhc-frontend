import { DEFAULT_SETTINGS } from '../constants/settingsDefaults';

export function mergeSettings(settings = {}) {
  return {
    maintenance: {
      ...DEFAULT_SETTINGS.maintenance,
      ...(settings.maintenance || {}),
    },

    support: {
      ...DEFAULT_SETTINGS.support,
      ...(settings.support || {}),
    },

    billing: {
      ...DEFAULT_SETTINGS.billing,
      ...(settings.billing || {}),
    },

    order: {
      ...DEFAULT_SETTINGS.order,
      ...(settings.order || {}),
    },

    tax: {
      ...DEFAULT_SETTINGS.tax,
      ...(settings.tax || {}),
    },

    delivery: {
      ...DEFAULT_SETTINGS.delivery,
      ...(settings.delivery || {}),
      partners: Array.isArray(settings.delivery?.partners)
        ? settings.delivery.partners
        : [],
    },
  };
}

export function toNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}