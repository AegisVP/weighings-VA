import { WeighingsEntryForm } from 'components/WeighingEntryForm/WeighingEntryForm';
import { WeighingsEntryHeader } from 'components/WeighingsEntryHeader/WeighingsEntryHeader';
import { WeighingsList } from 'components/WeighingsList/WeighingsList';
import { useLayoutEffect, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntries } from 'redux/selectors';
import { addNewEntry } from 'redux/actions';
import { useGetConstantQuery } from 'redux/services/constantsAPI';
import { useGetWeighingsQuery } from 'redux/services/weighingsAPI';
import { date2Obj } from 'utils';

const WeighingsPage = () => {
  const dispatch = useDispatch();
  const [dailyTotal, setDailyTotal] = useState(0);
  const [date, setDate] = useState(new Date());
  const weighingEntries = useSelector(selectEntries);

  const { data: weighingsData = [], isLoading: weighingsIsLoading, isFetching: weighingsIsFetching } = useGetWeighingsQuery({ ...date2Obj(date) });
  const { data: destinationsList } = useGetConstantQuery('destinationsList');
  const { data: cropsList } = useGetConstantQuery('cropsList');
  const { data: sourcesList } = useGetConstantQuery('sourcesList');

  const addNewWeighing = newEntry => dispatch(addNewEntry(newEntry));

  useLayoutEffect(() => {
    if (!!weighingsData?.length)
      setDailyTotal(
        weighingsData.length > 0
          ? weighingsData.reduce((acc, cur) => (acc += sourcesList.find(({ _id }) => _id === cur.crop.source)?.isHarvested ? parseInt(cur.weighing.netto) : 0), 0)
          : 0
      );
  }, [weighingsData, sourcesList]);

  useEffect(() => setDailyTotal(0), [date]);

  return (
    <>
      <WeighingsEntryHeader
        addNewWeighing={addNewWeighing}
        updateDate={setDate}
        searchDate={date}
        dailyTotal={dailyTotal}
        destinationsList={destinationsList}
        sourcesList={sourcesList}
        cropsList={cropsList}
      />
      {weighingEntries.map((entry, i) => (
        <WeighingsEntryForm key={i} id={i} weighingEntry={entry} />
      ))}
      <WeighingsList
        weighings={weighingsData}
        weighingsIsLoading={weighingsIsLoading}
        weighingsIsFetching={weighingsIsFetching}
        weighingEntries={weighingEntries}
        dailyTotal={dailyTotal}
      />
    </>
  );
};

export default WeighingsPage;
