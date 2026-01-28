"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";
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
	const checkInterval = useRef<NodeJS.Timeout | null>(null);

	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
	const [torch, setTorch] = useState(false);
	const [zoom, setZoom] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [caps, setCaps] = useState({ torch: false, zoom: false });

	const enumerateDevices = useCallback(async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter((device) => device.kind === "videoinput");
			setDevices(videoDevices);
		} catch (err) {
			console.error("Error enumerating devices:", err);
		}
	}, []);

	useEffect(() => {
		enumerateDevices();
		navigator.mediaDevices.addEventListener("devicechange", enumerateDevices);
		return () => {
			navigator.mediaDevices.removeEventListener("devicechange", enumerateDevices);
		};
	}, [enumerateDevices]);

	useEffect(() => {
		if (devices && devices.length > 0 && !deviceId) {
			const backCamera = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
			if (backCamera) {
				setDeviceId(backCamera.deviceId);
			} else if (devices.length > 0) {
				setDeviceId(devices[devices.length - 1].deviceId);
			}
		}
	}, [devices, deviceId]);

	useEffect(() => {
		const checkCapabilities = () => {
			const video = document.querySelector("video");
			if (video?.srcObject) {
				const stream = video.srcObject as MediaStream;
				const track = stream.getVideoTracks()[0];
				if (track) {
					if (devices.some((d) => !d.label)) {
						enumerateDevices();
					}

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
	}, [devices, enumerateDevices]);

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
						window.location.replace(urlObj.pathname + urlObj.search + urlObj.hash);
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
			console.warn("Scanner error:", errorObj);
		}
	};

	const cameraOptions = devices.map((d, index) => ({
		label: d?.label?.replace(/\s*\(.*?\)\s*/g, "") || `Camera ${index + 1}`,
		value: d.deviceId,
	}));

	return (
		<div className="scannerPage">
			<h4 className="scannerHeader">Order Worder</h4>
			<p className="scannerFooter">Scan QR to Order</p>
			{devices.length > 0 && (
				<div className="cameraSelectWrapper">
					<select
						value={deviceId || ""}
						onChange={(e) => {
							setDeviceId(e.target.value);
						}}
						className="cameraSelect">
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
