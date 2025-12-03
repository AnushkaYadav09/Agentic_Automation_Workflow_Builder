# 📧 Workflow Automation Platform

A powerful, visual workflow automation platform for email management with role-based access control, scheduling capabilities, and professional email templates.

## 🌟 Overview

This platform enables teams to create, manage, and automate email workflows through an intuitive drag-and-drop interface. Built with React, TypeScript, and FastAPI, it provides enterprise-grade features including Google OAuth authentication, scheduled email delivery, file attachments, and comprehensive user activity tracking.

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control**: Three distinct user roles (Employee, Manager, Admin)
- **Google OAuth Integration**: Seamless sign-in with Google accounts
- **Email-Based Restrictions**: Configurable access control by email domain
- **Remember Me**: Persistent login with secure credential storage
- **Activity Logging**: Admin-only dashboard tracking all user logins and actions

### 📨 Email Workflow Management
- **Visual Workflow Builder**: Drag-and-drop interface for creating email workflows
- **Multiple Block Types**:
  - Webhook Trigger: Start workflows via HTTP requests
  - Database Query: Execute SQL queries and use results in emails
  - Loop Block: Iterate over data with multiple loop types
  - Send Email: Compose and send emails with dynamic content
  - Delay Block: Add time delays between actions
  - End Workflow: Gracefully terminate workflow execution

### ⏰ Advanced Scheduling
- **Flexible Scheduling Options**: One-time or recurring email delivery
- **Indian Standard Time (IST)**: Timezone-aware scheduling
- **Recurrence Patterns**: Daily, weekly, monthly, or custom intervals
- **File Attachments**: Support for multiple file types with base64 encoding
- **Link Attachments**: Include URLs in scheduled emails
- **Status Tracking**: Monitor pending, sent, and failed emails

### 📝 Professional Email Templates
- **Pre-built Templates**: 10+ professional templates including:
  - Weekly Status Reports
  - Project Updates
  - Meeting Invitations
  - Welcome Messages
  - Performance Reviews
  - And more...
- **Template Browser**: Easy-to-use interface for selecting and customizing templates
- **Dynamic Content**: Merge fields for personalization

### 🔄 Workflow Execution
- **Real-time Execution**: Immediate workflow processing
- **Execution Logs**: Detailed logging of each workflow step
- **Error Handling**: Graceful failure management with retry logic
- **Custom Actions**: Execute database queries within workflows

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive UI
- **Lucide React** for beautiful icons
- **React Flow** for visual workflow building
- **Date-fns** for date manipulation

### Backend
- **FastAPI** for high-performance API
- **Python 3.x** with async support
- **SMTP Integration** with Gmail
- **CORS Middleware** for cross-origin requests
- **Base64 Encoding** for file attachments

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Gmail account with App Password enabled

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Mini_Project-main1
```

2. **Setup Frontend**
```bash
cd Mini_Project-main/Blank-main
npm install
```

3. **Setup Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

### Running the Application

**Terminal 1 - Backend (Email Service):**
```bash
cd backend
venv\Scripts\python.exe send_email_simple.py
```
Backend runs on `http://localhost:8001`

**Terminal 2 - Frontend:**
```bash
cd Mini_Project-main/Blank-main
npm run dev
```
Frontend runs on `http://localhost:5173`

## 👥 User Roles & Permissions

### Employee
- Create and manage personal workflows
- Schedule emails
- Use email templates
- View own activity logs

### Manager
- All Employee permissions
- Access to team workflows
- View team activity logs
- Manage scheduled emails for team

### Admin
- Full system access
- User activity monitoring
- System configuration
- Access to all workflows and logs

**Default Admin**: `yadavanushka759@gmail.com`
**Default Manager**: `yadavanushka759@gmail.com`, `06kanishkaa@gmail.com`

## 📖 Usage Guide

### Creating a Workflow

1. **Login** with your Google account
2. **Navigate** to the workflow builder
3. **Drag blocks** from the sidebar onto the canvas
4. **Connect blocks** by dragging from output to input ports
5. **Configure** each block with required parameters
6. **Save** your workflow
7. **Run** immediately or schedule for later

### Scheduling an Email

1. Click **"Schedule Email"** button
2. Fill in recipient, subject, and body
3. Choose **schedule type** (one-time or recurring)
4. Select **date and time** (IST timezone)
5. Add **attachments** or **links** if needed
6. Click **"Schedule"** to confirm

### Using Templates

1. Open the **Template Browser**
2. Browse available templates
3. Click **"Use Template"** on your preferred option
4. Customize the content
5. Send or schedule the email

## 🔧 Configuration

### Email Settings
Configure SMTP settings in `backend/.env`:
- Use Gmail App Passwords (not regular password)
- Enable "Less secure app access" if needed
- Ensure ports 465 (SSL) or 587 (TLS) are not blocked

### Google OAuth
Update `Mini_Project-main/Blank-main/vite.config.ts` with your Google Client ID:
```typescript
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## 📊 Features in Detail

### Workflow Execution Engine
- Asynchronous processing
- Real-time status updates
- Comprehensive error logging
- Automatic retry on transient failures

### Database Integration
- SQL query execution
- Result set handling
- Dynamic data injection into emails

### Loop Processing
- Array iteration
- Range-based loops
- Custom iteration logic
- Nested loop support

## 🐛 Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify Gmail App Password is correct
- Ensure firewall allows ports 465/587
- Check backend logs for detailed errors

### Google OAuth Issues
- Verify Client ID configuration
- Check authorized origins in Google Console
- Clear browser cache and cookies

### Workflow Execution Fails
- Review execution logs in the UI
- Check database connectivity
- Verify all required fields are filled

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Authors

Developed with ❤️ for efficient workflow automation

## 🙏 Acknowledgments

- React Flow for the visual workflow builder
- FastAPI for the robust backend framework
- Tailwind CSS for the beautiful UI components
- Lucide for the icon library

---
