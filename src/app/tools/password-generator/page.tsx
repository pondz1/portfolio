'use client';

import { useState } from 'react';

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
      setPassword('Please select at least one option');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(result);
  };

  const copyToClipboard = async () => {
    if (password && password !== 'Please select at least one option') {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd || pwd === 'Please select at least one option') return { strength: 0, label: 'None', color: 'bg-gray-400' };

    let strength = 0;

    if (pwd.length >= 12) strength += 2;
    else if (pwd.length >= 8) strength += 1;

    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;

    if (strength >= 5) return { strength: 100, label: 'Very Strong', color: 'bg-green-500' };
    if (strength >= 4) return { strength: 75, label: 'Strong', color: 'bg-green-400' };
    if (strength >= 3) return { strength: 50, label: 'Medium', color: 'bg-yellow-400' };
    if (strength >= 2) return { strength: 25, label: 'Weak', color: 'bg-orange-400' };
    return { strength: 0, label: 'Very Weak', color: 'bg-red-400' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🔐 Password Generator</h1>
            <p className="text-blue-200">Generate strong, secure passwords instantly</p>
          </div>

          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={password}
                readOnly
                className="flex-1 bg-transparent text-2xl text-white font-mono outline-none"
                placeholder="Click generate to create a password"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-200 mb-1">
                <span>Strength: {strength.label}</span>
                <span>{strength.strength}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${strength.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${strength.strength}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-sm text-blue-300 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-white group-hover:text-blue-200 transition-colors">
                  Include Uppercase (A-Z)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-white group-hover:text-blue-200 transition-colors">
                  Include Lowercase (a-z)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-white group-hover:text-blue-200 transition-colors">
                  Include Numbers (0-9)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-white group-hover:text-blue-200 transition-colors">
                  Include Symbols (!@#$%^&*)
                </span>
              </label>
            </div>

            <button
              onClick={generatePassword}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg text-xl"
            >
              Generate Password 🚀
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <div className="text-blue-200 text-sm">
              <div className="font-semibold mb-2">💡 Security Tips:</div>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use passwords with 16+ characters for maximum security</li>
                <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                <li>Use unique passwords for each account</li>
                <li>Consider a password manager for storing them securely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
