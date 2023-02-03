import { useEffect, useState } from 'react';
import { useGetConstantQuery } from 'redux/services/constantsAPI';

export const WeighingsEntryForm = ({ weighingEntry, harverstersCount }) => {
  const [brutto, setBrutto] = useState();
  const [tare, setTare] = useState();
  const [netto, setNetto] = useState('нетто');

  const { data: sourcesList } = useGetConstantQuery('sourcesList');
  const { data: destinationsList } = useGetConstantQuery('destinationsList');
  const { data: cropsList } = useGetConstantQuery('cropsList');
  const { data: autosList } = useGetConstantQuery('autosList');
  const { data: driversList } = useGetConstantQuery('driversList');
  const { data: harvestersList } = useGetConstantQuery('harvestersList');
  const cols = 6 + parseInt(harverstersCount || 0);

  const autoChangeHandler = e => {
    // const id = e.currentTarget.value;
    // const auto = autosList.find(auto => String(auto._id) === id);
    // document.getElementById('autoModel').innerHTML = auto.model;
  };

  useEffect(() => {
    if (!!brutto && !!tare) setNetto(brutto - tare);
    else setNetto('нетто');
  }, [brutto, tare]);

  useEffect(() => {
    if (!!netto) document.getElementById('weightNetto').innerHTML = netto;
  }, [netto]);

  return (
    <form style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} className="grid gap-4 border py-2 bg-[#ffffee]">
      <button style={{ gridColumn: `${cols}`, gridRow: '1 / span 2' }}>add</button>
      <label>
        <span></span>
        <input placeholder="дата" type="text" name="date" className="w-full" />
      </label>
      <label>
        <span></span>
        {!!cropsList && (
          <select name="crop" className="w-content">
            <option disabled selected>
              культура
            </option>
            {cropsList?.map((crop, i) => {
              return (
                <option key={i} value={i}>
                  {crop}
                </option>
              );
            })}
          </select>
        )}
      </label>
      <label>
        <span></span>
        {!!destinationsList && (
          <select name="destination" className="w-content">
            <option disabled selected>
              призначення
            </option>
            {destinationsList?.map((destination, i) => {
              return (
                <option key={i} value={i}>
                  {destination}
                </option>
              );
            })}
          </select>
        )}
      </label>
      <label>
        <span></span>
        {!!sourcesList && (
          <select name="source" className="w-content">
            <option disabled selected>
              джерело
            </option>
            {sourcesList?.map((source, i) => {
              return (
                <option key={i} value={i}>
                  {source}
                </option>
              );
            })}
          </select>
        )}
      </label>
      <label className="col-start-1">
        <span></span>
        {!!driversList && (
          <select name="driver" className="w-content">
            <option disabled selected>
              водій
            </option>
            {driversList?.map((driver, i) => {
              return (
                <option key={i} value={i}>
                  {driver}
                </option>
              );
            })}
          </select>
        )}
      </label>
      <label>
        <span></span>
        {!!autosList && (
          <>
            <select name="auto" onChange={autoChangeHandler} className="w-content">
              <option disabled selected>
                авто
              </option>
              {autosList?.map(auto => {
                return (
                  <option key={auto._id} value={auto._id}>
                    {auto.licensePlate + ' - ' + auto.model}
                  </option>
                );
              })}
            </select>
            {/* <div className="border h-[1.75em] w-[150px] p-1" id="autoModel"></div> */}
          </>
        )}
      </label>
      <label>
        <span></span>
        <input placeholder="брутто" type="text" name="brutto" onBlur={e => setBrutto(e.target.value)} className="w-[110px]" />
      </label>
      <label>
        <span></span>
        <input placeholder="тара" type="text" name="tare" onBlur={e => setTare(e.target.value)} className="w-[110px]" />
      </label>
      <label>
        <span></span>
        <div className="border h-[1.75em] w-[110px] p-1" id="weightNetto"></div>
      </label>
      {harvestersList?.map((harvester, i) => (
        <label>
          <span></span>
          <input placeholder={harvester} type="text" key={i} id={`harvester_${i}`} className="w-[110px]" />
        </label>
      ))}
    </form>
  );
};
