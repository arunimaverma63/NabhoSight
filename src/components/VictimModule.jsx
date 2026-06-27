import React, { useState, useRef, useEffect } from 'react';

// A high-quality public placeholder representing a drone search and rescue view
const DEMO_IMAGE_URL = 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?q=80&w=800&auto=format&fit=crop';

const MOCK_DETECTIONS = [
  { label: 'Person', x: 0.22, y: 0.35, w: 0.08, h: 0.15, confidence: 94.2, latOffset: 0.0012, lngOffset: -0.0018 },
  { label: 'Person', x: 0.48, y: 0.52, w: 0.07, h: 0.13, confidence: 89.5, latOffset: -0.0008, lngOffset: 0.0022 },
  { label: 'Person', x: 0.72, y: 0.28, w: 0.09, h: 0.17, confidence: 81.7, latOffset: 0.0025, lngOffset: 0.0009 }
];

export default function VictimModule({ addToast, logActivity }) {
  const [imageSrc, setImageSrc] = useState(DEMO_IMAGE_URL);
  const [imageFile, setImageFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState([]);
  const [renderedDetections, setRenderedDetections] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Redraw canvas whenever the image or the rendered detections list changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    // Wait until image is fully loaded
    if (!img.complete) {
      img.onload = () => drawCanvas(canvas, ctx, img, renderedDetections);
    } else {
      drawCanvas(canvas, ctx, img, renderedDetections);
    }
  }, [imageSrc, renderedDetections]);

  // Handle redraw on window resize to keep canvas responsive
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = imgRef.current;
      if (canvas && ctx && img) {
        drawCanvas(canvas, ctx, img, renderedDetections);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderedDetections]);

  const drawCanvas = (canvas, ctx, img, boxes) => {
    // Set display/rendering bounds based on container
    const containerWidth = canvas.parentElement.clientWidth;
    const containerHeight = Math.min(canvas.parentElement.clientHeight, 480);
    
    // Scale image proportionally to fit inside boundaries
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let canvasWidth = containerWidth;
    let canvasHeight = containerWidth / imgRatio;

    if (canvasHeight > containerHeight) {
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * imgRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw base image
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    // Draw bounding boxes
    boxes.forEach((box) => {
      const bx = box.x * canvasWidth;
      const by = box.y * canvasHeight;
      const bw = box.w * canvasWidth;
      const bh = box.h * canvasHeight;

      // Bright yellow/lime green bounding box
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#eab308';
      ctx.strokeRect(bx, by, bw, bh);

      // Label Tag above
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#eab308';
      const labelText = `${box.label} ${(box.confidence).toFixed(1)}%`;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      
      const textWidth = ctx.measureText(labelText).width;
      const tagHeight = 16;
      ctx.fillRect(bx - 1.5, by - tagHeight, textWidth + 10, tagHeight);

      // Text inside tag
      ctx.fillStyle = '#050811';
      ctx.fillText(labelText, bx + 3.5, by - 4.5);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadFile(file);
    } else {
      addToast('Upload Error', 'Only image files are supported in this simulation.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadFile(file);
    }
  };

  const loadFile = (file) => {
    setImageFile(file);
    setDetections([]);
    setRenderedDetections([]);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      addToast('Image Uploaded', `${file.name} loaded successfully. Ready for inference.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRunDetection = () => {
    setIsScanning(true);
    setRenderedDetections([]);
    addToast('Roboflow Inference', 'Sending imagery to Roboflow models...', 'info');

    // Simulate FastAPI/Roboflow API network request latency
    setTimeout(() => {
      setIsScanning(false);
      
      // Determine how many victims to mock detect (randomize slightly if custom file, else constant for demo)
      const mockResult = imageFile 
        ? MOCK_DETECTIONS.map(d => ({ ...d, confidence: Math.floor(75 + Math.random() * 23) }))
        : MOCK_DETECTIONS;

      setDetections(mockResult);

      // Trigger draw-in animation for each bounding box sequentially
      mockResult.forEach((box, i) => {
        setTimeout(() => {
          setRenderedDetections((prev) => [...prev, box]);
        }, (i + 1) * 450);
      });

      // Complete notify
      setTimeout(() => {
        const count = mockResult.length;
        if (count > 0) {
          addToast('Inference Complete', `${count} victims detected in drone frame.`, 'success');
          logActivity('victim', `Drone victim detection run: found ${count} coordinates`, `Avg: ${Math.floor(mockResult.reduce((acc, curr) => acc + curr.confidence, 0) / count)}%`);
        } else {
          addToast('Inference Complete', `No victims detected in current frame.`, 'info');
          logActivity('victim', `Drone victim detection run: no hits recorded`, 'Safe');
        }
      }, (mockResult.length + 0.5) * 450);

    }, 2500);
  };

  const exportReport = () => {
    if (detections.length === 0) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      sourceFrame: imageFile ? imageFile.name : 'DEMO_SURVEY_FRAME_LA.PNG',
      totalVictims: detections.length,
      averageConfidence: (detections.reduce((a, b) => a + b.confidence, 0) / detections.length).toFixed(2) + '%',
      detections: detections.map((d, index) => ({
        id: `victim-pt-${index + 1}`,
        confidence: `${d.confidence}%`,
        bounding_box: { x: d.x, y: d.y, w: d.w, h: d.h },
        relative_coordinates: {
          latitude: (34.08 + d.latOffset).toFixed(6),
          longitude: (-118.18 + d.lngOffset).toFixed(6)
        }
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NabhoSight_Victims_Report_${Date.now()}.json`;
    link.click();
    
    addToast('Report Exported', 'JSON Coordinate details downloaded.', 'success');
  };

  const avgConfidence = detections.length > 0
    ? (detections.reduce((acc, curr) => acc + curr.confidence, 0) / detections.length).toFixed(1)
    : 0;

  return (
    <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-brand-bg-primary">
      {/* Hidden image element used to draw in canvas */}
      <img ref={imgRef} src={imageSrc} alt="source" className="hidden" />

      {/* Zone 1: Left Upload Panel */}
      <div className="w-full md:w-72 border-r border-brand-border bg-brand-bg-secondary p-5 flex flex-col shrink-0 select-none">
        <h3 className="text-xs uppercase font-bold tracking-wider text-brand-flood mb-4">🚁 Drone Feed Intake</h3>

        {/* Drag Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors relative h-48 md:h-auto ${
            isDragOver ? 'border-brand-flood bg-brand-flood/5' : 'border-brand-border bg-brand-bg-tertiary/20 hover:bg-brand-bg-tertiary/40'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="drone-file-input"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <svg className="w-8 h-8 text-brand-flood mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <div className="text-xs font-semibold text-white">Drag & drop frame</div>
            <p className="text-[10px] text-brand-secondary">Accepts drone ortho-images or search snapshots</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRunDetection}
          disabled={isScanning}
          className="mt-4 w-full py-2.5 bg-brand-flood hover:bg-brand-flood/80 disabled:bg-slate-800 disabled:text-slate-500 rounded text-xs uppercase font-bold tracking-wider text-white shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>{isScanning ? 'Running YOLO...' : 'Run Detection'}</span>
        </button>
      </div>

      {/* Zone 2: Canvas Center Display */}
      <div className="flex-1 p-6 flex items-center justify-center bg-brand-bg-primary relative overflow-hidden h-96 md:h-auto">
        {/* Responsive Canvas Container */}
        <div className="relative border border-brand-border bg-brand-bg-secondary rounded p-1 shadow-2xl flex items-center justify-center max-w-full">
          <canvas ref={canvasRef} className="max-w-full max-h-[480px] rounded block" />

          {/* Legend Overlay */}
          <div className="absolute bottom-4 right-4 bg-brand-bg-primary/95 border border-brand-border p-2.5 rounded shadow text-[9px] font-mono text-brand-secondary space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm border border-white"></span>
              <span className="text-white font-bold">Person Bounding Box</span>
            </div>
            <div className="text-[8px] text-brand-muted uppercase">Legend (Drone YOLOv8)</div>
          </div>

          {/* Empty frame label if not processed */}
          {detections.length === 0 && !isScanning && (
            <div className="absolute top-4 left-4 bg-brand-flood/90 border border-brand-flood p-2 rounded shadow text-xs font-semibold text-white">
              No victims detected in this frame. Run detection.
            </div>
          )}

          {/* Scanning Animation Sweep Line Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-brand-bg-primary/40 pointer-events-none overflow-hidden">
              {/* Vertical scanline */}
              <div className="absolute left-0 right-0 h-1 bg-brand-flood shadow-[0_0_15px_#3b82f6] animate-scan" style={{animationDuration: '2.5s'}}></div>
              {/* Tech overlay matrix dots */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-flood/40 via-transparent to-transparent animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 3: Detection Summary Panel */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-brand-border bg-brand-bg-secondary p-5 flex flex-col shrink-0">
        <h3 className="text-xs uppercase font-bold tracking-wider text-white mb-4 pb-2 border-b border-brand-border">Inference Metrics</h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-5">
          <div className="p-3 bg-brand-bg-tertiary/40 border border-brand-border rounded">
            <span className="block text-[8px] uppercase tracking-wider text-brand-secondary font-mono">Victims Detected</span>
            <span className="text-2xl font-bold text-white font-sans">{detections.length}</span>
          </div>
          <div className="p-3 bg-brand-bg-tertiary/40 border border-brand-border rounded">
            <span className="block text-[8px] uppercase tracking-wider text-brand-secondary font-mono">Avg Confidence</span>
            <span className="text-2xl font-bold text-brand-warning font-sans">{avgConfidence}%</span>
          </div>
        </div>

        {/* Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] md:max-h-none pr-1">
          {detections.length > 0 ? (
            detections.map((det, index) => (
              <div key={index} className="p-2.5 bg-brand-bg-tertiary/30 border border-brand-border rounded text-[10px] font-mono">
                <div className="flex justify-between items-center text-white font-bold mb-1">
                  <span>Survivor #{index + 1}</span>
                  <span className="text-brand-warning">{(det.confidence).toFixed(1)}% Match</span>
                </div>
                <div className="grid grid-cols-2 text-brand-muted mt-1.5 pt-1.5 border-t border-brand-border/40">
                  <span>Est Lat:</span>
                  <span className="text-right text-white">{(34.08 + det.latOffset).toFixed(6)}</span>
                  <span>Est Lng:</span>
                  <span className="text-right text-white text-clip">{(-118.18 + det.lngOffset).toFixed(6)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-[10px] text-brand-muted text-center py-8">
              Metrics will calculate following image scanning.
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={exportReport}
          disabled={detections.length === 0}
          className="mt-4 w-full py-2 bg-brand-bg-tertiary hover:bg-brand-bg-tertiary/80 border border-brand-border disabled:opacity-50 text-white rounded text-[10px] uppercase font-bold tracking-wider"
        >
          Export Coordinates JSON
        </button>
      </div>
    </div>
  );
}
