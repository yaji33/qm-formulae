"use client";
import { GrPowerReset } from "react-icons/gr";
import React, { useState } from "react";

type TabKey = "binomial" | "poisson" | "normal" | "students";

export default function Probability() {
  const [activeTab, setActiveTab] = useState<TabKey>("binomial");

  const [n, setN] = useState<string>("");
  const [p, setP] = useState<string>("");
  const [kb, setKB] = useState<string>("");
  const [kp, setKP] = useState<string>("");
  const [lambda, setLambda] = useState<string>("");
  const [mean, setMean] = useState<string>("");
  const [stdDev, setStdDev] = useState<string>("");
  const [xValue, setXValue] = useState<string>("");
  const [resultBinomial, setResultBinomial] = useState<number | string>(0);
  const [resultPoisson, setResultPoisson] = useState<number | string>(0);
  const [resultNormal, setResultNormal] = useState<number | string>(0);

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
    if (kb.startsWith(">=")) {
      if (value > nNum) {
        setResultBinomial("Error: k cannot be greater than n");
        return;
      }
      // Calculate for all values k >= value
      for (let i = value; i <= nNum; i++) {
        const cNk = binomialCoefficient(n, i);
        probability += cNk * Math.pow(pNum, i) * Math.pow(1 - pNum, nNum - i);
      }
    } else if (kb.startsWith("<=")) {
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
      probability =
        cNk *
        Math.pow(pNum, successCount) *
        Math.pow(1 - pNum, nNum - successCount);
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
    };
    const poissonProbability =
      (Math.pow(lambdaNum, kNum) * Math.exp(-lambdaNum)) / factorial(kNum);
    setResultPoisson(poissonProbability);
  };
  const calculateNormal = () => {
    const meanNum = parseFloat(mean);
    const stdDevNum = parseFloat(stdDev);
    const xNum = parseFloat(xValue);

    if (stdDevNum <= 0) {
      setResultNormal("Error: Standard deviation must be greater than 0");
      return;
    }

    const exponent =
      -Math.pow(xNum - meanNum, 2) / (2 * Math.pow(stdDevNum, 2));
    const normalProbability =
      (1 / (stdDevNum * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    setResultNormal(normalProbability);
  };

  const tabContent: Record<TabKey, React.JSX.Element> = {
    binomial: (
      <div>
        <h1 className="text-xl font-bold mb-4 text-center">
          Binomial Distribution
        </h1>
        <p>Formula: P(X = k) = (nCk) * p^k * (1-p)^(n-k)</p>
        <p>
          Where n = number of trials, p = probability of success, k = number of
          successes
        </p>
      </div>
    ),
    poisson: (
      <div>
        <h1 className="text-xl font-bold mb-4 text-center">
          Poisson Distribution
        </h1>
        <p>Formula: P(X = k) = (λ^k * e^(-λ)) / k!</p>
        <p>
          Where λ = average number of occurrences, k = number of occurrences
        </p>
      </div>
    ),
    normal: (
      <div>
        <h1 className="text-xl font-bold mb-4 text-center">
          Normal Distribution
        </h1>
        <p>Formula: f(x|μ,σ) = (1 / (σ√2π)) * e^(-(x-μ)² / 2σ²)</p>
        <p>Where μ = mean, σ = standard deviation</p>
      </div>
    ),
    students: (
      <div>
        <h1 className="text-xl font-bold mb-4 text-center">
          Student's t Distribution
        </h1>
        <p>
          Formula: f(t) = (Γ((ν + 1) / 2) / (√(νπ) * Γ(ν / 2))) * (1 + (t² /
          ν))^(-(ν + 1) / 2)
        </p>
        <p>
          Where ν = degrees of freedom, Γ = Gamma function, t = test statistic
        </p>
      </div>
    ),
  };
  const resetInputs = () => {
    setN("");
    setP("");
    setKB("");
    setKP("");
    setLambda("");
    setMean("");
    setStdDev("");
    setXValue("");
    setResultBinomial(0);
    setResultPoisson(0);
    setResultNormal(0);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap justify-center space-x-2 mb-4 mx-10 items-center text-center">
        <button
          className={`p-2  ${activeTab === "binomial" ? "text-indigo-500" : "text-gray-700"}`}
          onClick={() => setActiveTab("binomial")}
        >
          Binomial
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === "poisson" ? "text-indigo-500" : "text-gray-700"}`}
          onClick={() => setActiveTab("poisson")}
        >
          Poisson
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === "normal" ? "text-indigo-500" : "text-gray-700"}`}
          onClick={() => setActiveTab("normal")}
        >
          Normal
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === "students" ? "text-indigo-500" : "text-gray-700"}`}
          onClick={() => setActiveTab("students")}
        >
          Student's
        </button>
      </div>

      <div className="flex justify-center items-center text-left mb-4 mt-4">
        {tabContent[activeTab]}
      </div>

      {activeTab === 'binomial' && (
        <div className="flex w-full gap-3 justify-center items-center my-9 text-black">
          <div className="w-full h-full max-w-sm flex flex-col items-center gap-y-5 bg-neutral-950 rounded-lg border border-zinc-600 p-6">
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="n"
              value={n}
              onChange={(e) => setN(String(e.target.value))}
            />
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="p"
              value={p}
              onChange={(e) => setP(String(e.target.value))}
            />
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="k (e.g. >=4 or 5)"
              value={kb}
              onChange={(e) => setKB(e.target.value)}
            />

            <button
              className="w-full bg-indigo-600 p-2 rounded-lg mt-4 text-white"
              onClick={calculateBinomial}
            >
              Calculate
            </button>

            {resultBinomial !== null && (
              <div className="mt-4 text-white text-md ">
                <p>
                  Binomial Probability:{" "}
                  {typeof resultBinomial === "number"
                    ? resultBinomial.toFixed(4)
                    : resultBinomial}
                </p>
              </div>
            )}
            <button>
              <GrPowerReset
                className="text-indigo-500 text-2xl"
                onClick={resetInputs}
              />
            </button>
          </div>
        </div>
      )}
      {activeTab === 'poisson' && (
        <div className="flex w-full gap-3 justify-center items-center my-9 text-black">
          <div className="w-full max-w-sm flex flex-col items-center gap-y-5 bg-neutral-950 rounded-lg border border-zinc-600 p-6">
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="λ (average occurrences)"
              value={lambda}
              onChange={(e) => setLambda(e.target.value)}
            />
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="k (actual occurrences)"
              value={kp}
              onChange={(e) => setKP(e.target.value)}
            />
            <button
              className="w-full bg-indigo-600 p-2 rounded-lg mt-4 text-white"
              onClick={calculatePoisson}
            >
              Calculate
            </button>

            {resultPoisson !== null && (
              <div className="mt-4 text-white text-xl">
                <p>
                  Poisson Probability:{" "}
                  {typeof resultPoisson === "number"
                    ? resultPoisson.toFixed(4)
                    : resultPoisson}
                </p>
              </div>
            )}
            <button>
              <GrPowerReset
                className="text-indigo-500 text-2xl"
                onClick={resetInputs}
              />
            </button>
          </div>
        </div>
      )}
      {activeTab === 'normal' && (
        <div className="flex w-full gap-3 justify-center items-center my-9 text-black">
          <div className="w-full max-w-sm flex flex-col items-center gap-y-5 bg-neutral-950 rounded-lg border border-zinc-600 p-6">
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="μ (mean)"
              value={mean}
              onChange={(e) => setMean(e.target.value)}
            />
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="std D (standard deviation)"
              value={stdDev}
              onChange={(e) => setStdDev(e.target.value)}
            />
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="x (random variable)"
              value={xValue}
              onChange={(e) => setXValue(e.target.value)}
            />
            <button
              className="w-full bg-indigo-600 p-2 rounded-lg mt-4 text-white"
              onClick={calculateNormal}
            >
              Calculate
            </button>

            {resultNormal !== null && (
              <div className="mt-4 text-white text-lg">
                <p>
                  Poisson Probability:{" "}
                  {typeof resultNormal === "number"
                    ? resultNormal.toFixed(4)
                    : resultNormal}
                </p>
              </div>
            )}
            <button>
              <GrPowerReset
                className="text-indigo-500 text-2xl"
                onClick={resetInputs}
              />
            </button>
          </div>
        </div>
      )}
      {activeTab === 'students' && (
        <div className="flex flex-col w-full gap-4 justify-center items-center my-6 sm:my-9 text-black">
          <div className="w-full max-w-sm flex flex-col items-center gap-y-4 bg-neutral-950 rounded-lg border border-zinc-600 p-6">
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="μ (mean)"
              value={lambda}
              onChange={(e) => setLambda(e.target.value)}
            />
            <input
              className="w-full rounded-lg p-2"
              type="text"
              placeholder="k (actual occurrences)"
              value={kp}
              onChange={(e) => setKP(e.target.value)}
            />
            <button
              className="w-full bg-indigo-600 p-2 rounded-lg mt-2 text-white hover:bg-indigo-700 transition"
              onClick={calculatePoisson}
            >
              Calculate
            </button>

            {resultPoisson !== null && (
              <div className="mt-4 text-white text-lg text-center">
                <p>
                  Poisson Probability:{" "}
                  {typeof resultPoisson === "number"
                    ? resultPoisson.toFixed(4)
                    : resultPoisson}
                </p>
              </div>
            )}
            <button className="mt-4">
              <GrPowerReset
                className="text-indigo-500 text-2xl hover:text-indigo-700 transition"
                onClick={resetInputs}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
