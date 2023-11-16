import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { cancelReservation } from "../utils/api";

const DisplayReservation = ({ reservation }) => {
  const history = useHistory();

  async function cancelHandler() {
    const abortController = new AbortController();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      await cancelReservation(reservation.reservation_id, abortController.signal);
      history.go(0);
    }
  }

  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date.substr(0, 10)}</td>
      <td>{reservation.reservation_time.substr(0, 5)}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>

      {reservation.status === "booked" && (
        <>
          <td>
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button
                onClick={() => console.log("Edit Button Clicked")}
                className="btn btn-secondary"
                type="button"
              >
                Edit
              </button>
            </Link>
          </td>

          <td>
            <button
              className="btn btn-danger"
              type="button"
              onClick={cancelHandler}
              data-reservation-id-cancel={reservation.reservation_id}
            >
              Cancel
            </button>
          </td>

          <td>
            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-primary" type="button">
                Seat
              </button>
            </Link>
          </td>
        </>
      )}
    </tr>
  );
};

export default DisplayReservation;
