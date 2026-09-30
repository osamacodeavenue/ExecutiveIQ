import { useState, type DragEvent } from 'react';
import { Icon } from '../components/Icon';
import { PageHead, Track } from '../components/ui';
import { dataTypes } from '../data/mock';
import type { DataType, FileStatus } from '../data/types';
import { summarizeDomains } from '../lib/domains';
import { useApp } from '../state/AppContext';

const STATUS_CHIP: Record<FileStatus, string> = {
  Synced: 'chip good',
  Processed: 'chip good',
  'Needs review': 'chip warn',
  Validating: 'chip info',
  Uploading: 'chip info',
};

export default function Data() {
  const { files, startUpload } = useApp();
  const [upType, setUpType] = useState<DataType>('Sales data');
  const [drag, setDrag] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const fl = e.dataTransfer?.files?.[0];
    if (fl) startUpload(fl.name, upType);
  };

  return (
    <div className="fade stack" style={{ gap: 22 }}>
      <PageHead title="Data Center" sub="The files behind every number in ExecutiveIQ. Upload a new month to refresh the dashboards." />

      <div className="g g-4" style={{ gap: 14 }}>
        {summarizeDomains(files).map(d => (
          <div key={d.l} className="card hov" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{d.l}</span><span className={d.chip}>{d.st}</span></div>
            <span className="num" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>{d.rec}</span>
            <span style={{ fontSize: 12.5, color: '#6B6E76' }}>records · {d.files} · updated {d.upd}</span>
          </div>
        ))}
      </div>

      <section
        className={'drop' + (drag ? ' drop-on' : '')}
        style={{ padding: 30, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}
        onDragOver={e => { e.preventDefault(); if (!drag) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <span style={{ width: 56, height: 56, borderRadius: 14, background: '#FFFFFF', border: '1px solid #E6E3DC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B59C3', flexShrink: 0 }}>
          <Icon name="upload" size={24} />
        </span>
        <div style={{ flexGrow: 1, minWidth: 220 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Upload CSV / Excel</div>
          <div style={{ fontSize: 13.5, color: '#4A4D55', marginTop: 4 }}>Drag a file here, or browse. .csv, .xlsx or .xls up to 25 MB. Columns are matched automatically.</div>
        </div>
        <div className="selw">
          <select className="sel sel-plain" aria-label="Data type for upload" value={upType} onChange={e => setUpType(e.target.value as DataType)}>
            {dataTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Icon name="chevDown" size={14} width={2} className="chev" />
        </div>
        <input
          id="upl"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="sr-only"
          onChange={e => { const fl = e.target.files?.[0]; if (fl) startUpload(fl.name, upType); e.target.value = ''; }}
        />
        <label htmlFor="upl" className="btn btn-pri">Browse files</label>
        <button className="btn btn-sec" onClick={() => startUpload('customer_receivables_jul2026.csv', upType)}>Use sample file</button>
      </section>

      <section className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px' }}><h2 className="h2">Uploaded Files</h2><p className="sub">{files.length} files · newest first</p></div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>File name</th><th>Data type</th><th className="r">Records</th><th>Last updated</th><th>Status</th></tr></thead>
            <tbody>
              {files.map(x => {
                const csv = x.name.split('.').pop()?.toUpperCase() === 'CSV';
                return (
                  <tr key={x.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 30, height: 30, borderRadius: 7, background: csv ? '#EAF0FB' : '#E6F4EC', color: csv ? '#1F4499' : '#17683F', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{csv ? 'CSV' : 'XLS'}</span>
                        <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{x.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#4A4D55', whiteSpace: 'nowrap' }}>{x.type}</td>
                    <td className="r num">{x.rec ? x.rec.toLocaleString('en-US') : '—'}</td>
                    <td style={{ color: '#4A4D55', whiteSpace: 'nowrap' }}>{x.updated}</td>
                    <td>
                      {x.status === 'Uploading'
                        ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Track w={(x.pct ?? 0) + '%'} c="#2B59C3" width={110} />
                            <span className="num" style={{ fontSize: 12.5, color: '#4A4D55' }}>{x.pct ?? 0}%</span>
                          </div>
                        )
                        : <span className={STATUS_CHIP[x.status]}>{x.status}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
