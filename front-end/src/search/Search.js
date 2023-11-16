import { useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import DisplayReservation from '../reservations/DisplayReservation';
import { findReservation } from '../utils/api';

function Search() {
  const [search, setSearch] = useState({
    mobile_number: '',
  });
  const [errors, setErrors] = useState(null);
  const [reservations, setReservations] = useState([]);

  function handleChange({ target }) {
    setSearch({
      ...search,
      [target.name]: target.value,
    });
  }

  const reservationsJSX = () => {
    return reservations.map((reservation) => (
      <DisplayReservation
        key={reservation.reservation_id}
        reservation={reservation}
      />
    ));
  };
  
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = validateSearch();
    setErrors(errors);
  
    if (errors === null) {
      try {
        const foundReservation = await findReservation(search.mobile_number, abortController.signal);
        setReservations(foundReservation);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrors(error);
        }
      }
    }
  
    return () => abortController.abort();
  }

  function validateSearch() {
    const errors = [];
    if (search.mobile_number === undefined || search.mobile_number === '') {
      errors.push({ message: 'Please enter a valid phone number.' });
    }
    return errors.length > 0 ? errors : null;
  }

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit} className='form p-3'>
          <label htmlFor='mobile_number' className='form-label'>Phone Number</label>
          <input
            id='mobile_number'
            name='mobile_number'
            type='text'
            className='form-control'
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={search.mobile_number}
            required
          />
          <button type='submit' className='btn btn-primary m-1'>
            Search
          </button>
      </form>
      <div>
        {reservations.length > 0 ? (
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
        ) : (
          <p>No reservations found</p>
        )}
      </div>
    </div>
  );
}

export default Search;