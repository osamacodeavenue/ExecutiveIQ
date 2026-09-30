import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { initialFiles, matchQuestion } from '../data/mock';
import type {
  AnalysisKey, AnswerKey, ChatMessage, DataFile, DataType, DecisionId, DecisionStatus, Filters, ReportId,
} from '../data/types';

export interface ReportState {
  sel: ReportId | null;
  phase: 'idle' | 'gen' | 'ready';
  step: number;
}

export interface Prefs {
  digest: boolean;
  alerts: boolean;
  weekly: boolean;
}

interface AppState {
  filters: Filters;
  loading: boolean;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;

  decisions: Record<DecisionId, DecisionStatus>;
  setDecision: (id: DecisionId, status: DecisionStatus, msg?: string) => void;

  modal: AnalysisKey | null;
  openModal: (key: AnalysisKey) => void;
  closeModal: () => void;

  toastMsg: string | null;
  toast: (msg: string) => void;

  unread: number;
  markRead: () => void;

  chat: ChatMessage[];
  thinking: boolean;
  ask: (text: string, key?: AnswerKey) => void;
  clearChat: () => void;

  report: ReportState;
  generateReport: () => void;
  pickReport: (id: ReportId) => void;

  files: DataFile[];
  startUpload: (name: string, type: DataType) => void;

  poDone: Record<number, boolean>;
  draftPo: (index: number, name: string) => void;

  prefs: Prefs;
  togglePref: (key: keyof Prefs) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const timers = useRef<number[]>([]);
  const toastTimer = useRef<number>(0);
  const loadTimer = useRef<number>(0);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(toastTimer.current);
    clearTimeout(loadTimer.current);
  }, []);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2800);
  }, []);

  // Filters (a short loading state mimics a data refetch)
  const [filters, setFilters] = useState<Filters>({ range: 'h1', unit: 'all', region: 'all' });
  const [loading, setLoading] = useState(false);
  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(f => ({ ...f, [key]: value }));
    setLoading(true);
    clearTimeout(loadTimer.current);
    loadTimer.current = window.setTimeout(() => setLoading(false), 650);
  }, []);
  const resetFilters = useCallback(() => setFilters(f => ({ ...f, unit: 'all', region: 'all' })), []);

  // Decisions & modal
  const [decisions, setDecisions] = useState<Record<DecisionId, DecisionStatus>>({ logistics: 'open', productB: 'open', receivables: 'open' });
  const [modal, setModal] = useState<AnalysisKey | null>(null);
  const setDecision = useCallback((id: DecisionId, status: DecisionStatus, msg?: string) => {
    setDecisions(d => ({ ...d, [id]: status }));
    setModal(null);
    if (msg) toast(msg);
  }, [toast]);

  // Notifications
  const [unread, setUnread] = useState(3);

  // Analyst chat
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const thinkingRef = useRef(false);
  const ask = useCallback((text: string, key?: AnswerKey) => {
    if (thinkingRef.current || !text) return;
    const k = key ?? matchQuestion(text);
    thinkingRef.current = true;
    setThinking(true);
    setChat(c => [...c, { role: 'user', text }]);
    later(() => {
      setChat(c => [...c, { role: 'bot', key: k }]);
      thinkingRef.current = false;
      setThinking(false);
    }, 1300);
  }, [later]);
  const clearChat = useCallback(() => {
    setChat([]);
  }, []);

  // Reports
  const [report, setReport] = useState<ReportState>({ sel: null, phase: 'idle', step: 0 });
  const reportRun = useRef(0);
  const generateReport = useCallback(() => {
    const run = ++reportRun.current;
    setReport({ sel: 'exec', phase: 'gen', step: 0 });
    const tick = (s: number) => later(() => {
      if (reportRun.current !== run) return;
      if (s < 4) { setReport({ sel: 'exec', phase: 'gen', step: s + 1 }); tick(s + 1); }
      else setReport({ sel: 'exec', phase: 'ready', step: 4 });
    }, 700);
    tick(0);
  }, [later]);
  const pickReport = useCallback((id: ReportId) => {
    if (id === 'exec') { generateReport(); return; }
    reportRun.current++;
    setReport({ sel: id, phase: 'ready', step: 4 });
  }, [generateReport]);

  // Data uploads
  const [files, setFiles] = useState<DataFile[]>(initialFiles);
  const startUpload = useCallback((name: string, type: DataType) => {
    const id = Date.now();
    setFiles(fs => [{ id, name, type, rec: 0, updated: 'Just now', status: 'Uploading', pct: 0 }, ...fs]);
    const upd = (patch: Partial<DataFile>) => setFiles(fs => fs.map(f => (f.id === id ? { ...f, ...patch } : f)));
    [18, 41, 66, 88, 100].forEach((p, i) => later(() => upd({ pct: p }), 260 * (i + 1)));
    later(() => upd({ status: 'Validating' }), 1600);
    later(() => {
      upd({ status: 'Processed', rec: 1200 + (name.length * 373) % 8800 });
      toast(name + ' processed and added to ' + type.toLowerCase());
    }, 2900);
  }, [later, toast]);

  // Purchase orders
  const [poDone, setPoDone] = useState<Record<number, boolean>>({});
  const draftPo = useCallback((index: number, name: string) => {
    setPoDone(p => (p[index] ? p : { ...p, [index]: true }));
    toast('Purchase order drafted for ' + name);
  }, [toast]);

  // Settings
  const [prefs, setPrefs] = useState<Prefs>({ digest: true, alerts: true, weekly: false });
  const togglePref = useCallback((key: keyof Prefs) => setPrefs(p => ({ ...p, [key]: !p[key] })), []);

  const value = useMemo<AppState>(() => ({
    filters, loading, setFilter, resetFilters,
    decisions, setDecision,
    modal, openModal: setModal, closeModal: () => setModal(null),
    toastMsg, toast,
    unread, markRead: () => setUnread(0),
    chat, thinking, ask, clearChat,
    report, generateReport, pickReport,
    files, startUpload,
    poDone, draftPo,
    prefs, togglePref,
  }), [filters, loading, setFilter, resetFilters, decisions, setDecision, modal, toastMsg, toast, unread, chat, thinking, ask, clearChat, report, generateReport, pickReport, files, startUpload, poDone, draftPo, prefs, togglePref]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
