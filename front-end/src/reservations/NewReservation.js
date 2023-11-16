import { useHistory, useParams } from 'react-router-dom';
import { createReservation, updateReservation } from '../utils/api';

import React from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationForm from './ReservationForm';

function NewReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [reservationsError, setReservationsError] = React.useState(null);

  const parseDate = (date) => Date.parse(date);
  
  const isATuesDay = (date) => {
    const day = new Date(parseDate(date)).getUTCDay();
    return day === 2;
  };

  const pastDate = (date, time) => {
    const formattedDate = new Date(`${date}T${time}`);
    const now = new Date();
    return formattedDate <= now;
  };

  const isNotOpen = (time) => {
    const openTime = new Date('2021-01-01 10:30');
    const closeTime = new Date('2021-01-01 21:30');
    const resTime = new Date(`2021-01-01 ${time}`);
    return resTime < openTime || resTime > closeTime;
  };

  async function submitReservation(reservation) {
    try {
      setReservationsError(null);
      if (reservation_id) {
        await updateReservation(reservation_id ,reservation);
      } else {
        await createReservation(reservation);
      }
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setReservationsError(error);
    }
  }

  const handleSubmit = (data) => {
    setReservationsError(null);

    if (pastDate(data.reservation_date, data.reservation_time)) {
      setReservationsError({ message: 'Reservations cannot be made in the past.' });
      return;
    }

    if (isATuesDay(data.reservation_date)) {
      setReservationsError({ message: 'The restaurant is closed on Tuesdays.' });
      return;
    }

    if (isNotOpen(data.reservation_time)) {
      setReservationsError({ message: 'The restaurant is not open at that time.' });
      return;
    }
    data.people = Number(data.people);

    submitReservation(data);
  };

  return (
    <div>
      <h1>{reservation_id ? 'Edit' : 'New'} Reservation</h1>
      <ErrorAlert error={reservationsError} />
      <ReservationForm submitHandler={handleSubmit} reservationId={reservation_id} />
    </div>
  );
}

export default NewReservation;
