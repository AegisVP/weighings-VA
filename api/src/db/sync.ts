const syncCondition = { alter: true, force: true };
const doSync = true;

import { User, Location, Crop, MachineType, Operator, Machine, Weighing } from '../models/index.ts';

Machine.belongsTo(MachineType, { foreignKey: 'type', targetKey: 'id' });
MachineType.hasMany(Machine, { foreignKey: 'type', sourceKey: 'id' });

Weighing.belongsTo(Crop, { foreignKey: 'crop', targetKey: 'id' });
Crop.hasMany(Weighing, { foreignKey: 'crop', sourceKey: 'id' });

Weighing.belongsTo(Machine, { foreignKey: 'auto', targetKey: 'id' });
Machine.hasMany(Weighing, { foreignKey: 'auto', sourceKey: 'id' });

Weighing.belongsTo(Operator, { foreignKey: 'driver', targetKey: 'id' });
Operator.hasMany(Weighing, { foreignKey: 'driver', sourceKey: 'id' });

Weighing.belongsTo(Machine, { foreignKey: 'harvester', targetKey: 'id' });
Machine.hasMany(Weighing, { foreignKey: 'harvester', sourceKey: 'id' });

Weighing.belongsTo(Operator, { foreignKey: 'operator', targetKey: 'id' });
Operator.hasMany(Weighing, { foreignKey: 'operator', sourceKey: 'id' });

Weighing.belongsTo(Location, { foreignKey: 'source', targetKey: 'id' });
Location.hasMany(Weighing, { foreignKey: 'source', sourceKey: 'id' });

Weighing.belongsTo(Location, { foreignKey: 'destination', targetKey: 'id' });
Location.hasMany(Weighing, { foreignKey: 'destination', sourceKey: 'id' });

if (doSync) {
  console.log('Syncing DB with condition:', syncCondition);
  (async () => {
    await User.sync(syncCondition);
    await MachineType.sync(syncCondition);
    await Location.sync(syncCondition);
    await Crop.sync(syncCondition);
    await Operator.sync(syncCondition);
    await Machine.sync(syncCondition);
    await Weighing.sync(syncCondition);
  })();
}
