import type { TypeFeatureSchema } from '../../../api/src/schema/featureSchema';
import type { TypeUserSchema } from '../redux/types';

export const getAllUserFeatures = (user: TypeUserSchema): TypeFeatureSchema[] => user.features;

export const getActiveFeatures = (user: TypeUserSchema): TypeFeatureSchema[] => {
  const retFeatures = [];
  const allFeatures = getAllUserFeatures(user);
  for (const feature of allFeatures) {
    const enabled = feature.enabled;
    const expires = feature.UserHasFeature.expires;

    if (!enabled) continue;
    if (expires && expires < new Date()) continue;

    retFeatures.push(feature);
  }
  return retFeatures;
};

export const parseFeatures = (features: TypeFeatureSchema[]): string[] => features.map((feature) => feature.name);
