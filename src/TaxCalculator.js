import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import * as Slider from '@radix-ui/react-slider';

const TaxCalculator = () => {
  const [priceMultiplier, setPriceMultiplier] = useState(3);
  const [indexationRate, setIndexationRate] = useState(5);
  const [holdingYears, setHoldingYears] = useState(70);

  const BASE_PRICE = 10000000; // 1 Crore

  const calculateTaxes = (years, priceMulti, indexRate) => {
    const sellPrice = BASE_PRICE * priceMulti;
    const indexationFactor = Math.pow(1 + indexRate / 100, years);
    const indexedCost = BASE_PRICE * indexationFactor;
    
    const capital_gain = Math.max(0, sellPrice - indexedCost);
    
    const oldTax = capital_gain * 0.20;
    const newTax = Math.max(0, (sellPrice - BASE_PRICE) * 0.125);
    
    return { oldTax, newTax, indexedCost };
  };

  const chartData = useMemo(() => {
    return Array.from({ length: holdingYears + 1 }, (_, i) => {
      const year = i;
      const { oldTax, newTax, indexedCost } = calculateTaxes(year, priceMultiplier, indexationRate);
      return { year, oldTax, newTax, indexedCost };
    });
  }, [priceMultiplier, indexationRate, holdingYears]);

  const crossoverPoint = useMemo(() => {
    return chartData.find(data => data.newTax > data.oldTax);
  }, [chartData]);

  const finalYearData = chartData[chartData.length - 1];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>India Real Estate Tax Comparison</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Final Price Multiplier: {priceMultiplier.toFixed(2)}x
          <Slider.Root
            value={[priceMultiplier]}
            onValueChange={(value) => setPriceMultiplier(value[0])}
            min={0.5}
            max={50}
            step={0.1}
            style={{ marginTop: '10px' }}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Annual Indexation Rate: {indexationRate.toFixed(1)}%
          <Slider.Root
            value={[indexationRate]}
            onValueChange={(value) => setIndexationRate(value[0])}
            min={0}
            max={20}
            step={0.1}
            style={{ marginTop: '10px' }}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Holding Period: {holdingYears} years
          <Slider.Root
            value={[holdingYears]}
            onValueChange={(value) => setHoldingYears(value[0])}
            min={1}
            max={100}
            step={1}
            style={{ marginTop: '10px' }}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </label>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
          <Legend />
          <Line type="monotone" dataKey="oldTax" name="Old Tax (20% with indexation)" stroke="#8884d8" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="newTax" name="New Tax (12.5% flat)" stroke="#82ca9d" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="indexedCost" name="Indexed Cost" stroke="#ff7300" strokeWidth={2} strokeDasharray="3 3" dot={false} />
          {crossoverPoint && (
            <ReferenceLine x={crossoverPoint.year} stroke="red" label={{ value: 'Crossover', position: 'top' }} />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <p>Base property value: ₹{BASE_PRICE.toLocaleString('en-IN')} (1 Crore)</p>
        <p>Graph shows tax amounts and indexed cost over the selected holding period.</p>
        <p>Adjust sliders to see how final price multiplier, indexation rate, and holding period affect taxes.</p>
        {crossoverPoint ? (
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
            <p>Crossover Point: {crossoverPoint.year} years</p>
            <p>At crossover:</p>
            <p>- Sell Price: ₹{(BASE_PRICE * priceMultiplier).toLocaleString('en-IN')}</p>
            <p>- Indexed Cost: ₹{crossoverPoint.indexedCost.toLocaleString('en-IN')}</p>
            <p>- Old Tax: ₹{crossoverPoint.oldTax.toLocaleString('en-IN')}</p>
            <p>- New Tax: ₹{crossoverPoint.newTax.toLocaleString('en-IN')}</p>
          </div>
        ) : (
          <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
            {finalYearData.oldTax < finalYearData.newTax
              ? "Old tax system remains more advantageous throughout the selected holding period."
              : "New tax system remains more advantageous throughout the selected holding period."}
          </p>
        )}
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Tax Calculation Formulas:</p>
        <p>Old Tax = Max(0, (Sell Price - Indexed Cost)) * 20%</p>
        <p>New Tax = Max(0, (Sell Price - Purchase Price) * 12.5%)</p>
        <p>Indexed Cost = Purchase Price * (1 + Indexation Rate)^Years</p>
      </div>
    </div>
  );
};

export default TaxCalculator;
