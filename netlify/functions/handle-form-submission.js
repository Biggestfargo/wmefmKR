exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  // Parse the form submission
  const data = JSON.parse(event.body);

  // Example: Log the submission (replace with your logic)
  console.log("Form submission received:", data);

  // You can process/store/send the data as needed here

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Form submission processed successfully!" }),
  };
};
