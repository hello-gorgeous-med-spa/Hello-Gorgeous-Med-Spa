"use client";

import { useState, useEffect } from "react";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "sending" | "sent" | "failed";
  recipientCount: number;
  sentAt?: string;
  openRate?: number;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "botox-special",
    name: "Botox Special",
    subject: "💉 Exclusive Botox Offer - $10/unit!",
    description: "Promote your Botox pricing special",
    category: "Promotions",
  },
  {
    id: "solaria-launch",
    name: "Solaria CO2 Launch",
    subject: "✨ NEW: Solaria CO2 Laser Now Available!",
    description: "Announce the new Solaria laser treatment",
    category: "New Services",
  },
  {
    id: "morpheus8-promo",
    name: "Morpheus8 Promo",
    subject: "🔥 Tighten & Contour with Morpheus8",
    description: "RF Microneedling promotion",
    category: "Promotions",
  },
  {
    id: "weight-loss",
    name: "Weight Loss Program",
    subject: "🏃‍♀️ Transform Your Body - Medical Weight Loss",
    description: "Semaglutide/Tirzepatide promotion",
    category: "Promotions",
  },
  {
    id: "monthly-newsletter",
    name: "Monthly Newsletter",
    subject: "💕 Hello Gorgeous - March Updates",
    description: "Monthly news and specials",
    category: "Newsletter",
  },
  {
    id: "birthday",
    name: "Birthday Special",
    subject: "🎂 Happy Birthday! A Gift Just For You",
    description: "Birthday discount offer",
    category: "Automated",
  },
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "💖 Welcome to Hello Gorgeous Med Spa!",
    description: "New client welcome message",
    category: "Automated",
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminder",
    subject: "📅 Your Appointment Tomorrow",
    description: "24-hour appointment reminder",
    category: "Automated",
  },
  {
    id: "custom",
    name: "Custom Email",
    subject: "",
    description: "Create your own email from scratch",
    category: "Custom",
  },
];

