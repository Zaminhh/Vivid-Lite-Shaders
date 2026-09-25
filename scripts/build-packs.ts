// ============================================================================
//  Vivid Lite — headless pack builder (temp-upload / test workflow)
//
//  Produces the exact same files as the web builder (buildPackFiles) and zips
//  them into ./release/<tag>/ together with SHA256SUMS and an index.html, so
//  a test build can be served from a temporary host and downloaded directly.
//
//  Usage:  npm run packs              -> release/v<VERSION>/
//          npm run packs -- --tag rc1 -> release/v<VERSION>-rc1/
// ============================================================================

import JSZip from 'jszip';
import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPackFiles, packFileName } from '../src/shader/pack';
import { PRESETS, PRESET_META, type PresetId, type ShaderSettings } from '../src/shader/settings';
import { VERSION_TARGETS, type LoaderId, type VersionTargetId } from '../src/shader/compat';
import { VERSION } from '../src/shader/version';

// Fixed timestamp so the same input always yields byte-identical zips.
const ZIP_DATE = new Date('2020-01-01T00:00:00Z');

async function zipFiles(files: Record<string, string>): Promise<Buffer> {
  const zip = new JSZip();
  for (const path of Object.keys(files).sort()) zip.file(path, files[path], { date: ZIP_DATE });
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 }, platform: 'DOS' });
}

interface Job { preset: PresetId; mc: VersionTargetId; loader: LoaderId }

async function main() {
  const tagArg = process.argv.indexOf('--tag');
  const tag = `v${VERSION}` + (tagArg > 0 ? `-${process.argv[tagArg + 1]}` : '');
  const outDir = join('release', tag);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // Every preset for the newest bucket (the one most people run) +
  // Medium / High Potato for every other bucket so both shadow paths
  // (hardware sampler2DShadow and Legacy sampler2D + step()) can be tested.
  const jobs: Job[] = [];
  for (const p of Object.keys(PRESETS) as PresetId[]) jobs.push({ preset: p, mc: 'latest', loader: 'both' });
  for (const mc of ['legacy', 'classic', 'modern'] as VersionTargetId[]) {
    jobs.push({ preset: 'medium', mc, loader: 'both' });
    jobs.push({ preset: 'highPotato', mc, loader: 'both' });
    jobs.push({ preset: 'extraHigh', mc, loader: 'both' });
  }

  const rows: { file: string; sha: string; kb: string; preset: string; mc: string }[] = [];
  for (const j of jobs) {
    const s: ShaderSettings = { ...PRESETS[j.preset], mcVersion: j.mc, loader: j.loader };
    const buf = await zipFiles(buildPackFiles(s));
    const base = packFileName(s).replace(/\.zip$/, '');
    const file = j.mc === 'latest' ? `${base}.zip` : `${base}_${j.mc}.zip`;
    writeFileSync(join(outDir, file), buf);
    rows.push({ file, sha: createHash('sha256').update(buf).digest('hex'), kb: (buf.length / 1024).toFixed(1), preset: PRESET_META[j.preset].name, mc: VERSION_TARGETS[j.mc].label });
  }

  writeFileSync(join(outDir, 'SHA256SUMS'), rows.map((r) => `${r.sha}  ${r.file}`).join('\n') + '\n');
  writeFileSync(join(outDir, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Vivid Lite ${tag} test builds</title>
<style>body{font:14px system-ui;background:#0b1020;color:#e2e8f0;max-width:900px;margin:40px auto;padding:0 16px}a{color:#fbbf24}td,th{padding:6px 10px;border-bottom:1px solid #1e293b;text-align:left}code{font-size:11px;color:#94a3b8}</style>
<h1>Vivid Lite ${tag} — temporary test builds</h1>
<p>Loader: <b>Both</b> (works on Iris and OptiFine). Drop the .zip into <code>.minecraft/shaderpacks/</code> without extracting.</p>
<table><tr><th>File</th><th>Preset</th><th>Minecraft</th><th>Size</th><th>SHA-256</th></tr>
${rows.map((r) => `<tr><td><a href="${r.file}" download>${r.file}</a></td><td>${r.preset}</td><td>${r.mc}</td><td>${r.kb} KB</td><td><code>${r.sha.slice(0, 16)}…</code></td></tr>`).join('\n')}
</table><p><a href="SHA256SUMS">SHA256SUMS</a></p>`);

  console.log(`Built ${rows.length} packs into ${outDir}/`);
  for (const r of rows) console.log(`  ${r.file.padEnd(44)} ${r.kb.padStart(6)} KB  ${r.sha.slice(0, 12)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
