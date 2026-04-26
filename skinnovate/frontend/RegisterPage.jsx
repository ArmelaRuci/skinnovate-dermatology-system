.controls {
  display: flex; gap: 16px; align-items: center;
  flex-wrap: wrap; margin-bottom: 20px;
}
.searchWrap {
  position: relative; flex: 1; min-width: 200px;
}
.searchIcon {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%); color: var(--text-muted);
  pointer-events: none;
}
.searchInput {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 10px 14px 10px 38px;
  color: var(--text-primary);
  font-size: 0.9rem; font-family: var(--font-body);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.searchInput:focus {
  outline: none; border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(42,157,143,0.15);
}
.searchInput::placeholder { color: var(--text-muted); }

.roleTabs { display: flex; gap: 4px; flex-wrap: wrap; }
.roleTab {
  padding: 8px 16px; border-radius: 100px;
  background: var(--surface-2); border: 1px solid var(--border);
  color: var(--text-muted); font-size: 0.84rem; font-weight: 500;
  cursor: pointer; font-family: var(--font-body); transition: all 0.2s;
}
.roleTab:hover     { color: var(--cream); border-color: var(--border-light); }
.roleTabActive     { background: var(--teal-dim); border-color: var(--teal); color: var(--teal-light); }

.countRow {
  font-size: 0.84rem; color: var(--text-muted);
  margin-bottom: 12px;
}
.countRow strong { color: var(--text-secondary); }

.tableCard  { padding: 0; overflow: hidden; }
.tableWrap  { overflow-x: auto; }
.table {
  width: 100%; border-collapse: collapse;
  font-size: 0.88rem;
}
.table thead tr {
  border-bottom: 1px solid var(--border);
}
.table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--text-muted); white-space: nowrap;
}
.table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.table tbody tr:last-child { border-bottom: none; }
.table tbody tr:hover { background: rgba(255,255,255,0.025); }
.table td { padding: 14px 20px; vertical-align: middle; }

.rowInactive { opacity: 0.55; }

.userCell { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--teal-dim);
  border: 1px solid rgba(42,157,143,0.3);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.9rem; color: var(--teal-light);
  flex-shrink: 0;
}
.userName  { font-weight: 600; color: var(--cream); margin-bottom: 2px; }
.userEmail { font-size: 0.78rem; color: var(--text-muted); }
.dateCell  { color: var(--text-muted); white-space: nowrap; }
