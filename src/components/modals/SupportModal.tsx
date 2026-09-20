import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp, Check, Phone } from 'lucide-react';
import { initialFaqs } from '../../data/mockData';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'faqs' | 'chat'>('faqs');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      sender: 'assistant',
      text: 'Namaste! Welcome to NEXORA Concierge. How may we assist your couture and sizing questions today?',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isSupportModalOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setInputMsg('');

    // Responsive concierge response
    setTimeout(() => {
      let reply = "Thank you for reaching out to NEXORA. Our footwear master-craftsmen and styling concierges are reviewing your request. For immediate sizing queries, try our 'Measure Your Foot' calculator!";
      if (userText.toLowerCase().includes('size') || userText.toLowerCase().includes('foot')) {
        reply = "For girls' footwear, we recommend using our interactive Size Studio on the product page. Simply measure foot length in cm and we'll calculate the perfect size with comfortable growth room.";
      } else if (userText.toLowerCase().includes('order') || userText.toLowerCase().includes('track')) {
        reply = "You can track your real-time shipment directly under 'My Orders' in your account menu, complete with BlueDart or Delhivery dispatch timestamps.";
      } else if (userText.toLowerCase().includes('return') || userText.toLowerCase().includes('exchange')) {
        reply = "We provide 7-day complimentary doorstep pickup for size exchanges and returns on unworn items. Refunds are initiated to your original payment within 48 hours.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleOpenWhatsApp = () => {
    showToast('Connecting to WhatsApp Concierge', '+91 98765 43210');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-2xl w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#EAE6DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF6EC] text-[#B38F4D] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">NEXORA Customer Concierge</h3>
              <p className="text-[11px] text-[#7A746E]">Dedicated styling, delivery, & fit assistance</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-1.5 rounded-full text-[#7A746E] hover:text-[#1A1A1A] hover:bg-[#F2EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#EAE6DF] bg-[#F7F4EE] px-5">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'faqs'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#7A746E] hover:text-[#1A1A1A]'
            }`}
          >
            Help Center & FAQs
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#7A746E] hover:text-[#1A1A1A]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Concierge Chat</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'faqs' ? (
            <div className="space-y-4">
              {/* Quick WhatsApp Banner */}
              <div className="bg-[#EBF7EE] border border-[#BDE8C6] p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#14532D]">WhatsApp Luxury Concierge</h5>
                    <p className="text-[11px] text-[#166534]">
                      Instant assistance with footwear sizing, orders, and styling queries.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleOpenWhatsApp}
                  className="px-3 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Chat on WhatsApp
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8275]">
                  Frequently Asked Questions
                </h4>
                {initialFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-[#EAE6DF] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        className="w-full text-left p-4 text-xs font-semibold text-[#1A1A1A] flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#777] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#777] shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 text-xs text-[#635D56] leading-relaxed border-t border-[#F5F2EB] pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Live Chat */
            <div className="flex flex-col h-[380px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#1A1A1A] text-white rounded-tr-none'
                          : 'bg-white border border-[#EAE6DF] text-[#1A1A1A] rounded-tl-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-[#A69E94] mt-1 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type your message to NEXORA concierge..."
                  className="flex-1 bg-white border border-[#DCD4C7] px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D] text-[#1A1A1A]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
