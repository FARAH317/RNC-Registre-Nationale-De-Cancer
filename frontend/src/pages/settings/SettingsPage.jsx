import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/Sidebar';
import useAuthStore from '../../hooks/useAuth';
import usePermissions from '../../hooks/usePermissions';

const STORAGE_KEY = 'registry_ui_settings';

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  dashboardHints: true,
  compactLists: false,
  autoRefreshDashboard: false,
};

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { can, roleLabel, roleColor } = usePermissions();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const updateSetting = (key) => {
    setSettings((current) => {
      const next = { ...current, [key]: !current[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedAt(new Date());
      return next;
    });
  };

  const resetSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    setSettings(DEFAULT_SETTINGS);
    setSavedAt(new Date());
  };

  const quickAccess = [
    can.readPatient && { to: '/patients', label: 'Patients', tone: '#00a8ff' },
    can.readDiagnostic && { to: '/diagnostics', label: 'Diagnostics', tone: '#9b8afb' },
    can.readTreatment && { to: '/traitements', label: 'Traitements', tone: '#f59e0b' },
    can.viewStatistics && { to: '/stats', label: 'Statistiques', tone: '#10b981' },
    can.manageUsers && { to: '/admin', label: 'Administration', tone: '#ef4444' },
    { to: '/help', label: 'Centre d aide', tone: '#0ea5e9' },
  ].filter(Boolean);

  return (
    <AppLayout title="Parametres">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, alignItems: 'start' }}>
        <section style={cardStyle}>
          <div style={headerRowStyle}>
            <div>
              <h2 style={titleStyle}>Compte utilisateur</h2>
              <p style={subStyle}>Resume du profil connecte et des acces disponibles.</p>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: roleColor.color,
              background: roleColor.bg,
              border: `1px solid ${roleColor.border}`,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: roleColor.color }} />
              {roleLabel}
            </span>
          </div>

          <div style={infoGridStyle}>
            <InfoBlock label="Nom complet" value={user?.full_name || '-'} />
            <InfoBlock label="Email" value={user?.email || '-'} />
            <InfoBlock label="Nom d utilisateur" value={user?.username || '-'} />
            <InfoBlock label="Institution" value={user?.institution || '-'} />
            <InfoBlock label="Wilaya" value={user?.wilaya || '-'} />
            <InfoBlock label="Specialite" value={user?.speciality || '-'} />
          </div>
        </section>

        <aside style={cardStyle}>
          <h2 style={titleStyle}>Acces rapides</h2>
          <p style={{ ...subStyle, marginBottom: 16 }}>Raccourcis selon votre role actuel.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {quickAccess.map((item) => (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: `${item.tone}12`,
                  border: `1px solid ${item.tone}33`,
                  color: item.tone,
                  fontSize: 13,
                  fontWeight: 700,
                }}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <section style={cardStyle}>
          <div style={headerRowStyle}>
            <div>
              <h2 style={titleStyle}>Preferences locales</h2>
              <p style={subStyle}>Ces options sont enregistrees dans le navigateur de cette machine.</p>
            </div>
            <button type="button" onClick={resetSettings} style={ghostButtonStyle}>
              Reinitialiser
            </button>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <SettingRow
              label="Notifications email"
              description="Conserver une preference locale pour les rappels et notifications."
              checked={settings.emailNotifications}
              onToggle={() => updateSetting('emailNotifications')}
            />
            <SettingRow
              label="Astuces dashboard"
              description="Afficher les aides contextuelles sur les ecrans principaux."
              checked={settings.dashboardHints}
              onToggle={() => updateSetting('dashboardHints')}
            />
            <SettingRow
              label="Listes compactes"
              description="Preference preparee pour les tables patients et diagnostics."
              checked={settings.compactLists}
              onToggle={() => updateSetting('compactLists')}
            />
            <SettingRow
              label="Actualisation auto dashboard"
              description="Preference locale pour rafraichir plus souvent les statistiques."
              checked={settings.autoRefreshDashboard}
              onToggle={() => updateSetting('autoRefreshDashboard')}
            />
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
            {savedAt ? `Derniere sauvegarde locale : ${savedAt.toLocaleTimeString('fr-FR')}` : 'Aucune modification locale pour le moment.'}
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={titleStyle}>Etat du compte</h2>
          <p style={{ ...subStyle, marginBottom: 14 }}>
            Le projet utilise les permissions du JWT pour controler les modules affiches.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <PermissionPill enabled={can.readPatient} label="Acces lecture patients" />
            <PermissionPill enabled={can.writePatient} label="Edition patients" />
            <PermissionPill enabled={can.readDiagnostic} label="Lecture diagnostics" />
            <PermissionPill enabled={can.readTreatment} label="Lecture traitements" />
            <PermissionPill enabled={can.viewStatistics} label="Statistiques" />
            <PermissionPill enabled={can.manageUsers} label="Administration utilisateurs" />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: 12,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

function SettingRow({ label, description, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '14px 16px',
        borderRadius: 14,
        border: '1px solid var(--border-light)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</div>
      </div>
      <div style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        background: checked ? 'linear-gradient(135deg, #00a8ff, #00c39a)' : 'var(--bg-elevated)',
        border: `1px solid ${checked ? 'rgba(0,168,255,0.35)' : 'var(--border)'}`,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        flexShrink: 0,
      }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
      </div>
    </button>
  );
}

function PermissionPill({ enabled, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      borderRadius: 12,
      background: enabled ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.08)',
      border: `1px solid ${enabled ? 'rgba(16,185,129,0.22)' : 'rgba(107,114,128,0.18)'}`,
    }}>
      <span style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: enabled ? 'var(--success)' : 'var(--text-muted)',
        flexShrink: 0,
      }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-lg)',
  padding: 22,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 18,
};

const titleStyle = {
  fontSize: 18,
  fontWeight: 800,
  fontFamily: 'var(--font-display)',
  color: 'var(--text-primary)',
  marginBottom: 4,
};

const subStyle = {
  fontSize: 13,
  color: 'var(--text-muted)',
  lineHeight: 1.6,
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

const ghostButtonStyle = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--border-light)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 700,
};
