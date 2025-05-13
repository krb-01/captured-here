import Link from 'next/link';
import Layout from '@/components/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for <em>CAPTURED HERE</em></h1>
        <p className="mb-4"><strong>Effective Date:</strong> May 13, 2025</p>
        <p className="mb-6">We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use <em>CAPTURED HERE</em>, our web application.</p>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="mb-4">We do <strong>not</strong> collect personal information such as your name, email address, or phone number directly from you.</p>
        <p className="mb-4">However, we use third-party services to help us understand how users interact with our application. These services may collect certain technical and usage information, including:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Device type and browser</li>
          <li>Operating system</li>
          <li>IP address (may be anonymized)</li>
          <li>Pages visited and time spent</li>
          <li>Referring URLs</li>
        </ul>
        <p className="mb-4">The services we use include:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li><strong>Google Analytics</strong> (for usage analytics)</li>
          <li><strong>Firebase</strong> (for application infrastructure and analytics)</li>
        </ul>
        <p className="mb-6">This data is collected in an anonymized and aggregated manner and does not personally identify you.</p>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">2. Use of Cookies</h2>
        <p className="mb-4">We use cookies and similar technologies for analytics and functionality purposes.</p>
        <p className="mb-6">Where required by law (e.g., for users in the EU), we display a cookie consent banner to allow you to accept or reject non-essential cookies before they are set.</p>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">3. Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Access the data we collect about you</li>
          <li>Request deletion of your data</li>
          <li>Withdraw your consent for data processing</li>
        </ul>
        <p className="mb-6">To exercise these rights, please contact us at: <a href="mailto:support-team@kairiku-books.com" className="text-blue-600 hover:underline"><strong>support-team@kairiku-books.com</strong></a></p>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">4. Data Sharing</h2>
        <p className="mb-4">We do <strong>not</strong> sell or share your personal data with third parties.</p>
        <p className="mb-4">Usage data is processed by trusted service providers (such as Google and Firebase) under their respective privacy policies:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li><Link href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</Link></li>
          <li><Link href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Privacy and Security</Link></li>
        </ul>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">5. Changes to This Policy</h2>
        <p className="mb-6">We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.</p>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
        <p className="mb-6">If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:support-team@kairiku-books.com" className="text-blue-600 hover:underline"><strong>support-team@kairiku-books.com</strong></a></p>
        
        <hr className="my-6" />

        <h2 className="text-2xl font-semibold mb-3">7. Affiliate Disclosure</h2>
        <p className="mb-6"><em>CAPTURED HERE</em> is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As part of this program, we may earn a commission when you click on affiliate links and make qualifying purchases.</p>

        <hr className="my-6" />
      </div>
    </Layout>
  );
}
