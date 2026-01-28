"use client";

import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Icon } from "xtreme-ui";

import "./scan.scss";

interface IDetectedBarcode {
	rawValue: string;
	raw_value?: string;
	[key: string]: unknown;
}

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
	torch?: boolean;
	zoom?: boolean;
}

const ScannerClient = () => {
	const router = useRouter();

	const devices = useDevices();
	const checkInterval = useRef<NodeJS.Timeout | null>(null);

	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
	const [torch, setTorch] = useState(false);
	const [zoom, setZoom] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [caps, setCaps] = useState({ torch: false, zoom: false });

	useEffect(() => {
		if (devices && devices.length > 0 && !deviceId) {
			const backCamera = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
			setDeviceId(backCamera ? backCamera.deviceId : devices[0].deviceId);
		}
	}, [devices, deviceId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Need to update on DeviceId Change
	useEffect(() => {
		const checkCapabilities = () => {
			const video = document.querySelector("video");
			if (video?.srcObject) {
				const stream = video.srcObject as MediaStream;
				const track = stream.getVideoTracks()[0];
				if (track) {
					const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as ExtendedMediaTrackCapabilities;
					setCaps({
						torch: !!capabilities.torch,
						zoom: !!capabilities.zoom,
					});
					if (checkInterval.current) {
						clearInterval(checkInterval.current);
						checkInterval.current = null;
					}
				}
			}
		};

		if (checkInterval.current) clearInterval(checkInterval.current);
		checkInterval.current = setInterval(checkCapabilities, 500);

		return () => {
			if (checkInterval.current) clearInterval(checkInterval.current);
		};
	}, [deviceId]);

	const handleScan = (detectedCodes: unknown) => {
		const codes = detectedCodes as IDetectedBarcode[];
		if (codes && codes.length > 0 && !isScanning) {
			const result = codes[0];
			const url = result.rawValue || result.raw_value;

			if (url) {
				try {
					const urlObj = new URL(url);
					const isOrderWorder = urlObj.hostname.includes("orderworder");
					const hasTable = urlObj.searchParams.has("table");

					if (isOrderWorder && hasTable) {
						setIsScanning(true);
						router.replace(urlObj.pathname + urlObj.search + urlObj.hash);
					} else {
						toast.error("Not an OrderWorder QR");
					}
				} catch {
					toast.error("Invalid QR Code");
				}
			}
		}
	};

	const handleError = (err: unknown) => {
		const errorObj = err as Error;
		if (errorObj?.name === "NotAllowedError" || errorObj?.name === "PermissionDeniedError") {
			setHasPermission(false);
			setError("Camera permission denied. Please allow access.");
		} else if (errorObj?.name === "NotFoundError" || errorObj?.name === "DevicesNotFoundError") {
			setError("No camera found on this device.");
		} else {
			setError(`Camera error: ${errorObj?.message || "Unknown error"}`);
		}
	};

	const cameraOptions = devices.map((d) => ({
		label:
			(d.label || `Camera ${d.deviceId}`)
				.replace(/\s*\(.*?\)\s*/g, "")
				.replace(/\s*camera\s*/gi, "")
				.trim() || `Camera ${devices.indexOf(d) + 1}`,
		value: d.deviceId,
	}));

	return (
		<div className="scannerPage">
			<div className="scannerHeader">
				<h4 className="title">Order Worder</h4>
				<p className="subtitle">Scan QR to Order</p>
			</div>

			{devices.length > 1 && (
				<div className="cameraSelectWrapper">
					<select value={deviceId} onChange={(e) => setDeviceId(e.target.value)} className="cameraSelect">
						{cameraOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<Icon code="f0d7" type="solid" className="selectIcon" />
				</div>
			)}

			<div className="scannerContainer">
				{error ? (
					<div className="errorMessage">
						<Icon code="f071" type="solid" className="errorIcon" />
						<p>{error}</p>
						{!hasPermission && <p className="hint">Check your browser settings.</p>}
					</div>
				) : (
					<Scanner
						key={`${deviceId}-${torch}`}
						onScan={handleScan}
						onError={handleError}
						constraints={{
							deviceId: deviceId ? { exact: deviceId } : undefined,
							facingMode: deviceId ? undefined : "environment",
							advanced: [{ torch, zoom } as unknown as MediaTrackConstraintSet],
						}}
						components={{
							finder: false,
						}}
						styles={{
							container: { width: "100%", height: "100%", borderRadius: "20px" },
							video: { objectFit: "cover", borderRadius: "20px" },
						}}
					/>
				)}

				<div className="scanOverlay">
					<div className="corners" />
				</div>

				{caps.torch && (
					<Button
						type={torch ? "primary" : "secondary"}
						icon="f0e7"
						iconType="solid"
						onClick={() => setTorch(!torch)}
						disabled={!!error}
						className="flashBtn"
					/>
				)}
			</div>

			<div className="scannerControls">
				{caps.zoom && (
					<div className="zoomControls">
						<Button type="secondary" icon="f068" iconType="solid" onClick={() => setZoom(Math.max(1, zoom - 0.5))} disabled={!!error} className="zoomBtn" />
						<span className="zoomVal">{zoom}x</span>
						<Button type="secondary" icon="f067" iconType="solid" onClick={() => setZoom(Math.min(5, zoom + 0.5))} disabled={!!error} className="zoomBtn" />
					</div>
				)}
			</div>
		</div>
	);
};

export default ScannerClient;
