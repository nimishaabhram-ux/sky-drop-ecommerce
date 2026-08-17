import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, CheckCircle2, Camera, Image as ImageIcon, Trash2, X, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCamera } from '../hooks/useCamera';
import { locationsApi } from '../services/locationsApi';
import { Button } from '../components/common/Button';

type SurroundingsPhotoDraft = {
  id: string;
  source: 'camera' | 'upload';
  file: File | Blob;
  previewUrl: string;
  capturedAt: string;
  sequence: number;
};

export const DroneLocationSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromCheckout = searchParams.get('checkout') === 'true';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [locationName, setLocationName] = useState('Home');
  
  const [photos, setPhotos] = useState<SurroundingsPhotoDraft[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [safetyConfirmed, setSafetyConfirmed] = useState({
    openArea: false,
    noWires: false,
    clearOfPeople: false,
    awayFromTraffic: false,
    permission: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { location, error: geoError, isLocating, requestLocation } = useGeolocation();
  const { stream, error: cameraError, isStarting, startCamera, stopCamera, capturePhoto, videoRef } = useCamera();

  // Cleanup ObjectURLs on unmount or photo removal
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    // We store the photos in a ref to clean them up strictly on unmount.
    // In this simple case, relying on browser cleanup is also acceptable, 
    // but we can let them live for the lifecycle of the component.
    return () => {
      photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCameraActive) {
      stopCamera();
    }
  }, [isCameraActive, stopCamera]);

  // Handle Location Step
  const handleLocationContinue = () => {
    if (location) setStep(2);
  };

  // Handle Photo Capture
  const handleOpenCamera = async () => {
    setIsCameraActive(true);
    await startCamera();
  };

  const handleCapture = async () => {
    const dataUrl = capturePhoto();
    if (!dataUrl) return;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const previewUrl = URL.createObjectURL(blob);
      
      const newPhoto: SurroundingsPhotoDraft = {
        id: Math.random().toString(36).substring(7),
        source: 'camera',
        file: blob,
        previewUrl,
        capturedAt: new Date().toISOString(),
        sequence: photos.length + 1
      };

      setPhotos(prev => [...prev, newPhoto]);
      setIsCameraActive(false);
    } catch (e) {
      console.error("Failed to process photo", e);
    }
  };

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files);
    const availableSlots = 8 - photos.length;
    const filesToAdd = newFiles.slice(0, availableSlots);

    const newPhotos: SurroundingsPhotoDraft[] = filesToAdd.map((file: File, idx: number) => ({
      id: Math.random().toString(36).substring(7),
      source: 'upload',
      file,
      previewUrl: URL.createObjectURL(file),
      capturedAt: new Date().toISOString(),
      sequence: photos.length + 1 + idx
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const removed = prev.find(p => p.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      // Re-sequence
      return filtered.map((p, idx) => ({ ...p, sequence: idx + 1 }));
    });
  };

  const handleSurroundingsContinue = () => {
    if (photos.length >= 4) setStep(3);
  };

  // Handle Safety Step
  const allSafetyConfirmed = Object.values(safetyConfirmed).every(v => v);
  
  const handleSafetyContinue = () => {
    if (allSafetyConfirmed) setStep(4);
  };

  // Handle Save
  const handleSaveLocation = async () => {
    if (!location) return;
    
    setIsSaving(true);
    setSaveError(null);

    try {
      // 1. Create Location
      const newLoc = await locationsApi.createLocation({
        userId: 'user1',
        name: locationName,
        type: 'home',
        latitude: location.latitude,
        longitude: location.longitude,
        gpsAccuracy: location.accuracy,
        address: `${locationName} — ${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E`,
        status: 'verified',
        isDefault: true,
        clearanceScore: 100,
        imagesCount: photos.length,
        groundSurface: 'grass',
        overheadHazards: [],
        lastScannedAt: new Date().toISOString()
      });

      // 2. Upload Photos
      let failedUploads = 0;
      for (const photo of photos) {
        try {
          // Convert file/blob to base64 for the mock API (simulating upload)
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(photo.file);
          });
          const dataUrl = await base64Promise;

          await locationsApi.uploadImage(newLoc.id, {
            dataUrl,
            sequence: photo.sequence,
            directionName: photo.sequence === 1 ? 'Delivery area' : `Surroundings ${photo.sequence - 1}`,
            heading: null,
            pitch: null,
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            capturedAt: photo.capturedAt,
            fileSizeKb: Math.round(photo.file.size / 1024)
          });
        } catch (e) {
          console.error("Failed to upload photo", e);
          failedUploads++;
        }
      }

      setSaveSuccess(true);
      setIsSaving(false);
    } catch (err) {
      console.error("Failed to save location", err);
      setSaveError("Failed to save location. Please try again.");
      setIsSaving(false);
    }
  };

  const handleFinish = () => {
    if (isFromCheckout) {
      navigate('/checkout');
    } else {
      navigate('/settings/drone');
    }
  };

  if (saveSuccess) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Location saved</h1>
        <p className="text-[15px] text-gray-500 mb-8">{locationName} is ready for drone delivery.</p>
        <Button onClick={handleFinish} className="px-8">
          Done
        </Button>
      </div>
    );
  }

  const stepLabels = ['Location', 'Surroundings', 'Safety', 'Review'];

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6 md:py-10 min-h-[calc(100vh-64px)] md:min-h-screen flex flex-col bg-white md:bg-transparent">
      
      {/* Mobile Stepper */}
      <div className="md:hidden mb-8">
        <p className="text-[13px] font-medium text-gray-500 mb-1">Step {step} of 4</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-3">{stepLabels[step - 1]}</h1>
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center gap-2 mb-10 pb-6 border-b border-gray-100">
        {stepLabels.map((label, idx) => {
          const s = idx + 1;
          const isCompleted = s < step;
          const isActive = s === step;
          return (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <span className={`text-[14px] font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
                )}
                <span className={`text-[15px] ${isActive ? 'font-semibold text-gray-900' : isCompleted ? 'font-medium text-gray-700' : 'font-medium text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {s < 4 && <div className="w-8 h-px bg-gray-200 mx-2" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Camera Full Screen Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
            <button onClick={() => setIsCameraActive(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-[13px] font-medium opacity-80">Delivery surroundings</p>
              <p className="text-[15px] font-semibold">Photo {photos.length + 1} of 4</p>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
          
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            {isStarting && <p className="text-white">Starting camera...</p>}
            {cameraError && <p className="text-red-400 p-4 text-center">{cameraError}</p>}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 bg-black flex flex-col items-center">
            <p className="text-white text-[15px] mb-8 text-center">Capture the delivery point.</p>
            <button 
              onClick={handleCapture}
              disabled={isStarting || !!cameraError}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1"
            >
              <div className="w-full h-full bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      )}

      {/* Main Wizard Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Step 1: Location */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="hidden md:block mb-8">
              <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Location</h1>
              <p className="text-[15px] text-gray-500">Where should we deliver? Choose the exact point where your drone delivery should arrive.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Location name</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900" 
                  placeholder="e.g. Home, Front Yard"
                />
              </div>

              {location && (
                <div className="w-full h-48 rounded-lg overflow-hidden relative border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
                    alt="Map view" 
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                variant="secondary" 
                onClick={requestLocation}
                isLoading={isLocating}
                fullWidth
              >
                Use current location
              </Button>
              
              {geoError && (
                <p className="text-[13px] text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {geoError}
                </p>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 mt-8 flex flex-col md:flex-row justify-end">
              <Button className="w-full md:w-auto" onClick={handleLocationContinue} disabled={!location}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Surroundings */}
        {step === 2 && !isCameraActive && (
          <div className="flex-1 flex flex-col">
            <div className="hidden md:block mb-8">
              <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Surroundings</h1>
              <p className="text-[15px] text-gray-500 mb-1">Add at least 4 photos of the delivery area so we can identify the correct place.</p>
              <p className="text-[14px] text-gray-600">Capture the delivery point from different angles and include nearby buildings, trees or obstacles.</p>
            </div>
            
            <div className="md:hidden mb-6">
              <p className="text-[14px] text-gray-600">Capture the delivery point from different angles and include nearby buildings, trees or obstacles.</p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Button variant="secondary" onClick={handleOpenCamera} className="flex-1">
                Take photo
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex-1">
                Upload photos
              </Button>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
            
            <p className="text-[14px] font-medium text-gray-700 mb-4">
              {photos.length >= 4 ? `✓ ${photos.length} photos added` : `${photos.length} of 4 photos`}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                  <img src={photo.previewUrl} alt="Surrounding" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 mt-8 flex gap-3 flex-col-reverse md:flex-row md:justify-between items-center">
              <Button variant="ghost" className="w-full md:w-auto" onClick={() => setStep(1)}>Back</Button>
              <Button className="w-full md:w-auto" onClick={handleSurroundingsContinue} disabled={photos.length < 4}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Safety */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <div className="hidden md:block mb-8">
              <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Safety</h1>
              <p className="text-[15px] text-gray-500">Confirm the delivery area is suitable.</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'openArea', label: 'The delivery area is open' },
                { id: 'noWires', label: 'There are no overhead wires directly above it' },
                { id: 'clearOfPeople', label: 'People and animals can stay clear during delivery' },
                { id: 'awayFromTraffic', label: 'The area is away from active traffic' },
                { id: 'permission', label: 'I have permission to use this location' }
              ].map((item) => (
                <label key={item.id} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={safetyConfirmed[item.id as keyof typeof safetyConfirmed]}
                    onChange={(e) => setSafetyConfirmed(prev => ({ ...prev, [item.id]: e.target.checked }))}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-[15px] text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 mt-8 flex gap-3 flex-col-reverse md:flex-row md:justify-between items-center">
              <Button variant="ghost" className="w-full md:w-auto" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-full md:w-auto" onClick={handleSafetyContinue} disabled={!allSafetyConfirmed}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <div className="hidden md:block mb-8">
              <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Review</h1>
              <p className="text-[15px] text-gray-500">Review your location details before saving.</p>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-semibold text-gray-900">Location</h3>
                  <button onClick={() => setStep(1)} className="text-[14px] text-blue-600 font-medium">Edit</button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-4 border border-gray-100">
                  {location && (
                    <div className="w-16 h-16 rounded-md border border-gray-200 shrink-0 relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=200&q=80" 
                        alt="Map view" 
                        className="w-full h-full object-cover grayscale-[20%]"
                      />
                      <div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply pointer-events-none"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border border-white shadow-sm"></div>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{locationName}</p>
                    <p className="text-[14px] text-gray-500 mt-0.5">{location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-semibold text-gray-900">Surroundings</h3>
                  <button onClick={() => setStep(2)} className="text-[14px] text-blue-600 font-medium">Edit photos</button>
                </div>
                <p className="text-[14px] text-gray-600 mb-3">{photos.length} photos</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map(photo => (
                    <div key={photo.id} className="w-16 h-16 rounded-md bg-gray-100 shrink-0 overflow-hidden">
                      <img src={photo.previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-3">Safety</h3>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[14px] font-medium">Confirmed</span>
                </div>
              </div>
              
              {saveError && (
                <div className="p-3 bg-red-50 text-red-600 text-[14px] rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {saveError}
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 mt-8 flex gap-3 flex-col-reverse md:flex-row md:justify-between items-center pb-4">
              <Button variant="ghost" className="w-full md:w-auto" onClick={() => setStep(3)} disabled={isSaving}>Back</Button>
              <Button className="w-full md:w-auto" onClick={handleSaveLocation} isLoading={isSaving}>
                Save location
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
