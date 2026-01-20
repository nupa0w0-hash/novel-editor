import { StylePreset, NovelStyle } from '../types';

export function exportPresetsToFile(presets: StylePreset[]): void {
  const json = JSON.stringify(presets, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'novel-editor-presets.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importPresetsFromFile(): Promise<StylePreset[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const presets = JSON.parse(event.target?.result as string);
          if (!Array.isArray(presets)) {
            reject(new Error('Invalid preset file format'));
            return;
          }
          resolve(presets);
        } catch (err) {
          reject(new Error('Failed to parse preset file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    
    input.click();
  });
}

export function validatePreset(preset: unknown): preset is StylePreset {
  if (typeof preset !== 'object' || preset === null) return false;
  const p = preset as Record<string, unknown>;
  return typeof p.name === 'string' && typeof p.style === 'object';
}