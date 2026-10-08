"use client";
import {
  useEffect,
  useState,
} from "react";
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
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [
    error,
    setError
  ] = useState("");
  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url =
      URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);
  function handleFileChange(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setDetections([]);
      setHasAnalyzed(false);
      setError("");
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
    {
      previewUrl && (
        <div className="ux-preview">
          {/* eslint-disable-next-line
 @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected image preview"
          />
        </div>
      )
    }
  }
  return (
    <section className="ux-card ux-detection">
      <div className="ux-section-heading">
        <p className="ux-eyebrow">
          AI IMAGE ANALYSIS
        </p>
        <h2>Object Detection</h2>
        <p className="ux-muted">
          Upload an image to identify animals using the YOLO model.
        </p>
      </div>
      <div className="ux-upload">
        <label className="ux-file-button">
          <input
            className="ux-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <span>Choose Image</span>
        </label>
        <span className="ux-file-name">
          {selectedFile
            ? selectedFile.name
            : "No image selected"}
        </span>
      </div>
      <button
        type="button"
        className="ux-button"
        onClick={detectObjects}
        disabled={!selectedFile || loading}
        >
        {loading
          ? "Detecting..."
          : "Detect Animals"}
</button>
{
    error && (
      <div
        className="ux-error"
        role="alert"
      >
        {error}
      </div>
    )
  }
  <div className="ux-results">
    {detections.map((item, index) => (
      <article
        className="ux-result-item"
        key={index}
      >
        <strong>{item.class}</strong>
        <p>
          Confidence: {item.confidence}%
        </p>
        <div className="ux-confidence-track">
          <div
            className="ux-confidence-fill"
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  item.confidence
                )
              )
                }%`,
            }}
          />
        </div>
      </article>
    ))}
  </div>
</section >

    );
}