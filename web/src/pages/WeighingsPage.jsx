import { WeighingsEntryForm } from 'components/WeighingEntryForm/WeighingEntryForm';
import { WeighingsEntryHeader } from 'components/WeighingsEntryHeader/WeighingsEntryHeader';
import { WeighingsList } from 'components/WeighingsList/WeighingsList';
import { useLayoutEffect, useRef, useState } from 'react';
import { useGetConstantQuery } from 'redux/services/constantsAPI';
import { useGetWeighingsQuery } from 'redux/services/weighingsAPI';
import { date2Obj } from 'utils';

const sourcesList = new Map();

const WeighingsPage = () => {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [date, setDate] = useState(new Date());
  const weighingEntries = useRef([]);

  const { data: weighingsData = [], isLoading: weighingsIsLoading, isFetching: weighingsIsFetching } = useGetWeighingsQuery({ ...date2Obj(date) });
  const { data: destinationsList } = useGetConstantQuery('destinationsList');
  const { data: cropsList } = useGetConstantQuery('cropsList');
  useGetConstantQuery('sourcesList')?.data?.forEach(i => sourcesList.set(String(i._id), { source: i.source, isHarvested: i.isHarvested }));

  const addNewWeighing = e => {
    weighingEntries.current.push({});
    console.log(weighingEntries.current);
    // console.log(e);
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
      {weighingEntries.current.map(entry => (
        <WeighingsEntryForm key={entry?.id || entry} weighingEntry={entry} />
      ))}
      <WeighingsList weighings={weighingsData} weighingsIsLoading={weighingsIsLoading} weighingsIsFetching={weighingsIsFetching} weighingEntries={weighingEntries} />
    </>
  );
};

export default WeighingsPage;
