import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/Sidebar';
import usePermissions from '../../hooks/usePermissions';

export default function HelpPage() {
  const { can, roleLabel } = usePermissions();

  const modules = [
    can.readPatient && {
      title: 'Patients',
      description: 'Creer, rechercher et consulter les dossiers patients.',
      to: '/patients',
      tone: '#00a8ff',
    },
    can.readDiagnostic && {
      title: 'Diagnostics',
      description: 'Saisir les localisations, morphologies et informations oncologiques.',
      to: '/diagnostics',
      tone: '#9b8afb',
    },
    can.readTreatment && {
      title: 'Traitements',
      description: 'Suivre les protocoles, cures, chirurgies et parcours therapeutiques.',
      to: '/traitements',
      tone: '#f59e0b',
    },
    can.viewStatistics && {
      title: 'Statistiques',
      description: 'Analyser l activite du registre et produire des vues de synthese.',
      to: '/stats',
      tone: '#10b981',
    },
    can.manageUsers && {
      title: 'Administration',
      description: 'Gerer les comptes, roles, traces d acces et parametres admin.',
      to: '/admin',
      tone: '#ef4444',
    },
  ].filter(Boolean);

  return (
    <AppLayout title="Aide">
      <div style={{ display: 'grid', gap: 20 }}>
        <section style={heroStyle}>
          <div>
            <div style={eyebrowStyle}>Support utilisateur</div>
            <h2 style={heroTitleStyle}>Centre d aide du registre national du cancer</h2>
            <p style={heroTextStyle}>
              Cette page regroupe les reperes essentiels pour prendre en main l application selon votre role actuel : {roleLabel || 'Utilisateur'}.
            </p>
          </div>
          <div style={heroBadgeStyle}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Acces recommande</div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Commencer par le dashboard
            </div>
            <Link to="/dashboard" style={heroLinkStyle}>Ouvrir le tableau de bord</Link>
          </div>
        </section>

        <section style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>Guide rapide</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
            <StepCard
              number="01"
              title="Se connecter"
              text="Utilisez votre email professionnel et verifiez votre role affiche dans la barre laterale."
            />
            <StepCard
              number="02"
              title="Choisir un module"
              text="Patients, diagnostics, traitements et statistiques sont affiches selon vos permissions."
            />
            <StepCard
              number="03"
              title="Tracer les actions"
              text="Les operations sensibles peuvent etre journalisees pour la tracabilite clinique et admin."
            />
          </div>
        </section>

        <section style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>Modules disponibles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            {modules.length ? modules.map((module) => (
              <Link key={module.title} to={module.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: 18,
                  borderRadius: 16,
                  background: `${module.tone}10`,
                  border: `1px solid ${module.tone}2e`,
                  minHeight: 120,
                }}>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', color: module.tone, marginBottom: 8 }}>
                    {module.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {module.description}
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Aucun module metier n est actif pour ce compte. Contactez un administrateur si besoin.
              </div>
            )}
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
          <div style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>Questions frequentes</h3>
            <FaqItem
              question="Comment creer un compte medecin ?"
              answer="La creation des comptes passe par un administrateur connecte, depuis la page d inscription reservee aux comptes ayant la permission de gestion des utilisateurs."
            />
            <FaqItem
              question="Pourquoi certains menus n apparaissent pas ?"
              answer="La navigation est filtree selon les permissions envoyees dans le profil connecte. Un utilisateur lecture seule ne voit pas les memes modules qu un administrateur."
            />
            <FaqItem
              question="Ou modifier mes preferences ?"
              answer="La page Parametres permet deja de consulter votre profil et de conserver quelques preferences locales dans le navigateur."
            />
          </div>

          <div style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>Assistance</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <SupportBox
                title="Support fonctionnel"
                text="Pour les questions de saisie, de roles ou de workflow clinique."
              />
              <SupportBox
                title="Support technique"
                text="Pour les erreurs d affichage, problemes API ou acces refuses inattendus."
              />
              <SupportBox
                title="Bon reflexe"
                text="Notez l ecran, l action effectuee et l heure approximative avant de signaler un incident."
              />
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function StepCard({ number, title, text }) {
  return (
    <div style={{
      padding: 18,
      borderRadius: 16,
      border: '1px solid var(--border-light)',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,247,250,0.92))',
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 10 }}>{number}</div>
      <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{question}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{answer}</div>
    </div>
  );
}

function SupportBox({ title, text }) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 14,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

const heroStyle = {
  display: 'grid',
  gridTemplateColumns: '1.3fr 0.7fr',
  gap: 20,
  background: 'linear-gradient(135deg, rgba(0,119,204,0.10), rgba(16,185,129,0.10), rgba(255,255,255,0.92))',
  border: '1px solid rgba(0,119,204,0.16)',
  borderRadius: 24,
  padding: 26,
};

const eyebrowStyle = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: 'var(--accent)',
  marginBottom: 10,
};

const heroTitleStyle = {
  fontSize: 28,
  fontWeight: 800,
  fontFamily: 'var(--font-display)',
  color: 'var(--text-primary)',
  marginBottom: 10,
  lineHeight: 1.1,
};

const heroTextStyle = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  maxWidth: 700,
};

const heroBadgeStyle = {
  padding: 18,
  borderRadius: 20,
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(255,255,255,0.9)',
  alignSelf: 'start',
};

const heroLinkStyle = {
  display: 'inline-block',
  marginTop: 12,
  padding: '10px 14px',
  borderRadius: 12,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 700,
  background: 'var(--accent)',
  color: '#fff',
};

const sectionCardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-lg)',
  padding: 22,
};

const sectionTitleStyle = {
  fontSize: 19,
  fontWeight: 800,
  fontFamily: 'var(--font-display)',
  color: 'var(--text-primary)',
  marginBottom: 16,
};
