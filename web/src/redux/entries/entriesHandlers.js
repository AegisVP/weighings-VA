export const handleAddEntry = (state, action) => {
  state.items.push(action.payload);
};

export const handleModifyEntry = (state, action) => {
  console.log(action.payload);
  const { id, auto, harvesters, weighing } = action.payload;
  const curEntry = state.items[id];

  if (!!auto) curEntry.auto = { ...curEntry.auto, ...auto };

  if (!!weighing) curEntry.weighing = { ...curEntry.weighing, ...weighing };

  if (!!harvesters) {
    const { harvesterId, harvesterWeight } = harvesters;
    const updatedHarvesters = [...curEntry.harvesters];
    const updatedHarvesterData = { id: harvesterId, weight: parseInt(harvesterWeight) };
    const updateIndex = curEntry.harvesters.findIndex(baseHarvester => baseHarvester.id === harvesterId);

    console.log({ updateIndex, updatedHarvesterData });

    if (updateIndex < 0) {
      if (updatedHarvesterData.weight > 0) updatedHarvesters.push(updatedHarvesterData);
    } else {
      if (updatedHarvesterData.weight > 0) updatedHarvesters[updateIndex] = updatedHarvesterData;
      else updatedHarvesters.splice(updateIndex, 1);
    }

    curEntry.harvesters = updatedHarvesters;
  }
};

export const handleRemoveEntry = (state, action) => {
  state.items.splice(action.payload.id, 1);
};
