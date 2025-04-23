// frontend/src/components/ImageCropper.tsx
import React, { useEffect, useRef, useState } from "react";

interface ImageCropperProps {
  file: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  file,
  onCropComplete,
  onCancel,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartDragPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - startDragPos.x,
      y: e.clientY - startDragPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Calculate new scale with more precise control
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    const newScale = scale * delta;

    // Limit the scale between 0.5x and 3x
    const clampedScale = Math.min(Math.max(newScale, 0.5), 3);

    if (containerRef.current && imageRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate the mouse position relative to the container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Adjust position to zoom from the mouse cursor point
      const scaleChange = clampedScale / scale;
      setPosition((prev) => ({
        x: mouseX - (mouseX - prev.x) * scaleChange,
        y: mouseY - (mouseY - prev.y) * scaleChange,
      }));
    }

    setScale(clampedScale);
  };

  const cropImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = imageRef.current;
    const containerSize = 300; // Size of the preview container
    const outputSize = 500; // Size of the output image

    canvas.width = outputSize;
    canvas.height = outputSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate what portion of the image should be visible
    const visibleRect = {
      x: -position.x / scale,
      y: -position.y / scale,
      width: containerSize / scale,
      height: containerSize / scale,
    };

    // Draw the cropped area to the canvas
    ctx.drawImage(
      image,
      visibleRect.x,
      visibleRect.y,
      visibleRect.width,
      visibleRect.height,
      0,
      0,
      outputSize,
      outputSize,
    );

    // Convert to PNG blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      "image/png",
      1.0,
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Crop Image</h3>

        <div
          ref={containerRef}
          className="relative w-[300px] h-[300px] mx-auto mb-4 overflow-hidden bg-gray-100 border-2 border-gray-300 cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {imageSrc && (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Preview"
              className="absolute max-w-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "0 0",
                userSelect: "none",
                pointerEvents: "none",
              }}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                const containerSize = 300;

                // Calculate initial scale to fill the container
                const scaleX = containerSize / img.naturalWidth;
                const scaleY = containerSize / img.naturalHeight;
                const initialScale = Math.max(scaleX, scaleY);

                setScale(initialScale);

                // Center the image
                setPosition({
                  x: (containerSize - img.naturalWidth * initialScale) / 2,
                  y: (containerSize - img.naturalHeight * initialScale) / 2,
                });
              }}
            />
          )}

          {/* Crop guide overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-white border-dashed"></div>
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="border border-white border-opacity-30"
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 text-center mb-2">
            <strong>Drag</strong> to position • <strong>Scroll</strong> to zoom
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Zoom Out
            </button>
            <span className="text-sm text-gray-600">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Zoom In
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={cropImage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
