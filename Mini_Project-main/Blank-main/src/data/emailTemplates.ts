export interface EmailTemplate {
  id: string;
  name: string;
  category: 'weekly-report' | 'monthly-report' | 'project-update' | 'meeting-summary' | 'status-update';
  subject: string;
  body: string;
  description: string;
  icon: string;
}

export const emailTemplates: EmailTemplate[] = [
  // Weekly Report Templates
  {
    id: 'weekly-report-1',
    name: 'Weekly Progress Report',
    category: 'weekly-report',
    subject: 'Weekly Progress Report - [Week of {date}]',
    description: 'Standard weekly progress report for team updates',
    icon: '📊',
    body: `Dear Team,

Here is the weekly progress report for the week of {date}:

📈 KEY ACCOMPLISHMENTS:
• [Achievement 1]
• [Achievement 2]
• [Achievement 3]

🎯 ONGOING TASKS:
• [Task 1] - [Progress %]
• [Task 2] - [Progress %]
• [Task 3] - [Progress %]

⚠️ CHALLENGES/BLOCKERS:
• [Challenge 1]
• [Challenge 2]

📅 NEXT WEEK'S PRIORITIES:
• [Priority 1]
• [Priority 2]
• [Priority 3]

📊 METRICS:
• Tasks Completed: [Number]
• Tasks In Progress: [Number]
• Overall Progress: [Percentage]%

Please let me know if you have any questions or need additional information.

Best regards,
[Your Name]`
  },
  {
    id: 'weekly-report-2',
    name: 'Executive Weekly Summary',
    category: 'weekly-report',
    subject: 'Executive Summary - Week {week_number}',
    description: 'Concise weekly summary for executives and management',
    icon: '📋',
    body: `Dear [Manager Name],

WEEKLY SUMMARY - WEEK {week_number}

🎯 HIGHLIGHTS:
{highlight_1}
{highlight_2}
{highlight_3}

📊 KEY METRICS:
• Productivity: [X]%
• Deliverables Completed: [X]/[Y]
• Team Velocity: [X] points

⚡ QUICK WINS:
• {win_1}
• {win_2}

🚧 ATTENTION NEEDED:
• {issue_1}
• {issue_2}

📅 NEXT WEEK FOCUS:
{focus_area_1}
{focus_area_2}

Available for discussion at your convenience.

Regards,
[Your Name]`
  },
  {
    id: 'weekly-report-3',
    name: 'Team Activity Report',
    category: 'weekly-report',
    subject: 'Team Activity Report - {date_range}',
    description: 'Detailed team activity and collaboration report',
    icon: '👥',
    body: `Hi Team,

TEAM ACTIVITY REPORT
Period: {date_range}

👥 TEAM ACTIVITIES:
• Meetings Conducted: [Number]
• Collaborative Sessions: [Number]
• Code Reviews: [Number]

✅ COMPLETED DELIVERABLES:
1. [Deliverable 1] - [Owner]
2. [Deliverable 2] - [Owner]
3. [Deliverable 3] - [Owner]

🔄 IN PROGRESS:
1. [Task 1] - [Owner] - [Status]
2. [Task 2] - [Owner] - [Status]

📈 TEAM PERFORMANCE:
• Sprint Velocity: [X] points
• Bug Resolution Rate: [X]%
• Code Quality Score: [X]/10

💡 LEARNINGS & IMPROVEMENTS:
• {learning_1}
• {learning_2}

🎉 TEAM RECOGNITION:
• {recognition_1}
• {recognition_2}

Looking forward to another productive week!

Best,
[Your Name]`
  },

  // Monthly Report Templates
  {
    id: 'monthly-report-1',
    name: 'Monthly Performance Report',
    category: 'monthly-report',
    subject: 'Monthly Performance Report - {month} {year}',
    description: 'Comprehensive monthly performance overview',
    icon: '📅',
    body: `Dear Stakeholders,

MONTHLY PERFORMANCE REPORT
{month} {year}

📊 EXECUTIVE SUMMARY:
{executive_summary}

🎯 GOALS ACHIEVED:
• {goal_1} - ✅ Completed
• {goal_2} - ✅ Completed
• {goal_3} - 🔄 In Progress

📈 KEY METRICS:
• Overall Progress: [X]%
• Budget Utilization: [X]%
• Resource Efficiency: [X]%
• Customer Satisfaction: [X]/10

🏆 MAJOR ACHIEVEMENTS:
1. {achievement_1}
2. {achievement_2}
3. {achievement_3}

⚠️ CHALLENGES & MITIGATION:
• Challenge: {challenge_1}
  Mitigation: {mitigation_1}

📅 NEXT MONTH OBJECTIVES:
1. {objective_1}
2. {objective_2}
3. {objective_3}

💰 FINANCIAL SUMMARY:
• Budget: [Amount]
• Spent: [Amount]
• Remaining: [Amount]

Thank you for your continued support.

Best regards,
[Your Name]
[Your Title]`
  },

  // Project Update Templates
  {
    id: 'project-update-1',
    name: 'Project Status Update',
    category: 'project-update',
    subject: 'Project Update: {project_name} - {date}',
    description: 'Regular project status update for stakeholders',
    icon: '🚀',
    body: `Hi Team,

PROJECT STATUS UPDATE
Project: {project_name}
Date: {date}

📊 PROJECT HEALTH: [Green/Yellow/Red]

✅ COMPLETED THIS WEEK:
• {completed_1}
• {completed_2}
• {completed_3}

🔄 IN PROGRESS:
• {progress_1} - [X]% complete
• {progress_2} - [X]% complete

📅 UPCOMING MILESTONES:
• {milestone_1} - [Date]
• {milestone_2} - [Date]

⚠️ RISKS & ISSUES:
• {risk_1} - [Impact: High/Medium/Low]
  Mitigation: {mitigation}

👥 RESOURCE STATUS:
• Team Size: [X] members
• Availability: [X]%

💰 BUDGET STATUS:
• Allocated: [Amount]
• Spent: [Amount] ([X]%)
• Forecast: On Track / At Risk

📈 PROGRESS METRICS:
• Overall Completion: [X]%
• On Schedule: Yes/No
• Quality Score: [X]/10

Please reach out with any questions.

Regards,
[Project Manager Name]`
  },

  // Meeting Summary Templates
  {
    id: 'meeting-summary-1',
    name: 'Meeting Minutes',
    category: 'meeting-summary',
    subject: 'Meeting Minutes - {meeting_title} - {date}',
    description: 'Professional meeting minutes and action items',
    icon: '📝',
    body: `MEETING MINUTES

Meeting: {meeting_title}
Date: {date}
Time: {time}
Location: {location}

👥 ATTENDEES:
• {attendee_1}
• {attendee_2}
• {attendee_3}

📋 AGENDA:
1. {agenda_item_1}
2. {agenda_item_2}
3. {agenda_item_3}

💬 DISCUSSION SUMMARY:
{discussion_summary}

✅ DECISIONS MADE:
• {decision_1}
• {decision_2}

📌 ACTION ITEMS:
1. {action_1} - Owner: {owner_1} - Due: {due_date_1}
2. {action_2} - Owner: {owner_2} - Due: {due_date_2}
3. {action_3} - Owner: {owner_3} - Due: {due_date_3}

📅 NEXT MEETING:
Date: {next_meeting_date}
Agenda: {next_agenda}

Please review and confirm if any corrections are needed.

Best regards,
[Your Name]`
  },

  // Status Update Templates
  {
    id: 'status-update-1',
    name: 'Quick Status Update',
    category: 'status-update',
    subject: 'Status Update - {date}',
    description: 'Brief daily or weekly status update',
    icon: '⚡',
    body: `Hi Team,

QUICK STATUS UPDATE - {date}

✅ DONE:
• {done_1}
• {done_2}

🔄 DOING:
• {doing_1}
• {doing_2}

📅 PLANNED:
• {planned_1}
• {planned_2}

🚧 BLOCKERS:
• {blocker_1}

Let me know if you need any clarification.

Thanks,
[Your Name]`
  },

  {
    id: 'weekly-report-4',
    name: 'Engineering Weekly Report',
    category: 'weekly-report',
    subject: 'Engineering Weekly Report - Week {week_number}',
    description: 'Technical weekly report for engineering teams',
    icon: '⚙️',
    body: `Engineering Weekly Report
Week {week_number} - {date_range}

🔧 DEVELOPMENT ACTIVITIES:
• Features Shipped: [X]
• Bugs Fixed: [X]
• Code Reviews: [X]
• Pull Requests Merged: [X]

📊 CODE METRICS:
• Lines of Code: [X]
• Test Coverage: [X]%
• Build Success Rate: [X]%
• Deployment Frequency: [X]

🐛 BUG REPORT:
• New Bugs: [X]
• Resolved: [X]
• Open: [X]
• Critical: [X]

🚀 RELEASES:
• {release_1} - [Version] - [Date]
• {release_2} - [Version] - [Date]

🔐 SECURITY & PERFORMANCE:
• Security Vulnerabilities: [X]
• Performance Improvements: {improvement}
• System Uptime: [X]%

📚 TECHNICAL DEBT:
• Items Addressed: [X]
• Remaining: [X]

👨‍💻 TEAM DEVELOPMENT:
• Training Sessions: {training}
• Knowledge Sharing: {sharing}

Best regards,
[Engineering Lead]`
  }
];

export const getTemplatesByCategory = (category: EmailTemplate['category']) => {
  return emailTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return emailTemplates.find(template => template.id === id);
};