const TEMPLATE_CONTENT: Record<string, string> = {
  "botox-special": `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
  <div style="background: linear-gradient(135deg, #E91E8C 0%, #FF69B4 100%); padding: 40px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">HELLO GORGEOUS</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">MED SPA</p>
  </div>
  
  <div style="padding: 40px 30px;">
    <h2 style="color: #E91E8C; text-align: center; font-size: 24px;">💉 Exclusive Botox Special</h2>
    
    <div style="background: #FFF0F5; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
      <p style="font-size: 48px; font-weight: bold; color: #E91E8C; margin: 0;">$10</p>
      <p style="font-size: 18px; color: #666; margin: 5px 0;">per unit</p>
      <p style="font-size: 14px; color: #999; text-decoration: line-through;">Regular $14/unit</p>
    </div>
    
    <p style="color: #333; line-height: 1.6;">Hi {{first_name}},</p>
    <p style="color: #333; line-height: 1.6;">For a limited time, enjoy our exclusive Botox pricing at just <strong>$10 per unit</strong>!</p>
    
    <ul style="color: #333; line-height: 1.8;">
      <li>Quick 15-minute treatment</li>
      <li>No downtime</li>
      <li>Results in 3-5 days</li>
      <li>Lasts 3-4 months</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://hellogorgeousmedspa.com/book" style="background: #E91E8C; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">BOOK NOW</a>
    </div>
  </div>
  
  <div style="background: #f8f8f8; padding: 30px; text-align: center;">
    <p style="color: #666; margin: 0 0 10px 0;">Hello Gorgeous Med Spa</p>
    <p style="color: #999; margin: 0; font-size: 14px;">74 W Washington St, Oswego, IL</p>
    <p style="color: #999; margin: 5px 0; font-size: 14px;">📞 630-636-6193</p>
    <p style="color: #999; margin: 15px 0 0 0; font-size: 12px;">
      <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
    </p>
  </div>
</div>
  `,
  "solaria-launch": `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000;">
  <div style="background: linear-gradient(135deg, #E91E8C 0%, #FF69B4 100%); padding: 40px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">HELLO GORGEOUS</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">MED SPA</p>
  </div>
  
  <div style="background: #000; padding: 40px 30px; text-align: center;">
    <p style="color: #E91E8C; font-size: 14px; letter-spacing: 3px; margin: 0;">NOW AVAILABLE</p>
    <h2 style="color: white; font-size: 32px; margin: 15px 0;">SOLARIA CO2 LASER</h2>
    <p style="color: #ccc; font-size: 16px; margin: 0;">by InMode</p>
  </div>
  
  <div style="background: #111; padding: 30px;">
    <p style="color: #ccc; line-height: 1.6;">Hi {{first_name}},</p>
    <p style="color: #ccc; line-height: 1.6;">We're thrilled to announce the arrival of the <strong style="color: #E91E8C;">Solaria CO2 Fractional Laser</strong> at Hello Gorgeous Med Spa!</p>
    
    <div style="background: #222; border-radius: 10px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #E91E8C; margin: 0 0 15px 0;">What it treats:</h3>
      <ul style="color: #ccc; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Sun damage & age spots</li>
        <li>Fine lines & wrinkles</li>
        <li>Uneven skin texture</li>
        <li>Acne scarring</li>
      </ul>
    </div>
    
    <div style="background: linear-gradient(135deg, #E91E8C 0%, #FF69B4 100%); border-radius: 10px; padding: 25px; text-align: center; margin: 20px 0;">
      <p style="color: white; font-size: 14px; margin: 0;">VIP LAUNCH SPECIAL</p>
      <p style="color: white; font-size: 36px; font-weight: bold; margin: 10px 0;">$1,895</p>
      <p style="color: rgba(255,255,255,0.7); font-size: 14px; text-decoration: line-through; margin: 0;">Regular $2,500</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://hellogorgeousmedspa.com/book" style="background: #E91E8C; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">BOOK CONSULTATION</a>
    </div>
  </div>
  
  <div style="background: #000; padding: 30px; text-align: center; border-top: 1px solid #333;">
    <p style="color: #666; margin: 0 0 10px 0;">Hello Gorgeous Med Spa</p>
    <p style="color: #555; margin: 0; font-size: 14px;">74 W Washington St, Oswego, IL</p>
    <p style="color: #555; margin: 5px 0; font-size: 14px;">📞 630-636-6193</p>
    <p style="color: #444; margin: 15px 0 0 0; font-size: 12px;">
      <a href="{{unsubscribe_url}}" style="color: #444;">Unsubscribe</a>
    </p>
  </div>
</div>
  `,
  "welcome": `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
  <div style="background: linear-gradient(135deg, #E91E8C 0%, #FF69B4 100%); padding: 40px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">HELLO GORGEOUS</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">MED SPA</p>
  </div>
  
  <div style="padding: 40px 30px;">
    <h2 style="color: #E91E8C; text-align: center; font-size: 24px;">Welcome to the Family! 💕</h2>
    
    <p style="color: #333; line-height: 1.6;">Hi {{first_name}},</p>
    <p style="color: #333; line-height: 1.6;">Thank you for choosing Hello Gorgeous Med Spa! We're so excited to have you as part of our family.</p>
    
    <div style="background: #FFF0F5; border-radius: 10px; padding: 25px; margin: 25px 0;">
      <h3 style="color: #E91E8C; margin: 0 0 15px 0;">🎁 New Client Special</h3>
      <p style="color: #333; margin: 0; font-size: 18px;"><strong>10% OFF</strong> your first treatment!</p>
      <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Use code: <strong>GORGEOUS10</strong></p>
    </div>
    
    <h3 style="color: #333;">Our Most Popular Services:</h3>
    <ul style="color: #333; line-height: 1.8;">
      <li><strong>Botox & Fillers</strong> - Smooth wrinkles, restore volume</li>
      <li><strong>Morpheus8</strong> - RF microneedling for skin tightening</li>
      <li><strong>Solaria CO2 Laser</strong> - Advanced skin resurfacing</li>
      <li><strong>Medical Weight Loss</strong> - Semaglutide programs</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://hellogorgeousmedspa.com/book" style="background: #E91E8C; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">BOOK YOUR FIRST APPOINTMENT</a>
    </div>
    
    <p style="color: #666; text-align: center; font-style: italic;">We can't wait to help you look and feel gorgeous!</p>
  </div>
  
  <div style="background: #f8f8f8; padding: 30px; text-align: center;">
    <p style="color: #666; margin: 0 0 10px 0;">Hello Gorgeous Med Spa</p>
    <p style="color: #999; margin: 0; font-size: 14px;">74 W Washington St, Oswego, IL</p>
    <p style="color: #999; margin: 5px 0; font-size: 14px;">📞 630-636-6193</p>
  </div>
</div>
  `,
};

