"use client";

import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "xtreme-ui";

import "./scan.scss";

const ScannerPage = () => {
	const router = useRouter();
	const devices = useDevices();

	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
	const [torch, setTorch] = useState(false);
	const [zoom, setZoom] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		if (devices && devices.length > 0) {
			if (!deviceId) {
				const backCamera = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
				setDeviceId(backCamera ? backCamera.deviceId : devices[0].deviceId);
			}
		}
	}, [devices, deviceId]);

	const handleScan = (detectedCodes: any[]) => {
		if (detectedCodes && detectedCodes.length > 0) {
			const result = detectedCodes[0];
			const url = result.rawValue || result.raw_value;

			if (url) {
				if (url.includes(window.location.hostname) || url.startsWith("/")) {
					const targetPath = url.includes("://") ? url.substring(url.indexOf("/", url.indexOf("://") + 3)) : url;
					router.replace(targetPath);
				}
			}
		}
	};

	const handleError = (err: any) => {
		console.error("Scanner Error:", err);
		if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
			setHasPermission(false);
			setError("Camera permission denied. Please allow access.");
		} else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
			setError("No camera found on this device.");
		} else {
			setError(`Camera error: ${err?.message || "Unknown error"}`);
		}
	};

	return (
		<div className="scanner-page">
			<div className="scanner-header">
				<h4 className="title">Order Worder</h4>
				<p className="subtitle">Scan QR to Order</p>

				{devices.length > 1 && (
					<div className="camera-select-wrapper">
						<select value={deviceId} onChange={(e) => setDeviceId(e.target.value)} className="camera-select">
							{devices.map((device) => (
								<option key={device.deviceId} value={device.deviceId}>
									{device.label || `Camera ${device.deviceId}`}
								</option>
							))}
						</select>
						<Icon code="f0d7" type="solid" className="select-icon" />
					</div>
				)}
			</div>

			<div className="scanner-container">
				{error ? (
					<div className="error-message">
						<Icon code="f071" type="solid" className="error-icon" />
						<p>{error}</p>
						{!hasPermission && <p className="hint">Check your browser settings.</p>}
					</div>
				) : (
					<Scanner
						onScan={handleScan}
						onError={handleError}
						constraints={
							{
								deviceId: deviceId,
								facingMode: deviceId ? undefined : "environment",
								advanced: [{ torch: torch }] as any,
								zoom: zoom as any,
							} as any
						}
						components={
							{
								audio: false,
								onOff: false,
								torch: false,
								zoom: false,
								finder: false,
							} as any
						}
						styles={{
							container: { width: "100%", height: "100%", borderRadius: "20px" },
							video: { objectFit: "cover", borderRadius: "20px" },
						}}
					/>
				)}

				<div className="scan-overlay">
					<div className="corners"></div>
				</div>
			</div>

			<div className="scanner-controls">
				<button className={`control-btn ${torch ? "active" : ""}`} onClick={() => setTorch(!torch)} disabled={!!error}>
					<Icon code="f0e7" type="solid" />
				</button>

				<div className="zoom-controls">
					<button onClick={() => setZoom(Math.max(1, zoom - 0.5))} disabled={!!error}>
						<Icon code="f068" type="solid" />
					</button>
					<span className="zoom-val">{zoom}x</span>
					<button onClick={() => setZoom(Math.min(5, zoom + 0.5))} disabled={!!error}>
						<Icon code="f067" type="solid" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ScannerPage;
