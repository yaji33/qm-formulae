'use client';
import { GrPowerReset } from "react-icons/gr";
import React, { useState } from 'react';

type TabKey = 'binomial' | 'poisson' | 'normal';

export default function Probability() {
  const [activeTab, setActiveTab] = useState<TabKey>('binomial');

  const [n, setN] = useState<string>('');
  const [p, setP] = useState<string>('');
  const [kb, setKB] = useState<string>('');  
  const [kp, setKP] = useState<string>('');
  const [lambda, setLambda] = useState<string>('');
  const [resultBinomial, setResultBinomial] = useState<number | string>(0);
  const [resultPoisson, setResultPoisson] = useState<number | string>(0);

  const binomialCoefficient = (n: string, k: number): number => {
    const nNum = parseInt(n, 10);
    const kNum = k as unknown as number;
    if (kNum > nNum) return 0;
    let numerator = 1;
    let denominator = 1;
    for (let i = 1; i <= kNum; i++) {
      numerator *= nNum - (kNum - i);
      denominator *= i;
    }
    return numerator / denominator;
  };

  const calculateBinomial = () => {
    let successCount = 0;
    let probability = 0;
    const value = parseInt(kb.slice(2), 10);
    const nNum = parseInt(n, 10);
    const pNum = parseFloat(p);

    // Handle input conditions like ">=4"
    if (kb.startsWith('>=')) {
      
      if (value > nNum) {
        setResultBinomial("Error: k cannot be greater than n");
        return;
      }
      // Calculate for all values k >= value
      for (let i = value; i <= nNum; i++) {
        const cNk = binomialCoefficient(n, i);
        probability += cNk * Math.pow(pNum, i) * Math.pow(1 - pNum, nNum - i);
      }
    } else if (kb.startsWith('<=')) {
      const value = parseInt(kb.slice(2), 10);
      if (value > nNum) {
        setResultBinomial("Error: k cannot be greater than n");
        return;
      }
      // Calculate for all values k <= value
      for (let i = 0; i <= value; i++) {
        const cNk = binomialCoefficient(n, i);
        probability += cNk * Math.pow(pNum, i) * Math.pow(1 - pNum, nNum - i);
      }
    } else {
      // Normal case for exact number of successes
      successCount = parseInt(kb, 10);
      if (successCount < 0 || successCount > nNum) {
        setResultBinomial("Error: k must be between 0 and n");
        return;
      }
      const cNk = binomialCoefficient(n, successCount);
      probability = cNk * Math.pow(pNum, successCount) * Math.pow(1 - pNum, nNum - successCount);
    }

    setResultBinomial(probability);
    
  };

  const calculatePoisson = () => {
    const lambdaNum = parseFloat(lambda);
    const kNum = parseInt(kb, 10);
    
    if (lambdaNum < 0 || kNum < 0) {
      setResultBinomial("Error: λ and k must be positive");
    }
    const factorial = (n: number): number => {
      if (n === 0) return 1;
      return n * factorial(n - 1);
    }
    const poissonProbability = (Math.pow(lambdaNum, kNum) * Math.exp(-lambdaNum)) / factorial(kNum);
    setResultPoisson(poissonProbability)
  };

  const tabContent: Record<TabKey, React.JSX.Element> = {
    binomial: (
      <div>
        <h1 className='text-xl font-bold mb-4 text-center'>Binomial Distribution</h1>
        <p>Formula: P(X = k) = (nCk) * p^k * (1-p)^(n-k)</p>
        <p>Where n = number of trials, p = probability of success, k = number of successes</p>
      </div>
    ),
    poisson: (
      <div>
        <h1 className='text-xl font-bold mb-4 text-center'>Poisson Distribution</h1>
        <p>Formula: P(X = k) = (λ^k * e^(-λ)) / k!</p>
        <p>Where λ = average number of occurrences, k = number of occurrences</p>
      </div>
    ),
    normal: (
      <div>
        <h1 className='text-xl font-bold mb-4 text-center'>Normal Distribution</h1>
        <p>Formula: f(x|μ,σ) = (1 / (σ√2π)) * e^(-(x-μ)² / 2σ²)</p>
        <p>Where μ = mean, σ = standard deviation</p>
      </div>
    ),
  };
  const resetInputs = () => {
    setN('');
    setP('');
    setKB('');
    setKP('');
    setLambda('');
    setResultBinomial(0); // Reset result to default value
    setResultPoisson(0);
  };
  

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center space-x-8 mb-4 border-l">
        <button
          className={`p-2  ${activeTab === 'binomial' ? 'text-indigo-500' : 'text-gray-700'}`}
          onClick={() => setActiveTab('binomial')}
        >
          Binomial
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === 'poisson' ? 'text-indigo-500' : 'text-gray-700'}`}
          onClick={() => setActiveTab('poisson')}
        >
          Poisson
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === 'normal' ? 'text-indigo-500' : 'text-gray-700'}`}
          onClick={() => setActiveTab('normal')}
        >
          Normal
        </button>
      </div>

      <div className="flex justify-center items-center text-left mb-4 mt-4">
        {tabContent[activeTab]}
      </div>

      {activeTab === 'binomial' && (
        <div className="flex w-full h-full gap-3 justify-center items-center my-9 text-black">
          <div className="w-1/3 h-full flex flex-col items-center gap-y-5 bg-neutral-950 rounded-lg border border-zinc-600">
            
            <input
              className='w-72 rounded-lg p-2 mt-20'
              type="text"
              placeholder='n'
              value={n}
              onChange={(e) => setN(String(e.target.value))}
            />
            <input
              className='w-72 rounded-lg p-2'
              type="text"
              placeholder='p'
              value={p}
              onChange={(e) => setP(String(e.target.value))}
            />
            <input
              className='w-72 rounded-lg p-2'
              type="text"
              placeholder='k (e.g. >=4 or 5)'
              value={kb}
              onChange={(e) => setKB(e.target.value)}
            />
            
            <button
              className='w-72 bg-indigo-600 p-2 rounded-lg mt-4 text-white'
              onClick={calculateBinomial}
            >
              Calculate
            </button>

            {resultBinomial !== null && (
              <div className='mt-4 text-white text-xl'>
                <p>Binomial Probability: {typeof resultBinomial === "number" ? resultBinomial.toFixed(4) : resultBinomial}</p>
              </div>
            )}
            <button>
              <GrPowerReset className='text-indigo-500 text-2xl' onClick={resetInputs}/>
            </button>
            
          </div>
        </div>
      )}
      {activeTab === 'poisson' && (
        <div className="flex w-full h-full gap-3 justify-center items-center my-9 text-black">
          <div className="w-1/3 h-full flex flex-col items-center gap-y-5 bg-neutral-950 rounded-lg border border-zinc-600">
            <input
              className="w-72 rounded-lg p-2 mt-20"
              type="text"
              placeholder="λ (average occurrences)"
              value={lambda}
              onChange={(e) => setLambda(e.target.value)}
            />
            <input
              className="w-72 rounded-lg p-2"
              type="text"
              placeholder="k (actual occurrences)"
              value={kp}
              onChange={(e) => setKP(e.target.value)}
            />
            <button
              className="w-72 bg-indigo-600 p-2 rounded-lg mt-4 text-white"
              onClick={calculatePoisson}
            >
              Calculate
            </button>

            {resultPoisson !== null && (
              <div className="mt-4 text-white text-xl">
                <p>Poisson Probability: {typeof resultPoisson === "number" ? resultPoisson.toFixed(4) : resultPoisson}</p>
              </div>
            )}
            <button>
              <GrPowerReset className='text-indigo-500 text-2xl' onClick={resetInputs}/>
            </button>
          </div>
        </div>
      )}
      {activeTab === 'normal' && (
        <div className="flex w-full h-full gap-3 justify-center items-center my-9 text-black">
          <div className="w-1/3 h-full flex flex-col items-center gap-y-5 bg-neutral-950 rounded-lg border border-zinc-600">
            <input
              className="w-72 rounded-lg p-2 mt-20"
              type="text"
              placeholder="λ (average occurrences)"
              value={lambda}
              onChange={(e) => setLambda(e.target.value)}
            />
            <input
              className="w-72 rounded-lg p-2"
              type="text"
              placeholder="k (actual occurrences)"
              value={kp}
              onChange={(e) => setKP(e.target.value)}
            />
            <button
              className="w-72 bg-indigo-600 p-2 rounded-lg mt-4 text-white"
              onClick={calculatePoisson}
            >
              Calculate
            </button>

            {resultPoisson !== null && (
              <div className="mt-4 text-white text-xl">
                <p>Poisson Probability: {typeof resultPoisson === "number" ? resultPoisson.toFixed(4) : resultPoisson}</p>
              </div>
            )}
            <button>
              <GrPowerReset className='text-indigo-500 text-2xl' onClick={resetInputs}/>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
