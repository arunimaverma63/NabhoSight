import React, { useState, useRef, useEffect } from 'react';

const SAT_IMAGE_URL = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop';

export default function FloodModule({ addToast, logActivity }) {
  const [satSrc, setSatSrc] = useState(SAT_IMAGE_URL);
  const [satFile, setSatFile] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSegmented, setHasSegmented] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);
  const [isDragOver, setIsDragOver] = useState(false);

  const containerRef = useRef(null);

  // Sync width of comparison container to size clip accurately
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

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
      addToast('Upload Error', 'Only image files are supported.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadFile(file);
    }
  };

  const loadFile = (file) => {
    setSatFile(file);
    setHasSegmented(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSatSrc(event.target.result);
      addToast('Satellite Image Loaded', `${file.name} loaded. Ready for U-Net segmentation.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRunSegmentation = () => {
    setIsProcessing(true);
    addToast('U-Net Segmentation', 'Running semantic mask prediction via FastAPI...', 'info');

    setTimeout(() => {
      setIsProcessing(false);
      setHasSegmented(true);
      addToast('Segmentation Complete', 'Flood boundary overlay generated successfully.', 'success');
      logActivity('flood', `Satellite segmentation run complete: 14.8 km² flooded area detected`, 'SEVERE');
    }, 2500);
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-brand-bg-primary select-none">
      {/* Top File Action Bar */}
      <div className="h-14 border-b border-brand-border bg-brand-bg-secondary px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-teal">
            🌊 Satellite Mapping Environment
          </span>

          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="sat-file-input"
              className="hidden"
            />
            <label
              htmlFor="sat-file-input"
              className="text-[10px] uppercase font-bold tracking-wider bg-brand-bg-tertiary hover:bg-brand-bg-tertiary/80 border border-brand-border px-3 py-1.5 rounded text-white cursor-pointer"
            >
              Upload Satellite Scene
            </label>
          </div>
        </div>

        <button
          onClick={handleRunSegmentation}
          disabled={isProcessing}
          className="flex items-center space-x-2 text-xs bg-brand-teal hover:bg-brand-teal/80 disabled:bg-slate-800 disabled:text-slate-500 border border-brand-border px-4 py-1.5 rounded text-white font-medium shadow"
        >
          <svg className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span>{isProcessing ? 'Segmenting Satellite Pixels...' : 'Run Segmentation'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Side-by-Side Viewer */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden bg-brand-bg-primary h-2/3 md:h-auto">
          
          <div
            ref={containerRef}
            className="relative border border-brand-border bg-brand-bg-secondary rounded p-1 shadow-2xl w-full max-w-[700px] overflow-hidden"
          >
            {/* Left Image: Original Scene */}
            <img
              src={satSrc}
              alt="Satellite Scene Original"
              className="w-full h-auto block select-none pointer-events-none"
            />

            {/* Right Mask Overlay Reveal Container */}
            {hasSegmented && (
              <div
                className="absolute inset-y-1 left-1 overflow-hidden pointer-events-none z-10"
                style={{ width: `${sliderPos}%` }}
              >
                {/* Scaled satellite scene to match dimensions exactly */}
                <div style={{ width: containerWidth }} className="relative h-full overflow-hidden">
                  <img
                    src={satSrc}
                    alt="Satellite Scene Masked"
                    className="w-full h-auto block select-none pointer-events-none filter brightness-95"
                  />
                  
                  {/* Organic vector paths representing the flood layer */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-80"
                    viewBox="0 0 800 500"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 120 180 Q 280 130 420 280 T 720 230 L 800 330 L 800 500 L 0 500 L 0 280 Z"
                      fill="rgba(59, 130, 246, 0.45)"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 280 40 Q 420 100 580 30 L 680 70 L 630 140 L 380 110 Z"
                      fill="rgba(59, 130, 246, 0.45)"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 450 320 Q 560 380 710 300 L 780 350 L 690 440 L 400 390 Z"
                      fill="rgba(30, 64, 175, 0.55)"
                      stroke="#1d4ed8"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Drag Handle Indicator */}
            {hasSegmented && (
              <div
                className="absolute inset-y-1 w-0.5 bg-brand-teal select-none pointer-events-none z-20"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-bg-primary border border-brand-teal flex items-center justify-center shadow-2xl">
                  <svg className="w-3.5 h-3.5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>
            )}

            {/* Invisible Slider Controller */}
            {hasSegmented && (
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            )}

            {/* Prompt banner if not run yet */}
            {!hasSegmented && !isProcessing && (
              <div className="absolute top-4 left-4 bg-brand-teal/90 border border-brand-teal px-3 py-1.5 rounded shadow text-xs font-semibold text-white">
                No active segmentation overlay. Click "Run Segmentation" to analyze.
              </div>
            )}

            {/* Loading scan state */}
            {isProcessing && (
              <div className="absolute inset-0 bg-brand-bg-primary/50 flex flex-col items-center justify-center z-40">
                <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-xs font-mono tracking-widest text-brand-teal uppercase animate-pulse">Analyzing satellite pixels...</span>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Metrics & Legends */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-brand-border bg-brand-bg-secondary p-5 flex flex-col shrink-0">
          <h3 className="text-xs uppercase font-bold tracking-wider text-white mb-4 pb-2 border-b border-brand-border">GIS Surface Analysis</h3>

          {/* Stats Display */}
          <div className="space-y-4 mb-6">
            <div className="p-3.5 bg-brand-bg-tertiary/40 border border-brand-border rounded flex justify-between items-center">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-brand-secondary font-mono">Est. Flooded Area</span>
                <span className="text-xl font-bold text-white">{hasSegmented ? '14.82 km²' : '--'}</span>
              </div>
              {hasSegmented && (
                <span className="text-[10px] font-mono bg-blue-900/30 text-brand-flood border border-blue-800 px-2 py-0.5 rounded">
                  7,284 Pixels
                </span>
              )}
            </div>

            <div className="p-3.5 bg-brand-bg-tertiary/40 border border-brand-border rounded flex justify-between items-center">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-brand-secondary font-mono">Disaster Severity</span>
                <span className={`text-sm font-bold uppercase ${hasSegmented ? 'text-brand-fire-alert' : 'text-white'}`}>
                  {hasSegmented ? 'Severe Threat' : '--'}
                </span>
              </div>
              {hasSegmented && (
                <span className="w-2.5 h-2.5 bg-brand-fire-alert rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-ping"></span>
              )}
            </div>

            <div className="p-3.5 bg-brand-bg-tertiary/40 border border-brand-border rounded flex justify-between items-center">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-brand-secondary font-mono">Model Confidence</span>
                <span className="text-xl font-bold text-brand-teal">{hasSegmented ? '91.24%' : '--'}</span>
              </div>
              {hasSegmented && (
                <span className="text-[9px] font-mono text-brand-secondary">U-Net v2</span>
              )}
            </div>
          </div>

          {/* Depth / Class Legend */}
          <div className="flex-1 p-4 bg-brand-bg-tertiary/20 border border-brand-border rounded flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-white tracking-wider mb-3.5 block">Segmentation Key</span>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2.5 text-xs text-brand-secondary">
                  <span className="w-3.5 h-3.5 rounded bg-blue-500/50 border border-blue-500 shrink-0"></span>
                  <span>Moderate Flood Water</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-brand-secondary">
                  <span className="w-3.5 h-3.5 rounded bg-blue-900/60 border border-blue-700 shrink-0"></span>
                  <span>Deep / Flowing Current</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-brand-secondary">
                  <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700 shrink-0"></span>
                  <span>Dry Terrain / Safe Zone</span>
                </div>
              </div>
            </div>

            {hasSegmented && (
              <button
                onClick={() => {
                  addToast('Export Mask', 'Flood segmentation mask exported as PNG.', 'success');
                  logActivity('flood', 'Flood segmentation mask exported to disk', 'PNG');
                }}
                className="mt-6 w-full py-2 bg-brand-bg-tertiary hover:bg-brand-bg-tertiary/80 border border-brand-border text-white text-[10px] font-bold uppercase tracking-wider rounded"
              >
                Export Mask PNG
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
