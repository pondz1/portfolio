'use client';

import { useState, useMemo } from 'react';
import { ArrowRightLeft, Calculator, Copy, Check, RotateCcw } from 'lucide-react';
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

type ConversionCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'time';

interface ConversionUnit {
  name: string;
  symbol: string;
  factor: number; // Base multiplier
}

const CATEGORIES: Record<ConversionCategory, { name: string; units: ConversionUnit[] }> = {
  length: {
    name: 'Length',
    units: [
      { name: 'Meter', symbol: 'm', factor: 1 },
      { name: 'Kilometer', symbol: 'km', factor: 1000 },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { name: 'Inch', symbol: 'in', factor: 0.0254 },
    ],
  },
  weight: {
    name: 'Weight',
    units: [
      { name: 'Kilogram', symbol: 'kg', factor: 1 },
      { name: 'Gram', symbol: 'g', factor: 0.001 },
      { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
      { name: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { name: 'Ounce', symbol: 'oz', factor: 0.02834952 },
      { name: 'Ton', symbol: 't', factor: 1000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    units: [
      { name: 'Celsius', symbol: '°C', factor: 1 },
      { name: 'Fahrenheit', symbol: '°F', factor: 1 },
      { name: 'Kelvin', symbol: 'K', factor: 1 },
    ],
  },
  volume: {
    name: 'Volume',
    units: [
      { name: 'Liter', symbol: 'L', factor: 1 },
      { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      { name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
      { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
    ],
  },
  area: {
    name: 'Area',
    units: [
      { name: 'Square Meter', symbol: 'm²', factor: 1 },
      { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      { name: 'Acre', symbol: 'ac', factor: 4046.86 },
      { name: 'Hectare', symbol: 'ha', factor: 10000 },
    ],
  },
  time: {
    name: 'Time',
    units: [
      { name: 'Second', symbol: 's', factor: 1 },
      { name: 'Minute', symbol: 'min', factor: 60 },
      { name: 'Hour', symbol: 'h', factor: 3600 },
      { name: 'Day', symbol: 'd', factor: 86400 },
      { name: 'Week', symbol: 'wk', factor: 604800 },
      { name: 'Month', symbol: 'mo', factor: 2629746 },
      { name: 'Year', symbol: 'yr', factor: 31556952 },
    ],
  },
};

const ConvertIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M7 10h14l-4-4"/>
    <path d="M17 14H3l4 4"/>
  </svg>
);

export default function UnitConverter() {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [fromValue, setFromValue] = useState('1');
  const [copied, setCopied] = useState(false);

  const currentCategory = CATEGORIES[category];
  const units = currentCategory.units;

  const toValue = useMemo(() => {
    const val = parseFloat(fromValue);
    if (isNaN(val)) return '';

    // Temperature needs special handling
    if (category === 'temperature') {
      let celsius: number;
      
      // Convert from source to Celsius
      switch (fromUnit) {
        case '°C':
          celsius = val;
          break;
        case '°F':
          celsius = (val - 32) * (5 / 9);
          break;
        case 'K':
          celsius = val - 273.15;
          break;
        default:
          celsius = val;
      }

      // Convert from Celsius to target
      switch (toUnit) {
        case '°C':
          return celsius.toString();
        case '°F':
          return (celsius * 9 / 5 + 32).toString();
        case 'K':
          return (celsius + 273.15).toString();
        default:
          return celsius.toString();
      }
    }

    // Standard unit conversion
    const fromFactor = units.find(u => u.symbol === fromUnit)?.factor || 1;
    const toFactor = units.find(u => u.symbol === toUnit)?.factor || 1;
    const baseValue = val * fromFactor;
    const result = baseValue / toFactor;

    // Format the result
    if (result === 0) return '0';
    if (Math.abs(result) < 0.000001 || Math.abs(result) > 999999999) {
      return result.toExponential(6);
    }
    return result.toString();
  }, [fromValue, fromUnit, toUnit, category, units]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setFromValue('1');
  };

  const handleCategoryChange = (newCategory: ConversionCategory) => {
    setCategory(newCategory);
    const newUnits = CATEGORIES[newCategory].units;
    setFromUnit(newUnits[0].symbol);
    setToUnit(newUnits[newUnits.length - 1].symbol);
    setFromValue('1');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      <PageHeader 
        title="Unit Converter" 
        subtitle="CONVERT BETWEEN DIFFERENT UNITS" 
        icon={<ConvertIcon className="w-5 h-5" />} 
        iconClass="bg-blue-600 text-white" 
        shadowClass="shadow-[0_4px_0_0_#2563eb]" 
      />

      <div className="container mx-auto px-4 mt-8 md:mt-12 max-w-4xl">
        
        {/* Category Selector */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#2563eb]" className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {(Object.keys(CATEGORIES) as ConversionCategory[]).map((cat) => (
              <NeoButton
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                variant={category === cat ? 'primary' : 'secondary'}
                className="px-4 py-2 font-bold"
              >
                {CATEGORIES[cat].name}
              </NeoButton>
            ))}
          </div>
        </NeoBlock>

        {/* Converter */}
        <NeoBlock shadowClass="shadow-[12px_12px_0_0_#2563eb]">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            
            {/* From Unit */}
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                From
              </label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 p-4 text-2xl font-black text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-0 transition-all"
                placeholder="Enter value"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 p-4 font-bold text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-0 cursor-pointer"
              >
                {units.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <NeoButton
                onClick={handleSwap}
                variant="secondary"
                className="w-16 h-16 p-0 rounded-none flex items-center justify-center"
              >
                <ArrowRightLeft className="w-8 h-8" />
              </NeoButton>
            </div>

            {/* To Unit */}
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                To
              </label>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border-4 border-emerald-600 p-4 min-h-[64px] flex items-center">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 break-all">
                  {toValue || '—'}
                </span>
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 p-4 font-bold text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-0 cursor-pointer"
              >
                {units.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <NeoButton onClick={handleCopy} variant="success" className="flex-1">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </NeoButton>
            <NeoButton onClick={handleReset} variant="secondary" className="flex-1">
              <RotateCcw className="w-5 h-5" /> Reset
            </NeoButton>
          </div>
        </NeoBlock>

        {/* Formula Explanation */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="mt-8">
          <h2 className="flex items-center gap-2 text-2xl font-black uppercase mb-4 dark:text-white">
            <Calculator className="w-6 h-6 text-blue-600" /> Formula
          </h2>
          <div className="font-mono font-bold text-zinc-700 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 p-4 border-2 border-zinc-900 dark:border-zinc-100">
            {category === 'temperature' ? (
              <div className="space-y-2">
                <div>Celsius → Fahrenheit: (°C × 9/5) + 32</div>
                <div>Fahrenheit → Celsius: (°F - 32) × 5/9</div>
                <div>Celsius → Kelvin: °C + 273.15</div>
              </div>
            ) : (
              <div>
                {parseFloat(fromValue) || 0} {fromUnit} × {(units.find(u => u.symbol === fromUnit)?.factor || 1) / (units.find(u => u.symbol === toUnit)?.factor || 1)} = {toValue || 0} {toUnit}
              </div>
            )}
          </div>
        </NeoBlock>

        {/* Available Units */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="mt-8">
          <h2 className="text-xl font-black uppercase mb-4 dark:text-white">
            Available {currentCategory.name} Units
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {units.map((unit) => (
              <div
                key={unit.symbol}
                className={`p-3 border-2 font-bold text-center transition-all ${
                  (fromUnit === unit.symbol || toUnit === unit.symbol)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                }`}
              >
                <div className="text-lg">{unit.symbol}</div>
                <div className="text-xs uppercase tracking-wider opacity-75">{unit.name}</div>
              </div>
            ))}
          </div>
        </NeoBlock>

      </div>
    </div>
  );
}
