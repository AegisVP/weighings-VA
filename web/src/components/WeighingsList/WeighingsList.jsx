export const WeighingsList = ({ weighings }) => {
  return (
    <table className="border w-[1200px]">
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
          <table className="w-full">
            <tr>
              <th className="border">комб1</th>
              <th className="border">комб2</th>
              <th className="border">комб3</th>
            </tr>
          </table>
        </tr>
      </thead>
    </table>
  );
};
