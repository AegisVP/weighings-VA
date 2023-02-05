import { WeighingsEntryForm } from 'components/WeighingEntryForm/WeighingEntryForm';
import { WeighingsEntryHeader } from 'components/WeighingsEntryHeader/WeighingsEntryHeader';
import { WeighingsList } from 'components/WeighingsList/WeighingsList';
import { useLayoutEffect, useState } from 'react';
import { useGetConstantQuery } from 'redux/services/constantsAPI';
import { useGetWeighingsQuery } from 'redux/services/weighingsAPI';
import { date2Obj } from 'utils';

const sourcesList = new Map();

const WeighingsEntryPage = () => {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [date, setDate] = useState(new Date());
  const weighingEntries = [];
  const { data: weighingsData = [], isLoading: weighingsIsLoading, isFetching: weighingsIsFetching } = useGetWeighingsQuery({ ...date2Obj(date) });

  const { data: sourcesData } = useGetConstantQuery('sourcesList');
  sourcesData?.forEach(i => sourcesList.set(String(i._id), { source: i.source, isHarvested: i.isHarvested }));

  const { data: destinationsList } = useGetConstantQuery('destinationsList');
  const { data: cropsList } = useGetConstantQuery('cropsList');

  const addNewWeighing = e => {
    console.log(e);
  };

  useLayoutEffect(() => {
    if (!!weighingsData?.length) setDailyTotal(weighingsData.reduce((acc, cur) => (acc += sourcesList.get(cur.crop.source)?.isHarvested ? parseInt(cur.weighing.netto) : 0), 0));
  }, [weighingsData]);

  return (
    <>
      <WeighingsEntryHeader
        addNewWeighing={addNewWeighing}
        updateDate={setDate}
        searchDate={date}
        dailyTotal={dailyTotal}
        destinationsList={destinationsList}
        cropsList={cropsList}
      />
      {/* <WeighingsEntryForm /> */}
      <WeighingsList weighings={weighingsData} weighingsIsLoading={weighingsIsLoading} weighingsIsFetching={weighingsIsFetching} weighingEntries={weighingEntries} />
    </>
  );
};

export default WeighingsEntryPage;
