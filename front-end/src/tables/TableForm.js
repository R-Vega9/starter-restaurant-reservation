import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { createTable } from '../utils/api';

function TableForm({submitForm}) {
  const [form, setForm] = useState({ table_name: '', capacity: '' });
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  function handleChange({ target }) {
    setForm({
      ...form,
      [target.name]: target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = validateTable();
    form.capacity = Number(form.capacity);
    setErrors(errors);
    if (!errors) {
      createTable(form, abortController.signal)
        .then((submitForm))
        .then(() => history.push('/dashboard'))
        .catch(setErrors);
    }
    return () => abortController.abort();
  }


  

  function validateTable() {
    const capacity = Number(form.capacity);

    if (capacity < 1 || !Number.isInteger(capacity)) {
      return 'Capacity must be a at least 1 person.';
    }

    if (form.table_name.length < 2) {
      return 'Table name must be at least 2 characters long.';
    }

    

    return null;
  }

  return (
      <div >
        <h4 className='mt-3'>New Table</h4>
        <ErrorAlert error={errors} />
        <form onSubmit={handleSubmit}>
          <div className='form-group'>

            <label htmlFor='table_name'>Table Name</label>
              <input
                id='table_name'
                name='table_name'
                type='text'
                className='form-control'
                placeholder='Table Name'
                onChange={handleChange}
                value={form.table_name}
                required
              />

            <div>
            <label htmlFor='capacity'>Capacity</label>
              <input
                id='capacity'
                name='capacity'
                type='number'
                className='form-control'
                placeholder='Capacity'
                onChange={handleChange}
                value={form.capacity}
                required
              />
              
            </div>

            <div className='form-group m-2'>
            <button type='submit' className='btn btn-success m-2'>
                Submit
              </button>
              <button
                type='button'
                className='btn btn-danger m-2'
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
              
            </div>
          </div>
        </form>
      </div>
  );
}

export default TableForm;
