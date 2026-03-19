'use client';

import { useState } from 'react';
import { Lock, RefreshCcw, Check, Fingerprint } from 'lucide-react';
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';

    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars === '') {
      setPassword('!Please select an option!');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(result);
  };

  const copyToClipboard = async () => {
    if (password && password !== '!Please select an option!') {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd || pwd === '!Please select an option!') return { strength: 0, label: 'NONE', color: 'bg-zinc-400' };

    let strength = 0;

    if (pwd.length >= 12) strength += 2;
    else if (pwd.length >= 8) strength += 1;

    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;

    if (strength >= 5) return { strength: 100, label: 'VERY STRONG', color: 'bg-emerald-500' };
    if (strength >= 4) return { strength: 75, label: 'STRONG', color: 'bg-blue-500' };
    if (strength >= 3) return { strength: 50, label: 'MEDIUM', color: 'bg-yellow-500' };
    if (strength >= 2) return { strength: 25, label: 'WEAK', color: 'bg-rose-500' };
    return { strength: 0, label: 'VERY WEAK', color: 'bg-rose-700' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      <PageHeader 
        title="Generator" 
        subtitle="SECURE PASSWORDS" 
        icon={<Lock className="w-5 h-5" />} 
        iconClass="bg-blue-600 text-white" 
        shadowClass="shadow-[0_4px_0_0_#2563EB]" 
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <NeoBlock shadowClass="shadow-[12px_12px_0_0_#2563EB]" className="p-6 md:p-10">
          
          {/* Password Output Field */}
          <div className="bg-zinc-100 dark:bg-zinc-800 border-4 border-zinc-900 dark:border-zinc-100 shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.1)] p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
             <input
              type="text"
              value={password}
              readOnly
              className="flex-1 w-full bg-transparent text-xl md:text-3xl font-mono font-black text-zinc-900 dark:text-zinc-50 text-center md:text-left outline-none"
              placeholder="Click GENERATE below..."
            />
            <button
               onClick={copyToClipboard}
              className={`w-full md:w-auto px-6 py-3 border-4 border-zinc-900 dark:border-zinc-100 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#fafafa] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all flex items-center justify-center gap-2 ${
                copied ? 'bg-emerald-500 text-zinc-900' : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800'
               }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Fingerprint className="w-5 h-5" />}
               {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Strength Meter */}
          <div className="mb-10">
            <div className="flex justify-between text-xs md:text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-2">
              <span>Security Level</span>
              <span className={strength.strength >= 75 ? "text-emerald-500" : strength.strength >= 50 ? "text-amber-500" : "text-rose-500"}>
                {strength.label}
              </span>
            </div>
            <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 p-0.5 flex">
               <div
                className={`h-full border-r-2 border-zinc-900 dark:border-zinc-900 transition-all duration-500 ${strength.color}`}
                style={{ width: `${strength.strength}%` }}
              />
            </div>
          </div>

          {/* Settings Grid */}
          <div className="space-y-6 mb-10">
             {/* Length slider */}
            <div className="p-4 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800">
               <label className="flex justify-between items-center text-zinc-900 dark:text-zinc-50 font-black uppercase text-sm md:text-base mb-6">
                Length
                <span className="text-2xl text-blue-600 dark:text-blue-400">{length}</span>
              </label>
              <input
                 type="range"
                min="4"
                 max="64"
                value={length}
                 onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 border-2 border-zinc-900 rounded-none appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />
               <div className="flex justify-between text-xs font-bold text-zinc-500 mt-2">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-4 p-4 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                 <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-6 h-6 border-2 border-zinc-900 appearance-none checked:bg-blue-600 checked:after:content-['✓'] checked:after:text-white checked:after:font-bold checked:after:absolute relative flex items-center justify-center shadow-[2px_2px_0_0_#18181b]"
                />
                <span className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 text-sm">
                   Uppercase (A-Z)
                </span>
               </label>

              <label className="flex items-center gap-4 p-4 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                 <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                   className="w-6 h-6 border-2 border-zinc-900 appearance-none checked:bg-blue-600 checked:after:content-['✓'] checked:after:text-white checked:after:font-bold checked:after:absolute relative flex items-center justify-center shadow-[2px_2px_0_0_#18181b]"
                />
                 <span className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 text-sm">
                  Lowercase (a-z)
                </span>
               </label>

              <label className="flex items-center gap-4 p-4 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                 <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-6 h-6 border-2 border-zinc-900 appearance-none checked:bg-blue-600 checked:after:content-['✓'] checked:after:text-white checked:after:font-bold checked:after:absolute relative flex items-center justify-center shadow-[2px_2px_0_0_#18181b]"
                />
                 <span className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 text-sm">
                  Numbers (0-9)
                 </span>
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                 <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                   className="w-6 h-6 border-2 border-zinc-900 appearance-none checked:bg-blue-600 checked:after:content-['✓'] checked:after:text-white checked:after:font-bold checked:after:absolute relative flex items-center justify-center shadow-[2px_2px_0_0_#18181b]"
                />
                <span className="font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 text-sm">
                   Symbols (!@#$)
                </span>
               </label>
             </div>
          </div>

          <NeoButton onClick={generatePassword} variant="primary" className="w-full text-xl md:text-2xl py-6">
            <RefreshCcw className="w-8 h-8" /> Generate
          </NeoButton>
        </NeoBlock>
      </div>
    </div>
  );
}
