"use client";
import { useState } from "react";
type Detection = {
  class: string;
  confidence: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};
export function DetectionPanel() {
  const [
    selectedFile,
    setSelectedFile
  ] = useState<File | null>(
    null
  );
  const [
    detections,
    setDetections
  ] = useState<Detection[]>(
    []
  );
  const [
    loading,
    setLoading
  ] = useState(false);
  const [
    error,
    setError
  ] = useState("");
  function handleFileChange(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }
  async function detectObjects() {
    if (!selectedFile) {
      setError(
        "Please select an image"
      );
      return;
    }
    try {
      setLoading(true);
      setError("");
      const formData =
        new FormData();
      formData.append(
        "image",
        selectedFile
      );
      const response =
        await fetch(
          "http://127.0.0.1:5000/predict",
          {
            method: "POST",
            body: formData
          }
        );
      if (!response.ok) {
        throw new Error(
          "Detection failed"
        );
      }
      const data =
        await response.json();
      setDetections(
        data.detected_objects
      );
    } catch (error) {
      setError(
        "Cannot detect objects"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <section>
      <h2>
        Object Detection
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <p>
          Selected:
          {selectedFile.name}
        </p>
      )}
      <button
        onClick={detectObjects}
        disabled={loading}
      >
        {
          loading
            ? "Detecting..."
            : "Detect Objects"
        }
      </button>
      {error && (
        <p>
          {error}
        </p>
      )}
      <h3>
        Detection Result
      </h3>
      {detections.map(
        (item, index) => (
          <div key={index}>
            <strong>
              {item.class}
            </strong>
            <p>
              Confidence:
              {item.confidence}%
            </p>
          </div>
        )
      )}
    </section>
  );
}



