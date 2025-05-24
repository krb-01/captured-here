// src/app/terms-of-service/page.tsx
import Link from 'next/link';
// import Layout from '@/components/Layout'; // Layout import removed

export default function TermsOfServicePage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    // Layout wrapper removed, applying similar styling as privacy-policy page
    <div className="max-w-[1280px] mx-auto px-4 py-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Terms of Service for <em>CAPTURED HERE</em></h1>
      <p className="mb-4"><strong>Effective Date:</strong> {formattedDate}</p>
      <p className="mb-6">
        Welcome to our website (hereinafter referred to as "the Site"). By using the Site, you agree to comply with and be bound by the following terms and conditions of use (hereinafter referred to as "these Terms"). Please review these Terms carefully.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">1. About This Service</h2>
      <p className="mb-4">
        The Site aims to provide information about photography art books and their shooting locations. While we strive for the information to be a helpful reference for users, we do not guarantee its completeness, accuracy, or timeliness.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">2. Map Information</h2>
      <p className="mb-4">
        Map information used on the Site, particularly regarding the display of national borders and territorial attributions, is based on referenced data sources (e.g., Natural Earth Data). Such geographical information can be highly sensitive and may include areas where international disagreements or disputes exist. The display on the Site does not endorse or express any particular political stance and is shown purely as part of the information provided. Users should understand the context of this information and use it at their own discretion.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">3. Information on Book Shooting Locations</h2>
      <p className="mb-4">
        Information regarding the shooting locations of books on the Site may include estimations derived from AI analysis of book content and related information. Therefore, there is a possibility that such information may contain errors. While the Site endeavors to ensure the accuracy of this information, it is not guaranteed.
      </p>
      <p className="mb-4">
        If you find any errors in the information, please contact us at the email address below. We will review and make corrections where possible.
      </p>
      <p className="mb-4">
        Contact Email: <a href="mailto:support-team@kairiku-books.com" className="text-blue-600 hover:underline"><strong>support-team@kairiku-books.com</strong></a>
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property Rights</h2>
      <p className="mb-4">
        Copyrights and other intellectual property rights related to content on the Site (including text, images, map data, book information, etc.) belong to the Site or to third parties who have legitimate rights. Unauthorized use (including reproduction, transmission, distribution, modification, etc.) of this content beyond the scope permitted by law is prohibited.
      </p>
      <p className="mb-4">
        Book cover images may be displayed for the purpose of referencing product pages on Amazon.co.jp, in accordance with Amazon's terms.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">5. Amazon Associates Program</h2>
      <p className="mb-4">
        <em>CAPTURED HERE</em> is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.co.jp. As an Amazon Associate, we earn from qualifying purchases. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">6. Disclaimer</h2>
      <p className="mb-4">
        The Site shall not be liable for any damages incurred by users as a result of using the Site, except in cases of willful misconduct or gross negligence on the part of the Site.
      </p>
      <p className="mb-4">
        The Site assumes no responsibility for the content or services of external sites linked from the Site.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">7. Changes to Terms of Service</h2>
      <p className="mb-4">
        The Site may change these Terms as necessary. The revised Terms of Service shall become effective from the time they are posted on the Site.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-3">8. Governing Law and Jurisdiction</h2>
      <p className="mb-4">
        These Terms shall be governed by and construed in accordance with the laws of Japan. Any disputes arising in connection with this service shall be subject to the exclusive jurisdiction of the Hiroshima District Court in the first instance.
      </p>

      <hr className="my-6" />
      

    </div>
  );
}
