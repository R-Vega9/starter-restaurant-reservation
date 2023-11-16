import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous } from '../utils/date-time';
import { useHistory } from 'react-router-dom';
import DisplayReservation from '../reservations/DisplayReservation';
import TableDisplay from '../tables/TableDisplay';



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();

  useEffect(() => {
    loadDashboard();
  }, [date]);

  async function loadDashboard() {
    try {
      const abortController = new AbortController();
      setReservationsError(null);
      
      const reservationsData = await listReservations({ date }, abortController.signal);
      setReservations(reservationsData);
  
      const tablesData = await listTables();
      setTables(tablesData.sort(tableSortByOccupied));
    } catch (error) {
      setReservationsError(error);
    }
  }

  function tableSortByOccupied(tableA, tableB) {
      if (tableA.reservation_id && !tableB.reservation_id) return -1;
      if (!tableA.reservation_id && tableB.reservation_id) return 1;
      return 0;
  }

  const reservationsJSX = () => {
    return reservations.map((reservation) => (
      <DisplayReservation
        key={reservation.reservation_id}
        reservation={reservation}
        loadDashboard={loadDashboard}
      />
    ));
  };

  const tablesJSX = () => {
    return tables.map((table) => (
      <TableDisplay
        key={table.table_id}
        table={table}
        loadDashboard={loadDashboard}
      />
    ));
  };

  



  function todaysDate() {
    const today = new Date()
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const todaysDate = `${year}-${month}-${day}`
    history.push(`/dashboard?date=${todaysDate}`);
  }

  function previousDate() {
    const previousDate = previous(date);
    history.push(`/dashboard?date=${previousDate}`);
  }

  function nextDate() {
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`);
  }

  return (
    <main>
    <h1>Dashboard</h1>
    <div className='d-md-flex flex-column align-items-center justify-content-center'>
      <h4 className='mb-3'>Reservations for {date}</h4>
        <div className='d-flex justify-content-center'>
          <button type='button' className='btn btn-secondary m-1' onClick={previousDate}>
            Previous
          </button>
          <button type='button' className='btn btn-secondary m-1' onClick={todaysDate}>
            Today
          </button>
          <button type='button' className='btn btn-secondary m-1' onClick={nextDate}>
            Next
          </button>
        </div>
    </div>

    <ErrorAlert error={reservationsError} />

      <table className="table table-hover m-1">
      <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
            <th scope="col">Seat</th>
          </tr>
        </thead>
        <tbody>{reservationsJSX()}</tbody>
      </table>

      <br />

      <h4 className="mb-0">Tables</h4>


      <table className="table table-hover m-1">
      <thead className="thead-light">
          <tr>
            <th scope="col">Table ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Reservation ID</th>
            <th scope="col">Finish</th>
          </tr>
        </thead>
        <tbody>{tablesJSX()}</tbody>
      </table>
  </main>
);
}

export default Dashboard;