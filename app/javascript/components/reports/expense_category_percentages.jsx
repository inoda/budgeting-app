import React, { useState, useEffect } from 'react';
import { Numerics, UNCATEGORIZED, UNCATEGORIZED_COLOR } from 'utilities/main';
import { Chart } from 'chart.js/auto';

const ExpenseCategoryPercentages = ({ percentagesByCategory }) => {
  const [randomId] = useState(Math.random().toString());
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    instance?.destroy();

    const labels = percentagesByCategory.map(c => c.category || UNCATEGORIZED);
    const colors = percentagesByCategory.map(c => c.color || UNCATEGORIZED_COLOR);
    const data = percentagesByCategory.map(c => Numerics.floatToPercent(c.percentage));

    const config = {
      type: 'pie',
      data: {
        datasets: [{ data, backgroundColor: colors }],
        labels,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: t => `${t.label}: ${t.formattedValue}%`,
            },
          },
        }
      },
    };

    const newInstance = new Chart(document.getElementById(randomId), config);

    setInstance(newInstance);
  }, [JSON.stringify(percentagesByCategory)]);

  return <canvas id={randomId} />;
}

export default ExpenseCategoryPercentages;
