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
  document.getElementById("downloadPDF").style.display = "inline-block";

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
        backgroundColor: "rgba(222, 20, 43, 0.1)",
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

document.getElementById("downloadPDF").addEventListener("click", async function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const P = parseFloat(document.getElementById("monthlyInvestment").value);
  const annualRate = parseFloat(document.getElementById("annualRate").value);
  const years = parseInt(document.getElementById("years").value);

  const invested = document.getElementById("invested").textContent;
  const maturity = document.getElementById("maturity").textContent;
  const interest = document.getElementById("interest").textContent;

  doc.setFontSize(16);
  doc.text("SIP Investment Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Monthly Investment: ₹${P}`, 20, 40);
  doc.text(`Annual Return Rate: ${annualRate}%`, 20, 50);
  doc.text(`Duration: ${years} years`, 20, 60);
  doc.text(`Total Invested: ₹${invested}`, 20, 80);
  doc.text(`Maturity Amount: ₹${maturity}`, 20, 90);
  doc.text(`Total Interest Earned: ₹${interest}`, 20, 100);

  doc.save("SIP_Report.pdf");
});
