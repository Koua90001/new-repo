import React, { useState } from "react";
import {
  createApiUser,
  generateApiKey,
  getAccessToken,
  requestPayment,
} from "../utils/IceManapi";

const MomoTest = () => {
  const [log, setLog] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const addLog = (msg) => setLog((prev) => [...prev, msg]);

  const handleCreateUser = async () => {
    try {
      await createApiUser();
      addLog("✅ API User created");
    } catch (err) {
      addLog("❌ Failed to create API user: " + err.message);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const { apiKey } = await generateApiKey();
      setApiKey(apiKey);
      addLog("✅ API Key generated");
    } catch (err) {
      addLog("❌ Failed to generate API key: " + err.message);
    }
  };

  const handleGetAccessToken = async () => {
    try {
      const referenceId = "C1787280-8C22-438E-AD8C-D70C80A20F07"; // your UUID
      const token = await getAccessToken(referenceId, apiKey);
      setAccessToken(token.access_token);
      addLog("✅ Access token received");
    } catch (err) {
      addLog("❌ Failed to get token: " + err.message);
    }
  };

  const handleRequestPayment = async () => {
    try {
      const externalId = "test-order-123";
      const amount = "100"; // amount in currency
      const currency = "EUR";
      const payer = "256772123456"; // use MoMo sandbox number format
      const txnId = await requestPayment(accessToken, externalId, amount, currency, payer);
      addLog("✅ Payment requested. Transaction ID: " + txnId);
    } catch (err) {
      addLog("❌ Payment failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📦 MoMo API Test</h2>
      <button onClick={handleCreateUser}>1️⃣ Create API User</button>
      <button onClick={handleGenerateApiKey}>2️⃣ Generate API Key</button>
      <button onClick={handleGetAccessToken}>3️⃣ Get Access Token</button>
      <button onClick={handleRequestPayment}>4️⃣ Request Payment</button>
      <div style={{ marginTop: "1rem", fontFamily: "monospace" }}>
        <h4>Logs</h4>
        <pre>{log.join("\n")}</pre>
      </div>
    </div>
  );
};

export default MomoTest;
