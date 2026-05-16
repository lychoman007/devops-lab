import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [dbTime, setDbTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.status);
        setDbTime(data.database_time?.now || "");
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to reach backend");
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>DevOps Project</h1>
      <h2>Backend Status: {message || "Loading..."}</h2>
      <p>Database Time: {dbTime || "Waiting for response..."}</p>
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
