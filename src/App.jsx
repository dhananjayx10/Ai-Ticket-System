import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Clock, CheckCircle, AlertCircle, User, Bot, Ticket, Search, Filter, Plus, BarChart3, Settings } from 'lucide-react';

// Mock AI Classification Engine
class TicketClassifier {
  constructor() {
    this.categories = {
      'Authentication': {
        keywords: ['password', 'login', 'access', 'reset', 'forgot', 'incorrect', 'locked', 'signin'],
        priority: 'High',
        color: 'red',
        responseTemplate: this.getAuthTemplate
      },
      'HR_Services': {
        keywords: ['leave', 'balance', 'vacation', 'sick', 'pay', 'benefits', 'policy', 'time off'],
        priority: 'Medium',
        color: 'blue',
        responseTemplate: this.getHRTemplate
      },
      'IT_Support': {
        keywords: ['computer', 'software', 'network', 'printer', 'installation', 'hardware', 'slow'],
        priority: 'Medium',
        color: 'green',
        responseTemplate: this.getITTemplate
      },
      'System_Issues': {
        keywords: ['error', 'bug', 'crash', 'system', 'application', 'feature', 'not working'],
        priority: 'High',
        color: 'orange',
        responseTemplate: this.getSystemTemplate
      },
      'General_Inquiry': {
        keywords: [],
        priority: 'Low',
        color: 'gray',
        responseTemplate: this.getGeneralTemplate
      }
    };
  }

  classify(text) {
    const textLower = text.toLowerCase();
    let maxScore = 0;
    let bestCategory = 'General_Inquiry';
    
    for (const [category, config] of Object.entries(this.categories)) {
      if (category === 'General_Inquiry') continue;
      
      const score = config.keywords.reduce((acc, keyword) => {
        return acc + (textLower.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }
    
    const categoryConfig = this.categories[bestCategory];
    const confidence = maxScore > 0 ? Math.min(0.8 + (maxScore * 0.05), 0.98) : 0.3;
    
    return {
      category: bestCategory,
      confidence,
      priority: categoryConfig.priority,
      color: categoryConfig.color,
      response: categoryConfig.responseTemplate(text)
    };
  }

  getAuthTemplate(text) {
    return `Hello! I can help you with your password issue.

Here's how to reset your password:
1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset instructions
5. Follow the link to create a new password

If you continue to have issues, I'll escalate this to our IT team.`;
  }

  getHRTemplate(text) {
    return `Hi there! I can help you with your HR inquiry.

To check your leave balance:
1. Log into the employee portal
2. Navigate to "HR Services" → "Leave Management"
3. Your current balance will be displayed

If you need assistance accessing the portal or have other HR questions, I'll connect you with our HR team.`;
  }

  getITTemplate(text) {
    return `Hello! I'm here to help with your IT support request.

For common IT issues, try these steps:
1. Restart your computer/application
2. Check your network connection
3. Clear your browser cache if it's a web issue

If the problem persists, I'll create a ticket for our IT support team to assist you further.`;
  }

  getSystemTemplate(text) {
    return `Hi! I understand you're experiencing a system issue.

I've logged this as a high-priority ticket. Our technical team will:
1. Investigate the issue immediately
2. Provide updates within 2 hours
3. Work on a resolution

Thank you for reporting this - it helps us maintain system quality.`;
  }

  getGeneralTemplate(text) {
    return `Hello! Thank you for contacting support.

I've received your inquiry and it will be reviewed by our support team. You can expect a response within 24 hours.

If this is urgent, please call our support hotline at 1-800-SUPPORT.`;
  }
}

// Main App Component
export default function TicketClassificationSystem() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState('');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('submit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [classifier] = useState(new TicketClassifier());
  const [showTicketCreated, setShowTicketCreated] = useState(false);
  const [lastCreatedTicket, setLastCreatedTicket] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Calculate stats whenever tickets change
    const newStats = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {});
    setStats(newStats);
  }, [tickets]);

