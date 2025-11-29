// Simple email service using EmailJS (free service)
// Alternative: Connect to your backend API

interface EmailParams {
  to: string;
  subject?: string;
  body?: string;
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    console.log('Attempting to send email to:', params.to);
    
    // Try to use the backend API
    const response = await fetch('http://localhost:8001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        subject: params.subject || 'Workflow Notification',
        body: params.body || 'This is a notification from FlowForge workflow.',
      }),
    });

    const result = await response.json();
    console.log('Backend response:', result);

    if (response.ok && result.success) {
      console.log('✅ Email sent successfully to:', params.to);
      alert(`✅ Email sent successfully!\n\nTo: ${params.to}\nSubject: ${params.subject || 'Workflow Notification'}\n\nCheck your inbox!`);
      return true;
    } else {
      console.error('❌ Failed to send email:', result);
      alert(`❌ Failed to send email\n\nError: ${result.error || 'Unknown error'}\n\nTo: ${params.to}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error connecting to email service:', error);
    
    // Fallback: Show alert that email service is not available
    alert(`⚠️ Email Service Not Available\n\nThe email would be sent to: ${params.to}\n\nSubject: ${params.subject || 'Workflow Notification'}\n\nBody: ${params.body || 'Notification from FlowForge'}\n\n💡 Make sure the backend email service is running on port 8001`);
    return false;
  }
};
