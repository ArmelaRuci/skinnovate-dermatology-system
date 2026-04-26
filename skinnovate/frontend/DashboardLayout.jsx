.statsRow {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(190px,1fr));
  gap: 16px; margin-bottom: 28px;
}
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 700px) { .grid2 { grid-template-columns: 1fr; } }
.list { display: flex; flex-direction: column; gap: 10px; }

.reviewItem   { padding: 16px 20px; }
.reviewTop    { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.condName     { font-weight: 600; color: var(--cream); font-size: 0.95rem; margin-bottom: 3px; }
.condMeta     { font-size: 0.78rem; color: var(--text-muted); }
.reviewRight  { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.confScore    { font-size: 1rem; font-weight: 700; color: var(--teal-light); font-family: var(--font-heading); }
.consultFlag  { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: var(--gold); margin-bottom: 8px; }
.reviewActions { display: flex; justify-content: flex-end; }

.apptItem   { display: flex; align-items: center; gap: 16px; padding: 14px 18px; }
.apptTime   { display: flex; flex-direction: column; align-items: center; min-width: 44px; }
.apptHour   { font-size: 1.4rem; font-weight: 700; font-family: var(--font-heading); color: var(--teal-light); line-height: 1; }
.apptAmPm   { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); }
.apptInfo   { flex: 1; }
.patientName { font-weight: 600; color: var(--cream); font-size: 0.92rem; margin-bottom: 3px; }
.apptType    { font-size: 0.8rem; color: var(--text-muted); text-transform: capitalize; }
.apptReason  { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }

.viewAll {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 0.84rem; color: var(--teal); margin-top: 4px; transition: gap 0.2s;
}
.viewAll:hover { gap: 8px; }