export default function EmailCampaignsPage() {
  const [activeTab, setActiveTab] = useState<"create" | "campaigns" | "templates">("create");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  
  const [emailForm, setEmailForm] = useState({
    subject: "",
    fromName: "Hello Gorgeous Med Spa",
    fromEmail: "hello.gorgeous@hellogorgeousmedspa.com",
    replyTo: "hellogorgeousskin@yahoo.com",
    htmlContent: "",
  });

  useEffect(() => {
    fetchClients();
    fetchCampaigns();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients?limit=500");
      if (response.ok) {
        const data = await response.json();
        const clientsWithEmail = (data.clients || []).filter((c: Client) => c.email);
        setClients(clientsWithEmail);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/email-campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setEmailForm((prev) => ({
        ...prev,
        subject: template.subject,
        htmlContent: TEMPLATE_CONTENT[templateId] || "",
      }));
      setPreviewHtml(TEMPLATE_CONTENT[templateId] || "");
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients(new Set());
    } else {
      const filtered = filteredClients.map((c) => c.id);
      setSelectedClients(new Set(filtered));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectClient = (clientId: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);
  };

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.first_name?.toLowerCase().includes(query) ||
      client.last_name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query)
    );
  });

  const handleSendCampaign = async () => {
    if (selectedClients.size === 0) {
      alert("Please select at least one recipient");
      return;
    }
    if (!emailForm.subject) {
      alert("Please enter a subject line");
      return;
    }
    if (!emailForm.htmlContent) {
      alert("Please select a template or enter email content");
      return;
    }

    setIsSending(true);

    try {
      const recipients = clients.filter((c) => selectedClients.has(c.id));
      
      const response = await fetch("/api/email-campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailForm.subject,
          fromName: emailForm.fromName,
          fromEmail: emailForm.fromEmail,
          replyTo: emailForm.replyTo,
          htmlContent: emailForm.htmlContent,
          recipients: recipients.map((c) => ({
            email: c.email,
            firstName: c.first_name,
            lastName: c.last_name,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`✅ Campaign sent to ${result.sentCount} recipients!`);
        setSelectedClients(new Set());
        setSelectAll(false);
        fetchCampaigns();
      } else {
        alert(`❌ Failed to send campaign: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign. Check console for details.");
    }

    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-pink-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-2">
            📧 Email Campaigns
          </h1>
          <p className="text-gray-600 text-lg">
            Send professional marketing emails to your clients
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "create", label: "Create Campaign", icon: "✉️" },
            { id: "campaigns", label: "Past Campaigns", icon: "📊" },
            { id: "templates", label: "Templates", icon: "📋" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-pink-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Email Builder */}
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
                <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                  <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                  Choose Template
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {EMAIL_TEMPLATES.slice(0, 6).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTemplate === template.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="font-medium text-gray-800">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Details */}
              <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
                <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                  <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                  Email Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Subject Line</label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="Enter email subject..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">From Name</label>
                      <input
                        type="text"
                        value={emailForm.fromName}
                        onChange={(e) => setEmailForm({ ...emailForm, fromName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">Reply-To</label>
                      <input
                        type="email"
                        value={emailForm.replyTo}
                        onChange={(e) => setEmailForm({ ...emailForm, replyTo: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
                <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                  <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                  Select Recipients
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {selectedClients.size} selected
                  </span>
                </h2>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none text-gray-900"
                  />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium"
                  >
                    {selectAll ? "Deselect All" : "Select All"}
                  </button>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{filteredClients.length} clients with email</span>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
                  {filteredClients.slice(0, 50).map((client) => (
                    <label
                      key={client.id}
                      className="flex items-center gap-3 p-3 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClients.has(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                        className="w-4 h-4 text-pink-500 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {client.first_name} {client.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </label>
                  ))}
                  {filteredClients.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No clients found with email addresses
                    </div>
                  )}
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendCampaign}
                disabled={isSending || selectedClients.size === 0}
                className={`w-full py-5 rounded-2xl font-bold text-xl text-white transition-all shadow-xl ${
                  isSending || selectedClients.size === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-400 hover:via-pink-500 hover:to-purple-500"
                }`}
              >
                {isSending ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  `📧 Send to ${selectedClients.size} Recipients`
                )}
              </button>
            </div>

            {/* Right: Preview */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg sticky top-8">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">Email Preview</h2>
              
              {previewHtml ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Subject:</strong> {emailForm.subject}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>From:</strong> {emailForm.fromName} &lt;{emailForm.fromEmail}&gt;
                    </p>
                  </div>
                  <div 
                    className="p-4 max-h-[600px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: previewHtml.replace(/\{\{first_name\}\}/g, "Sarah") }}
                  />
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-6xl mb-4">📧</div>
                  <p>Select a template to preview</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Past Campaigns</h2>
            
            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📊</div>
                <p>No campaigns sent yet</p>
                <p className="text-sm mt-2">Create your first campaign above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-800">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.subject}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        campaign.status === "sent" ? "text-green-600" : 
                        campaign.status === "failed" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {campaign.status.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">{campaign.recipientCount} recipients</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "templates" && (
          <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Email Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EMAIL_TEMPLATES.map((template) => (
                <div key={template.id} className="p-4 border border-gray-200 rounded-xl hover:border-pink-300 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-gray-800">{template.name}</div>
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                  <p className="text-sm text-gray-600 font-medium truncate">{template.subject}</p>
                  <button
                    onClick={() => {
                      handleSelectTemplate(template.id);
                      setActiveTab("create");
                    }}
                    className="mt-3 w-full py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
