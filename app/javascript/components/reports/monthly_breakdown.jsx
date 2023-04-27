import React, { useState, useEffect } from 'react';
import { Numerics, UNCATEGORIZED, UNCATEGORIZED_COLOR } from 'utilities/main';
import { Chart } from 'chart.js/auto';

const toggleCategory = function (_, legendItem) {
  const index = legendItem.datasetIndex;
  const ci = this.chart;
  const alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

  ci.data.datasets.forEach(function (e, i) {
    const meta = ci.getDatasetMeta(i);

    if (i !== index) {
      if (!alreadyHidden) {
        meta.hidden = meta.hidden === null ? !meta.hidden : null;
      } else if (meta.hidden === null) {
        meta.hidden = true;
      }
    }

    if (i === index) {
      meta.hidden = null;
    }
  });

  ci.update();
};

const MonthlyBreakdown = ({ monthlyDetails }) => {
  const [randomId] = useState(Math.random().toString());
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    instance?.destroy();

    const labels = monthlyDetails.map(m => m.month);

    const allCategories = []; // [{ label: x, color: x }]
    let hasUncategorized = false;
    monthlyDetails.forEach(m => {
      m.expenses.forEach(e => {
        if (!e.category) {
          hasUncategorized = true
        } else if (!allCategories.find(c => c.label === e.category)) {
          allCategories.push({ label: e.category, color: e.color });
        }
      });
    });
    if (hasUncategorized) allCategories.push({ label: UNCATEGORIZED, color: UNCATEGORIZED_COLOR });

    const expenseDatasets = []
    allCategories.forEach(c => {
      const totalsForCategoryByMonth = monthlyDetails.map(m => {
        const categoryForMonth = m.expenses.find(e => c.label === (e.category || UNCATEGORIZED))
        return Numerics.centsToFloat(categoryForMonth?.amount || 0);
      });

      expenseDatasets.push({
        label: c.label,
        data: totalsForCategoryByMonth,
        stack: 'expenses',
        backgroundColor: c.color,
      });
    });

    const datasets = [
      ...expenseDatasets,
      {
        label: 'Savings',
        data: monthlyDetails.map(m => Numerics.centsToFloat(m.savings)),
        backgroundColor: 'rgba(0, 196, 3, 0.5)'
      },
    ];

    const config = {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: label => `$${Numerics.commify(label)}`,
            },
            border: {
              display: false,
            },
          },
          x: {
            border: {
              display: false,
            },
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            onClick: toggleCategory,
            labels: { usePointStyle: true, boxWidth: 5, boxHeight: 5, padding: 15 },
            onHover: e => e.native.target.style.cursor = 'pointer',
            onLeave: e => e.native.target.style.cursor = 'default',
          },
          tooltip: {
            callbacks: {
              label: (t) => `${t.dataset.label}: $${t.raw}`,
            },
          },
        }
      },
    };

    const newInstance = new Chart(document.getElementById(randomId), config);

    setInstance(newInstance);
  }, [JSON.stringify(monthlyDetails)]);

  return <canvas id={randomId} />;
}

export default MonthlyBreakdown;
