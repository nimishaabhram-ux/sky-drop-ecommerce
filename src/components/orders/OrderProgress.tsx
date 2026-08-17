import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Order } from '../../types';
import { getOrderProgress, OrderProgressStep } from '../../utils/orderProgress';

interface OrderProgressProps {
  order: Order;
  compact?: boolean;
  showTimestamps?: boolean;
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ── Step Icon ──
const StepIcon: React.FC<{ step: OrderProgressStep; isCancelled?: boolean; isFailed?: boolean }> = ({ step, isCancelled, isFailed }) => {
  if (step.state === 'completed') {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Check className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }
  if (step.state === 'current') {
    if (isCancelled) {
      return (
        <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <X className="w-4 h-4" strokeWidth={3} />
        </div>
      );
    }
    if (isFailed) {
      return (
        <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm ring-4 ring-blue-100">
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </div>
    );
  }
  // upcoming
  return (
    <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center shrink-0">
      <div className="w-2 h-2 bg-gray-300 rounded-full" />
    </div>
  );
};

// ── Vertical Timeline (mobile + detail page) ──
const VerticalProgress: React.FC<{ steps: OrderProgressStep[]; isCancelled: boolean; isFailed: boolean; showTimestamps: boolean }> = ({
  steps, isCancelled, isFailed, showTimestamps
}) => (
  <div className="flex flex-col">
    {steps.map((step, i) => (
      <div key={step.id} className="flex gap-4" aria-current={step.state === 'current' ? 'step' : undefined}>
        <div className="flex flex-col items-center">
          <StepIcon step={step} isCancelled={isCancelled && step.state === 'current'} isFailed={isFailed && step.state === 'current'} />
          {i < steps.length - 1 && (
            <div className={`w-0.5 flex-1 min-h-[28px] my-1 transition-colors duration-200 ${
              step.state === 'completed' ? 'bg-green-400' :
              step.state === 'current' && (isCancelled || isFailed) ? (isCancelled ? 'bg-red-300' : 'bg-amber-300') :
              'bg-gray-200'
            }`} />
          )}
        </div>
        <div className={`pb-5 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
          <p className={`text-sm font-bold leading-7 ${
            step.state === 'completed' ? 'text-gray-900' :
            step.state === 'current' ? (isCancelled ? 'text-red-700' : isFailed ? 'text-amber-700' : 'text-blue-700') :
            'text-gray-400'
          }`}>
            {step.label}
          </p>
          {showTimestamps && step.completedAt && (
            <p className="text-xs text-gray-400 mt-0.5">{formatTime(step.completedAt)}</p>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ── Horizontal Stepper (desktop) ──
const HorizontalProgress: React.FC<{ steps: OrderProgressStep[]; isCancelled: boolean; isFailed: boolean }> = ({
  steps, isCancelled, isFailed
}) => (
  <div className="w-full">
    {/* Dots + Lines */}
    <div className="flex items-center">
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center shrink-0" aria-current={step.state === 'current' ? 'step' : undefined}>
            <StepIcon step={step} isCancelled={isCancelled && step.state === 'current'} isFailed={isFailed && step.state === 'current'} />
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 transition-colors duration-200 ${
              step.state === 'completed' ? 'bg-green-400' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
    {/* Labels */}
    <div className="flex mt-2.5">
      {steps.map((step, i) => (
        <div key={step.id} className={`flex-1 ${i === 0 ? 'text-left' : i === steps.length - 1 ? 'text-right' : 'text-center'}`}>
          <p className={`text-xs font-bold ${
            step.state === 'completed' ? 'text-gray-700' :
            step.state === 'current' ? (isCancelled ? 'text-red-700' : isFailed ? 'text-amber-700' : 'text-blue-700') :
            'text-gray-400'
          }`}>
            {step.label}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ── Main Component ──
export const OrderProgress: React.FC<OrderProgressProps> = ({ order, compact = false, showTimestamps = false }) => {
  const progress = getOrderProgress(order);

  return (
    <div>
      {/* Desktop: horizontal, Mobile: vertical */}
      {compact ? (
        <>
          <div className="hidden md:block">
            <HorizontalProgress steps={progress.steps} isCancelled={progress.isCancelled} isFailed={progress.isFailed} />
          </div>
          <div className="md:hidden">
            <VerticalProgress steps={progress.steps} isCancelled={progress.isCancelled} isFailed={progress.isFailed} showTimestamps={false} />
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:block">
            <HorizontalProgress steps={progress.steps} isCancelled={progress.isCancelled} isFailed={progress.isFailed} />
          </div>
          <div className="md:hidden">
            <VerticalProgress steps={progress.steps} isCancelled={progress.isCancelled} isFailed={progress.isFailed} showTimestamps={showTimestamps} />
          </div>
          {showTimestamps && (
            <div className="hidden md:block mt-1">
              <div className="flex">
                {progress.steps.map((step, i) => (
                  <div key={step.id} className={`flex-1 ${i === 0 ? 'text-left' : i === progress.steps.length - 1 ? 'text-right' : 'text-center'}`}>
                    {step.completedAt && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{formatTime(step.completedAt)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Description */}
      {progress.description && (
        <p className={`mt-3 text-sm font-medium ${
          progress.isCancelled ? 'text-red-600' : progress.isFailed ? 'text-amber-600' : 'text-gray-500'
        }`}>
          {progress.description}
        </p>
      )}
    </div>
  );
};
