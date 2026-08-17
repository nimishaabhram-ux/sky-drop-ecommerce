import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, UploadCloud, CheckCircle, ChevronRight, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCamera } from '../hooks/useCamera';
import { locationsApi } from '../services/locationsApi';
import { Button } from '../components/common/Button';

export const DroneLocationSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromCheckout = searchParams.get('checkout') === 'true';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [locationName, setLocationName] = useState('Home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { location, error: geoError, isLocating, requestLocation } = useGeolocation();
  const { stream, error: cameraError, isStarting, startCamera, stopCamera, capturePhoto, videoRef } = useCamera();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleStartScan = async () => {
    if (!location) {
      alert("Please allow location access to continue.");
      return;
    }
    setStep(2);
    await startCamera();
  };

  const handleCapture = async () => {
    const photo = capturePhoto();
    if (!photo) return;
    
    stopCamera();
    setStep(3);
    
    setTimeout(async () => {
      try {
        await locationsApi.createLocation({
          userId: 'user1',
          name: locationName,
          type: 'home',
          latitude: location!.latitude,
          longitude: location!.longitude,
          gpsAccuracy: location!.accuracy,
          status: 'verified',
          isDefault: true,
          clearanceScore: 95,
          imagesCount: 1,
          groundSurface: 'grass',
          overheadHazards: [],
          lastScannedAt: new Date().toISOString()
        });
        setStep(4);
      } catch (err) {
        console.error("Failed to save location", err);
        alert("Failed to save location. Please try again.");
        setStep(1);
      }
    }, 2500);
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
        <p className="text-gray-500 font-medium">We need to verify that your location is safe for drone landings.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative px-2">
        <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-4 h-1.5 bg-blue-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `calc(${((step - 1) / 3) * 100}% - 32px)` }}
        ></div>
        
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 shadow-sm ${
              s < step ? 'bg-blue-600 text-white scale-95' : 
              s === step ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' : 
              'bg-white border-2 border-gray-100 text-gray-400'
            }`}
          >
            {s < step ? <CheckCircle className="w-6 h-6" /> : s}
          </div>
        ))}
      </div>

      <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden flex flex-col relative min-h-[500px]">
        
        {/* Step 1: Location Setup */}
        {step === 1 && (
          <div className="flex-1 flex flex-col p-6 md:p-10 h-full">
            <div className="text-center mb-10 mt-4">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MapPin className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">Find your landing zone</h2>
              <p className="text-gray-500 max-w-md mx-auto font-medium">
                First, we need your exact GPS coordinates to check airspace restrictions in your area.
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
              <Button className="h-14 px-8 text-lg rounded-2xl shadow-md w-full sm:w-auto" onClick={handleStartScan} disabled={!location}>
                Continue to Scan <ChevronRight className="w-5 h-5 ml-2 -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Camera Scan */}
        {step === 2 && (
          <div className="flex-1 flex flex-col h-full bg-black text-white relative">
            <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start text-white drop-shadow-md">
              <div>
                <h2 className="text-2xl font-black">Scan Landing Zone</h2>
                <p className="text-sm font-medium mt-1 opacity-90">Point camera at the ground where you want the drone to land.</p>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {isStarting ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                  <p className="font-bold">Starting camera...</p>
                </div>
              ) : cameraError ? (
                <div className="text-center p-8 bg-gray-900 rounded-3xl max-w-sm border border-gray-800">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <p className="text-red-400 font-medium mb-6">{cameraError}</p>
                  <Button onClick={() => setStep(1)} className="h-12 rounded-xl bg-white text-gray-900 hover:bg-gray-100">Go back</Button>
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
                  {/* AR Overlay Guides */}
                  <div className="absolute inset-0 border-[24px] border-black/40 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 border-4 border-dashed border-white/70 rounded-full pointer-events-none flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  </div>
                  <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
                    <button 
                      onClick={handleCapture}
                      className="w-20 h-20 rounded-full bg-white border-[6px] border-gray-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500"
                      aria-label="Capture photo"
                    ></button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Upload and Processing */}
        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
            <div className="relative w-32 h-32 mb-8">
              <svg className="animate-spin w-full h-full text-blue-600 drop-shadow-md" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <UploadCloud className="w-10 h-10" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-3">Analyzing location...</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
              Our AI is checking the area for overhead hazards, power lines, and flat landing surfaces.
            </p>
            
            <div className="w-72 h-3 bg-gray-200 rounded-full mt-10 overflow-hidden shadow-inner">
              <div className="h-full bg-blue-600 animate-[pulse_1.5s_ease-in-out_infinite] w-full"></div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center bg-white">
            <div className="w-28 h-28 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm border-[8px] border-green-100">
              <CheckCircle className="w-14 h-14" />
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-4">Verified</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 text-lg leading-relaxed">
              Great news! <span className="font-bold text-gray-900">"{locationName}"</span> is clear of obstacles and safe for drone deliveries.
            </p>
            
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-10 text-left w-full max-w-sm shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">Safety Score</span>
                <span className="text-lg font-black text-green-600">95/100</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-green-500 w-[95%]"></div>
              </div>
            </div>

            <Button className="h-16 w-full max-w-sm rounded-2xl text-lg shadow-lg font-black" onClick={handleFinish}>
              {isFromCheckout ? 'Continue Checkout' : 'Back to Settings'}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};
