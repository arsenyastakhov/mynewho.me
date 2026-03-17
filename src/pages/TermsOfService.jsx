import './LegalPage.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="container legal-shell">
        <span className="legal-kicker">Legal</span>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-meta">Effective date: March 17, 2026</p>

        <p className="legal-intro">
          These Terms of Service govern your use of the MyNewHome website and any related communications, self-tour requests, and rental
          information provided through it.
        </p>

        <div className="legal-notice">
          <p>
            This is general website terms copy, not legal advice. Before launch, it should be reviewed by legal counsel for your specific
            business, leasing workflow, and property operations.
          </p>
        </div>

        <section className="legal-section">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using this website, you agree to these Terms of Service. If you do not agree, do not use the website.
          </p>
        </section>

        <section className="legal-section">
          <h2>Website Purpose</h2>
          <p>
            This website is provided to share rental property information, respond to leasing inquiries, support self-tour requests, and direct
            users to application services.
          </p>
        </section>

        <section className="legal-section">
          <h2>Property Information and Availability</h2>
          <ul>
            <li>Property descriptions, pricing, availability dates, amenities, and other details are for general informational purposes only.</li>
            <li>Listings may change, be updated, be removed, or become unavailable without notice.</li>
            <li>Photos, renderings, descriptions, and amenities may not always reflect current conditions exactly.</li>
            <li>Nothing on the website guarantees rental availability, approval, pricing, move-in date, or eligibility.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Applications and Screening</h2>
          <ul>
            <li>Applications may be processed through third-party services such as Innago or similar providers.</li>
            <li>Separate terms, fees, and privacy practices may apply when you use third-party application platforms.</li>
            <li>Submitting an application does not guarantee approval, tenancy, or reservation of a property.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Self-Tour Terms</h2>
          <ul>
            <li>Self-tour access may be offered only for certain properties, at certain times, and subject to availability and eligibility.</li>
            <li>We may require SMS communication, identity verification, scheduling rules, or access instructions before a tour is provided.</li>
            <li>You are responsible for following all tour instructions, using access codes only as authorized, and leaving the property secure.</li>
            <li>You may not share access credentials, attempt unauthorized entry, damage the property, or use the self-tour system for any improper purpose.</li>
            <li>We may suspend, deny, or revoke tour access at any time.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>SMS and Mobile Communications</h2>
          <ul>
            <li>Your browser or device may ask permission before opening your messaging application.</li>
            <li>Standard message and data rates may apply.</li>
            <li>Mobile carriers and third-party messaging platforms are not responsible for delayed or undelivered messages.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Permitted Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the website for unlawful, fraudulent, abusive, or misleading purposes.</li>
            <li>Attempt to interfere with the website, servers, or access-control systems.</li>
            <li>Copy, scrape, reproduce, or exploit website content beyond ordinary personal use without permission.</li>
            <li>Misrepresent your identity, intent, or eligibility in communications, applications, or tour requests.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Fair Housing and Compliance</h2>
          <p>
            We intend to comply with applicable fair housing and anti-discrimination laws. Nothing in these Terms limits rights provided under
            applicable housing laws.
          </p>
        </section>

        <section className="legal-section">
          <h2>Intellectual Property</h2>
          <p>
            Website content, including text, design, graphics, branding, and images, is owned by or licensed to MyNewHome unless otherwise stated
            and may not be used without permission except as allowed by law.
          </p>
        </section>

        <section className="legal-section">
          <h2>No Warranties</h2>
          <p>
            This website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, express or implied, to the fullest extent
            permitted by law.
          </p>
        </section>

        <section className="legal-section">
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, MyNewHome and its owners, operators, service providers, and affiliates are not liable for any
            indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the website, third-party
            services, applications, or self-tour communications.
          </p>
        </section>

        <section className="legal-section">
          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless MyNewHome and its related parties from claims, damages, losses, liabilities, and expenses
            arising out of your misuse of the website, violation of these Terms, or improper use of any self-tour or access features.
          </p>
        </section>

        <section className="legal-section">
          <h2>Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. The revised version will be effective when posted on this page unless otherwise stated.
          </p>
        </section>

        <section className="legal-section">
          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law principles, except where applicable law
            requires otherwise.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Questions about these Terms may be sent to <a href="mailto:info@mynewho.me">info@mynewho.me</a> or by phone at{' '}
            <a href="tel:+19412734666">(941) 273-4666</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