  const submitTicket = async () => {
    if (!newTicket.trim() || !userName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const classification = classifier.classify(newTicket);
    
    const ticket = {
      id: `TKT-${Date.now()}`,
      user: userName,
      text: newTicket,
      timestamp: new Date(),
      status: 'Processing',
      ...classification
    };
    
    setTickets(prev => [ticket, ...prev]);
    setLastCreatedTicket(ticket);
    setNewTicket('');
    setUserName('');
    setIsProcessing(false);
    setShowTicketCreated(true);
    
    // Simulate auto-response after a short delay
    setTimeout(() => {
      setTickets(prev => prev.map(t => 
        t.id === ticket.id ? { ...t, status: 'Responded' } : t
      ));
    }, 2000);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || ticket.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(classifier.categories);
  const priorityColors = {
    'High': 'text-red-600 bg-red-100',
    'Medium': 'text-yellow-600 bg-yellow-100',
    'Low': 'text-green-600 bg-green-100'
  };

  const statusIcons = {
    'Processing': <Clock className="w-4 h-4 text-yellow-500" />,
    'Responded': <CheckCircle className="w-4 h-4 text-green-500" />,
    'Escalated': <AlertCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Colorful gear wheels */}
                <div className="p-2 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-lg animate-pulse">
                  <Settings className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                {/* Small decorative gears */}
                <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
                  <Settings className="w-3 h-3 text-white animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                </div>
                <div className="absolute -bottom-1 -left-1 p-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full">
                  <Settings className="w-3 h-3 text-white animate-spin" style={{ animationDuration: '10s' }} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Ticket System</h1>
                <p className="text-sm text-gray-600">Intelligent Support Classification</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total Tickets: <span className="font-semibold">{tickets.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'submit', label: 'Submit Ticket', icon: Plus },
            { id: 'manage', label: 'Ticket Status', icon: Ticket },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showTicketCreated && lastCreatedTicket ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Created Successfully!</h2>
                <p className="text-gray-600">Your support request has been received and classified by our AI system.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Ticket ID</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-lg font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                        {lastCreatedTicket.id}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(lastCreatedTicket.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-medium">Processing</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${lastCreatedTicket.color}-100 text-${lastCreatedTicket.color}-800`}>
                      {lastCreatedTicket.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[lastCreatedTicket.priority]}`}>
                      {lastCreatedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">AI Classification Results</span>
                  <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    {Math.round(lastCreatedTicket.confidence * 100)}% Confidence
                  </span>
                </div>
                <p className="text-blue-900">
                  Your ticket has been automatically classified as <strong>{lastCreatedTicket.category.replace('_', ' ')}</strong> with <strong>{lastCreatedTicket.priority}</strong> priority. 
                  Our AI system will generate an appropriate response shortly.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setActiveTab('manage');
                    setShowTicketCreated(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Ticket Status
                </button>
                <button
                  onClick={() => {
                    setShowTicketCreated(false);
                    setLastCreatedTicket(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Create New Ticket
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Bot className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Submit Support Ticket</h2>
                  <p className="text-gray-600">AI will automatically classify and respond to your request</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue</label>
                  <textarea
                    value={newTicket}
                    onChange={(e) => setNewTicket(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  />
                </div>
                
                <button
                  onClick={submitTicket}
                  disabled={isProcessing || !newTicket.trim() || !userName.trim()}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tickets..."
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No tickets found</p>
                  <p className="text-gray-400">Submit a ticket to get started</p>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {statusIcons[ticket.status]}
                          <span className="text-sm font-medium text-gray-700">{ticket.status}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                          {ticket.priority} Priority
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${ticket.color}-100 text-${ticket.color}-700`}>
                          {ticket.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.timestamp.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{ticket.user}</span>
                      </div>
                      <p className="text-gray-900 mb-3">{ticket.text}</p>
                    </div>
                    
                    {ticket.status === 'Responded' && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">AI Response</span>
                          <span className="text-xs text-blue-600">
                            Confidence: {Math.round(ticket.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-blue-900 whitespace-pre-line">{ticket.response}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats).map(([category, count]) => {
                  const config = classifier.categories[category];
                  const percentage = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-${config.color}-500`} />
                        <span className="text-gray-700">{category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-${config.color}-500 h-2 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12 text-right">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response Time Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">&lt;2s</div>
                  <div className="text-sm text-blue-700">Avg Response Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{tickets.length}</div>
                  <div className="text-sm text-purple-700">Total Processed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">95%</div>
                  <div className="text-sm text-yellow-700">User Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {tickets.slice(0, 5).map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${ticket.color}-500`} />
                      <span className="text-gray-700">
                        {ticket.user} - {ticket.category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {statusIcons[ticket.status]}
                      <span className="text-sm text-gray-500">
                        {ticket.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}