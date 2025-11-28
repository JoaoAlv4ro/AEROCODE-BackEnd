#!/usr/bin/env node
/**
 * Simple load test runner to produce load-test-results.json
 * Measures on the client side response time and reads X-Process-Time header for server processing time.
 * Latency (network) = responseTimeMs - processingMs (>= 0)
 */

const { performance } = require('node:perf_hooks');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { url: 'http://localhost:3000/health', levels: [1,5,10], requests: 30, method: 'GET' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--url') out.url = args[++i];
    else if (a === '--levels') out.levels = args[++i].split(',').map(n => Number(n.trim())).filter(Boolean);
    else if (a === '--requests') out.requests = Number(args[++i]);
    else if (a === '--method') out.method = String(args[++i]).toUpperCase();
  }
  return out;
}

function httpRequestOnce(u, method='GET') {
  return new Promise((resolve) => {
    const url = new URL(u);
    const mod = url.protocol === 'https:' ? https : http;
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + (url.search || ''),
      headers: { 'Accept': 'application/json' }
    };
    const start = performance.now();
    const req = mod.request(opts, (res) => {
      res.resume(); // drain
      res.on('end', () => {
        const end = performance.now();
        const responseTimeMs = end - start;
        const pHeader = res.headers['x-process-time'];
        const processingMs = pHeader ? Number(pHeader) : NaN;
        const latencyMs = isFinite(processingMs) ? Math.max(responseTimeMs - processingMs, 0) : NaN;
        resolve({ statusCode: res.statusCode || 0, responseTimeMs, processingMs, latencyMs });
      });
    });
    req.on('error', () => {
      const end = performance.now();
      resolve({ statusCode: 0, responseTimeMs: end - start, processingMs: NaN, latencyMs: NaN, error: true });
    });
    req.end();
  });
}

async function runLevel(url, method, concurrency, total) {
  const results = [];
  let active = 0, started = 0;
  return await new Promise((resolve) => {
    const launch = () => {
      while (active < concurrency && started < total) {
        active++; started++;
        httpRequestOnce(url, method).then(r => results.push(r)).finally(() => {
          active--;
          if (results.length === total) return resolve(results);
          launch();
        });
      }
    };
    launch();
  });
}

function avg(xs) { const arr = xs.filter(x => isFinite(x)); return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : NaN; }

async function main() {
  const { url, levels, requests, method } = parseArgs();
  const outPath = path.resolve(process.cwd(), 'load-test-results.json');
  const out = [];

  for (const c of levels) {
    const res = await runLevel(url, method, c, requests);
    out.push({
      scenario: `${c} usuario${c>1?'s':''}`,
      concurrentUsers: c,
      averageProcessingMs: Number(avg(res.map(r=>r.processingMs)).toFixed(3)),
      averageLatencyMs: Number(avg(res.map(r=>r.latencyMs)).toFixed(3)),
      averageResponseMs: Number(avg(res.map(r=>r.responseTimeMs)).toFixed(3)),
    });
    console.log(`Level ${c}: avg response=${out[out.length-1].averageResponseMs}ms, processing=${out[out.length-1].averageProcessingMs}ms, latency=${out[out.length-1].averageLatencyMs}ms`);
  }

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('Saved results to', outPath);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
