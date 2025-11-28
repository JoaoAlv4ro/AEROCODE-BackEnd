#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const WIDTH = Number(process.env.CHART_WIDTH ?? 800);
const HEIGHT = Number(process.env.CHART_HEIGHT ?? 500);
const OUTPUT_DIR = path.resolve(process.cwd(), 'charts');
const RESULTS_FILE = path.resolve(process.cwd(), 'load-test-results.json');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
function readResults() {
  if (!fs.existsSync(RESULTS_FILE)) {
    throw new Error(`Arquivo de resultados não encontrado em ${RESULTS_FILE}. Execute "npm run metrics:test" antes.`);
  }
  const parsed = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
  if (!Array.isArray(parsed) || !parsed.length) throw new Error('Arquivo de resultados vazio ou inválido.');
  return parsed;
}

async function createChart(results, valueKey, title, fileName, color) {
  const chartCanvas = new ChartJSNodeCanvas({ width: WIDTH, height: HEIGHT, backgroundColour: '#ffffff' });
  const labels = results.map(r => `${r.concurrentUsers} usuário${r.concurrentUsers>1?'s':''}`);
  const data = results.map(r => r[valueKey]);
  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: title, data, backgroundColor: color }]
    },
    options: {
      responsive: false,
      plugins: {
        title: { display: true, text: title, padding: { top: 10, bottom: 30 }, font: { size: 18 } },
        legend: { display: false },
      },
      scales: {
        y: { title: { display: true, text: 'Tempo (ms)' }, beginAtZero: true },
        x: { title: { display: true, text: 'Cenário (usuários simultâneos)' } },
      },
    },
  };
  const buffer = await chartCanvas.renderToBuffer(configuration);
  const outputPath = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Gráfico salvo em ${outputPath}`);
}

(async function main(){
  ensureOutputDir();
  const results = readResults();
  await createChart(results, 'averageProcessingMs', 'Tempo Médio de Processamento (Servidor)', 'tempo-processamento.png', '#2563eb');
  await createChart(results, 'averageLatencyMs', 'Latência Média (Rede)', 'latencia-media.png', '#16a34a');
  await createChart(results, 'averageResponseMs', 'Tempo Médio de Resposta Total', 'tempo-resposta.png', '#f97316');
  console.log(`Gráficos gerados em ${OUTPUT_DIR}.`);
})().catch((e)=>{ console.error('Erro ao gerar gráficos:', e); process.exit(1); });
