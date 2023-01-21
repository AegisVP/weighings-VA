// import { WeighingsEntryForm } from 'components/WeighingEntryForm/WeighingEntryForm';
import { WeighingsList } from 'components/WeighingsList/WeighingsList';

const WeighingsEntryPage = () => {
  return (
    <div className="grid grid-cols-9">
      <p>Weighings entry page</p>
      <WeighingsList />
    </div>
  );
};

export default WeighingsEntryPage;
