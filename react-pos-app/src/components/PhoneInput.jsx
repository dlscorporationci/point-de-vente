import React, { useState, useEffect, useRef } from 'react';

// Liste complète des pays avec drapeau emoji, nom et indicatif international
export const COUNTRIES = [
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo-Brazzaville', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'RDC (Congo-Kinshasa)', dialCode: '+243', flag: '🇨🇩' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
];

/**
 * Composant de saisie de numéro de téléphone moderne avec sélection de pays & indicatif.
 */
export const PhoneInput = ({
  value = '',
  onChange,
  placeholder = '07 00 00 00 00',
  disabled = false,
  required = false,
  id,
  className = '',
  defaultCountryCode = 'CI',
}) => {
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Trouver le pays correspondant au numéro fourni ou utiliser la Côte d'Ivoire par défaut
  const parseValue = (val) => {
    if (!val) {
      const def = COUNTRIES.find((c) => c.code === defaultCountryCode) || COUNTRIES[0];
      return { country: def, localNumber: '' };
    }

    const cleanVal = val.trim();
    // Vérifier si la valeur commence par un indicatif connu
    const matchedCountry = COUNTRIES.find((c) => cleanVal.startsWith(c.dialCode));

    if (matchedCountry) {
      const local = cleanVal.slice(matchedCountry.dialCode.length).trim();
      return { country: matchedCountry, localNumber: local };
    }

    // Si la valeur est juste un numéro local sans indicatif
    const def = COUNTRIES.find((c) => c.code === defaultCountryCode) || COUNTRIES[0];
    return { country: def, localNumber: cleanVal };
  };

  const initial = parseValue(value);
  const [selectedCountry, setSelectedCountry] = useState(initial.country);
  const [localNumber, setLocalNumber] = useState(initial.localNumber);

  // Mettre à jour si la prop `value` externe change
  useEffect(() => {
    const parsed = parseValue(value);
    setSelectedCountry(parsed.country);
    setLocalNumber(parsed.localNumber);
  }, [value]);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus sur le champ de recherche à l'ouverture du menu
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearchQuery('');

    // Notifier le composant parent avec le numéro complet formé
    const formatted = localNumber ? `${country.dialCode} ${localNumber}` : country.dialCode + ' ';
    if (onChange) {
      onChange(formatted);
    }
  };

  const handleLocalNumberChange = (e) => {
    // Filtrer pour ne garder que les chiffres, espaces et tirets
    const val = e.target.value.replace(/[^0-9\s-]/g, '');
    setLocalNumber(val);

    const formatted = val ? `${selectedCountry.dialCode} ${val}` : '';
    if (onChange) {
      onChange(formatted);
    }
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`phone-input-wrapper ${className}`} ref={containerRef} style={{ position: 'relative' }}>
      <div className="phone-input-group" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {/* Bouton de sélection du pays */}
        <button
          type="button"
          className="phone-country-btn"
          disabled={disabled}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'var(--color-bg-subtle, #f8fafc)',
            border: '1px solid var(--color-border, #cbd5e1)',
            borderRight: 'none',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text, #1e293b)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
            height: '42px',
          }}
          title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{selectedCountry.flag}</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted, #64748b)' }}>
            {selectedCountry.dialCode}
          </span>
          <i
            className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}
            style={{ fontSize: '10px', marginLeft: '2px', opacity: 0.7 }}
          ></i>
        </button>

        {/* Champ de saisie du numéro local */}
        <input
          type="tel"
          id={id}
          className="form-control phone-number-field"
          value={localNumber}
          onChange={handleLocalNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: '42px',
          }}
        />
      </div>

      {/* Menu déroulant de recherche et sélection de pays */}
      {dropdownOpen && (
        <div
          className="phone-country-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 1050,
            width: '280px',
            maxHeight: '300px',
            backgroundColor: 'var(--color-surface, #ffffff)',
            border: '1px solid var(--color-border, #cbd5e1)',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Barre de recherche dans la modale */}
          <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
            <div style={{ position: 'relative' }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#94a3b8',
                }}
              ></i>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher un pays ou indicatif..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #cbd5e1)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Liste des pays filtrés */}
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '240px' }}>
            {filteredCountries.length === 0 ? (
              <div style={{ padding: '12px', textCenter: 'center', fontSize: '13px', color: '#64748b' }}>
                Aucun pays trouvé
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background:
                      selectedCountry.code === country.code
                        ? 'var(--color-primary-light, #eff6ff)'
                        : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color:
                      selectedCountry.code === country.code
                        ? 'var(--color-primary, #2563eb)'
                        : 'var(--color-text, #1e293b)',
                    fontWeight: selectedCountry.code === country.code ? '600' : '400',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCountry.code !== country.code) {
                      e.currentTarget.style.background = 'var(--color-bg-subtle, #f1f5f9)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCountry.code !== country.code) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                    {country.dialCode}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
