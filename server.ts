import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// High body limits for compressed multi-image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory storage for live demo backend state
let users = [
  {
    id: 'user-001',
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: 'Flat 4B, Green View Apartments, Kakkanad, Kochi, Kerala',
    preferredUnits: 'metric',
    notificationsEnabled: true,
    flightAlertsEnabled: true,
  }
];

let locations = [
  {
    id: 'loc-001',
    userId: 'user-001',
    name: 'Home Backyard Lawn Zone',
    type: 'home',
    latitude: 37.7749,
    longitude: -122.4194,
    gpsAccuracy: 1.4,
    altitude: 48,
    address: '12 Greenfield Lane, Kakkanad, Kochi, Kerala',
    status: 'verified',
    isDefault: true,
    clearanceScore: 98,
    imagesCount: 8,
    groundSurface: 'grass',
    overheadHazards: [],
    lastScannedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    panoramaThumbnail: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    notes: 'Green lawn area 10m away from patio awning. Perfect GPS line-of-sight.',
  },
  {
    id: 'loc-002',
    userId: 'user-001',
    name: 'Tech Hub Rooftop Deck #B',
    type: 'work',
    latitude: 37.7833,
    longitude: -122.4167,
    gpsAccuracy: 2.1,
    altitude: 92,
    address: 'Rooftop B, SmartCity Tech Hub, Kakkanad, Kochi',
    status: 'verified',
    isDefault: false,
    clearanceScore: 94,
    imagesCount: 8,
    groundSurface: 'pavers',
    overheadHazards: ['North perimeter rail (0.9m)'],
    lastScannedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    panoramaThumbnail: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=600&auto=format&fit=crop&q=80',
    notes: 'Designated Drone Delivery Helipad marked with Yellow H.',
  },
];

let locationImagesStore: Record<string, any[]> = {};

let addresses: any[] = [];
let reviews: any[] = [];

let orders: any[] = [
  {
    id: 'ORD-84920',
    userId: 'user-001',
    items: [
      {
        product: {
          id: 'prod-01',
          name: 'Rapid Emergency First-Aid Kit',
          price: 899,
          imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80',
          weightGrams: 580,
        },
        quantity: 1,
      },
      {
        product: {
          id: 'prod-02',
          name: 'Artisan Espresso & Warm Croissant Set',
          price: 349,
          imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500&auto=format&fit=crop&q=80',
          weightGrams: 360,
        },
        quantity: 1,
      },
    ],
    deliveryMethod: 'drone',
    deliveryLocationId: 'loc-001',
    deliveryLocation: locations[0],
    totalWeightGrams: 940,
    subtotal: 1248,
    deliveryFee: 0.0,
    dronePriorityFee: 99,
    tax: 224,
    totalAmount: 1571,
    status: 'DRONE_FLYING',
    estimatedDeliveryMinutes: 4,
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    trackingNumber: 'SKY-FLX-9938',
    droneId: 'FALCON-X9',
    deliveryNotes: 'Autonomous precision tether descent to backyard grass landing zone.',
    paymentMethod: 'UPI',
  },
];

