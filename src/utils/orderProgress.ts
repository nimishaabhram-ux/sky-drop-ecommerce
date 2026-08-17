import { Order, OrderStatus } from '../types';

export interface OrderProgressStep {
  id: string;
  label: string;
  state: 'completed' | 'current' | 'upcoming';
  completedAt?: string;
}

export interface OrderProgressModel {
  currentLabel: string;
  description: string;
  steps: OrderProgressStep[];
  isCancelled: boolean;
  isFailed: boolean;
}

// ── Standard Delivery Stages ──
const STANDARD_STAGES: { id: string; label: string; statuses: OrderStatus[] }[] = [
  { id: 'placed',       label: 'Order placed',      statuses: ['ORDER_CREATED', 'PAYMENT_CONFIRMED'] },
  { id: 'confirmed',    label: 'Confirmed',          statuses: ['ORDER_PROCESSING'] },
  { id: 'preparing',    label: 'Preparing',          statuses: ['PACKAGE_PREPARING'] },
  { id: 'out',          label: 'Out for delivery',   statuses: ['DRONE_ASSIGNED', 'DRONE_LOADING', 'DRONE_READY', 'DRONE_LAUNCHING', 'DRONE_FLYING', 'APPROACHING_DESTINATION', 'DELIVERY_IN_PROGRESS'] },
  { id: 'delivered',    label: 'Delivered',           statuses: ['DELIVERED'] },
];

// ── Drone Delivery Stages ──
const DRONE_STAGES: { id: string; label: string; statuses: OrderStatus[] }[] = [
  { id: 'placed',       label: 'Order placed',      statuses: ['ORDER_CREATED', 'PAYMENT_CONFIRMED'] },
  { id: 'preparing',    label: 'Preparing',          statuses: ['ORDER_PROCESSING', 'PACKAGE_PREPARING'] },
  { id: 'assigned',     label: 'Drone assigned',     statuses: ['DRONE_ASSIGNED', 'DRONE_LOADING', 'DRONE_READY', 'DRONE_LAUNCHING'] },
  { id: 'otw',          label: 'On the way',         statuses: ['DRONE_FLYING', 'APPROACHING_DESTINATION', 'DELIVERY_IN_PROGRESS'] },
  { id: 'delivered',    label: 'Delivered',           statuses: ['DELIVERED'] },
];

const TERMINAL_STATUSES: OrderStatus[] = ['DELIVERED', 'CANCELLED', 'DELIVERY_FAILED'];

// ── Customer-facing descriptions ──
function getDescription(order: Order, currentStageId: string): string {
  const isDrone = order.deliveryMethod === 'drone';

  if (order.status === 'CANCELLED') return 'This order was cancelled.';
  if (order.status === 'DELIVERY_FAILED') return 'There was an issue with your delivery. We\'re looking into it.';
  if (order.status === 'DELIVERED') return 'Your order has been delivered.';

  if (isDrone) {
    switch (currentStageId) {
      case 'placed': return 'We\'ve received your order.';
      case 'preparing': return 'Your items are being prepared.';
      case 'assigned': return 'A drone is being prepared for your delivery.';
      case 'otw':
        if (order.status === 'APPROACHING_DESTINATION' || order.status === 'DELIVERY_IN_PROGRESS') {
          return 'Your delivery is approaching. Keep the delivery area clear.';
        }
        return 'Your drone delivery is on the way.';
      default: return '';
    }
  } else {
    switch (currentStageId) {
      case 'placed': return 'We\'ve received your order.';
      case 'confirmed': return 'Your order has been confirmed.';
      case 'preparing': return 'Your items are being packed.';
      case 'out': return 'Your order is out for delivery.';
      default: return '';
    }
  }
}

// ── Main function ──
export function getOrderProgress(order: Order): OrderProgressModel {
  const isDrone = order.deliveryMethod === 'drone';
  const stages = isDrone ? DRONE_STAGES : STANDARD_STAGES;

  const isCancelled = order.status === 'CANCELLED';
  const isFailed = order.status === 'DELIVERY_FAILED';

  // For cancelled / failed orders, build a truncated timeline
  if (isCancelled || isFailed) {
    // Find how far the order got before terminating
    const statusHistory = (order as any).statusHistory as { status: OrderStatus; timestamp: string }[] | undefined;
    const historyStatuses = statusHistory ? statusHistory.map(h => h.status) : [];
    
    const steps: OrderProgressStep[] = [];
    let foundTerminal = false;

    for (const stage of stages) {
      if (foundTerminal) break;
      
      const hasCompleted = stage.statuses.some(s => historyStatuses.includes(s));
      if (hasCompleted) {
        const historyEntry = statusHistory?.find(h => stage.statuses.includes(h.status));
        steps.push({
          id: stage.id,
          label: stage.label,
          state: 'completed',
          completedAt: historyEntry?.timestamp,
        });
      } else {
        foundTerminal = true;
      }
    }

    // Always at least show "Order placed" as completed
    if (steps.length === 0) {
      steps.push({ id: 'placed', label: 'Order placed', state: 'completed', completedAt: order.createdAt });
    }

    // Add terminal step
    steps.push({
      id: isCancelled ? 'cancelled' : 'failed',
      label: isCancelled ? 'Cancelled' : 'Delivery issue',
      state: 'current',
    });

    return {
      currentLabel: isCancelled ? 'Cancelled' : 'Delivery issue',
      description: getDescription(order, ''),
      steps,
      isCancelled,
      isFailed,
    };
  }

  // Normal flow: find which stage is current
  let currentStageIndex = 0;
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].statuses.includes(order.status)) {
      currentStageIndex = i;
      break;
    }
  }

  // Build status history lookup
  const statusHistory = (order as any).statusHistory as { status: OrderStatus; timestamp: string }[] | undefined;

  const steps: OrderProgressStep[] = stages.map((stage, i) => {
    let state: 'completed' | 'current' | 'upcoming';
    if (i < currentStageIndex) state = 'completed';
    else if (i === currentStageIndex) state = order.status === 'DELIVERED' ? 'completed' : 'current';
    else state = 'upcoming';

    // Find timestamp from history
    let completedAt: string | undefined;
    if (state === 'completed' || state === 'current') {
      if (statusHistory) {
        const entry = statusHistory.find(h => stage.statuses.includes(h.status));
        if (entry) completedAt = entry.timestamp;
      }
      // Fallback: use order.createdAt for first step
      if (!completedAt && i === 0) completedAt = order.createdAt;
    }

    return { id: stage.id, label: stage.label, state, completedAt };
  });

  const currentStage = stages[currentStageIndex];

  return {
    currentLabel: currentStage.label,
    description: getDescription(order, currentStage.id),
    steps,
    isCancelled: false,
    isFailed: false,
  };
}

// ── ETA helper ──
export function getEstimatedArrival(order: Order): string {
  if (TERMINAL_STATUSES.includes(order.status)) return '';
  
  const eta = order.estimatedDeliveryMinutes;
  if (!eta) return '';

  if (eta <= 15) return `About ${eta} min away`;
  if (eta <= 60) return `Expected in ${eta} min`;
  if (eta <= 1440) {
    const arrivalTime = new Date(new Date(order.createdAt).getTime() + eta * 60000);
    const timeStr = arrivalTime.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `Arriving today by ${timeStr}`;
  }
  const arrivalDate = new Date(new Date(order.createdAt).getTime() + eta * 60000);
  return `Expected by ${arrivalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}
