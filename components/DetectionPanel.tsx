"use client";
import { useEffect, useState } from "react";

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
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [detections, setDetections] =
    useState<Detection[]>([]);

  const [hasAnalyzed, setHasAnalyzed] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setDetections([]);
      setHasAnalyzed(false);
      setError("");

      // 🔴 เพิ่มจุดที่ 1: สร้าง Object URL สำหรับแสดงรูป Preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  // 🔴 เพิ่มจุดที่ 2: คืนค่า Memory URL เมื่อ Unmount หรือเปลี่ยนรูป เพื่อป้องกัน Memory Leak
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function detectObjects() {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Detection failed");
      }
      const data = await response.json();
      setDetections(data.detected_objects);
      setHasAnalyzed(true);
    } catch (error) {
      setError("Cannot detect objects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ux-card ux-detection">
      <div className="ux-section-heading">
        <p className="ux-eyebrow">AI IMAGE ANALYSIS</p>
        <h2>Object Detection</h2>
        <p className="ux-muted">
          Upload an image to identify objects using the YOLO model.
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
          {selectedFile ? selectedFile.name : "No image selected"}
        </span>
      </div>

      {/* 🔴 เพิ่มจุดที่ 3: แท็ก <img> สำหรับแสดงตัวอย่างรูปภาพ */}
      {previewUrl && (
        <div className="ux-preview-container" style={{ margin: "16px 0" }}>
          <img
            src={previewUrl}
            alt="Selected Preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              display: "block",
            }}
          />
        </div>
      )}

      <button
        type="button"
        className="ux-button"
        onClick={detectObjects}
        disabled={!selectedFile || loading}
      >
        {loading ? "Detecting..." : "Detect Objects"}
      </button>
      {error && (
        <div className="ux-error" role="alert">
          {error}
        </div>
      )}
      <div className="ux-results">
        {detections.map((item, index) => (
          <article className="ux-result-item" key={index}>
            <strong>{item.class}</strong>
            <p>Confidence: {item.confidence}%</p>
            <div className="ux-confidence-track">
              <div
                className="ux-confidence-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, item.confidence))}%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}