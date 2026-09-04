import JSZip from 'jszip';
import { LIB_FILES } from './glsl-lib';
import { PROGRAM_FILES } from './glsl-programs';
import {
  buildBlockProperties,
  LANG_EN,
  PRESET_META,
  buildReadme,
  buildReadmeGithub,
  buildChangelog,
  buildSettingsGlsl,
  buildShadersProperties,
  buildStubFiles,
  detectPreset,
  type ShaderSettings,
} from './settings';

export { VERSION as PACK_VERSION } from './version';
import { VERSION } from './version';

export function presetLabel(s: ShaderSettings): string {
  const id = detectPreset(s);
  return id === 'custom' ? 'Custom' : PRESET_META[id].name;
}

/** Every file of the shader pack, keyed by its path inside the zip. */
export function buildPackFiles(s: ShaderSettings): Record<string, string> {
  const label = presetLabel(s);
  const files: Record<string, string> = {
    'README.txt': buildReadme(label, s),
    'README.md': buildReadmeGithub(),
    'CHANGELOG.txt': buildChangelog(),
    'shaders/shaders.properties': buildShadersProperties(s, label),
    'shaders/block.properties': buildBlockProperties(s.mcVersion),
    'shaders/lang/en_us.lang': LANG_EN,
    'shaders/lib/settings.glsl': buildSettingsGlsl(s, label),
    ...LIB_FILES,
    ...PROGRAM_FILES,
    ...buildStubFiles(),
  };
  return files;
}

export function packFileName(s: ShaderSettings): string {
  const id = detectPreset(s);
  if (id === 'custom') return `VividLite_v${VERSION}_Custom.zip`;
  // camelCase → PascalCase (e.g. extraPotato → ExtraPotato)
  const suffix = id.charAt(0).toUpperCase() + id.slice(1);
  return `VividLite_v${VERSION}_${suffix}.zip`;
}

export function packSizeBytes(files: Record<string, string>): number {
  return Object.values(files).reduce((sum, c) => sum + new Blob([c]).size, 0);
}

export async function buildZipBlob(files: Record<string, string>): Promise<Blob> {
  const zip = new JSZip();
  Object.entries(files).forEach(([path, content]) => zip.file(path, content));
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } });
}

export async function downloadPack(s: ShaderSettings): Promise<number> {
  const files = buildPackFiles(s);
  const blob = await buildZipBlob(files);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = packFileName(s);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return blob.size;
}
