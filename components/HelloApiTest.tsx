import React, { useState } from "react";
import { apiRequest } from "../lib/api";

const HelloApiTest: React.FC = () => {
  const [nameGet, setNameGet] = useState<string>("");
  const [messageGet, setMessageGet] = useState<string | null>(null);

  const [namePost, setNamePost] = useState<string>("");
  const [messagePost, setMessagePost] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleGetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiRequest(`/hello?=name${nameGet}`, "GET");
      setMessageGet(result.message);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("GET Error fetching the message.");
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiRequest("/hello-body", "POST", {
        name: namePost,
      });
      setMessagePost(result.message);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("POST Error fetching the message.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔹 GET Request (Query Param)</h2>
      <form onSubmit={handleGetSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={nameGet}
          onChange={(e) => setNameGet(e.target.value)}
        />
        <button type="submit">Send GET</button>
      </form>
      {messageGet && (
        <p className="text-success">Message (GET): {messageGet}</p>
      )}

      <hr />

      <h2>🔸 POST Request (Request Body)</h2>
      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={namePost}
          onChange={(e) => setNamePost(e.target.value)}
        />
        <button type="submit">Send POST</button>
      </form>
      {messagePost && (
        <p className="text-success">Message (POST): {messagePost}</p>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default HelloApiTest;
