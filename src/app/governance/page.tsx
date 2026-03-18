import type { Metadata } from 'next';
import DocLayout from '@/components/DocLayout';

export const metadata: Metadata = {
  title: 'Governance',
  description:
    'How NAIS is governed — open contribution model, versioning policy, and proposal process.',
};

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'principles', label: 'Core Principles' },
  { id: 'structure', label: 'Governance Structure' },
  { id: 'contributions', label: 'How to Contribute' },
  { id: 'rfcs', label: 'RFC Process' },
  { id: 'versioning', label: 'Versioning Policy' },
  { id: 'coc', label: 'Code of Conduct' },
  { id: 'contact', label: 'Contact' },
];

export default function GovernancePage() {
  return (
    <DocLayout
      title="Governance"
      description="NAIS is an open standard with no corporate owner. This page describes how decisions are made, how contributions are accepted, and how the standard evolves."
      navItems={NAV}
    >
      <section id="overview">
        <h2>Overview</h2>
        <p>
          NAIS is an open, vendor-neutral standard. It is not owned, controlled, or governed by any
          single company, registrar, cloud provider, or AI platform. No organization has veto power
          over the standard or its direction.
        </p>
        <p>
          The NAIS specification is developed in the open on GitHub. Decisions are made through
          consensus among contributors, documented as Requests for Comments (RFCs), and ratified
          through a review period. Breaking changes require broader community sign-off.
        </p>
        <div className="callout">
          <strong>Short version:</strong> NAIS belongs to the internet, not a vendor. Anyone can
          implement it, anyone can contribute to it, and no one can revoke your ability to use it.
        </div>
      </section>

      <section id="principles">
        <h2>Core Principles</h2>
        <p>Every decision about the NAIS standard is evaluated against these principles:</p>

        <div className="space-y-4 my-6">
          {[
            {
              title: 'Vendor neutrality',
              body: 'NAIS must not give any registrar, platform, or company a structural advantage. The standard must work equally well for a domain registered at GoDaddy, Namecheap, Cloudflare, Porkbun, or anywhere else.',
            },
            {
              title: 'No gatekeeping',
              body: 'There is no application, review, or approval process to become a NAIS agent. Any domain that publishes the correct DNS and manifest is a valid NAIS agent. There is no registry to join.',
            },
            {
              title: 'Minimal required infrastructure',
              body: 'NAIS should be implementable by anyone with a domain name and an HTTPS server. Adding requirements beyond DNS and HTTPS is strongly disfavored.',
            },
            {
              title: 'Open implementation',
              body: 'The specification is released under CC BY 4.0. Anyone can implement a NAIS resolver, SDK, validator, or indexer without permission, license fees, or notification.',
            },
            {
              title: 'Backwards compatibility',
              body: 'Existing agents should continue to work when new optional fields are added. Breaking changes to required behavior are rare and require a major version increment with a long deprecation window.',
            },
            {
              title: 'Public governance',
              body: 'All discussions, proposals, and decisions happen in public GitHub issues and pull requests. There are no private steering committee votes.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="flex gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                <circle cx="9" cy="9" r="7.5" fill="#dbeafe" />
                <polyline points="5.5,9 8,11.5 12.5,6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="font-semibold text-slate-900 text-sm mb-0.5">{title}</div>
                <div className="text-sm text-slate-500 leading-relaxed">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="structure">
        <h2>Governance Structure</h2>
        <p>
          NAIS uses a lightweight, meritocratic governance model inspired by open-source projects
          like Node.js, the IETF, and the W3C.
        </p>

        <h3>Contributors</h3>
        <p>
          Anyone who opens an issue, submits a pull request, or participates in an RFC discussion is
          a contributor. There is no formal enrollment process.
        </p>

        <h3>Maintainers</h3>
        <p>
          Maintainers are contributors who have demonstrated sustained, high-quality engagement with
          the project. They have merge access to the specification repository and are responsible for
          triaging issues and reviewing RFCs. Maintainers are added by consensus of existing
          maintainers.
        </p>

        <h3>Editorial Board</h3>
        <p>
          A small editorial board (3–7 people) handles day-to-day editorial decisions — clarifying
          ambiguous spec language, merging non-controversial fixes, and managing releases. Board
          members are drawn from active maintainers. No single organization may hold more than one
          third of board seats.
        </p>

        <h3>Working Groups</h3>
        <p>
          Specific areas of the standard (e.g., payment protocols, authentication, SDK compatibility)
          may form working groups. Working groups produce proposals that go through the RFC process
          before being incorporated into the standard.
        </p>

        <div className="callout callout-note">
          The current governance model is intentionally minimal because NAIS is in early draft. As
          adoption grows, governance will be formalized through a community RFC process — not
          unilateral decisions.
        </div>
      </section>

      <section id="contributions">
        <h2>How to Contribute</h2>
        <p>All contributions happen through GitHub. There are four ways to contribute:</p>

        <ol>
          <li>
            <strong>Bug reports and clarifications:</strong> Open a GitHub Issue. Use the{' '}
            <em>spec-clarification</em> label if the text is ambiguous, or <em>spec-bug</em> if
            behavior is underspecified or contradictory.
          </li>
          <li>
            <strong>Small editorial fixes:</strong> Submit a pull request directly. Typos, grammar,
            broken links, and code sample fixes do not require an RFC.
          </li>
          <li>
            <strong>New optional fields:</strong> Open an issue with the <em>proposal</em> label.
            Describe the use case, the proposed field name and schema, and any backwards-compatibility
            considerations. Maintainers will review and, if there is consensus, ask you to write an
            RFC.
          </li>
          <li>
            <strong>Breaking changes:</strong> These require an RFC with a formal review period. See
            the RFC process below.
          </li>
        </ol>

        <p>
          All contributions must be made under the project&apos;s CC BY 4.0 license. By submitting a
          pull request, you agree that your contribution may be incorporated into the standard under
          that license.
        </p>
      </section>

      <section id="rfcs">
        <h2>RFC Process</h2>
        <p>
          Significant changes to NAIS — new required fields, behavioral changes, new protocol
          integrations, or breaking changes — are proposed as Requests for Comments (RFCs). The RFC
          process is adapted from the Rust and TC39 RFC processes.
        </p>

        <h3>RFC stages</h3>
        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Description</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>0 — Idea</strong></td>
              <td>Informal GitHub issue. Gauge community interest before writing a full proposal.</td>
              <td>No minimum</td>
            </tr>
            <tr>
              <td><strong>1 — Proposal</strong></td>
              <td>Written RFC document submitted as a PR to the <code>rfcs/</code> directory. Describes motivation, design, and alternatives.</td>
              <td>No minimum</td>
            </tr>
            <tr>
              <td><strong>2 — Review</strong></td>
              <td>RFC is open for community comment. Maintainers invite feedback from implementors.</td>
              <td>Minimum 21 days</td>
            </tr>
            <tr>
              <td><strong>3 — Accepted</strong></td>
              <td>RFC is accepted by maintainer consensus. Implementation begins.</td>
              <td>—</td>
            </tr>
            <tr>
              <td><strong>4 — Stable</strong></td>
              <td>RFC is incorporated into the specification. At least two independent implementations must exist.</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <p>
          RFCs may be rejected at any stage. Rejection is not permanent — an RFC may be revised and
          resubmitted if new information or use cases emerge.
        </p>

        <div className="callout">
          <strong>Write an RFC:</strong> Copy the{' '}
          <a
            href="https://github.com/nais-standard/nais/blob/main/rfcs/0000-template.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            RFC template
          </a>{' '}
          and open a pull request to the <code>rfcs/</code> directory.
        </div>
      </section>

      <section id="versioning">
        <h2>Versioning Policy</h2>
        <p>NAIS uses a two-level versioning scheme:</p>
        <ul>
          <li>
            <strong>TXT record version</strong> (<code>v=nais1</code>) — an integer that increments
            only on breaking changes to the DNS record format or the fundamental resolution model.
            Version 1 covers the entire 1.x line of the spec.
          </li>
          <li>
            <strong>Manifest spec version</strong> (<code>&quot;nais&quot;: &quot;1.0&quot;</code>) — a
            decimal string that increments the minor number for new optional fields, and the major
            number for breaking manifest schema changes.
          </li>
        </ul>

        <h3>Backwards compatibility commitment</h3>
        <p>
          Any manifest valid under NAIS 1.0 must remain valid under all 1.x versions. Resolvers
          compliant with 1.0 must be able to resolve any 1.x manifest without errors (unknown
          optional fields are ignored).
        </p>

        <h3>Deprecation policy</h3>
        <p>
          Deprecated features are marked in the specification with a deprecation notice and a target
          removal version. Deprecated features remain functional for at least 24 months and two major
          versions before removal.
        </p>
      </section>

      <section id="coc">
        <h2>Code of Conduct</h2>
        <p>
          NAIS follows the{' '}
          <a
            href="https://www.contributor-covenant.org/version/2/1/code_of_conduct/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Contributor Covenant v2.1
          </a>
          . All participants in GitHub issues, pull requests, and discussions are expected to
          adhere to this code. Maintainers are responsible for enforcement.
        </p>
        <p>
          Violations can be reported by email to the editorial board at{' '}
          <a href="mailto:conduct@nais.id" className="text-blue-600 hover:underline">
            conduct@nais.id
          </a>
          . Reports are handled confidentially.
        </p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4 my-4">
          {[
            {
              label: 'GitHub Discussions',
              desc: 'General questions, ideas, and community conversation.',
              href: 'https://github.com/nais-standard/nais/discussions',
            },
            {
              label: 'GitHub Issues',
              desc: 'Bug reports, spec clarifications, and formal proposals.',
              href: 'https://github.com/nais-standard/nais/issues',
            },
            {
              label: 'Editorial Board',
              desc: 'Governance matters and editorial decisions.',
              href: 'mailto:editors@nais.id',
            },
            {
              label: 'Code of Conduct',
              desc: 'Reporting conduct violations confidentially.',
              href: 'mailto:conduct@nais.id',
            },
          ].map(({ label, desc, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2563eb" strokeWidth="1.5" className="mt-0.5 flex-shrink-0" aria-hidden="true">
                <path d="M3 2h10v10M13 2 2 13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="font-medium text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </DocLayout>
  );
}
