import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        <p>
          Welcome to Dimond! By accessing and using our website (dimond.com) and purchasing our products, you agree to
          comply with and be bound by the following terms and conditions. Please read them carefully. If you do not
          agree with these terms, please do not use the site or make a purchase.
        </p>

        <h3>Eligibility</h3>
        <p>
          You must be at least 18 years old and legally able to enter into contracts to use our Site. By using the Site,
          you represent and warrant that you meet these eligibility requirements.
        </p>

        <h3>Account Registration</h3>
        <p>
          To participate in auctions and place bids, you must create an account on our Site. When registering, you agree
          to:
        </p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>
            Maintain the confidentiality of your account credentials and notify us immediately of any unauthorized
            access to your account
          </li>
          <li>Be responsible for all activities that occur under your account</li>
        </ul>

        <h3>Auctions & Bidding</h3>
        <p>
          All auctions on our Site are conducted in real-time or at scheduled times, depending on the auction type. You
          can place bids on items by:
        </p>
        <ul>
          <li>
            Bidding Rules: By placing a bid, you are making a legally binding offer to purchase the item. If you have
            the highest bid when the auction ends, you are required to complete the purchase.
          </li>
          <li>
            Bid Cancellation: Once placed, bids cannot be canceled or withdrawn. If you are the winning bidder, you are
            obligated to pay the bid amount.
          </li>
          <li>
            Reserve Price: Some items may have a reserve price. If the bidding does not meet the reserve price, we may
            cancel the transaction.
          </li>
        </ul>

        <h3>Winning Bid and Payment</h3>
        <p>
          Payment: If you win an auction, you agree to pay the bid amount plus any applicable taxes, fees, and shipping
          costs. Payments must be made through the methods specified on the Site.
        </p>
        <p>
          Failure to Pay: If you fail to make the required payment within the specified time, we may cancel the
          transaction, and you may be subject to penalties, including suspension from future auctions.
        </p>

        <h3>Fees</h3>
        <ul>
          <li>
            Listing Fees: Sellers may be required to pay a fee to list an item for auction on our Site. These fees are
            outlined in our fee schedule available on the Site.
          </li>
          <li>
            Transaction Fees: We may charge a transaction fee based on the final auction value, which will be specified
            at the time of the auction.
          </li>
        </ul>

        <h3>Seller Responsibilities</h3>
        <ul>
          <li>
            Item Description: Sellers must provide accurate and honest descriptions of the items they list for auction,
            including clear details about condition, defects, and authenticity.
          </li>
          <li>
            Shipping: Sellers are responsible for shipping the items to the winning bidder within the timeframe
            specified on the Site.
          </li>
          <li>
            Customer Service: Sellers must provide satisfactory customer service and resolve any disputes related to
            their items in a fair and timely manner.
          </li>
        </ul>

        <h3>Prohibited Activities</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>
            Engage in fraudulent activities, including placing fake bids, creating multiple accounts to manipulate
            auction outcomes, or misrepresenting items for sale.
          </li>
          <li>Interfere with or disrupt the Site's functionality or security.</li>
        </ul>

        <h3>Intellectual Property</h3>
        <p>
          Ownership: All content on the Site, including text, graphics, logos, images, and software, is the property of
          [Your Website Name] or our licensors and is protected by copyright, trademark, and other intellectual property
          laws.
        </p>
        <p>
          Limited License: We grant you a limited, non-exclusive, non-transferable license to access and use the Site
          for its intended purpose.
        </p>

        <h3>Privacy</h3>
        <p>
          Your use of the Site is also governed by our Privacy Policy, which outlines how we collect, use, and protect
          your personal information.
        </p>

        <h3>Limitation of Liability</h3>
        <p>
          To the fullest extent permitted by law, [Your Website Name] shall not be liable for any direct, indirect,
          incidental, special, or consequential damages arising from your use of the Site or any items purchased through
          the Site.
        </p>

        <h3>Dispute Resolution</h3>
        <p>
          Any disputes arising out of or related to these Terms and your use of the Site will be resolved through
          binding arbitration in accordance with the laws of [Your Country/State]. You agree to waive the right to
          participate in class actions, class arbitrations, or any other proceedings involving multiple parties.
        </p>

        <h3>Termination</h3>
        <p>
          We reserve the right to suspend or terminate your access to the Site at our discretion, without notice, for
          violations of these Terms or any other reason. If your account is terminated, any pending transactions or
          obligations will remain enforceable.
        </p>

        <h3>Changes to These Terms</h3>
        <p>
          We may update these Terms from time to time. The most current version will always be available on this page.
          By continuing to use the Site after changes are posted, you agree to be bound by the updated Terms.
        </p>

        <h3>Governing Law</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of [Your Country/State]. Any legal
          action or proceeding related to these Terms must be brought in the competent courts located in [Location].
        </p>
      </CardContent>
    </Card>
  )
}
