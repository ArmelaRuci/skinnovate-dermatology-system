.statsRow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.ctaBanner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
  margin-bottom: 28px;
  border-color: var(--teal);
  background: linear-gradient(135deg, var(--teal-dim) 0%, transparent 100%);
}
.ctaTitle { font-size: 1.1rem; color: var(--cream); margin-bottom: 4px; font-family: var(--font-body); font-weight: 600; }
.ctaDesc  { font-size: 0.88rem; color: var(--text-muted); margin: 0; }

.grid2 {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
}
@media (max-width: 700px) { .grid2 { grid-template-columns: 1fr; } }

.list { display: flex; flex-direction: column; gap: 10px; }

/* Analysis item */
.analysisItem { padding: 16px 20px; }
.analysisTop  { display: flex; justify-content: space-between; align-items: flex-start; }
.conditionName { font-weight: 600; color: var(--cream); font-size: 0.95rem; margin-bottom: 3px; }
.uploadDate    { font-size: 0.78rem; color: var(--text-muted); }
.analysisRight { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.confidence    { font-size: 1.1rem; font-weight: 700; color: var(--teal-light); font-family: var(--font-heading); }
.validStatus   { margin-top: 10px; }

/* Appointment item */
.apptItem  { display: flex; align-items: center; gap: 16px; padding: 14px 18px; }
.apptDate  { display: flex; flex-direction: column; align-items: center; min-width: 44px; }
.apptDay   { font-size: 1.6rem; font-weight: 700; font-family: var(--font-heading); color: var(--teal-light); line-height: 1; }
.apptMonth { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.apptInfo  { flex: 1; }
.apptType  { font-weight: 600; color: var(--cream); font-size: 0.92rem; text-transform: capitalize; margin-bottom: 3px; }
.apptTime  { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text-muted); }
.apptReason { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }

.viewAll {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 0.84rem; color: var(--teal); margin-top: 4px;
  transition: gap 0.2s;
}
.viewAll:hover { gap: 8px; }

/* Treatments */
.treatmentsRow { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.treatCard   { padding: 20px; }
.treatTitle  { font-size: 1rem; color: var(--cream); margin-bottom: 6px; font-family: var(--font-body); font-weight: 600; }
.treatDesc   { font-size: 0.84rem; color: var(--text-muted); margin-bottom: 12px; }
.treatMeta   { font-size: 0.78rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 10px; }
