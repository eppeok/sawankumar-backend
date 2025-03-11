// Privacy Policy Content
const privacyPolicyContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Privacy Policy - WhatsApp Integration Service</title>
    <style>
        body { font-family: Arial; max-width: 1000px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>Last updated: ${new Date().toLocaleDateString()}</p>

    <h2>1. Information Collection and Use</h2>
    <p>Our WhatsApp integration service collects and processes the following information:</p>
    <ul>
        <li>WhatsApp business account information</li>
        <li>Message content and metadata</li>
        <li>Phone numbers of message recipients</li>
        <li>Message timestamps and delivery status</li>
        <li>User interaction data</li>
    </ul>

    <h2>2. Data Processing and Storage</h2>
    <p>We process data in accordance with WhatsApp's Business API terms and conditions. All data is:</p>
    <ul>
        <li>Encrypted during transmission</li>
        <li>Stored securely on our servers</li>
        <li>Accessed only by authorized personnel</li>
        <li>Retained only as long as necessary for service provision</li>
    </ul>

    <h2>3. Third-Party Services</h2>
    <p>We integrate with:</p>
    <ul>
        <li>WhatsApp Business API</li>
        <li>GoHighLevel platform</li>
        <li>Digital Ocean hosting services</li>
    </ul>

    <h2>4. Data Protection Rights</h2>
    <p>Users have the right to:</p>
    <ul>
        <li>Access their personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request data deletion</li>
        <li>Withdraw consent for data processing</li>
    </ul>

    <h2>5. Contact Information</h2>
    <p>For privacy-related inquiries, contact us at:</p>
    <p>Email: dharmeshdiyora.dev@gmail.com</p>
</body>
</html>
`;

// Terms of Service Content
const termsOfServiceContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Terms of Service - WhatsApp Integration Service</title>
    <style>
        body { font-family: Arial; max-width: 1000px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p>Last updated: ${new Date().toLocaleDateString()}</p>

    <h2>1. Service Description</h2>
    <p>Our service provides:</p>
    <ul>
        <li>WhatsApp message integration with GoHighLevel</li>
        <li>Automated message handling and routing</li>
        <li>Message delivery tracking</li>
        <li>Customer interaction management</li>
    </ul>

    <h2>2. User Obligations</h2>
    <p>Users of this service must:</p>
    <ul>
        <li>Comply with WhatsApp's Business Solution Policy</li>
        <li>Obtain proper consent from message recipients</li>
        <li>Not use the service for spam or harassment</li>
        <li>Maintain security of access credentials</li>
        <li>Report any security incidents promptly</li>
    </ul>

    <h2>3. Service Limitations</h2>
    <p>The service is provided "as is" with:</p>
    <ul>
        <li>No guarantee of uninterrupted availability</li>
        <li>Dependence on third-party services (WhatsApp, GoHighLevel)</li>
        <li>Message delivery subject to WhatsApp's policies</li>
        <li>Rate limits and usage restrictions</li>
    </ul>

    <h2>4. Termination</h2>
    <p>We reserve the right to:</p>
    <ul>
        <li>Suspend service for policy violations</li>
        <li>Terminate accounts for abuse</li>
        <li>Modify service features with notice</li>
        <li>Discontinue service with reasonable notice</li>
    </ul>

    <h2>5. Liability</h2>
    <p>Our liability is limited to:</p>
    <ul>
        <li>Direct damages from willful misconduct</li>
        <li>The amount paid for services in the past month</li>
    </ul>

    <h2>6. Contact Information</h2>
    <p>For service-related inquiries:</p>
    <p>Email: dharmeshdiyora.dev@gmail.com</p>
</body>
</html>
`;

module.exports = {
    privacyPolicyContent,
    termsOfServiceContent
};