import { dataTypeDots, dataTypes } from '../data/mock';
import type { DataFile } from '../data/types';

/** Per data-type rollup of uploaded files: record count, file count, freshness and health. */
export function summarizeDomains(files: DataFile[]) {
  return dataTypes.map((t, k) => {
    const fs = files.filter(x => x.type === t);
    const rec = fs.reduce((s, x) => s + (x.rec || 0), 0);
    const review = fs.some(x => x.status === 'Needs review');
    const busy = fs.some(x => x.status === 'Uploading' || x.status === 'Validating');
    return {
      l: t,
      dot: dataTypeDots[k],
      rec: rec.toLocaleString('en-US'),
      files: fs.length + (fs.length === 1 ? ' file' : ' files'),
      upd: fs.length ? fs[0].updated : '—',
      st: busy ? 'Processing' : review ? 'Needs review' : 'Healthy',
      chip: busy ? 'chip info' : review ? 'chip warn' : 'chip good',
    };
  });
}
