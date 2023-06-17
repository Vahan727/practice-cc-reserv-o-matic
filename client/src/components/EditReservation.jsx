import {useState} from "react";

function EditReservation({
  onEditReservation,
  customer,
  location,
  customers,
  locations,
}) {
  const [formData, setFormData] = useState({
    party_name: "",
    customer_id: "0",
    location_id: "0",
    reservation_date: "",
    party_size: "",
  });
  const [errors, setErrors] = useState([]);
  function handleChange(event) {
    const name = event.target.name;
    let value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    if (
      name === "customer_id" ||
      name === "location_id" ||
      name === "party_size"
    ) {
      value = parseInt(value);
    }
    setFormData({...formData, [name]: value});
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(response => {
      if (response.status !== 200) {
        console.log(response);
        setErrors([response.status, response.statusText]);
      } else if (response.ok) {
        response.json().then(reservation => {
          setFormData({
            party_name: "",
            customer_id: "0",
            location_id: "0",
            date: "",
            party_size: "",
          });
          setErrors([]);
          onAddNewReservation(reservation);
        });
      } else {
        response.json().then(error => setErrors(error.errors));
      }
    });
  }
  const displayCustomerSelect = customers.map(customer => (
    <option value={customer.id} key={customer.id}>
      {customer.name}
    </option>
  ));
  const displayLocationSelect = locations.map(location => (
    <option value={location.id} key={location.id}>
      {location.name}
    </option>
  ));
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <h2 className="text-2xl text-center">Add New Reservation</h2>
      <div className="flex flex-row justify-between items-center">
        <label htmlFor="party_name">Party Name</label>
        <input
          type="text"
          id="party_name"
          name="party_name"
          value={formData.party_name}
          onChange={event => handleChange(event)}
          className="input input-bordered input-xs input-primary w-64 "
        />
      </div>
      <div className="flex flex-row justify-between items-center">
        <label htmlFor="customer">Customer</label>
        <select
          name="customer_id"
          id="customer_id"
          onChange={handleChange}
          className="select select-primary select-xs w-64"
          defaultValue={formData.customer_id}>
          <option value="0">Choose a customer</option>
          {displayCustomerSelect}
        </select>
      </div>

      <div className="flex flex-row justify-between items-center">
        <label htmlFor="location">Location</label>
        <select
          name="location_id"
          id="location_id"
          onChange={handleChange}
          className="select select-primary select-xs w-64"
          defaultValue={formData.location_id}>
          <option value="0">Choose a location</option>
          {displayLocationSelect}
        </select>
      </div>
      <div className="flex flex-row justify-between items-center">
        <label htmlFor="party_size">Party size</label>
        <input
          type="number"
          id="party_size"
          name="party_size"
          value={formData.party_size}
          onChange={event => handleChange(event)}
          className="input input-bordered input-xs input-primary w-64"
        />
      </div>
      <div className="flex flex-row justify-between items-center">
        <label htmlFor="reservation_date">Date</label>
        <input
          type="date"
          id="reservation_date"
          name="reservation_date"
          value={formData.reservation_date}
          onChange={event => handleChange(event)}
          className="input input-bordered input-xs input-primary w-64"
        />
      </div>
      {errors.map(error => (
        <p key={error} style={{color: "red"}}>
          {error}
        </p>
      ))}
      <button type="submit" className="btn btn-success btn-sm">
        Submit
      </button>
    </form>
  );
}

export default EditReservation;
