import React, { useState } from 'react';

export const GlobalDateRangeFilter = ({ onFilterChange, initialPeriod = 'this_month', className = '' }) => {
  const [period, setPeriod] = useState(initialPeriod);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handlePeriodChange = (e) => {
    const selected = e.target.value;
    setPeriod(selected);
    if (selected === 'custom') {
      setShowCustomModal(true);
    } else {
      onFilterChange({ period: selected, start_date: '', end_date: '' });
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setShowCustomModal(false);
    onFilterChange({ period: 'custom', start_date: startDate, end_date: endDate });
  };

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <div className="d-flex align-items-center">
        <label className="small text-muted me-2 font-bold m-0" style={{ whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-calendar-days text-primary me-1"></i> Période :
        </label>
        <select
          value={period}
          onChange={handlePeriodChange}
          className="form-control form-control-sm"
          style={{ width: 'auto', fontWeight: 600, borderRadius: '8px', paddingRight: '28px' }}
        >
          <option value="this_month">Ce mois-ci</option>
          <option value="today">Aujourd'hui</option>
          <option value="yesterday">Hier</option>
          <option value="this_week">Cette semaine</option>
          <option value="last_week">Semaine précédente</option>
          <option value="last_month">Mois précédent</option>
          <option value="this_quarter">Ce trimestre</option>
          <option value="last_quarter">Trimestre précédent</option>
          <option value="this_semester">Ce semestre</option>
          <option value="this_year">Cette année</option>
          <option value="last_year">Année précédente</option>
          <option value="custom">📅 Période personnalisée...</option>
        </select>
      </div>

      {period === 'custom' && startDate && endDate && (
        <span className="badge bg-primary-light text-primary border border-primary px-2.5 py-1.5 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
          {startDate} ➔ {endDate}
          <button 
            type="button"
            onClick={() => setShowCustomModal(true)} 
            className="btn btn-link btn-sm p-0 ms-1 text-primary" 
            title="Modifier la période"
          >
            <i className="fa-solid fa-pen text-xs"></i>
          </button>
        </span>
      )}

      {/* Modal Période Personnalisée */}
      {showCustomModal && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '420px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0 font-bold text-primary">
                <i className="fa-solid fa-calendar-range me-2"></i> Période Personnalisée
              </h5>
              <button 
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="btn-close"
                style={{ filter: 'invert(0.5)' }}
              ></button>
            </div>

            <form onSubmit={handleApplyCustom}>
              <div className="mb-3">
                <label className="form-label small font-semibold">Date de début</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small font-semibold">Date de fin</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm font-bold"
                >
                  Appliquer le filtre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default GlobalDateRangeFilter;