// Flight Simulation Coordinate calculation
function getFlightWaypoints(destLat: number, destLng: number) {
  // Warehouse hub ~2.8km away
  const startLat = destLat + 0.018;
  const startLng = destLng - 0.024;
  return {
    start: { lat: startLat, lng: startLng },
    destination: { lat: destLat, lng: destLng },
  };
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Auth
app.get('/api/auth/me', (req, res) => {
  res.json({ user: users[0] });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  let user = users.find((u) => u.email === email) || users[0];
  res.json({ success: true, user, token: 'mock-jwt-skydrop-token' });
});

// Delivery Locations
app.get('/api/delivery-locations', (req, res) => {
  res.json({ locations });
});

app.get('/api/delivery-locations/:id', (req, res) => {
  const loc = locations.find((l) => l.id === req.params.id);
  if (!loc) return res.status(404).json({ error: 'Location not found' });
  const images = locationImagesStore[req.params.id] || [];
  res.json({ location: loc, images });
});

app.post('/api/delivery-locations', (req, res) => {
  const newLoc = {
    id: `loc-${Date.now()}`,
    userId: 'user-001',
    status: req.body.status || 'verified',
    isDefault: locations.length === 0,
    clearanceScore: req.body.clearanceScore || 96,
    imagesCount: req.body.imagesCount || 0,
    groundSurface: req.body.groundSurface || 'grass',
    overheadHazards: req.body.overheadHazards || [],
    lastScannedAt: new Date().toISOString(),
    ...req.body,
  };
  locations.unshift(newLoc);
  res.json({ success: true, location: newLoc });
});

app.put('/api/delivery-locations/:id', (req, res) => {
  const idx = locations.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Location not found' });
  locations[idx] = { ...locations[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, location: locations[idx] });
});

app.delete('/api/delivery-locations/:id', (req, res) => {
  locations = locations.filter((l) => l.id !== req.params.id);
  res.json({ success: true });
});

app.post('/api/delivery-locations/:id/set-default', (req, res) => {
  locations = locations.map((l) => ({
    ...l,
    isDefault: l.id === req.params.id,
  }));
  res.json({ success: true, locations });
});

// Upload Location Images (batch or single)
app.post('/api/delivery-locations/:id/images', (req, res) => {
  const { images } = req.body; // array of image objects
  const locationId = req.params.id;
  if (!locationImagesStore[locationId]) {
    locationImagesStore[locationId] = [];
  }
  if (Array.isArray(images)) {
    locationImagesStore[locationId].push(...images);
  } else if (images) {
    locationImagesStore[locationId].push(images);
  }

  // Update count
  const loc = locations.find((l) => l.id === locationId);
  if (loc) {
    loc.imagesCount = locationImagesStore[locationId].length;
  }

  res.json({
    success: true,
    totalImages: locationImagesStore[locationId].length,
    message: 'Images captured and geospatial telemetry verified',
  });
});

// Photogrammetry Processing Simulation
app.post('/api/delivery-locations/:id/process', (req, res) => {
  const locationId = req.params.id;
  const loc = locations.find((l) => l.id === locationId);
  if (!loc) return res.status(404).json({ error: 'Location not found' });

  // Simulate computer vision analysis
  const photogrammetryResult = {
    locationId,
    pointCloudDensity: 1420, // pts/m2
    safetyScore: 97,
    landingZoneRadiusMeters: 3.2,
    slopeDeg: 0.8,
    clearanceStatus: 'PASS',
    obstacles: [
      {
        id: 'obs-1',
        label: 'Patio Awning',
        hazardLevel: 'caution',
        distanceMeters: 6.4,
        directionDeg: 45,
        elevationMeters: 2.8,
      },
      {
        id: 'obs-2',
        label: 'Garden Shrub',
        hazardLevel: 'safe',
        distanceMeters: 4.1,
        directionDeg: 190,
        elevationMeters: 0.7,
      },
    ],
    processedAt: new Date().toISOString(),
    stitchedPanoramaUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1600&auto=format&fit=crop&q=80',
  };

  loc.status = 'verified';
  loc.clearanceScore = photogrammetryResult.safetyScore;
  loc.lastScannedAt = photogrammetryResult.processedAt;

  res.json({ success: true, result: photogrammetryResult });
});

// Standard Delivery Addresses
app.get('/api/delivery-addresses', (req, res) => {
  res.json({ addresses });
});

app.get('/api/delivery-addresses/:id', (req, res) => {
  const address = addresses.find((a) => a.id === req.params.id);
  if (!address) return res.status(404).json({ error: 'Address not found' });
  res.json({ address });
});

app.post('/api/delivery-addresses', (req, res) => {
  const newAddress = {
    id: `addr-${Date.now()}`,
    userId: 'user-001',
    isDefault: addresses.length === 0,
    country: 'India',
    ...req.body,
  };
  
  if (newAddress.isDefault) {
    addresses.forEach(a => a.isDefault = false);
  }
  
  addresses.push(newAddress);
  res.json({ success: true, address: newAddress });
});

app.put('/api/delivery-addresses/:id', (req, res) => {
  const idx = addresses.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Address not found' });
  
  const updatedAddress = { ...addresses[idx], ...req.body };
  if (req.body.isDefault) {
    addresses.forEach(a => a.isDefault = false);
    updatedAddress.isDefault = true;
  }
  
  addresses[idx] = updatedAddress;
  res.json({ success: true, address: updatedAddress });
});

app.delete('/api/delivery-addresses/:id', (req, res) => {
  const idx = addresses.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Address not found' });
  
  const wasDefault = addresses[idx].isDefault;
  addresses = addresses.filter((a) => a.id !== req.params.id);
  
  if (wasDefault && addresses.length > 0) {
    addresses[0].isDefault = true;
  }
  
  res.json({ success: true });
});

app.post('/api/delivery-addresses/:id/set-default', (req, res) => {
  addresses = addresses.map((a) => ({
    ...a,
    isDefault: a.id === req.params.id,
  }));
  res.json({ success: true, addresses });
});

// Product Reviews
app.get('/api/products/:productId/reviews', (req, res) => {
  const productReviews = reviews.filter(r => r.productId === req.params.productId);
  res.json({ reviews: productReviews });
});

app.post('/api/products/:productId/reviews', (req, res) => {
  const newReview = {
    id: `rev-${Date.now()}`,
    productId: req.params.productId,
    userId: 'user-001',
    userName: req.body.userName || users[0].name,
    userAvatarUrl: req.body.userAvatarUrl || users[0].avatarUrl,
    rating: req.body.rating,
    description: req.body.description,
    images: req.body.images || [],
    createdAt: new Date().toISOString(),
    verifiedPurchase: req.body.verifiedPurchase || false,
  };
  reviews.unshift(newReview);
  res.json({ success: true, review: newReview });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

app.post('/api/orders', (req, res) => {
  const { items, deliveryMethod, deliveryLocationId, deliveryAddressId, totalAmount, totalWeightGrams, paymentMethod, subtotal } = req.body;
  const targetDroneLocation = locations.find((l) => l.id === deliveryLocationId);
  const targetStandardAddress = addresses.find((a) => a.id === deliveryAddressId);

  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: 'user-001',
    items,
    deliveryMethod: deliveryMethod || 'drone',
    deliveryLocationId: targetDroneLocation?.id,
    deliveryLocation: targetDroneLocation,
    deliveryAddressId: targetStandardAddress?.id,
    deliveryAddress: targetStandardAddress,
    totalWeightGrams: totalWeightGrams || 750,
    subtotal: subtotal || 0,
    deliveryFee: deliveryMethod === 'standard' ? 49 : 0,
    dronePriorityFee: deliveryMethod === 'drone' ? 99 : 0,
    tax: Math.round((subtotal || 0) * 0.18),
    totalAmount: totalAmount || 0,
    status: 'ORDER_PROCESSING',
    estimatedDeliveryMinutes: deliveryMethod === 'drone' ? 8 : 1440,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingNumber: `SKY-FLX-${Math.floor(1000 + Math.random() * 9000)}`,
    droneId: deliveryMethod === 'drone' ? 'FALCON-X9' : undefined,
    deliveryNotes: req.body.deliveryNotes || '',
    paymentMethod: paymentMethod || 'UPI',
  };

  orders.unshift(newOrder);
  res.json({ success: true, order: newOrder });
});

// Telemetry State & SSE Stream
app.get('/api/orders/:id/tracking', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const loc = order.deliveryLocation || locations[0];
  const waypoints = getFlightWaypoints(loc.latitude, loc.longitude);

  res.json({
    order,
    telemetry: {
      orderId: order.id,
      droneId: order.droneId || 'FALCON-X9',
      droneModel: 'SkyDrop Aero-Hexa V4 Pro',
      latitude: loc.latitude + 0.006,
      longitude: loc.longitude - 0.008,
      altitude: 114,
      speedKmh: 36.2,
      batteryPercent: 82,
      headingDeg: 142,
      windSpeedKmh: 8.9,
      windDirection: 'NW',
      signalQuality: 98,
      etaSeconds: 210,
      distanceRemainingKm: 1.4,
      status: order.status,
      currentWaypointIndex: 3,
      totalWaypoints: 6,
      winchAltitudeMeters: order.status === 'DELIVERY_IN_PROGRESS' ? 4.2 : undefined,
      timestamp: new Date().toISOString(),
    },
    waypoints,
  });
});

// Server-Sent Events (SSE) for Real-Time Drone Telemetry
app.get('/api/drone-telemetry/:orderId/stream', (req, res) => {
  const orderId = req.params.orderId;
  const order = orders.find((o) => o.id === orderId) || orders[0];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let elapsedTicks = 0;
  const loc = order.deliveryLocation || locations[0];
  const { start, destination } = getFlightWaypoints(loc.latitude, loc.longitude);

  const interval = setInterval(() => {
    elapsedTicks++;

    // Calculate progression along path from 0.0 to 1.0
    const progress = Math.min(1.0, (elapsedTicks % 120) / 120);

    let currentStatus = order.status;
    if (progress < 0.1) currentStatus = 'DRONE_LAUNCHING';
    else if (progress < 0.8) currentStatus = 'DRONE_FLYING';
    else if (progress < 0.95) currentStatus = 'APPROACHING_DESTINATION';
    else if (progress < 0.99) currentStatus = 'DELIVERY_IN_PROGRESS';
    else currentStatus = 'DELIVERED';

    const currentLat = start.lat + (destination.lat - start.lat) * progress;
    const currentLng = start.lng + (destination.lng - start.lng) * progress;

    const telemetryData = {
      orderId,
      droneId: order.droneId || 'FALCON-X9',
      droneModel: 'SkyDrop Aero-Hexa V4 Pro',
      latitude: currentLat,
      longitude: currentLng,
      altitude: currentStatus === 'DELIVERY_IN_PROGRESS' ? 5 : currentStatus === 'DELIVERED' ? 0 : 120 - progress * 20,
      speedKmh: currentStatus === 'DELIVERY_IN_PROGRESS' ? 1.5 : currentStatus === 'DELIVERED' ? 0 : 38.5 - Math.sin(progress * 5) * 4,
      batteryPercent: Math.max(20, Math.round(88 - progress * 15)),
      headingDeg: Math.round((Math.atan2(destination.lng - start.lng, destination.lat - start.lat) * 180) / Math.PI),
      windSpeedKmh: 9.1 + (Math.sin(elapsedTicks) * 1.5),
      windDirection: 'NW (315°)',
      signalQuality: 96 + Math.round(Math.random() * 4),
      etaSeconds: Math.max(0, Math.round((1 - progress) * 240)),
      distanceRemainingKm: Math.max(0, +(2.8 * (1 - progress)).toFixed(2)),
      status: currentStatus,
      progressFraction: progress,
      timestamp: new Date().toISOString(),
    };

    res.write(`data: ${JSON.stringify(telemetryData)}\n\n`);

    if (currentStatus === 'DELIVERED' && elapsedTicks > 130) {
      // Keep sending heartbeat
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Start Express Server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkyDrop Flight Logistics Server running on port ${PORT}`);
  });
}

startServer();
