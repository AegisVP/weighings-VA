import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { modifyEntry, removeEntry } from 'redux/actions';
import { useGetConstantQuery } from 'redux/services/constantsAPI';
import { useAddWeighingMutation } from 'redux/services/weighingsAPI';
import { obj2Date } from 'utils';

export const WeighingsEntryForm = ({ weighingEntry = {}, id }) => {
  const dispatch = useDispatch();
  const [submitAction, setSubmitAction] = useState();
  const [addWeighing, { data: dataAdding, isError: isErrorAdding, error: errorAdding }] = useAddWeighingMutation();

  const { data: sourcesList } = useGetConstantQuery('sourcesList');
  const { data: destinationsList } = useGetConstantQuery('destinationsList');
  const { data: cropsList } = useGetConstantQuery('cropsList');
  const { data: autosList } = useGetConstantQuery('autosList');
  const { data: driversList } = useGetConstantQuery('driversList');
  const { data: harvestersList } = useGetConstantQuery('harvestersList');

  // TODO: refactor to redux --
  // const [brutto, setBrutto] = useState();
  // const [tare, setTare] = useState();
  // const [netto, setNetto] = useState();

  // useEffect(() => {
  //   if (!!brutto && !!tare) setNetto(brutto - tare);
  // }, [brutto, tare]);
  // --

  const curCrop = cropsList?.find(({ _id }) => _id === weighingEntry.crop.id);
  const curSource = sourcesList?.find(({ _id }) => _id === weighingEntry.crop.source);

  const handleModifyHarvester = e => {
    dispatch(
      modifyEntry({
        id,
        harvesters: {
          harvesterWeight: !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : 0,
          harvesterId: e.target.id.toString().slice(e.target.id.toString().indexOf('_') + 1),
        },
      })
    );
  };
  const handleCalculateNetto = ({ tare: { value: t }, brutto: { value: b } }) => {
    const brutto = parseInt(b);
    const tare = parseInt(t);
    if (brutto > 0 && tare > 0 && brutto > tare) dispatch(modifyEntry({ id, weighing: { netto: brutto - tare } }));
  };
  const handleModifyDriver = e => dispatch(modifyEntry({ id, auto: { driver: e.target.value } }));
  const handleModifyAuto = e => dispatch(modifyEntry({ id, auto: { id: e.target.value } }));
  const handleModifyBrutto = e => dispatch(modifyEntry({ id, weighing: { brutto: parseInt(e.target.value) } }));
  const handleModifyTare = e => dispatch(modifyEntry({ id, weighing: { tare: parseInt(e.target.value) } }));

  const handleAddWeighing = () => setSubmitAction('add');
  const handleRemoveEntry = () => setSubmitAction('remove');
  const handleSubmit = e => {
    e.preventDefault();
    const id = e.currentTarget.elements.id.value;
    console.log({ submitAction, id });

    switch (submitAction) {
      case 'add':
        let errorMessage = [];
        const { date, crop, auto, harvesters, weighing } = weighingEntry;
        // Check entries

        if (!auto.id && String(auto.id).length === 0 && String(auto.id) !== '0') errorMessage.push('"auto.id" must be a string');
        if (!auto.driver && String(auto.driver).length === 0 && String(auto.driver) !== '0') errorMessage.push('"auto.driver" must be a string');
        if (!weighing.tare && String(weighing.tare).length === 0 && String(weighing.tare) !== '0') errorMessage.push('"weighing.tare" must be a Dnumber');
        if (!weighing.brutto && String(weighing.brutto).length === 0 && String(weighing.brutto) !== '0') errorMessage.push('"weighing.brutto" must be a string');
        if (!harvesters && harvesters.length === 0) errorMessage.push('"harveseters" must be defined');

        // add to DB
        addWeighing(weighingEntry);

        break;

      case 'remove':
        dispatch(removeEntry({ id }));
        break;

      default:
        break;
    }

    setSubmitAction(null);
  };

  return (
    <form className="flex justify-between gap-4 border border-gray-400 rounded-lg py-2 px-3 mt-2 mt- bg-[#eef376]" onSubmit={handleSubmit}>
      {
        <>
          <div className="flex flex-col justify-around gap-2">
            <div className="flex gap-4 justify-start">
              <div className="flex gap-4 flex-wrap min-w-[350px] w-fit">
                <span className="inline-block min-w-[95px]">
                  ({String(weighingEntry.date.day).padStart(2, '0')}/{String(weighingEntry.date.month).padStart(2, '0')}/{String(weighingEntry.date.year)})
                </span>
                <img src={`img/${curCrop?.icon}`} width="24" height="24" alt={curCrop?.crop} />
                <span>{curSource?.source}</span>
                <span className="mx-auto">-&gt;</span>
                <span>{destinationsList?.find(({ _id }) => _id === weighingEntry.crop.destination)?.destination}</span>
              </div>

              {/* Harvesters list */}
              {curSource?.isHarvested && (
                <ul className="list-none flex gap-4 col-span-4 justify-center">
                  {harvestersList?.map(({ _id, harvester }) => (
                    <li key={_id}>
                      <label>
                        <input
                          defaultValue={weighingEntry.harvesters?.find(harvester => harvester.id === _id)?.weight}
                          placeholder={harvester}
                          type="number"
                          min="0"
                          key={_id}
                          id={`harvester_${_id}`}
                          className="w-[110px]"
                          onChange={e => handleModifyHarvester(e)}
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-4 justify-start">
              {/* Driver */}
              <label className="">
                {!!driversList && (
                  <select name="driver" className="w-fit" defaultValue={weighingEntry.auto.driver || '0'} onChange={handleModifyDriver}>
                    <option value="0" disabled>
                      - водій -
                    </option>
                    {driversList.map(({ _id, driver }, i) => (
                      <option key={_id} value={_id}>
                        {driver}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              {/* Auto */}
              <label>
                {!!autosList && (
                  <>
                    <select name="auto" className="w-fit" defaultValue={weighingEntry.auto.id || '0'} onChange={handleModifyAuto}>
                      <option value="0" disabled>
                        - авто -
                      </option>
                      {autosList?.map(({ _id, licensePlate, auto }) => (
                        <option key={_id} value={_id}>
                          {auto + ' (' + licensePlate + ')'}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </label>

              {/* Weight - Brutto */}
              <label>
                <input
                  defaultValue={weighingEntry.weighing?.brutto}
                  placeholder="брутто"
                  type="number"
                  min="0"
                  name="brutto"
                  onChange={handleModifyBrutto}
                  onBlur={e => handleCalculateNetto(e.target.form.elements)}
                  className="flex justify-center items-center w-[110px]"
                />
              </label>

              {/* Weight - Tare */}
              <label>
                <input
                  defaultValue={weighingEntry.weighing?.tare}
                  placeholder="тара"
                  type="number"
                  min="0"
                  name="tare"
                  onChange={handleModifyTare}
                  onBlur={e => handleCalculateNetto(e.target.form.elements)}
                  className="flex justify-center items-center w-[110px]"
                />
              </label>

              {/* Weight - Netto */}
              <label>
                <input
                  disabled
                  value={weighingEntry.weighing?.netto}
                  type="number"
                  min="0"
                  className="flex justify-center items-center border-b border-black background-[$ffffff] h-[2em] w-[110px] p-1"
                />
              </label>
            </div>
          </div>
          <div className=" flex flex-col justify-around">
            {/* Date */}
            <input type="hidden" name="date" value={obj2Date(weighingEntry.date)} />
            <input type="hidden" id="id" name="id" value={id} />

            <button type="submit" className="border border-black rounded-lg py-[2px] px-[30px] bg-[#b2e74e]" onClick={handleAddWeighing}>
              Додати
            </button>
            <button type="submit" className="border border-black rounded-lg py-[2px] px-[30px] bg-[#f38b77]" onClick={handleRemoveEntry}>
              Скасувати
            </button>
          </div>
        </>
      }
    </form>
  );
};
