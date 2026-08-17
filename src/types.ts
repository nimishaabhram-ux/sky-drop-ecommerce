export type OrderStatus =
  | 'ORDER_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'ORDER_PROCESSING'
  | 'PACKAGE_PREPARING'
  | 'DRONE_ASSIGNED'
  | 'DRONE_LOADING'
  | 'DRONE_READY'
  | 'DRONE_LAUNCHING'
  | 'DRONE_FLYING'
  | 'APPROACHING_DESTINATION'
  | 'DELIVERY_IN_PROGRESS'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RETURNING'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: string;
  preferredUnits: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  flightAlertsEnabled: boolean;
}

export interface DeliveryLocation {
  id: string;
  userId: string;
  name: string;
  type: 'home' | 'work' | 'outdoor' | 'custom';
  latitude: number;
  longitude: number;
  gpsAccuracy: number; // in meters
  altitude?: number; // in meters
  status: 'verified' | 'pending_verification' | 'action_required';
  isDefault: boolean;
  clearanceScore: number; // 0 - 100
  imagesCount: number;
  groundSurface: 'grass' | 'concrete' | 'pavers' | 'wood_deck' | 'rooftop';
  overheadHazards: string[];
  lastScannedAt: string;
  panoramaThumbnail?: string;
  notes?: string;
}

export interface LocationImage {
  id: string;
  deliveryLocationId: string;
  dataUrl: string;
  sequence: number;
  directionName: string; // e.g. "North (0°)", "North-East (45°)", etc.
  heading: number; // 0 - 360 degrees
  pitch: number; // -90 to +90 degrees
  latitude: number;
  longitude: number;
  accuracy: number;
  capturedAt: string;
  fileSizeKb: number;
}

export interface ObstacleDetection {
  id: string;
  label: string;
  hazardLevel: 'safe' | 'caution' | 'warning';
  distanceMeters: number;
  directionDeg: number;
  elevationMeters: number;
}

export interface PhotogrammetryResult {
  locationId: string;
  pointCloudDensity: number; // points/sqm
  safetyScore: number; // 0 - 100
  landingZoneRadiusMeters: number;
  slopeDeg: number;
  clearanceStatus: 'PASS' | 'MARGINAL' | 'FAIL';
  obstacles: ObstacleDetection[];
  processedAt: string;
  stitchedPanoramaUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'medical' | 'food' | 'tech' | 'bakery' | 'essentials';
  price: number;
  originalPrice?: number;
  description: string;
  weightGrams: number;
  dimensionsCm: { width: number; height: number; depth: number };
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  prepTimeMinutes: number;
  isDroneOptimized: boolean;
  inStock: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DroneTelemetry {
  orderId: string;
  droneId: string;
  droneModel: string;
  latitude: number;
  longitude: number;
  altitude: number; // meters AGL
  speedKmh: number;
  batteryPercent: number;
  headingDeg: number;
  windSpeedKmh: number;
  windDirection: string;
  signalQuality: number; // 0-100%
  etaSeconds: number;
  distanceRemainingKm: number;
  status: OrderStatus;
  currentWaypointIndex: number;
  totalWaypoints: number;
  winchAltitudeMeters?: number;
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  deliveryMethod: 'drone' | 'standard';
  deliveryLocationId?: string;
  deliveryLocation?: DeliveryLocation;
  totalWeightGrams: number;
  subtotal: number;
  deliveryFee: number;
  dronePriorityFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string;
  droneId?: string;
  deliveryNotes?: string;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay';
}

export interface FlightWeather {
  condition: 'clear' | 'partly_cloudy' | 'windy' | 'rain';
  temperatureC: number;
  windSpeedKmh: number;
  windGustKmh: number;
  windDirection: string;
  visibilityKm: number;
  airspaceStatus: 'OPEN_CLASS_G' | 'CAUTION' | 'RESTRICTED';
  droneFlyabilityScore: number; // 0 - 100
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'flight' | 'weather' | 'system';
  read: boolean;
  orderId?: string;
}
