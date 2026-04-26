.filters {
  display: flex; gap: 6px; flex-wrap: wrap;
  margin-bottom: 24px;
}
.filterTab {
  padding: 7px 16px; border-radius: 100px;
  background: var(--surface-2); border: 1px solid var(--border);
  color: var(--text-muted); font-size: 0.84rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; font-family: var(--font-body);
}
.filterTab:hover { border-color: var(--border-light); color: var(--cream); }
.filterActive    { background: var(--teal-dim); border-color: var(--teal); color: var(--teal-light); }

.list  { display: flex; flex-direction: column; gap: 12px; }
.apptCard {
  display: flex; align-items: center; gap: 20px;
  padding: 18px 22px; flex-wrap: wrap;
}
.apptLeft { flex-shrink: 0; }
.dateBlock { display: flex; flex-direction: column; align-items: center; min-width: 48px; }
.dateDay   { font-size: 2rem; font-weight: 700; font-family: var(--font-heading); color: var(--teal-light); line-height: 1; }
.dateMon   { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }

.apptMid   { flex: 1; }
.apptType  { font-weight: 600; color: var(--cream); font-size: 0.95rem; text-transform: capitalize; margin-bottom: 4px; }
.apptTime  { font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 4px; }
.apptReason { font-size: 0.82rem; color: var(--text-muted); }
.apptDoc    { font-size: 0.82rem; color: var(--teal); margin-top: 4px; }

.apptRight { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

/* Modal */
.modalOverlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: var(--surface-1);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 32px;
  width: 100%; max-width: 480px;
  box-shadow: var(--shadow-lg);
  animation: fadeUp 0.25s var(--ease);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.modalHead {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px;
}
.modalHead h3 { font-size: 1.3rem; color: var(--cream); }
.modalHead button { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; }
.modalHead button:hover { color: var(--cream); }
.modalForm    { display: flex; flex-direction: column; gap: 16px; }
.emergencyCheck {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; font-size: 0.88rem; color: var(--text-secondary);
}
.emergencyCheck input { width: 16px; height: 16px; accent-color: var(--rose); }
.modalActions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
