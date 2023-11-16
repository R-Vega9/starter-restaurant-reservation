import { useHistory } from 'react-router-dom';
import { finishTable } from '../utils/api';

const TableDisplay = ({ table, loadDashboard }) => {
  const history = useHistory();

  async function finishHandler({
    target: {
      dataset: { tableIdFinish, reservationIdFinish },
    },
  }) {
    const abortController = new AbortController();
    if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
      try {
        await finishTable(tableIdFinish, reservationIdFinish, abortController.signal);
        await loadDashboard();
        history.push('/dashboard');
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {table.reservation_id ? 'Occupied' : 'Free'}
      </td>
      <td>{table.reservation_id ? table.reservation_id : "--"}</td>
  
      {table.reservation_id && (
        <td>
          <button
            className='btn btn-success m-1'
            data-table-id-finish={table.table_id}
            data-reservation-id-finish={table.reservation_id}
            onClick={finishHandler}
          >
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}

export default TableDisplay;