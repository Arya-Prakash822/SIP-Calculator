document.getElementById("sipForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const P = parseFloat(document.getElementById("monthlyInvestment").value);
  const annualRate = parseFloat(document.getElementById("annualRate").value);
  const years = parseInt(document.getElementById("years").value);

  if (P <= 0 || annualRate <= 0 || years <= 0) {
    alert("Please enter valid positive numbers.");
    return;
  }

  const r = annualRate / 12 / 100;
  const n = years * 12;

  const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;
  const interest = maturity - invested;

  document.getElementById("invested").textContent = invested.toFixed(2);
  document.getElementById("maturity").textContent = maturity.toFixed(2);
  document.getElementById("interest").textContent = interest.toFixed(2);
  document.getElementById("results").style.display = "block";

  drawChart(P, r, n);
});

function drawChart(P, r, n) {
  const labels = [];
  const data = [];

  for (let i = 1; i <= n; i++) {
    const total = P * ((Math.pow(1 + r, i) - 1) / r) * (1 + r);
    labels.push(`Month ${i}`);
    data.push(total);
  }

  if (window.sipChart) {
    window.sipChart.destroy();
  }

  const ctx = document.getElementById("sipChart").getContext("2d");
  window.sipChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Investment Growth Over Time",
        data,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
