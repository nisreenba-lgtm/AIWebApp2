"use client";
import { useState } from "react";
export function DetectionPanel() {
  const [status, setStatus] = useState("Waiting");
  return (
    <section>
      <h2>Object Detection</h2>
      <br></br>
      <p>Status: {status}</p>
      <button onClick={() => setStatus("Ready")
      }
      >
        Prepare Detection</button>
    </section>
  );
}
