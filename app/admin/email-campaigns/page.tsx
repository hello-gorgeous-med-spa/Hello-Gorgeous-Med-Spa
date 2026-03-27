"use client";

import { useState, useEffect, useRef } from "react";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface EmailBlock {
  id: string;
  type: "header" | "text" | "image" | "button" | "divider" | "spacer" | "two-column" | "social" | "footer";
  content: Record<string, any>;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: EmailBlock[];
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

const DEFAULT_BLOCKS: EmailBlock[] = [
  {
    id: "header-1",
    type: "header",
    content: {
      logoUrl: "",
      title: "HELLO GORGEOUS",
      subtitle: "MED SPA",
      backgroundColor: "#E91E8C",
    },
  },
  {
    id: "text-1",
    type: "text",
    content: {
      text: "Hi {{first_name}},\n\nWe have an exciting offer just for you!",
      fontSize: "16px",
      textAlign: "left",
    },
  },
  {
    id: "button-1",
    type: "button",
    content: {
      text: "BOOK NOW",
      url: "https://hellogorgeousmedspa.com/book",
      backgroundColor: "#E91E8C",
      textColor: "#ffffff",
    },
  },
  {
    id: "footer-1",
    type: "footer",
    content: {
      companyName: "Hello Gorgeous Med Spa",
      address: "74 W. Washington St., Oswego, IL 60543",
      phone: "630-636-6193",
      showUnsubscribe: true,
    },
  },
];

const TEMPLATE_PRESETS: EmailTemplate[] = [
  {
    id: "botox-special",
    name: "Botox Special",
    description: "Promote Botox pricing",
    category: "Promotions",
    blocks: [
      { id: "h1", type: "header", content: { title: "HELLO GORGEOUS", subtitle: "MED SPA", backgroundColor: "#E91E8C" } },
      { id: "s1", type: "spacer", content: { height: "20px" } },
      { id: "t1", type: "text", content: { text: "💉 EXCLUSIVE BOTOX SPECIAL", fontSize: "28px", textAlign: "center", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "s2", type: "spacer", content: { height: "10px" } },
      { id: "i1", type: "image", content: { url: "", alt: "Botox Treatment", width: "100%" } },
      { id: "t2", type: "text", content: { text: "Hi {{first_name}},\n\nFor a limited time, enjoy our exclusive Botox pricing!", fontSize: "16px", textAlign: "left" } },
      { id: "t3", type: "text", content: { text: "$10 per unit", fontSize: "48px", textAlign: "center", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "t4", type: "text", content: { text: "Regular $14/unit", fontSize: "16px", textAlign: "center", textColor: "#999", textDecoration: "line-through" } },
      { id: "s3", type: "spacer", content: { height: "10px" } },
      { id: "t5", type: "text", content: { text: "✓ Quick 15-minute treatment\n✓ No downtime\n✓ Results in 3-5 days\n✓ Lasts 3-4 months", fontSize: "16px", textAlign: "left" } },
      { id: "s4", type: "spacer", content: { height: "20px" } },
      { id: "b1", type: "button", content: { text: "BOOK YOUR APPOINTMENT", url: "https://hellogorgeousmedspa.com/book", backgroundColor: "#E91E8C", textColor: "#ffffff" } },
      { id: "s5", type: "spacer", content: { height: "30px" } },
      { id: "f1", type: "footer", content: { companyName: "Hello Gorgeous Med Spa", address: "74 W. Washington St., Oswego, IL 60543", phone: "630-636-6193", showUnsubscribe: true } },
    ],
  },
  {
    id: "solaria-launch",
    name: "Solaria CO2 Launch",
    description: "New laser treatment announcement",
    category: "New Services",
    blocks: [
      { id: "h1", type: "header", content: { title: "HELLO GORGEOUS", subtitle: "MED SPA", backgroundColor: "#000000" } },
      { id: "t1", type: "text", content: { text: "✨ NOW AVAILABLE", fontSize: "14px", textAlign: "center", textColor: "#E91E8C", letterSpacing: "3px" } },
      { id: "t2", type: "text", content: { text: "SOLARIA CO2 LASER", fontSize: "32px", textAlign: "center", fontWeight: "bold", textColor: "#ffffff", backgroundColor: "#000000" } },
      { id: "i1", type: "image", content: { url: "", alt: "Solaria CO2 Laser", width: "100%" } },
      { id: "t3", type: "text", content: { text: "Hi {{first_name}},\n\nWe're thrilled to announce the arrival of the Solaria CO2 Fractional Laser!", fontSize: "16px", textAlign: "left" } },
      { id: "t4", type: "text", content: { text: "What it treats:", fontSize: "18px", textAlign: "left", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "t5", type: "text", content: { text: "• Sun damage & age spots\n• Fine lines & wrinkles\n• Uneven skin texture\n• Acne scarring", fontSize: "16px", textAlign: "left" } },
      { id: "t6", type: "text", content: { text: "VIP LAUNCH SPECIAL", fontSize: "14px", textAlign: "center", textColor: "#E91E8C" } },
      { id: "t7", type: "text", content: { text: "$1,895", fontSize: "48px", textAlign: "center", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "t8", type: "text", content: { text: "Regular $2,500", fontSize: "16px", textAlign: "center", textColor: "#999", textDecoration: "line-through" } },
      { id: "b1", type: "button", content: { text: "BOOK CONSULTATION", url: "https://hellogorgeousmedspa.com/book", backgroundColor: "#E91E8C", textColor: "#ffffff" } },
      { id: "f1", type: "footer", content: { companyName: "Hello Gorgeous Med Spa", address: "74 W. Washington St., Oswego, IL 60543", phone: "630-636-6193", showUnsubscribe: true } },
    ],
  },
  {
    id: "welcome",
    name: "Welcome Email",
    description: "New client welcome",
    category: "Automated",
    blocks: [
      { id: "h1", type: "header", content: { title: "HELLO GORGEOUS", subtitle: "MED SPA", backgroundColor: "#E91E8C" } },
      { id: "t1", type: "text", content: { text: "Welcome to the Family! 💕", fontSize: "28px", textAlign: "center", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "t2", type: "text", content: { text: "Hi {{first_name}},\n\nThank you for choosing Hello Gorgeous Med Spa! We're so excited to have you as part of our family.", fontSize: "16px", textAlign: "left" } },
      { id: "t3", type: "text", content: { text: "🎁 NEW CLIENT SPECIAL", fontSize: "20px", textAlign: "center", fontWeight: "bold", textColor: "#E91E8C", backgroundColor: "#FFF0F5", padding: "20px" } },
      { id: "t4", type: "text", content: { text: "10% OFF your first treatment!\nUse code: GORGEOUS10", fontSize: "18px", textAlign: "center", backgroundColor: "#FFF0F5", padding: "10px" } },
      { id: "t5", type: "text", content: { text: "Our Most Popular Services:", fontSize: "18px", textAlign: "left", fontWeight: "bold" } },
      { id: "t6", type: "text", content: { text: "• Botox & Fillers - Smooth wrinkles, restore volume\n• Morpheus8 - RF microneedling for skin tightening\n• Solaria CO2 Laser - Advanced skin resurfacing\n• Medical Weight Loss - Semaglutide programs", fontSize: "16px", textAlign: "left" } },
      { id: "b1", type: "button", content: { text: "BOOK YOUR FIRST APPOINTMENT", url: "https://hellogorgeousmedspa.com/book", backgroundColor: "#E91E8C", textColor: "#ffffff" } },
      { id: "t7", type: "text", content: { text: "We can't wait to help you look and feel gorgeous!", fontSize: "16px", textAlign: "center", fontStyle: "italic", textColor: "#666" } },
      { id: "f1", type: "footer", content: { companyName: "Hello Gorgeous Med Spa", address: "74 W. Washington St., Oswego, IL 60543", phone: "630-636-6193", showUnsubscribe: true } },
    ],
  },
  {
    id: "monthly-newsletter",
    name: "Monthly Newsletter",
    description: "Monthly updates and specials",
    category: "Newsletter",
    blocks: [
      { id: "h1", type: "header", content: { title: "HELLO GORGEOUS", subtitle: "MONTHLY NEWSLETTER", backgroundColor: "#E91E8C" } },
      { id: "t1", type: "text", content: { text: "March 2026 Updates 💕", fontSize: "24px", textAlign: "center", fontWeight: "bold" } },
      { id: "d1", type: "divider", content: { color: "#E91E8C", style: "solid" } },
      { id: "t2", type: "text", content: { text: "Hi {{first_name}},\n\nHere's what's happening at Hello Gorgeous this month!", fontSize: "16px", textAlign: "left" } },
      { id: "t3", type: "text", content: { text: "🌟 THIS MONTH'S SPECIAL", fontSize: "20px", textAlign: "left", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "i1", type: "image", content: { url: "", alt: "Monthly Special", width: "100%" } },
      { id: "t4", type: "text", content: { text: "Add your special offer details here...", fontSize: "16px", textAlign: "left" } },
      { id: "b1", type: "button", content: { text: "BOOK NOW", url: "https://hellogorgeousmedspa.com/book", backgroundColor: "#E91E8C", textColor: "#ffffff" } },
      { id: "d2", type: "divider", content: { color: "#eee", style: "solid" } },
      { id: "t5", type: "text", content: { text: "📰 NEWS & UPDATES", fontSize: "20px", textAlign: "left", fontWeight: "bold", textColor: "#E91E8C" } },
      { id: "t6", type: "text", content: { text: "Share your latest news, new services, staff updates, etc.", fontSize: "16px", textAlign: "left" } },
      { id: "social1", type: "social", content: { facebook: "https://facebook.com/hellogorgeousmedspa", instagram: "https://instagram.com/hellogorgeousmedspa" } },
      { id: "f1", type: "footer", content: { companyName: "Hello Gorgeous Med Spa", address: "74 W. Washington St., Oswego, IL 60543", phone: "630-636-6193", showUnsubscribe: true } },
    ],
  },
  {
    id: "blank",
    name: "Blank Template",
    description: "Start from scratch",
    category: "Custom",
    blocks: [
      { id: "h1", type: "header", content: { title: "HELLO GORGEOUS", subtitle: "MED SPA", backgroundColor: "#E91E8C" } },
      { id: "t1", type: "text", content: { text: "Hi {{first_name}},\n\nYour message here...", fontSize: "16px", textAlign: "left" } },
      { id: "b1", type: "button", content: { text: "BOOK NOW", url: "https://hellogorgeousmedspa.com/book", backgroundColor: "#E91E8C", textColor: "#ffffff" } },
      { id: "f1", type: "footer", content: { companyName: "Hello Gorgeous Med Spa", address: "74 W. Washington St., Oswego, IL 60543", phone: "630-636-6193", showUnsubscribe: true } },
    ],
  },
];

const BLOCK_TYPES = [
  { type: "header", label: "Header", icon: "🏠" },
  { type: "text", label: "Text", icon: "📝" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "button", label: "Button", icon: "🔘" },
  { type: "divider", label: "Divider", icon: "➖" },
  { type: "spacer", label: "Spacer", icon: "↕️" },
  { type: "two-column", label: "2 Columns", icon: "▥" },
  { type: "social", label: "Social Links", icon: "📱" },
  { type: "footer", label: "Footer", icon: "📋" },
];

export default function EmailCampaignsPage() {
  const [activeTab, setActiveTab] = useState<"create" | "campaigns" | "templates">("create");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>(DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [emailForm, setEmailForm] = useState({
    campaignName: "",
    subject: "",
    previewText: "",
    fromName: "Hello Gorgeous Med Spa",
    fromEmail: "hello.gorgeous@hellogorgeousmedspa.com",
    replyTo: "hello.gorgeous@hellogorgeousmedspa.com",
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

  const handleSelectTemplate = (template: EmailTemplate) => {
    setEmailBlocks([...template.blocks]);
    setEmailForm((prev) => ({
      ...prev,
      campaignName: template.name,
    }));
    setActiveStep(2);
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

  const addBlock = (type: string, afterBlockId: string | null) => {
    const newBlock: EmailBlock = {
      id: `${type}-${Date.now()}`,
      type: type as EmailBlock["type"],
      content: getDefaultContent(type),
    };

    if (afterBlockId) {
      const index = emailBlocks.findIndex((b) => b.id === afterBlockId);
      const newBlocks = [...emailBlocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setEmailBlocks(newBlocks);
    } else {
      setEmailBlocks([...emailBlocks, newBlock]);
    }
    setSelectedBlockId(newBlock.id);
    setShowBlockPicker(false);
  };

  const getDefaultContent = (type: string): Record<string, any> => {
    switch (type) {
      case "header":
        return { title: "HELLO GORGEOUS", subtitle: "MED SPA", backgroundColor: "#E91E8C" };
      case "text":
        return { text: "Enter your text here...", fontSize: "16px", textAlign: "left" };
      case "image":
        return { url: "", alt: "Image", width: "100%" };
      case "button":
        return { text: "CLICK HERE", url: "https://hellogorgeousmedspa.com", backgroundColor: "#E91E8C", textColor: "#ffffff" };
      case "divider":
        return { color: "#E91E8C", style: "solid" };
      case "spacer":
        return { height: "20px" };
      case "two-column":
        return { leftContent: "Left column", rightContent: "Right column" };
      case "social":
        return { facebook: "", instagram: "", twitter: "", youtube: "" };
      case "footer":
        return { companyName: "Hello Gorgeous Med Spa", address: "74 W. Washington St., Oswego, IL 60543", phone: "630-636-6193", showUnsubscribe: true };
      default:
        return {};
    }
  };

  const updateBlockContent = (blockId: string, field: string, value: any) => {
    setEmailBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, content: { ...block.content, [field]: value } }
          : block
      )
    );
  };

  const deleteBlock = (blockId: string) => {
    setEmailBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setSelectedBlockId(null);
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const index = emailBlocks.findIndex((b) => b.id === blockId);
    if (direction === "up" && index > 0) {
      const newBlocks = [...emailBlocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setEmailBlocks(newBlocks);
    } else if (direction === "down" && index < emailBlocks.length - 1) {
      const newBlocks = [...emailBlocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setEmailBlocks(newBlocks);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlockContent(blockId, "url", reader.result as string);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const generateHtml = (): string => {
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailForm.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; max-width: 600px;">
`;

    emailBlocks.forEach((block) => {
      html += renderBlockToHtml(block);
    });

    html += `
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
    return html;
  };

  const renderBlockToHtml = (block: EmailBlock): string => {
    const c = block.content;
    switch (block.type) {
      case "header":
        return `
          <tr>
            <td style="background: linear-gradient(135deg, ${c.backgroundColor || "#E91E8C"} 0%, #FF69B4 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${c.title || "HELLO GORGEOUS"}</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">${c.subtitle || "MED SPA"}</p>
            </td>
          </tr>
        `;
      case "text":
        return `
          <tr>
            <td style="padding: 20px 30px; font-size: ${c.fontSize || "16px"}; text-align: ${c.textAlign || "left"}; color: ${c.textColor || "#333333"}; font-weight: ${c.fontWeight || "normal"}; font-style: ${c.fontStyle || "normal"}; text-decoration: ${c.textDecoration || "none"}; background-color: ${c.backgroundColor || "transparent"}; letter-spacing: ${c.letterSpacing || "normal"};">
              ${(c.text || "").replace(/\n/g, "<br>")}
            </td>
          </tr>
        `;
      case "image":
        if (!c.url) return "";
        return `
          <tr>
            <td style="padding: 10px 0; text-align: center;">
              <img src="${c.url}" alt="${c.alt || ""}" style="max-width: ${c.width || "100%"}; height: auto; display: block; margin: 0 auto;">
            </td>
          </tr>
        `;
      case "button":
        return `
          <tr>
            <td style="padding: 20px 30px; text-align: center;">
              <a href="${c.url || "#"}" style="background-color: ${c.backgroundColor || "#E91E8C"}; color: ${c.textColor || "#ffffff"}; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">${c.text || "CLICK HERE"}</a>
            </td>
          </tr>
        `;
      case "divider":
        return `
          <tr>
            <td style="padding: 10px 30px;">
              <hr style="border: none; border-top: 2px ${c.style || "solid"} ${c.color || "#E91E8C"}; margin: 0;">
            </td>
          </tr>
        `;
      case "spacer":
        return `
          <tr>
            <td style="height: ${c.height || "20px"};"></td>
          </tr>
        `;
      case "social":
        let socialHtml = '<tr><td style="padding: 20px 30px; text-align: center;">';
        if (c.facebook) socialHtml += `<a href="${c.facebook}" style="margin: 0 10px; text-decoration: none;">📘 Facebook</a>`;
        if (c.instagram) socialHtml += `<a href="${c.instagram}" style="margin: 0 10px; text-decoration: none;">📸 Instagram</a>`;
        if (c.twitter) socialHtml += `<a href="${c.twitter}" style="margin: 0 10px; text-decoration: none;">🐦 Twitter</a>`;
        if (c.youtube) socialHtml += `<a href="${c.youtube}" style="margin: 0 10px; text-decoration: none;">▶️ YouTube</a>`;
        socialHtml += "</td></tr>";
        return socialHtml;
      case "footer":
        return `
          <tr>
            <td style="background-color: #f8f8f8; padding: 30px; text-align: center;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">${c.companyName || "Hello Gorgeous Med Spa"}</p>
              <p style="color: #999; margin: 0; font-size: 12px;">${c.address || ""}</p>
              <p style="color: #999; margin: 5px 0; font-size: 12px;">📞 ${c.phone || ""}</p>
              ${c.showUnsubscribe ? '<p style="color: #666; margin: 18px 0 0 0; font-size: 12px;"><a href="{{unsubscribe_url}}" style="color: #E91E8C; text-decoration: underline;">Unsubscribe from marketing emails</a></p>' : ""}
            </td>
          </tr>
        `;
      default:
        return "";
    }
  };

  const handleSendCampaign = async () => {
    if (selectedClients.size === 0) {
      alert("Please select at least one recipient");
      return;
    }
    if (!emailForm.subject) {
      alert("Please enter a subject line");
      return;
    }

    setIsSending(true);

    try {
      const recipients = clients.filter((c) => selectedClients.has(c.id));
      const htmlContent = generateHtml();

      const response = await fetch("/api/email-campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailForm.subject,
          fromName: emailForm.fromName,
          fromEmail: emailForm.fromEmail,
          replyTo: emailForm.replyTo,
          htmlContent,
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
        setActiveStep(1);
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

  const selectedBlock = emailBlocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-pink-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-1">
            📧 Email Campaign Builder
          </h1>
          <p className="text-gray-600">
            Create beautiful, professional email campaigns
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "create", label: "Create Campaign", icon: "✉️" },
            { id: "campaigns", label: "Sent Campaigns", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
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
          <>
            {/* Progress Steps */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {[
                  { step: 1, label: "Template" },
                  { step: 2, label: "Design" },
                  { step: 3, label: "Recipients" },
                  { step: 4, label: "Review & Send" },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center">
                    <button
                      onClick={() => setActiveStep(s.step as 1 | 2 | 3 | 4)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        activeStep === s.step
                          ? "bg-pink-500 text-white"
                          : activeStep > s.step
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-white/20">
                        {activeStep > s.step ? "✓" : s.step}
                      </span>
                      <span className="font-medium">{s.label}</span>
                    </button>
                    {i < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Template Selection */}
            {activeStep === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose a Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TEMPLATE_PRESETS.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="p-6 border-2 border-gray-200 rounded-xl text-left hover:border-pink-400 hover:bg-pink-50 transition-all group"
                    >
                      <div className="text-3xl mb-3">
                        {template.category === "Promotions" ? "🏷️" : 
                         template.category === "New Services" ? "✨" :
                         template.category === "Newsletter" ? "📰" :
                         template.category === "Automated" ? "🤖" : "📝"}
                      </div>
                      <div className="font-semibold text-gray-800 group-hover:text-pink-600">{template.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                      <div className="text-xs text-pink-500 mt-2">{template.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Email Designer */}
            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Block List */}
                <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-lg h-fit">
                  <h3 className="font-semibold text-gray-700 mb-3">Add Block</h3>
                  <div className="space-y-2">
                    {BLOCK_TYPES.map((bt) => (
                      <button
                        key={bt.type}
                        onClick={() => addBlock(bt.type, emailBlocks[emailBlocks.length - 1]?.id || null)}
                        className="w-full p-2 text-left text-sm rounded-lg hover:bg-pink-50 flex items-center gap-2 transition-colors"
                      >
                        <span>{bt.icon}</span>
                        <span>{bt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center: Email Preview */}
                <div className="lg:col-span-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Email Preview</h3>
                    <div className="text-sm text-gray-500">{emailBlocks.length} blocks</div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 p-4">
                    <div className="bg-white max-w-[600px] mx-auto shadow-lg">
                      {emailBlocks.map((block) => (
                        <div
                          key={block.id}
                          onClick={() => setSelectedBlockId(block.id)}
                          className={`relative cursor-pointer transition-all ${
                            selectedBlockId === block.id ? "ring-2 ring-pink-500" : "hover:ring-1 hover:ring-pink-300"
                          }`}
                        >
                          {renderBlockPreview(block)}
                          
                          {selectedBlockId === block.id && (
                            <div className="absolute top-1 right-1 flex gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}
                                className="w-6 h-6 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
                              >↑</button>
                              <button
                                onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}
                                className="w-6 h-6 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
                              >↓</button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                                className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              >×</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Block Editor */}
                <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-lg h-fit sticky top-4">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    {selectedBlock ? `Edit ${selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)}` : "Select a block to edit"}
                  </h3>
                  
                  {selectedBlock && (
                    <div className="space-y-4">
                      {selectedBlock.type === "header" && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Title</label>
                            <input
                              type="text"
                              value={selectedBlock.content.title || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "title", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={selectedBlock.content.subtitle || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "subtitle", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Background Color</label>
                            <input
                              type="color"
                              value={selectedBlock.content.backgroundColor || "#E91E8C"}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "backgroundColor", e.target.value)}
                              className="w-full h-10 rounded-lg cursor-pointer"
                            />
                          </div>
                        </>
                      )}

                      {selectedBlock.type === "text" && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Text Content</label>
                            <textarea
                              value={selectedBlock.content.text || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "text", e.target.value)}
                              rows={4}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="Use {{first_name}} for personalization"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Font Size</label>
                              <select
                                value={selectedBlock.content.fontSize || "16px"}
                                onChange={(e) => updateBlockContent(selectedBlock.id, "fontSize", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="12px">Small</option>
                                <option value="16px">Normal</option>
                                <option value="20px">Large</option>
                                <option value="24px">X-Large</option>
                                <option value="32px">Heading</option>
                                <option value="48px">Display</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Align</label>
                              <select
                                value={selectedBlock.content.textAlign || "left"}
                                onChange={(e) => updateBlockContent(selectedBlock.id, "textAlign", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Text Color</label>
                              <input
                                type="color"
                                value={selectedBlock.content.textColor || "#333333"}
                                onChange={(e) => updateBlockContent(selectedBlock.id, "textColor", e.target.value)}
                                className="w-full h-10 rounded-lg cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Bold</label>
                              <button
                                onClick={() => updateBlockContent(selectedBlock.id, "fontWeight", selectedBlock.content.fontWeight === "bold" ? "normal" : "bold")}
                                className={`w-full py-2 rounded-lg text-sm font-bold ${selectedBlock.content.fontWeight === "bold" ? "bg-pink-500 text-white" : "bg-gray-100"}`}
                              >
                                B
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === "image" && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Upload Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, selectedBlock.id)}
                              className="w-full text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Or paste URL</label>
                            <input
                              type="text"
                              value={selectedBlock.content.url || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "url", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Alt Text</label>
                            <input
                              type="text"
                              value={selectedBlock.content.alt || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "alt", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </>
                      )}

                      {selectedBlock.type === "button" && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Button Text</label>
                            <input
                              type="text"
                              value={selectedBlock.content.text || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "text", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Link URL</label>
                            <input
                              type="text"
                              value={selectedBlock.content.url || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "url", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              placeholder="https://..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Button Color</label>
                              <input
                                type="color"
                                value={selectedBlock.content.backgroundColor || "#E91E8C"}
                                onChange={(e) => updateBlockContent(selectedBlock.id, "backgroundColor", e.target.value)}
                                className="w-full h-10 rounded-lg cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Text Color</label>
                              <input
                                type="color"
                                value={selectedBlock.content.textColor || "#ffffff"}
                                onChange={(e) => updateBlockContent(selectedBlock.id, "textColor", e.target.value)}
                                className="w-full h-10 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === "spacer" && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Height</label>
                          <select
                            value={selectedBlock.content.height || "20px"}
                            onChange={(e) => updateBlockContent(selectedBlock.id, "height", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="10px">Small (10px)</option>
                            <option value="20px">Medium (20px)</option>
                            <option value="30px">Large (30px)</option>
                            <option value="50px">X-Large (50px)</option>
                          </select>
                        </div>
                      )}

                      {selectedBlock.type === "divider" && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Color</label>
                          <input
                            type="color"
                            value={selectedBlock.content.color || "#E91E8C"}
                            onChange={(e) => updateBlockContent(selectedBlock.id, "color", e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>
                      )}

                      {selectedBlock.type === "social" && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Facebook URL</label>
                            <input
                              type="text"
                              value={selectedBlock.content.facebook || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "facebook", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Instagram URL</label>
                            <input
                              type="text"
                              value={selectedBlock.content.instagram || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "instagram", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </>
                      )}

                      {selectedBlock.type === "footer" && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                            <input
                              type="text"
                              value={selectedBlock.content.companyName || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "companyName", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Address</label>
                            <input
                              type="text"
                              value={selectedBlock.content.address || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "address", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Phone</label>
                            <input
                              type="text"
                              value={selectedBlock.content.phone || ""}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "phone", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedBlock.content.showUnsubscribe !== false}
                              onChange={(e) => updateBlockContent(selectedBlock.id, "showUnsubscribe", e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-600">Show Unsubscribe Link</span>
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  {!selectedBlock && (
                    <p className="text-gray-400 text-center py-8">Click on a block in the preview to edit it</p>
                  )}

                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors"
                    >
                      Next: Select Recipients →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Recipients */}
            {activeStep === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
                  <span>Select Recipients</span>
                  <span className="text-pink-500 font-bold">{selectedClients.size} selected</span>
                </h2>

                <div className="mb-4 flex gap-4">
                  <input
                    type="text"
                    placeholder="Search clients by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSelectAll}
                    className="px-6 py-3 bg-pink-100 text-pink-600 rounded-xl font-medium hover:bg-pink-200 transition-colors"
                  >
                    {selectAll ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                  {filteredClients.map((client) => (
                    <label
                      key={client.id}
                      className="flex items-center gap-4 p-4 hover:bg-pink-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClients.has(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                        className="w-5 h-5 text-pink-500 rounded"
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
                    <div className="p-8 text-center text-gray-400">
                      No clients found with email addresses
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-4">{filteredClients.length} clients with email addresses</p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    ← Back to Design
                  </button>
                  <button
                    onClick={() => setActiveStep(4)}
                    disabled={selectedClients.size === 0}
                    className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-300"
                  >
                    Next: Review & Send →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Send */}
            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Campaign Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">Campaign Name (internal)</label>
                      <input
                        type="text"
                        value={emailForm.campaignName}
                        onChange={(e) => setEmailForm({ ...emailForm, campaignName: e.target.value })}
                        placeholder="e.g., March Botox Special"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">Subject Line *</label>
                      <input
                        type="text"
                        value={emailForm.subject}
                        onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                        placeholder="Enter email subject..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">Preview Text</label>
                      <input
                        type="text"
                        value={emailForm.previewText}
                        onChange={(e) => setEmailForm({ ...emailForm, previewText: e.target.value })}
                        placeholder="Shows in inbox preview..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1 font-medium">From Name</label>
                        <input
                          type="text"
                          value={emailForm.fromName}
                          onChange={(e) => setEmailForm({ ...emailForm, fromName: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1 font-medium">Reply-To</label>
                        <input
                          type="email"
                          value={emailForm.replyTo}
                          onChange={(e) => setEmailForm({ ...emailForm, replyTo: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                    <h3 className="font-semibold text-pink-700 mb-2">📬 Ready to Send</h3>
                    <p className="text-sm text-pink-600">
                      This campaign will be sent to <strong>{selectedClients.size} recipients</strong>
                    </p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSendCampaign}
                      disabled={isSending || !emailForm.subject}
                      className={`flex-1 py-4 rounded-xl font-bold text-lg text-white transition-all ${
                        isSending || !emailForm.subject
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500"
                      }`}
                    >
                      {isSending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        `🚀 Send Campaign`
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Final Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Final Preview</h2>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                      <p className="text-sm"><strong>To:</strong> {selectedClients.size} recipients</p>
                      <p className="text-sm"><strong>Subject:</strong> {emailForm.subject || "(no subject)"}</p>
                    </div>
                    <div 
                      className="max-h-[500px] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: generateHtml().replace(/\{\{first_name\}\}/g, "Sarah").replace(/\{\{unsubscribe_url\}\}/g, "#") }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "campaigns" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Sent Campaigns</h2>
            
            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📊</div>
                <p>No campaigns sent yet</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-xl font-medium"
                >
                  Create Your First Campaign
                </button>
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
      </div>
    </div>
  );

  function renderBlockPreview(block: EmailBlock) {
    const c = block.content;
    switch (block.type) {
      case "header":
        return (
          <div style={{ background: `linear-gradient(135deg, ${c.backgroundColor || "#E91E8C"} 0%, #FF69B4 100%)`, padding: "30px 20px", textAlign: "center" }}>
            <h1 style={{ color: "white", margin: 0, fontSize: "24px", fontWeight: "bold" }}>{c.title || "HELLO GORGEOUS"}</h1>
            <p style={{ color: "white", margin: "8px 0 0 0", fontSize: "12px" }}>{c.subtitle || "MED SPA"}</p>
          </div>
        );
      case "text":
        return (
          <div style={{ 
            padding: "15px 20px", 
            fontSize: c.fontSize || "16px", 
            textAlign: c.textAlign || "left", 
            color: c.textColor || "#333",
            fontWeight: c.fontWeight || "normal",
            fontStyle: c.fontStyle || "normal",
            backgroundColor: c.backgroundColor || "transparent",
            whiteSpace: "pre-wrap"
          }}>
            {c.text || "Enter text..."}
          </div>
        );
      case "image":
        return (
          <div style={{ padding: "10px 0", textAlign: "center" }}>
            {c.url ? (
              <img src={c.url} alt={c.alt || ""} style={{ maxWidth: "100%", height: "auto" }} />
            ) : (
              <div style={{ background: "#f0f0f0", padding: "40px", color: "#999" }}>
                📷 Click to add image
              </div>
            )}
          </div>
        );
      case "button":
        return (
          <div style={{ padding: "15px 20px", textAlign: "center" }}>
            <span style={{ 
              background: c.backgroundColor || "#E91E8C", 
              color: c.textColor || "#fff", 
              padding: "12px 30px", 
              borderRadius: "25px", 
              fontWeight: "bold",
              display: "inline-block"
            }}>
              {c.text || "BUTTON"}
            </span>
          </div>
        );
      case "divider":
        return (
          <div style={{ padding: "10px 20px" }}>
            <hr style={{ border: "none", borderTop: `2px solid ${c.color || "#E91E8C"}`, margin: 0 }} />
          </div>
        );
      case "spacer":
        return <div style={{ height: c.height || "20px", background: "#fafafa" }} />;
      case "social":
        return (
          <div style={{ padding: "15px 20px", textAlign: "center", color: "#666" }}>
            {c.facebook && "📘 "}
            {c.instagram && "📸 "}
            {c.twitter && "🐦 "}
            {!c.facebook && !c.instagram && !c.twitter && "Add social links..."}
          </div>
        );
      case "footer":
        return (
          <div style={{ background: "#f8f8f8", padding: "20px", textAlign: "center" }}>
            <p style={{ color: "#666", margin: "0 0 5px 0", fontSize: "14px" }}>{c.companyName || "Company Name"}</p>
            <p style={{ color: "#999", margin: 0, fontSize: "12px" }}>{c.address || "Address"}</p>
            <p style={{ color: "#999", margin: "5px 0", fontSize: "12px" }}>📞 {c.phone || "Phone"}</p>
            {c.showUnsubscribe && <p style={{ color: "#bbb", margin: "10px 0 0", fontSize: "11px" }}>Unsubscribe</p>}
          </div>
        );
      default:
        return <div style={{ padding: "20px", background: "#f0f0f0" }}>Unknown block</div>;
    }
  }
}
