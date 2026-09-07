"use client";
import { useState } from "react";
export function ApiStatus() {
    const [status, setStatus] =
        useState("Not checked");
    async function checkApi() {
        const response =
            await fetch(
                "http://127.0.0.1:5000/health"
            );
        const data =
            await response.json();
        setStatus(
            data.status
        );
    }
    return (
        <section>
            <h2>
                Backend API
            </h2>
            <p>
                API Status: {status}
            </p>
            <button onClick={checkApi}>
                Check API
            </button>
        </section >
    );
}