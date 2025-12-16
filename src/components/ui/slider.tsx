'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
  trackColor?: 'green' | 'blue' | 'amber';
}

export function Slider({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  unit = '',
  showValue = true,
  className,
  trackColor = 'green',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const trackColors = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
  };

  const thumbColors = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    amber: 'border-amber-600',
  };

  const textColors = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
          )}
          {showValue && (
            <span className={cn('text-lg font-bold', textColors[trackColor])}>
              {value}
              {unit}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sr-only"
          id={label}
        />

        <div
          className="relative h-3 rounded-full bg-gray-200 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newPercentage = x / rect.width;
            const newValue = Math.round(
              (newPercentage * (max - min) + min) / step
            ) * step;
            onChange(Math.min(Math.max(newValue, min), max));
          }}
        >
          {/* Filled track */}
          <div
            className={cn(
              'absolute h-full rounded-full bg-gradient-to-r',
              trackColors[trackColor]
            )}
            style={{ width: `${percentage}%` }}
          />

          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-3 cursor-grab active:cursor-grabbing transition-transform hover:scale-110',
              thumbColors[trackColor]
            )}
            style={{ left: `${percentage}%`, borderWidth: '3px' }}
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {min}
            {unit}
          </span>
          <span className="text-xs text-gray-500">
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// Dual range slider for ranges
export interface DualSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
  label?: string;
  unit?: string;
  className?: string;
}

export function DualSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
  label,
  unit = '',
  className,
}: DualSliderProps) {
  const percentageMin = ((valueMin - min) / (max - min)) * 100;
  const percentageMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm font-semibold text-green-700">
            {valueMin}
            {unit} - {valueMax}
            {unit}
          </span>
        </div>
      )}

      <div className="relative h-3">
        <div className="absolute w-full h-full rounded-full bg-gray-200" />
        
        {/* Selected range */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
          style={{
            left: `${percentageMin}%`,
            width: `${percentageMax - percentageMin}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          step={step}
          onChange={(e) => {
            const newMin = Number(e.target.value);
            if (newMin < valueMax) {
              onChange(newMin, valueMax);
            }
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          step={step}
          onChange={(e) => {
            const newMax = Number(e.target.value);
            if (newMax > valueMin) {
              onChange(valueMin, newMax);
            }
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />

        {/* Visual thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 border-green-600 pointer-events-none"
          style={{ left: `${percentageMin}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 border-green-600 pointer-events-none"
          style={{ left: `${percentageMax}%` }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between">
        <span className="text-xs text-gray-500">
          {min}
          {unit}
        </span>
        <span className="text-xs text-gray-500">
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
