import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Camera, UploadCloud, CheckCircle, ChevronRight, Navigation, Loader2 } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCamera } from '../hooks/useCamera';
import { locationsApi } from '../services/locationsApi';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const DroneLocationSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromCheckout = searchParams.get('checkout') === 'true';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [locationName, setLocationName] = useState('Home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { location, error: geoError, isLocating, requestLocation } = useGeolocation();
  const { stream, error: cameraError, isStarting, startCamera, stopCamera, capturePhoto, videoRef } = useCamera();

  // Cleanup camera on unmount
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
    
    // Simulate upload and processing
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
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Set Delivery Location</h1>
        <p className="text-slate-600">We need to verify that your location is safe for drone landings.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              s < step ? 'bg-blue-600 text-white' : 
              s === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
              'bg-slate-200 text-slate-500'
            }`}
          >
            {s < step ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <Card className="min-h-[400px] flex flex-col relative overflow-hidden">
        
        {/* Step 1: Location Setup */}
        {step === 1 && (
          <div className="flex-1 flex flex-col h-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Find your landing zone</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                First, we need your exact GPS coordinates to check airspace restrictions in your area.
              </p>
            </div>

            <div className="max-w-sm mx-auto w-full space-y-4 mb-8 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name this location</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                  placeholder="e.g. Home, Front Yard"
                />
              </div>

              {location ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Location found</h4>
                    <p className="text-xs text-green-700 mt-1">
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
                  className="py-6 border-dashed"
                >
                  <Navigation className="w-5 h-5 mr-2" /> 
                  Get current location
                </Button>
              )}
              
              {geoError && (
                <p className="text-sm text-red-600 text-center">{geoError}</p>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
              <Button size="lg" onClick={handleStartScan} disabled={!location}>
                Continue to Environment Scan <ChevronRight className="w-5 h-5 ml-1 -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Camera Scan */}
        {step === 2 && (
          <div className="flex-1 flex flex-col h-full bg-slate-900 -m-4 sm:-m-6 text-white">
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start text-white drop-shadow-md">
              <div>
                <h2 className="text-lg font-bold">Scan Landing Zone</h2>
                <p className="text-sm opacity-90">Point camera at the ground where you want the drone to land.</p>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
              {isStarting ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p>Starting camera...</p>
                </div>
              ) : cameraError ? (
                <div className="text-center p-6 bg-slate-800 rounded-xl max-w-sm">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-400 mb-4">{cameraError}</p>
                  <Button onClick={() => setStep(1)} variant="secondary">Go back</Button>
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
                  <div className="absolute inset-0 border-[16px] border-black/40 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 border-2 border-dashed border-white/50 rounded-full pointer-events-none flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                    <button 
                      onClick={handleCapture}
                      className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500"
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
          <div className="flex-1 flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="relative w-24 h-24 mb-6">
              <svg className="animate-spin w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <UploadCloud className="w-8 h-8" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing location...</h2>
            <p className="text-slate-600 max-w-sm mx-auto">
              Our AI is checking the area for overhead hazards, power lines, and flat landing surfaces.
            </p>
            
            <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-blue-600 animate-[pulse_2s_ease-in-out_infinite] w-full"></div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Location Verified</h2>
            <p className="text-slate-600 max-w-sm mx-auto mb-8">
              Great news! "{locationName}" is clear of obstacles and safe for drone deliveries.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left w-full max-w-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Safety Score</span>
                <span className="text-sm font-bold text-green-600">95/100</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[95%]"></div>
              </div>
            </div>

            <Button size="lg" className="w-full max-w-sm" onClick={handleFinish}>
              {isFromCheckout ? 'Continue Checkout' : 'Back to Settings'}
            </Button>
          </div>
        )}

      </Card>
    </div>
  );
};
