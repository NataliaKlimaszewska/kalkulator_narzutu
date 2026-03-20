/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Percent, Download, Copy, Check } from 'lucide-react';

export default function App() {
  const [price, setPrice] = useState<string>('');
  const [markup, setMarkup] = useState<string>('');
  const [tax, setTax] = useState<string>('12');
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const results = useMemo(() => {
    const p = parseFloat(price);
    const m = parseFloat(markup);
    const t = parseFloat(tax);

    if (isNaN(p) || isNaN(m)) return null;

    const markupAmount = p * (m / 100);
    const finalPrice = p + markupAmount;
    const profitAfterCosts = markupAmount * 0.7; // -30% costs
    const incomeTaxAmount = isNaN(t) ? 0 : profitAfterCosts * (t / 100);
    const finalProfit = profitAfterCosts - incomeTaxAmount;
    
    return {
      markupAmount: markupAmount.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      profitAfterCosts: profitAfterCosts.toFixed(2),
      incomeTaxAmount: incomeTaxAmount.toFixed(2),
      finalProfit: finalProfit.toFixed(2)
    };
  }, [price, markup, tax]);

  const handleCopy = () => {
    if (results) {
      navigator.clipboard.writeText(results.finalPrice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Calculator className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight">Kalkulator Narzutu</h1>
              <p className="text-sm text-slate-500">Oblicz cenę i zysk "na rękę"</p>
            </div>
            {deferredPrompt && (
              <button 
                onClick={handleInstall}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex flex-col items-center gap-1"
                title="Zainstaluj jako aplikację"
              >
                <Download className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Instaluj</span>
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cena podstawowa (brutto)
              </label>
              <div className="relative">
                <input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">PLN</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="markup" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Narzut
                </label>
                <div className="relative">
                  <input
                    id="markup"
                    type="number"
                    placeholder="0"
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tax" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Podatek doch.
                </label>
                <div className="relative">
                  <input
                    id="tax"
                    type="number"
                    placeholder="12"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {results ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-6 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200 relative group">
                  <p className="text-emerald-100 text-sm font-medium mb-1 uppercase tracking-wider">Cena po narzucie</p>
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-bold tracking-tight">
                      {results.finalPrice} <span className="text-xl font-medium opacity-80 text-white">PLN</span>
                    </h2>
                    <button 
                      onClick={handleCopy}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Kopiuj cenę"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Kwota narzutu</p>
                    <p className="text-lg font-semibold text-slate-900">+{results.markupAmount} PLN</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Zysk po kosztach (-30%)</p>
                    <p className="text-lg font-semibold text-slate-900">{results.profitAfterCosts} PLN</p>
                  </div>
                </div>

                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Zysk na rękę (po podatku)</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700">{results.finalProfit} PLN</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-600/60 uppercase font-bold">Podatek</p>
                    <p className="text-sm font-semibold text-emerald-600">-{results.incomeTaxAmount} PLN</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center">
                <Calculator className="w-8 h-8 text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm">Wprowadź dane, aby zobaczyć wynik</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center font-medium mb-2">
           
          </p>
          {!deferredPrompt && (
            <div className="text-[9px] text-slate-300 text-center leading-tight">
              <br/>
          
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
