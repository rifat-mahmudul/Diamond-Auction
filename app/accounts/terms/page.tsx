// "use client"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useEffect, useState } from "react"

// export default function PrivacyPolicyPage() {

//   const [privacyData, setPrivacyData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/policy`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjNjNkOGRlMTczNTI3NjI5NzQ2MGIiLCJpYXQiOjE3NDU2NjQ5MjUsImV4cCI6MTc0NjI2OTcyNX0.CqH9So7JTspw-P3l-W91lNMTn1gUTFRMkQm8siZIf2s`
//         }
//       });
//       const data = await response.json();

//       setPrivacyData(data.data);
//     };

//     fetchData();
//   }, []);

//   console.log(privacyData)

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Privacy Policy</CardTitle>
//       </CardHeader>
//       <CardContent className="prose max-w-none">
//         <p>
//           At Dimond, we value and respect your privacy. This Privacy Policy explains how we collect, use, disclose, and
//           safeguard your personal information when you visit our site and use our services.
//         </p>
//         <p>
//           By using our website, you agree to the practices described in this Privacy Policy. Please read it carefully to
//           understand our views and practices regarding your personal information.
//         </p>

//         <h3>Information We Collect</h3>
//         <p>We collect various types of information to provide and improve our auction services, including:</p>
//         <ul>
//           <li>
//             Personal Information: When you create an account, place a bid, or contact us, we may collect your name,
//             email address, phone number, billing address, shipping address, and payment details.
//           </li>
//           <li>
//             Bidding Information: We collect details about your bidding activity, including bids placed, items purchased,
//             and payment history.
//           </li>
//           <li>
//             Device and Technical Information: When you access our site, we may collect your IP address, browser type,
//             device type, and other technical information.
//           </li>
//           <li>
//             Cookies and Tracking Technologies: We use cookies, web beacons, and other tracking technologies to enhance
//             your experience and collect information about how you use our site.
//           </li>
//         </ul>

//         <h3>How We Use Your Information</h3>
//         <p>We use the information we collect to:</p>
//         <ul>
//           <li>
//             Provide and manage the auction services, including processing bids, managing payments, and shipping orders.
//           </li>
//           <li>Communicate with you about your account, bids, and purchases.</li>
//           <li>Personalize your experience on our site and recommend relevant products or auctions.</li>
//           <li>Ensure compliance with our terms of service, legal obligations, and prevent fraud.</li>
//         </ul>

//         <h3>How We Share Your Information</h3>
//         <p>We may share your data with:</p>
//         <ul>
//           <li>
//             Service Providers: We may share your data with trusted third-party service providers who assist us in
//             operating the Site, processing payments, and fulfilling orders.
//           </li>
//           <li>
//             Legal Requirements: We may disclose your personal information in response to a legal or regulatory request,
//             court order, or government request.
//           </li>
//           <li>
//             Business Transfers: In the event of a merger, acquisition, or sale of assets, your personal information may
//             be transferred as part of the transaction.
//           </li>
//         </ul>

//         <h3>Data Security</h3>
//         <p>
//           We take the security of your personal information seriously and use industry-standard security measures to
//           protect it. However, no data transmission over the internet is completely secure, and we cannot guarantee the
//           absolute security of your information.
//         </p>

//         <h3>Your Rights</h3>
//         <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
//         <ul>
//           <li>The right to access your personal information</li>
//           <li>The right to delete your personal information, subject to legal and contractual obligations</li>
//           <li>The right to withdraw consent where we process your information based on consent</li>
//           <li>The right to object to certain processing of your information</li>
//         </ul>
//         <p>If you wish to exercise any of these rights, please contact us at [contact@example.com].</p>

//         <h3>Data Retention</h3>
//         <p>
//           We retain your personal information for as long as necessary to provide services, comply with legal
//           obligations, and resolve disputes. Once your data is no longer needed, we will securely delete or anonymize
//           it.
//         </p>

//         <h3>Cookies</h3>
//         <p>
//           We use cookies to enhance your browsing experience. A cookie is a small file stored on your device that helps
//           us remember your preferences, analyze site usage, and protect your data when you return to our site.
//         </p>

//         <h3>Children&apos;s Privacy</h3>
//         <p>
//           Our site is not intended for children under the age of 13, and we do not knowingly collect personal
//           information from children. If we become aware that we have inadvertently collected personal information from a
//           child under 13, we will take steps to delete that information.
//         </p>

//         <h3>Changes to This Privacy Policy</h3>
//         <p>
//           We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the
//           "Effective Date" at the top will be updated. We encourage you to review this policy periodically to stay
//           informed about how we protect your data.
//         </p>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"

interface PolicySection {
  _id: string;
  text: string;
}

export default function PrivacyPolicyPage() {

  const [privacyData, setPrivacyData] = useState<PolicySection[]>([]);
  const session = useSession();
  const token = session?.data?.accessToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/terms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        setPrivacyData(data.data);
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      }
    };

    fetchData();
  }, [token]);

  console.log(privacyData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-non mt-5">
        {privacyData.length === 0 ? (
          <p>Loading privacy policy...</p>
        ) : (
          privacyData.map((section) => (
            <div key={section._id} className="mb-6">
              <p>{section.text}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

