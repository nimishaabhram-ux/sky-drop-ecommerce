import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, UploadCloud, CheckCircle, ChevronRight, Navigation, Camera, Image as ImageIcon, AlertCircle, Trash2, X } from 'lucide-react';
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
  const [partialFailure, setPartialFailure] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { location, error: geoError, isLocating, requestLocation } = useGeolocation();
  const { stream, error: cameraError, isStarting, startCamera, stopCamera, capturePhoto, videoRef } = useCamera();

  // Cleanup ObjectURLs on unmount or photo removal
  useEffect(() => {
    return () => {
      photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
      stopCamera();
    };
  }, [photos, stopCamera]);

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
    setPartialFailure(false);

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

      if (failedUploads > 0) {
        setPartialFailure(true);
        setIsSaving(false);
      } else {
        setSaveSuccess(true);
        setIsSaving(false);
      }
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

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Set Delivery Location</h1>
        <p className="text-gray-500 font-medium">Help SkyDrop accurately identify where the drone should deliver.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative px-2">
        <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-4 h-1.5 bg-blue-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `calc(${((step - 1) / 3) * 100}% - 32px)` }}
        ></div>
        
        {['Location', 'Surroundings', 'Safety', 'Review'].map((label, idx) => {
          const s = idx + 1;
          return (
            <div key={s} className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 shadow-sm ${
                  s < step ? 'bg-blue-600 text-white scale-95' : 
                  s === step ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' : 
                  'bg-white border-2 border-gray-100 text-gray-400'
                }`}
              >
                {s < step ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
              <span className={`text-xs font-bold hidden sm:block ${s <= step ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
            </div>
          )
        })}
      </div>

      <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden flex flex-col relative min-h-[500px]">
        
        {/* Step 1: Location Setup */}
        {step === 1 && (
          <div className="flex-1 flex flex-col p-6 md:p-10 h-full">
            <div className="text-center mb-10 mt-4">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MapPin className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Find your delivery area</h2>
              <p className="text-gray-500 max-w-md mx-auto font-medium">
                We need your GPS coordinates to confirm drone delivery is available in your area.
              </p>
            </div>

            <div className="max-w-md mx-auto w-full space-y-6 mb-8 flex-1">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Name this location</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold text-gray-900 transition-all" 
                  placeholder="e.g. Home, Front Yard"
                />
              </div>

              {location ? (
                <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-green-900">Location found</h4>
                    <p className="text-sm font-medium text-green-700 mt-1">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      <br />Accuracy: ±{Math.round(location.accuracy)}m
                    </p>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={requestLocation}
                  isLoading={isLocating}
                  className="h-16 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-bold text-lg rounded-2xl transition-all"
                >
                  <Navigation className="w-5 h-5 mr-2" /> 
                  Get current location
                </Button>
              )}
              
              {geoError && (
                <p className="text-sm font-bold text-red-600 text-center bg-red-50 p-3 rounded-xl">{geoError}</p>
              )}
            </div>

            <div className="mt-auto pt-6 flex justify-end">
              <Button className="h-14 px-8 text-lg rounded-2xl shadow-md w-full sm:w-auto" onClick={handleLocationContinue} disabled={!location}>
                Continue <ChevronRight className="w-5 h-5 ml-2 -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Surroundings */}
        {step === 2 && !isCameraActive && (
          <div className="flex-1 flex flex-col p-6 md:p-10 h-full">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Add delivery surroundings</h2>
            <p className="text-gray-500 font-medium mb-6">
              Add at least 4 photos showing the place where you want your order delivered. These photos help identify the delivery area and nearby surroundings.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-sm">
              <h4 className="font-bold text-blue-900 mb-2">What to capture</h4>
              <ul className="space-y-1 text-blue-800 font-medium list-disc list-inside">
                <li>The delivery point</li>
                <li>A wider view of the area</li>
                <li>The area from another angle</li>
                <li>Nearby buildings, trees or obstacles</li>
              </ul>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                  <img src={photo.previewUrl} alt="Surrounding" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    Photo {photo.sequence}
                  </div>
                </div>
              ))}
              
              {photos.length < 8 && (
                <div className="aspect-square flex flex-col gap-2">
                  <button 
                    onClick={handleOpenCamera}
                    className="flex-1 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-500 transition-colors"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Take photo</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Upload photos</span>
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold ${photos.length >= 4 ? 'text-green-600' : 'text-orange-600'}`}>
                  {photos.length >= 4 ? `${photos.length} photos added. Minimum requirement complete.` : `${photos.length} of 4 minimum photos added.`}
                </span>
                {photos.length === 8 && <span className="text-sm font-bold text-gray-500">Maximum 8 photos</span>}
              </div>
              <div className="flex justify-end">
                <Button 
                  className="h-14 px-8 text-lg rounded-2xl shadow-md w-full sm:w-auto" 
                  onClick={handleSurroundingsContinue} 
                  disabled={photos.length < 4}
                >
                  Continue <ChevronRight className="w-5 h-5 ml-2 -mr-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Camera View Overlay */}
        {isCameraActive && (
          <div className="absolute inset-0 bg-black text-white flex flex-col z-50">
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start text-white drop-shadow-md">
              <div>
                <h2 className="text-xl font-black">Delivery surroundings</h2>
                <p className="text-sm font-medium mt-1 opacity-90">Photo {photos.length + 1} of at least 4</p>
                <p className="text-xs mt-1 opacity-80">Capture the delivery area from another angle.</p>
              </div>
              <button 
                onClick={() => setIsCameraActive(false)}
                className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
              {isStarting ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold">Starting camera...</p>
                </div>
              ) : cameraError ? (
                <div className="text-center p-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Camera access is blocked</h3>
                  <p className="text-red-300 font-medium mb-6">Allow camera access to take new photos, or upload existing photos from your device.</p>
                  <div className="flex flex-col gap-3">
                    <Button onClick={handleOpenCamera} className="h-12 bg-white text-gray-900 hover:bg-gray-100">Try camera again</Button>
                    <Button onClick={() => { setIsCameraActive(false); fileInputRef.current?.click(); }} variant="outline" className="h-12 border-gray-600 text-white hover:bg-gray-800">Upload photos</Button>
                  </div>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 gap-8 items-center px-8">
                    <button onClick={() => setIsCameraActive(false)} className="text-white font-bold opacity-80 hover:opacity-100">Cancel</button>
                    <button 
                      onClick={handleCapture}
                      className="w-20 h-20 rounded-full bg-white border-[6px] border-gray-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                      aria-label="Capture photo"
                    ></button>
                    <div className="w-12"></div> {/* Spacer to balance flex layout */}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Safety Configuration */}
        {step === 3 && (
          <div className="flex-1 flex flex-col p-6 md:p-10 h-full bg-gray-50">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Safety Information</h2>
            <p className="text-gray-500 font-medium mb-8">
              Please confirm the following safety requirements for drone delivery at this location.
            </p>

            <div className="space-y-4 mb-8 flex-1">
              {[
                { key: 'openArea', label: 'The delivery area is open and flat.' },
                { key: 'noWires', label: 'There are no overhead wires directly above the delivery point.' },
                { key: 'clearOfPeople', label: 'People and animals can stay clear during delivery.' },
                { key: 'awayFromTraffic', label: 'The area is away from active road traffic.' },
                { key: 'permission', label: 'I have permission to use this delivery location.' },
              ].map(item => (
                <label key={item.key} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-blue-300 transition-colors">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={safetyConfirmed[item.key as keyof typeof safetyConfirmed]}
                    onChange={(e) => setSafetyConfirmed(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  />
                  <span className="font-medium text-gray-800">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-auto pt-6 flex justify-end">
              <Button 
                className="h-14 px-8 text-lg rounded-2xl shadow-md w-full sm:w-auto" 
                onClick={handleSafetyContinue} 
                disabled={!allSafetyConfirmed}
              >
                Continue <ChevronRight className="w-5 h-5 ml-2 -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="flex-1 flex flex-col p-6 md:p-10 h-full overflow-y-auto">
            {saveSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-green-100">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">Location ready</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">
                  Your delivery surroundings have been saved successfully and this location is ready for drone delivery.
                </p>
                <Button className="h-14 w-full max-w-sm rounded-2xl text-lg shadow-md font-bold" onClick={handleFinish}>
                  {isFromCheckout ? 'Continue Checkout' : 'Done'}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Review delivery location</h2>
                
                {/* Location summary */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Delivery Location</h3>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{locationName}</p>
                      <p className="text-sm text-gray-500">
                        {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Surroundings summary */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Delivery Surroundings</h3>
                    <button onClick={() => setStep(2)} className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit photos</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {photos.slice(0, 4).map(p => (
                      <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={p.previewUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {photos.length > 4 && (
                    <p className="text-sm font-bold text-gray-500">+{photos.length - 4} more photos</p>
                  )}
                  <p className="text-sm font-medium text-gray-600 mt-2">{photos.length} photos total</p>
                </div>

                {/* Safety summary */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Safety</h3>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">Safety information confirmed</span>
                  </div>
                </div>

                {saveError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{saveError}</p>
                  </div>
                )}
                
                {partialFailure && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl font-medium flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Some photos could not be saved.</p>
                      <p className="text-sm mb-3 text-orange-700">The location was created, but not all photos were successfully uploaded.</p>
                      <Button size="sm" variant="outline" onClick={handleSaveLocation} isLoading={isSaving} className="bg-white border-orange-300 text-orange-800 hover:bg-orange-100">
                        Try uploading again
                      </Button>
                    </div>
                  </div>
                )}

                {!partialFailure && (
                  <div className="mt-auto pt-4">
                    <Button 
                      className="h-14 w-full rounded-2xl text-lg shadow-lg font-black" 
                      onClick={handleSaveLocation}
                      isLoading={isSaving}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving delivery location...' : 'Save delivery location'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
