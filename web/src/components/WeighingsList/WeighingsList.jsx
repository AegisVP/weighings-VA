// import { WeighingsEntryForm } from 'components/WeighingEntryForm/WeighingEntryForm';
import { useGetConstantQuery } from 'redux/services/constantsAPI';
import { HarvestersList, HarvesterItem } from './WeighingsList.styled';
// import { ReactComponent as Corn } from 'img/corn.svg';
// import { ReactComponent as Dust } from 'img/dust.svg';
// import { ReactComponent as Hay } from 'img/hay.svg';
// import { ReactComponent as Horse } from 'img/horse.svg';
// import { ReactComponent as Oats } from 'img/oats.svg';
// import { ReactComponent as Recycle } from 'img/recycle.svg';
// import { ReactComponent as Soya } from 'img/soya.svg';

export const WeighingsList = ({ weighings, weighingsIsLoading, weighingsIsFetching, weighingEntries }) => {
  const autosList = new Map();
  const { data: autosData } = useGetConstantQuery('autosList');
  autosData?.forEach(i => autosList.set(String(i._id), { auto: i.auto, licensePlate: i.licensePlate }));

  const harvestersList = new Map();
  const { data: harvestersData } = useGetConstantQuery('harvestersList');
  harvestersData?.forEach(i => harvestersList.set(String(i._id), i.harvester));

  const sourcesList = new Map();
  const { data: sourcesData } = useGetConstantQuery('sourcesList');
  sourcesData?.forEach(i => sourcesList.set(String(i._id), { source: i.source, isHarvested: i.isHarvested }));

  const driversList = new Map();
  const { data: driversData } = useGetConstantQuery('driversList');
  driversData?.forEach(i => driversList.set(String(i._id), i.driver));

  const destinationsList = new Map();
  const { data: destinationsData } = useGetConstantQuery('destinationsList');
  destinationsData?.forEach(i => destinationsList.set(String(i._id), i.destination));

  // const cropsList = new Map();
  // const { data: cropsData } = useGetConstantQuery('cropsList');
  // cropsData?.forEach(i => cropsList.set(String(i._id), i));

  const harvestersLocalList = weighings
    ?.flatMap(w => (sourcesList.get(w.crop.source)?.isHarvested ? w.harvesters.map(harvester => harvester.id) : []))
    .reduce((acc, cur) => {
      if (!acc.includes(cur)) acc.push(cur);
      return acc;
    }, []);

  return (
    <table className="border w-[1200px]" border="all">
      <thead className="border">
        <tr className="border">
          <th rowSpan="3" scope="col" className="border">
            Джерело
          </th>
          <th colSpan="3" className="border">
            Машина (трактор)
          </th>
          <th colSpan="4" className="border">
            Вага (кг)
          </th>
        </tr>
        <tr className="border">
          <th rowSpan="2" scope="col" className="border">
            ПІП водія
          </th>
          <th rowSpan="2" scope="col" className="border">
            марка
          </th>
          <th rowSpan="2" scope="col" className="border">
            номер
          </th>
          <th rowSpan="2" scope="col" className="border">
            брутто
          </th>
          <th rowSpan="2" scope="col" className="border">
            тара
          </th>
          <th rowSpan="2" scope="col" className="border">
            нетто
          </th>
          <th scope="col" className="border">
            по комбайнерах
          </th>
        </tr>
        <tr>
          <td className=" border p-0">
            {!!harvestersLocalList && (
              <HarvestersList count={harvestersLocalList.length}>
                {harvestersLocalList?.map(h => (
                  <HarvesterItem key={h}>{harvestersList.get(h)}</HarvesterItem>
                ))}
              </HarvestersList>
            )}
          </td>
        </tr>
      </thead>
      {/* {!!weighingEntries && (
        <tbody>
          {weighingEntries.map(entry => (
            <tr>
              <td colSpan="8" className="border p-0">
                <WeighingsEntryForm weighingEntry={entry} harverstersCount={harverstersCount} />
              </td>
            </tr>
          ))}
        </tbody>
      )} */}
      {!!weighings?.length && (
        <tfoot>
          {weighings.map(weighing => {
            return (
              <tr key={weighing._id}>
                <td className="border flex justify-start gap-4 pr-4">
                  <span>{sourcesList.get(weighing.crop.source)?.source}</span>
                  <img src={'img/corn.svg'} width="24" height="24" alt={'corn'} />
                  <span className="ml-auto">-&gt;</span>
                  <span>{destinationsList.get(weighing.crop.destination)}</span>
                </td>
                <td className="border">{driversList.get(weighing.auto.driver)}</td>
                <td className="border">{autosList.get(weighing.auto.id)?.auto}</td>
                <td className="border">{autosList.get(weighing.auto.id)?.licensePlate}</td>
                <td className="border">{weighing.weighing.brutto}</td>
                <td className="border">{weighing.weighing.tare}</td>
                <td className="border">{weighing.weighing.netto}</td>
                <td className="border p-0">
                  <HarvestersList count={harvestersLocalList.length}>
                    {harvestersLocalList.map(h => (
                      <HarvesterItem key={h}>{sourcesList.get(weighing.crop.source)?.isHarvested ? weighing.harvesters.find(wh => wh.id === h)?.weight : '- - -'}</HarvesterItem>
                    ))}
                  </HarvestersList>
                </td>
              </tr>
            );
          })}
        </tfoot>
      )}
    </table>
  );
};
