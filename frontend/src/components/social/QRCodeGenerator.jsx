import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ streakData, user }) => {
  const [qrData, setQrData] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrStyle, setQrStyle] = useState('standard');
  const [color, setColor] = useState('#22c55e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSize, setDownloadSize] = useState(512);
  const [frameType, setFrameType] = useState('none');
  const [qrAnimation, setQrAnimation] = useState('pulse');
  const canvasRef = useRef(null);
  const qrContainerRef = useRef(null);
  const scanLineRef = useRef(null);

  const styles = [
    { id: 'standard', name: 'Standard', icon: '🎯' },
    { id: 'gradient', name: 'Gradient', icon: '🌈' },
    { id: 'dots', name: 'Dots', icon: '🔘' },
    { id: 'rounded', name: 'Rounded', icon: '⭕' },
    { id: 'animated', name: 'Animated', icon: '⚡' }
  ];

  const frames = [
    { id: 'none', name: 'No Frame', icon: '⬜' },
    { id: 'modern', name: 'Modern', icon: '🖼️' },
    { id: 'premium', name: 'Premium', icon: '🏆' },
    { id: 'minimal', name: 'Minimal', icon: '🔲' },
    { id: 'business', name: 'Business', icon: '💼' }
  ];

  const animations = [
    { id: 'pulse', name: 'Pulse', icon: '💓' },
    { id: 'scan', name: 'Scan Line', icon: '📱' },
    { id: 'particles', name: 'Particles', icon: '✨' },
    { id: 'glow', name: 'Glow', icon: '💫' },
    { id: 'none', name: 'No Animation', icon: '🚫' }
  ];

  const colors = [
    { name: 'Grass Green', value: '#22c55e' },
    { name: 'Premium Gold', value: '#fbbf24' },
    { name: 'Corporate Blue', value: '#3b82f6' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Black', value: '#000000' }
  ];

  useEffect(() => {
    generateQRData();
    startScanAnimation();
  }, [qrAnimation]);

  useEffect(() => {
    if (qrData) {
      generateQRCode();
    }
  }, [qrData, qrStyle, color, bgColor, logo]);

  const generateQRData = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/share/${streakData?.id || 'demo'}`;
    const data = {
      url: shareUrl,
      user: user?.displayName,
      streak: streakData?.currentStreak,
      timestamp: new Date().toISOString(),
      source: 'touchgrass_qr'
    };
    setQrData(JSON.stringify(data));
  };

  const generateQRCode = async () => {
    if (!qrData) return;

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate base QR code
      await QRCode.toCanvas(canvas, qrData, {
        width: downloadSize,
        margin: 2,
        color: {
          dark: color,
          light: bgColor
        }
      });

      // Apply styles
      const ctx = canvas.getContext('2d');
      applyStyle(ctx);

      // Add logo if present
      if (logo) {
        await addLogo(ctx);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setQrCode(dataUrl);

      // Start animation
      applyAnimation();
    } catch (err) {
    } finally {
      setIsGenerating(false);
    }
  };

  const applyStyle = (ctx) => {
    const canvas = canvasRef.current;
    const size = canvas.width;
    const moduleSize = size / 29; // QR code has 29x29 modules

    switch (qrStyle) {
      case 'dots':
        // Convert squares to dots
        ctx.globalCompositeOperation = 'destination-out';
        for (let y = 0; y < 29; y++) {
          for (let x = 0; x < 29; x++) {
            const imageData = ctx.getImageData(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
            const data = imageData.data;
            let isDark = false;
            
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] < 128) { // Dark pixel
                isDark = true;
                break;
              }
            }
            
            if (isDark) {
              ctx.beginPath();
              ctx.arc(
                x * moduleSize + moduleSize / 2,
                y * moduleSize + moduleSize / 2,
                moduleSize / 3,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = color;
              ctx.fill();
            }
          }
        }
        break;

      case 'rounded':
        // Round corners
        ctx.globalCompositeOperation = 'destination-out';
        for (let y = 0; y < 29; y++) {
          for (let x = 0; x < 29; x++) {
            const imageData = ctx.getImageData(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
            const data = imageData.data;
            let isDark = false;
            
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] < 128) {
                isDark = true;
                break;
              }
            }
            
            if (isDark) {
              ctx.beginPath();
              ctx.roundRect(
                x * moduleSize + 2,
                y * moduleSize + 2,
                moduleSize - 4,
                moduleSize - 4,
                6
              );
              ctx.fillStyle = color;
              ctx.fill();
            }
          }
        }
        break;

      case 'gradient':
        // Apply gradient
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, adjustColor(color, 40));
        
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        break;
    }
  };

  const addLogo = async (ctx) => {
    const canvas = canvasRef.current;
    const size = canvas.width;
    const logoSize = size / 4;

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = logo;
    });

    // Draw logo in center
    const x = (size - logoSize) / 2;
    const y = (size - logoSize) / 2;

    // Create circular mask for logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y, logoSize, logoSize);
    ctx.restore();

    // Add white border around logo
    ctx.beginPath();
    ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2 + 4, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = bgColor;
    ctx.stroke();
  };

  const applyAnimation = () => {
    if (qrAnimation === 'scan' && scanLineRef.current) {
      scanLineRef.current.style.animation = 'scan 2s ease-in-out infinite';
    }
  };

  const startScanAnimation = () => {
    if (qrAnimation === 'scan' && qrContainerRef.current) {
      // Animation is handled by CSS
    }
  };

  const adjustColor = (hex, percent) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.min(255, Math.floor(r * (1 + percent / 100)));
    g = Math.min(255, Math.floor(g * (1 + percent / 100)));
    b = Math.min(255, Math.floor(b * (1 + percent / 100)));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = (format = 'png') => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.download = `touchgrass-qr-${streakData?.currentStreak || 'streak'}.${format}`;
    link.href = qrCode;
    link.click();
  };

  const downloadPackage = () => {
    const packageData = {
      qrCode: qrCode,
      config: {
        style: qrStyle,
        color: color,
        backgroundColor: bgColor,
        size: downloadSize,
        frame: frameType,
        animation: qrAnimation
      },
      metadata: {
        streak: streakData?.currentStreak,
        user: user?.displayName,
        generated: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(packageData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `touchgrass-qr-package.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // const shareQRCode = () => {
  //   if (navigator.share && qrCode) {
  //     navigator.share({
  //       title: 'My TouchGrass QR Code',
  //       text: `Scan to view my ${streakData?.currentStreak}-day streak!`,
  //       files: [new File([qrCode], 'touchgrass-qr.png', { type: 'image/png' })]
  //   }
  // };

  return (
    <div className="qr-generator-container">
      <div className="qr-header">
        <div className="header-content">
          <div className="header-icon">🔳</div>
          <div>
            <h1 className="header-title">Professional QR Code Generator</h1>
            <p className="header-subtitle">Enterprise-grade QR codes for marketing & engagement</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat">
            <div className="stat-value">4K</div>
            <div className="stat-label">Resolution</div>
          </div>
          <div className="stat">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Scan Success</div>
          </div>
        </div>
      </div>

      <div className="qr-content">
        {/* Left Column - Preview */}
        <div className="preview-section">
          <div className="preview-header">
            <h2>Live Preview</h2>
            <div className="preview-actions">
              <button className="action-btn share-btn" onClick={shareQRCode}>
                <span className="btn-icon">📤</span>
                Share
              </button>
              <button className="action-btn download-btn" onClick={() => downloadQRCode('png')}>
                <span className="btn-icon">⬇️</span>
                Download PNG
              </button>
            </div>
          </div>

          <div className={`qr-preview-container frame-${frameType}`} ref={qrContainerRef}>
            <div className="qr-canvas-wrapper">
              <canvas
                ref={canvasRef}
                className="qr-canvas"
                width={downloadSize}
                height={downloadSize}
                style={{
                  width: '300px',
                  height: '300px',
                  '--qr-color': color,
                  '--qr-bg-color': bgColor
                }}
              />
              
              {qrAnimation === 'scan' && (
                <div className="scan-line" ref={scanLineRef}></div>
              )}
              
              {qrAnimation === 'particles' && (
                <div className="qr-particles">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="particle" style={{
                      '--particle-delay': `${i * 0.1}s`,
                      '--particle-color': color
                    }}></div>
                  ))}
                </div>
              )}
            </div>

            {frameType !== 'none' && (
              <div className="qr-frame">
                <div className="frame-content">
                  <div className="frame-logo">🌱</div>
                  <div className="frame-text">
                    <div className="frame-title">TouchGrass Streak</div>
                    <div className="frame-subtitle">Scan to view live streak</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="preview-info">
            <div className="info-card">
              <div className="info-icon">📱</div>
              <div className="info-content">
                <div className="info-title">Mobile Optimized</div>
                <div className="info-desc">Perfect for mobile scanning</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📈</div>
              <div className="info-content">
                <div className="info-title">Trackable</div>
                <div className="info-desc">Scan analytics included</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="controls-section">
          <div className="control-group">
            <h3>Design Style</h3>
            <div className="style-grid">
              {styles.map(style => (
                <button
                  key={style.id}
                  className={`style-btn ${qrStyle === style.id ? 'selected' : ''}`}
                  onClick={() => setQrStyle(style.id)}
                >
                  <span className="style-icon">{style.icon}</span>
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Colors</h3>
            <div className="color-controls">
              <div className="color-picker">
                <label>QR Color</label>
                <div className="color-grid">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      className={`color-btn ${color === c.value ? 'selected' : ''}`}
                      style={{ '--btn-color': c.value }}
                      onClick={() => setColor(c.value)}
                      title={c.name}
                    >
                      <span className="color-check">✓</span>
                    </button>
                  ))}
                </div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="color-input"
                />
              </div>
              
              <div className="color-picker">
                <label>Background</label>
                <div className="color-grid">
                  <button
                    className={`color-btn ${bgColor === '#ffffff' ? 'selected' : ''}`}
                    style={{ '--btn-color': '#ffffff' }}
                    onClick={() => setBgColor('#ffffff')}
                  >
                    <span className="color-check">✓</span>
                  </button>
                  <button
                    className={`color-btn ${bgColor === '#f8fafc' ? 'selected' : ''}`}
                    style={{ '--btn-color': '#f8fafc' }}
                    onClick={() => setBgColor('#f8fafc')}
                  >
                    <span className="color-check">✓</span>
                  </button>
                  <button
                    className={`color-btn ${bgColor === '#1f2937' ? 'selected' : ''}`}
                    style={{ '--btn-color': '#1f2937' }}
                    onClick={() => setBgColor('#1f2937')}
                  >
                    <span className="color-check">✓</span>
                  </button>
                </div>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="color-input"
                />
              </div>
            </div>
          </div>

          <div className="control-group">
            <h3>Frame Style</h3>
            <div className="frame-grid">
              {frames.map(frame => (
                <button
                  key={frame.id}
                  className={`frame-btn ${frameType === frame.id ? 'selected' : ''}`}
                  onClick={() => setFrameType(frame.id)}
                >
                  <span className="frame-icon">{frame.icon}</span>
                  <span className="frame-name">{frame.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Animation</h3>
            <div className="animation-grid">
              {animations.map(anim => (
                <button
                  key={anim.id}
                  className={`animation-btn ${qrAnimation === anim.id ? 'selected' : ''}`}
                  onClick={() => setQrAnimation(anim.id)}
                >
                  <span className="animation-icon">{anim.icon}</span>
                  <span className="animation-name">{anim.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Logo Upload</h3>
            <div className="logo-upload">
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="upload-input"
                />
                <div className="upload-area">
                  <span className="upload-icon">🏢</span>
                  <span className="upload-text">
                    {logo ? 'Logo Uploaded' : 'Add Company Logo'}
                  </span>
                  <span className="upload-subtext">PNG, JPG up to 2MB</span>
                </div>
              </label>
              {logo && (
                <button className="remove-logo" onClick={() => setLogo(null)}>
                  Remove Logo
                </button>
              )}
            </div>
          </div>

          <div className="control-group">
            <h3>Export Settings</h3>
            <div className="export-controls">
              <div className="size-control">
                <label>Size: {downloadSize}px</label>
                <input
                  type="range"
                  min="256"
                  max="2048"
                  step="256"
                  value={downloadSize}
                  onChange={(e) => setDownloadSize(parseInt(e.target.value))}
                  className="size-slider"
                />
                <div className="size-labels">
                  <span>256px</span>
                  <span>2048px</span>
                </div>
              </div>
              
              <div className="export-actions">
                <button className="export-btn png-btn" onClick={() => downloadQRCode('png')}>
                  <span className="export-icon">🖼️</span>
                  PNG
                </button>
                <button className="export-btn svg-btn" onClick={() => downloadQRCode('svg')}>
                  <span className="export-icon">📐</span>
                  SVG
                </button>
                <button className="export-btn package-btn" onClick={downloadPackage}>
                  <span className="export-icon">📦</span>
                  Full Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qr-footer">
        <div className="footer-content">
          <div className="business-features">
            <h4>Business Features</h4>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">📊</div>
                <div className="feature-text">Scan Analytics Dashboard</div>
              </div>
              <div className="feature">
                <div className="feature-icon">🎨</div>
                <div className="feature-text">Brand Guidelines Compliance</div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔗</div>
                <div className="feature-text">Dynamic URL Support</div>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <div className="feature-text">Batch Generation API</div>
              </div>
            </div>
          </div>
          
          <button className="enterprise-contact">
            <span className="contact-icon">🏢</span>
            Enterprise Solutions
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;