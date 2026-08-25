import React, { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function MessageInput({ onSendMessage, onTyping, onStopTyping }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Gallery & Camera states
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("LOOK AT THIS FRAME!!");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Helper to downscale and compress images for snappy websocket transfer
  const compressImage = (dataUrl: string, maxDimension = 800, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      const optimizedUrl = await compressImage(rawDataUrl);
      setPreviewImage(optimizedUrl);
      setImageCaption("LOOK AT THIS FRAME!!");
      setShowAttachmentMenu(false);
    };
    reader.readAsDataURL(file);
    // Reset file input so user can re-select the same file if needed
    e.target.value = "";
  };

  // Start live camera stream
  const startCamera = async (mode: "user" | "environment" = facingMode) => {
    setCameraError("");
    setIsCameraOpen(true);
    setShowAttachmentMenu(false);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("Live camera access failed or denied:", err);
      setCameraError(err.message || "Could not access camera. Try uploading from files!");
    }
  };

  // Stop live camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError("");
  };

  // Capture photo from live video feed
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror image horizontally if front facing for intuitive selfie experience
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const rawDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const optimizedUrl = await compressImage(rawDataUrl);
      setPreviewImage(optimizedUrl);
      setImageCaption("LOOK AT THIS FRAME!!");
    }
    stopCamera();
  };

  // Flip camera between front & back
  const flipCamera = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
    setShowEmojiPicker(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    if (onStopTyping) {
      onStopTyping();
    }
  };

  const handleSendPolaroid = () => {
    if (!previewImage) return;
    const captionText = imageCaption.trim() ? imageCaption.trim() : "LOOK AT THIS FRAME!!";
    onSendMessage(`IMAGE:${previewImage}|CAPTION:${captionText}`);
    setPreviewImage(null);
    setImageCaption("LOOK AT THIS FRAME!!");
  };

  const reactions = [
    { text: "🔥 FIRE!", bg: "bg-[#FF00E0] text-white" },
    { text: "LOL FR", bg: "bg-zap-cyan text-black" },
    { text: "WHAAT?!", bg: "bg-black text-[#FFD600]" },
    { text: "SLAY", bg: "bg-[#EAEAE2] text-black" },
  ];

  const emojiList = ["😱", "✨", "🌈", "🤘", "🔥", "😹", "👽", "💀", "💥", "🛸", "💬", "❤️", "👑", "🍕", "👾"];

  const mockImages = [
    {
      label: "🌆 TOKYO NEON",
      url: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&auto=format&fit=crop",
    },
    {
      label: "🔮 CRYSTALS",
      url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop",
    },
    {
      label: "👟 WINGED SHOE",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    },
    {
      label: "🌌 NEBULA DRIFT",
      url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop",
    },
  ];

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const handleSelectMockImage = (imageUrl: string, label: string) => {
    setPreviewImage(imageUrl);
    setImageCaption(label.replace(/^[^\s]+\s*/, ""));
    setShowAttachmentMenu(false);
  };

  return (
    <div className="flex flex-col border-t-[3.5px] border-black bg-white select-none relative">
      
      {/* Hidden file input for Photo Gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Hidden file input for Mobile Native Camera Capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 1. EMOJI PICKER DIALOG POPUP */}
      {showEmojiPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
          <div className="absolute right-4 bottom-16 bg-white border-[3px] border-black rounded-[14px] shadow-[4px_4px_0px_#000] p-3 z-50 w-64 animate-in slide-in-from-bottom duration-150">
            <h4 className="font-lilita text-xs uppercase tracking-wide border-b-[2px] border-black pb-1.5 mb-2.5">
              CHOOSE YOUR EMOTES!
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelectEmoji(emoji)}
                  className="w-10 h-10 border-2 border-black rounded-lg bg-[#F8F7F3] hover:bg-zap-yellow text-md flex items-center justify-center cursor-pointer hover:-translate-y-[0.5px] active:translate-y-[1px] transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 2. ATTACHMENT MENU POPUP (GALLERY + CAMERA + PRESETS) */}
      {showAttachmentMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowAttachmentMenu(false)} />
          <div className="absolute left-4 bottom-16 bg-white border-[3px] border-black rounded-[14px] shadow-[4px_4px_0px_#000] p-3 z-50 w-60 flex flex-col gap-2 animate-in slide-in-from-bottom duration-150">
            <h4 className="font-lilita text-xs uppercase tracking-wide border-b-[2px] border-black pb-1 px-1">
              ATTACH A POLAROID
            </h4>

            {/* Gallery Upload Option */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2.5 px-3 py-2 border-2 border-black bg-[#FFE600] hover:bg-amber-300 rounded-lg font-lilita text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer text-left"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-black flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>📁 PHOTO GALLERY</span>
            </button>

            {/* Camera Capture Option */}
            <button
              type="button"
              onClick={() => startCamera("user")}
              className="w-full flex items-center gap-2.5 px-3 py-2 border-2 border-black bg-zap-cyan hover:bg-cyan-300 rounded-lg font-lilita text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer text-left"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-black flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <span>📸 TAKE PHOTO</span>
            </button>

            {/* Preset Samples Header */}
            <div className="border-t-[1.5px] border-black/20 pt-1 mt-0.5">
              <span className="text-[9px] font-lilita uppercase tracking-wider text-black/50 px-1">
                SAMPLE POLAROIDS
              </span>
            </div>

            {/* Mock Image Presets */}
            <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
              {mockImages.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => handleSelectMockImage(img.url, img.label)}
                  className="w-full text-left px-2 py-1 border border-transparent hover:border-black hover:bg-[#F8F7F3] rounded font-lilita text-[10px] uppercase transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>{img.label}</span>
                  <span className="text-black/40 text-[9px]">→</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 3. LIVE CAMERA VIEWFINDER MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
          <div className="bg-white border-[3.5px] border-black rounded-[18px] shadow-[6px_6px_0px_#000] p-4 md:p-6 w-full max-w-[460px] flex flex-col gap-4 animate-in zoom-in-95 duration-150 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-[2.5px] border-black pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF00E0] animate-ping" />
                <h3 className="font-lilita text-lg uppercase tracking-wide">
                  LIVE POLAROID CAM ⚡
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="w-8 h-8 border-2 border-black rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Camera Viewport */}
            {cameraError ? (
              <div className="p-6 bg-red-100 border-[2.5px] border-black rounded-xl text-center flex flex-col items-center gap-3">
                <p className="font-lilita text-sm text-red-600 uppercase">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-zap-yellow border-2 border-black rounded-lg font-lilita text-xs uppercase shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  UPLOAD FROM FILES INSTEAD
                </button>
              </div>
            ) : (
              <div className="relative aspect-4/3 w-full bg-black border-[3px] border-black rounded-[14px] overflow-hidden shadow-[3px_3px_0px_#000]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                />
                
                {/* Neobrutalist Viewfinder Brackets */}
                <div className="absolute inset-3 border-2 border-dashed border-white/60 pointer-events-none rounded-lg" />
                <div className="absolute top-4 left-4 bg-black/60 text-white font-lilita text-[10px] uppercase px-2 py-0.5 rounded border border-white/40">
                  REC ●
                </div>

                {/* Flip camera button */}
                <button
                  type="button"
                  onClick={flipCamera}
                  title="Flip Camera"
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
              </div>
            )}

            {/* Shutter Controls */}
            {!cameraError && (
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 border-[2.5px] border-black rounded-xl bg-white font-lilita text-xs uppercase shadow-[2.5px_2.5px_0px_#000] hover:bg-neutral-100 cursor-pointer"
                >
                  CANCEL
                </button>

                {/* Big Shutter Snap Button */}
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-3 border-[3px] border-black rounded-2xl bg-zap-yellow text-black font-lilita text-base uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                  <span>SNAP FRAME!</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. POLAROID PREVIEW & CAPTION MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
          <div className="bg-white border-[3.5px] border-black rounded-[20px] shadow-[6px_6px_0px_#000] p-5 md:p-6 w-full max-w-[380px] flex flex-col gap-4 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-[2.5px] border-black pb-2">
              <h3 className="font-lilita text-base md:text-lg uppercase tracking-wide">
                ⚡ POLAROID PREVIEW
              </h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 border-2 border-black rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Classic Polaroid Card */}
            <div className="border-[3px] border-black p-3.5 pb-4 rounded-[16px] bg-[#FDFDF8] shadow-[4px_4px_0px_#000] transform -rotate-[1deg]">
              <img
                src={previewImage}
                alt="polaroid preview"
                className="w-full aspect-square object-cover border-[2.5px] border-black rounded-[10px] bg-neutral-100"
              />
              
              {/* Editable Caption Input */}
              <div className="mt-3">
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Add a dope caption..."
                  className="w-full bg-white text-black font-lilita text-xs uppercase placeholder-black/40 border-[2px] border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-amber-50"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="flex-1 py-2.5 border-[2.5px] border-black rounded-xl bg-white font-lilita text-xs uppercase shadow-[2.5px_2.5px_0px_#000] hover:bg-neutral-100 active:translate-y-[1px] transition-all cursor-pointer text-center"
              >
                DISCARD
              </button>
              <button
                type="button"
                onClick={handleSendPolaroid}
                className="flex-[2] py-2.5 border-[3px] border-black rounded-xl bg-zap-yellow text-black font-lilita text-sm uppercase shadow-[3.5px_3.5px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2.5px_2.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ SEND TO SQUAD!</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Reaction Badges row */}
      <div className="flex gap-2.5 px-4 py-2.5 overflow-x-auto border-b-[2px] border-black bg-[#FDFDFB]">
        {reactions.map((react, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(react.text)}
            className={`px-3 py-1 font-lilita text-[10px] uppercase border-[2.5px] border-black rounded-full shadow-[2px_2px_0px_#000] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0 cursor-pointer ${react.bg}`}
          >
            {react.text}
          </button>
        ))}
      </div>

      {/* Main input form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-center gap-3.5"
      >
        {/* Plus Icon (Square button toggles Attachment drawer) */}
        <button
          type="button"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          className="w-10 h-10 bg-white border-[3px] border-black rounded-[10px] shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
          title="Attach Polaroid (Gallery / Camera)"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        {/* Capsule Input box with Emoji Trigger inside */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              const val = e.target.value;
              setText(val);

              if (onTyping) {
                onTyping();
              }

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

              const timeout = setTimeout(() => {
                if (onStopTyping) {
                  onStopTyping();
                }
              }, 1500);

              setTypingTimeout(timeout);
            }}
            placeholder="Spill the tea..."
            className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-5 py-3 pr-12 rounded-[15px] shadow-[3.5px_3.5px_0px_#000] focus:outline-none focus:bg-amber-50 focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-[3px_3px_0px_#000] transition-all text-xs md:text-sm"
          />
          {/* Emoji smiley icon (Smiley toggles Emoji picker) */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FF00E0] hover:scale-110 transition-transform w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
            </svg>
          </button>
        </div>

        {/* Rounded square Send Button */}
        <button
          type="submit"
          className="w-10 h-10 bg-zap-yellow border-[3px] border-black rounded-[12px] shadow-[2.5px_2.5px_0px_#000] cursor-pointer flex items-center justify-center hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}

