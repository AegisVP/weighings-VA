// import { WeighingsEntryForm } from 'components/WeighingEntryForm/WeighingEntryForm';
import { useGetConstantQuery } from 'redux/services/constantsAPI';
import {
  HarvestersList,
  HarvesterItem,
  StyledTable,
  StyledTableListSection,
  StyledTableHeaderSection,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableCell,
  StyledTableSpannedErrorCell,
} from './WeighingsList.styled';
// import { ReactComponent as Corn } from 'img/corn.svg';
// import { ReactComponent as Dust } from 'img/dust.svg';
// import { ReactComponent as Hay } from 'img/hay.svg';
// import { ReactComponent as Horse } from 'img/horse.svg';
// import { ReactComponent as Oats } from 'img/oats.svg';
// import { ReactComponent as Recycle } from 'img/recycle.svg';
// import { ReactComponent as Soya } from 'img/soya.svg';

export const WeighingsList = ({ weighings, weighingsIsLoading, weighingsIsFetching, weighingEntries = [] }) => {
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
    <StyledTable border="all">
      <StyledTableHeaderSection>
        <StyledTableRow>
          <StyledTableHeaderCell rowSpan="3" scope="col">
            Джерело
          </StyledTableHeaderCell>
          <StyledTableHeaderCell colSpan="3">Машина (трактор)</StyledTableHeaderCell>
          <StyledTableHeaderCell colSpan="4">Вага (кг)</StyledTableHeaderCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableHeaderCell rowSpan="2" scope="col">
            ПІП водія
          </StyledTableHeaderCell>
          <StyledTableHeaderCell rowSpan="2" scope="col">
            марка
          </StyledTableHeaderCell>
          <StyledTableHeaderCell rowSpan="2" scope="col">
            номер
          </StyledTableHeaderCell>
          <StyledTableHeaderCell rowSpan="2" scope="col">
            брутто
          </StyledTableHeaderCell>
          <StyledTableHeaderCell rowSpan="2" scope="col">
            тара
          </StyledTableHeaderCell>
          <StyledTableHeaderCell rowSpan="2" scope="col">
            нетто
          </StyledTableHeaderCell>
          <StyledTableHeaderCell scope="col">по комбайнерах</StyledTableHeaderCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell>
            {!!harvestersLocalList && (
              <HarvestersList count={harvestersLocalList.length}>
                {harvestersLocalList?.map(h => (
                  <HarvesterItem key={h}>{harvestersList.get(h)}</HarvesterItem>
                ))}
              </HarvestersList>
            )}
          </StyledTableCell>
        </StyledTableRow>
      </StyledTableHeaderSection>
      {/* {weighingEntries.length > 0 && (
        <tbody>
          {weighingEntries.map(entry => (
            <StyledTableRow>
              <StyledTableCell colSpan="8">
                <WeighingsEntryForm weighingEntry={entry} harverstersCount={harverstersCount} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </tbody>
      )} */}
      {weighings?.length > 0 ? (
        <StyledTableListSection>
          {weighings.map(weighing => {
            return (
              <StyledTableRow key={weighing._id}>
                <StyledTableCell>
                  <div className="flex justify-start gap-4 w-full">
                    <span>{sourcesList.get(weighing.crop.source)?.source}</span>
                    <img src={'img/corn.svg'} width="24" height="24" alt={'corn'} />
                    <span className="ml-auto">-&gt;</span>
                    <span>{destinationsList.get(weighing.crop.destination)}</span>
                  </div>
                </StyledTableCell>
                <StyledTableCell>{driversList.get(weighing.auto.driver)}</StyledTableCell>
                <StyledTableCell>{autosList.get(weighing.auto.id)?.auto}</StyledTableCell>
                <StyledTableCell>{autosList.get(weighing.auto.id)?.licensePlate}</StyledTableCell>
                <StyledTableCell>{weighing.weighing.brutto}</StyledTableCell>
                <StyledTableCell>{weighing.weighing.tare}</StyledTableCell>
                <StyledTableCell>{weighing.weighing.netto}</StyledTableCell>
                <StyledTableCell style={{ padding: 0 }}>
                  <HarvestersList count={harvestersLocalList.length}>
                    {harvestersLocalList.map(h => (
                      <HarvesterItem key={h}>{sourcesList.get(weighing.crop.source)?.isHarvested ? weighing.harvesters.find(wh => wh.id === h)?.weight : '- - -'}</HarvesterItem>
                    ))}
                  </HarvestersList>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </StyledTableListSection>
      ) : (
        <StyledTableListSection>
          <StyledTableRow>
            <StyledTableSpannedErrorCell colSpan="8">Зважування за цей день відсутні</StyledTableSpannedErrorCell>
          </StyledTableRow>
        </StyledTableListSection>
      )}
    </StyledTable>
  );
};
