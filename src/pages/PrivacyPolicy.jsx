import './LegalPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="container legal-shell">
        <span className="legal-kicker">Legal</span>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-meta">Effective date: March 17, 2026</p>

        <p className="legal-intro">
          This Privacy Policy explains how MyNewHome collects, uses, shares, and protects information when you visit this website,
          request information, text us about a self-tour, or start a rental application.
        </p>

        <div className="legal-notice">
          <p>
            This is website policy copy, not legal advice. Before launch, it should be reviewed by a qualified attorney familiar with
            Florida rental operations, SMS communications, and U.S. privacy law.
          </p>
        </div>

        <section className="legal-section">
          <h2>Information We Collect</h2>
          <p>We may collect information in the following ways:</p>
          <ul>
            <li>Information you provide directly, such as your name, phone number, email address, and any information you send by email, text, or application.</li>
            <li>Information related to self-tour requests, including the phone number used to text us and the content of those messages.</li>
            <li>Application-related information that you submit through third-party rental or application services, such as Innago or similar vendors.</li>
            <li>Technical information automatically collected by your browser or device, such as IP address, device type, browser type, pages viewed, and approximate location information derived from IP.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>How We Use Information</h2>
          <ul>
            <li>To respond to inquiries about homes, tours, availability, and applications.</li>
            <li>To coordinate or facilitate self-tour access and related communications.</li>
            <li>To review, process, or route rental applications through our application providers.</li>
            <li>To operate, maintain, secure, and improve the website and our leasing process.</li>
            <li>To comply with legal obligations, enforce our policies, and protect our rights, residents, applicants, and properties.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>SMS and Self-Tour Communications</h2>
          <ul>
            <li>When you text us to request a self-tour, your mobile carrier may apply message or data charges.</li>
            <li>Your text messaging app or browser may ask permission before opening your messaging service.</li>
            <li>Text messages are used to help coordinate access, provide next steps, and respond to tour-related requests.</li>
            <li>Consent to receive text messages is not a condition of applying to rent, although certain self-tour features may require SMS communication to function.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>How We Share Information</h2>
          <p>We do not sell your personal information for money. We may share information:</p>
          <ul>
            <li>With service providers that help us host the website, process applications, manage communications, or operate tours.</li>
            <li>With application or property-management platforms you use, including third-party services such as Innago.</li>
            <li>With telecommunications, messaging, or access-control providers needed to support self-tour or SMS workflows.</li>
            <li>When required by law, court order, legal process, or to protect safety, property, or legal rights.</li>
            <li>In connection with a business transfer, sale, reorganization, or similar transaction involving the rental business or website.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Third-Party Services and Links</h2>
          <p>
            This website may link to third-party websites, applications, and services, including application platforms, SMS apps, email apps,
            and external service providers. Their privacy practices are governed by their own policies, not this one.
          </p>
        </section>

        <section className="legal-section">
          <h2>Data Retention</h2>
          <p>
            We retain information for as long as reasonably necessary to operate the website, manage tours and applications, comply with legal
            obligations, resolve disputes, and enforce agreements.
          </p>
        </section>

        <section className="legal-section">
          <h2>Your Choices</h2>
          <ul>
            <li>You may stop emailing or texting us at any time.</li>
            <li>You may choose not to use self-tour SMS features.</li>
            <li>If you submitted information through a third-party application provider, you may also need to contact that provider directly regarding your account or submitted information.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational safeguards to protect information, but no system or transmission
            method can be guaranteed to be completely secure.
          </p>
        </section>

        <section className="legal-section">
          <h2>Children&apos;s Privacy</h2>
          <p>
            This website is not intended for children under 13, and we do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="legal-section">
          <h2>State Privacy Rights</h2>
          <p>
            Depending on where you live, you may have privacy rights under applicable law, such as rights to request access, correction, or
            deletion of certain personal information. To make a request, contact us using the information below.
          </p>
        </section>

        <section className="legal-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised effective date.
          </p>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{' '}
            <a href="mailto:info@mynewho.me">info@mynewho.me</a> or call <a href="tel:+19412734666">(941) 273-4666</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
