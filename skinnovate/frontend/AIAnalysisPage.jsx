.tabs { display: flex; gap: 6px; margin-bottom: 28px; border-bottom: 1px solid var(--border); padding-bottom: 0; }
.tab {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 18px; background: none; border: none;
  color: var(--text-muted); font-size: 0.88rem; font-weight: 500;
  cursor: pointer; font-family: var(--font-body);
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}
.tab:hover    { color: var(--cream); }
.tabActive    { color: var(--teal-light); border-bottom-color: var(--teal); }

.list { display: flex; flex-direction: column; gap: 12px; }

.noteCard  { padding: 20px 24px; }
.noteHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.noteDate   { font-size: 0.84rem; font-weight: 600; color: var(--teal-light); }
.noteText   { font-size: 0.9rem; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.7; margin: 0; }

.rxCard   { padding: 20px 24px; }
.rxHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.rxDate   { font-size: 0.84rem; font-weight: 600; color: var(--teal-light); }
.medList  { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.medItem  { display: flex; gap: 10px; align-items: flex-start; }
.medName  { font-weight: 600; color: var(--cream); font-size: 0.9rem; }
.medDetail { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
.rxNotes  { font-size: 0.84rem; color: var(--text-secondary); border-top: 1px solid var(--border); padding-top: 10px; margin: 0; }
.rxExpiry { font-size: 0.78rem; color: var(--text-muted); margin-top: 8px; }
