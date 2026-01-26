import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";

interface ResizeOptions {
	initialWidth?: number;
	initialHeight?: number;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
}

interface ResizeReturn {
	dimensions: { width: number; height: number };
	handleResizeStart: (e: MouseEvent) => void;
	isResizing: boolean;
}

export const useResize = (options: ResizeOptions = {}): ResizeReturn => {
	const { initialWidth = 400, initialHeight = 600, minWidth = 320, minHeight = 400, maxWidth = 800, maxHeight = 900 } = options;

	const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
	const [isResizing, setIsResizing] = useState(false);
	const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

	const handleResizeStart = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsResizing(true);
			resizeStartRef.current = {
				x: e.clientX,
				y: e.clientY,
				width: dimensions.width,
				height: dimensions.height,
			};
		},
		[dimensions],
	);

	useEffect(() => {
		if (!isResizing) return;

		const handleResizeMove = (e: globalThis.MouseEvent) => {
			if (!resizeStartRef.current) return;

			const deltaX = resizeStartRef.current.x - e.clientX;
			const deltaY = resizeStartRef.current.y - e.clientY;

			const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX));
			const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height + deltaY));

			setDimensions({ width: newWidth, height: newHeight });
		};

		const handleResizeEnd = () => {
			setIsResizing(false);
			resizeStartRef.current = null;
		};

		document.addEventListener("mousemove", handleResizeMove);
		document.addEventListener("mouseup", handleResizeEnd);

		return () => {
			document.removeEventListener("mousemove", handleResizeMove);
			document.removeEventListener("mouseup", handleResizeEnd);
		};
	}, [isResizing, minWidth, minHeight, maxWidth, maxHeight]);

	return {
		dimensions,
		handleResizeStart,
		isResizing,
	};
};
