import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, MessageCircle, User, Search, Send } from 'lucide-react'
import { Card } from '../components/ui'

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: User,
    content: [
      { q: 'How do I sign up?', a: 'Click the "Sign Up" button on the landing page. Enter your email, password, and basic information to create your account. Once registered, you can complete your volunteer profile to start matching with tasks.' },
      { q: 'How do I find tasks?', a: 'Go to the Tasks page from the navigation menu. Browse available opportunities or use filters to search by category, location, date, and required skills. Click on any task to view full details.' },
      { q: 'How do I apply for a task?', a: 'Open a task details page and click "Apply". Your profile information will be shared with the task organizer. You\'ll receive a notification once your application is reviewed.' },
    ]
  },
  {
    id: 'volunteer-faq',
    title: 'Volunteer FAQ',
    icon: Search,
    content: [
      { q: 'What if I can\'t complete a task?', a: 'If circumstances change and you can\'t complete an assigned task, contact the task organizer as soon as possible through the task details page. It\'s better to communicate early than to not show up.' },
      { q: 'How do I track my hours?', a: 'After completing a task, the organizer will mark it as complete. You can view your volunteer hours and history on your Profile page under the Stats tab.' },
      { q: 'Can I switch categories?', a: 'Yes! Update your profile to add new skills or remove old ones. Go to Profile > Edit Profile > Skills to modify your volunteer categories at any time.' },
    ]
  },
  {
    id: 'admin-faq',
    title: 'Admin FAQ',
    icon: Send,
    content: [
      { q: 'How do I create tasks?', a: 'Navigate to Admin > Tasks > Create New Task. Fill in the task details including title, description, date, location, required skills, and number of volunteers needed.' },
      { q: 'How do I import volunteers?', a: 'Use the CSV import feature under Admin > Import. Upload a CSV file with volunteer data (name, email, phone, skills, location). The system will match and create new volunteer accounts.' },
      { q: 'How does AI matching work?', a: 'Our AI matching algorithm analyzes volunteer skills, location, availability, and past performance to suggest the best matches for each task. It considers proximity, skill relevance, and rating history.' },
    ]
  },
]

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2"
      >
        <span className="text-[#FAFAFA] font-medium">{item.q}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-[#D6CCC2] flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-[#6B6B6B] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-[#9CA3AF] leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  )
}

function SectionAccordion({ section }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openItem, setOpenItem] = useState(null)
  const Icon = section.icon

  const toggleItem = (idx) => {
    setOpenItem(openItem === idx ? null : idx)
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-5 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-[#D6CCC2]/20 flex items-center justify-center">
          <Icon size={20} className="text-[#D6CCC2]" />
        </div>
        <span className="text-lg font-semibold text-[#FAFAFA] flex-1 text-left">{section.title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-[#D6CCC2]" />
        ) : (
          <ChevronDown size={20} className="text-[#6B6B6B]" />
        )}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 bg-white/[0.02]">
          {section.content.map((item, idx) => (
            <AccordionItem
              key={idx}
              item={item}
              isOpen={openItem === idx}
              onToggle={() => toggleItem(idx)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#FAFAFA] mb-3">Help & FAQ</h1>
        <p className="text-[#6B6B6B]">Find answers to common questions about VolunteerIQ</p>
      </div>

      <div className="space-y-4 mb-12">
        {sections.map((section) => (
          <SectionAccordion key={section.id} section={section} />
        ))}
      </div>

      <Card padding="lg" className="bg-white/5 border-white/10">
        <h2 className="text-xl font-semibold text-[#FAFAFA] mb-6">Contact Support</h2>
        <p className="text-[#9CA3AF] mb-6">
          Can't find what you're looking for? Reach out to our support team.
        </p>
        <div className="space-y-4">
          <a
            href="mailto:support@volunteeriq.org"
            className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-[#D6CCC2]/20 flex items-center justify-center">
              <Mail size={20} className="text-[#D6CCC2]" />
            </div>
            <div>
              <div className="text-[#FAFAFA] font-medium">Email Support</div>
              <div className="text-[#6B6B6B] text-sm">support@volunteeriq.org</div>
            </div>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 rounded-lg bg-[#D6CCC2]/20 flex items-center justify-center">
              <MessageCircle size={20} className="text-[#D6CCC2]" />
            </div>
            <div>
              <div className="text-[#FAFAFA] font-medium">Live Chat</div>
              <div className="text-[#6B6B6B] text-sm">Coming soon</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}