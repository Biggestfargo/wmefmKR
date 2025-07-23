"use client";

export default function CelebrityBookingForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        // Optionally: Show a success message or redirect
        alert("Your request has been submitted!");
      } else {
        console.error("Form submission failed");
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Celebrity Booking Request</h2>
      <p>
        Please fill out the form below to request a celebrity for your event. We
        will review your request and get back to you as soon as possible.
      </p>
      <form name="celebrity-booking" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="celebrity-booking" />
        <label htmlFor="name">Your Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Your Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="eventName">Event Name:</label>
        <input type="text" id="eventName" name="eventName" required />

        <label htmlFor="artist">Requested Artist:</label>
        <input type="text" id="artist" name="artist" required />

        <label htmlFor="date">Event Date:</label>
        <input type="text" id="date" name="date" required />

        <label htmlFor="location">Event Location:</label>
        <input type="text" id="location" name="location" required />

        <label htmlFor="description">Event Description:</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          cols="50"
          placeholder="Please provide details about your event."
          required
        ></textarea>

        <button type="submit">Submit Request</button>
      </form>

      <style jsx>{`
        div {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        form {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input[type="text"],
        input[type="email"],
        textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}