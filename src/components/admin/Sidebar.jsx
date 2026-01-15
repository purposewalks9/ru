import React, { useContext } from 'react';
import { ThemeContext } from '../../context/themecontext';
import { 
  Home, 
  Award,
  BookOpen, 
  Users, 
  Briefcase,
  Info,
  MessageSquare,
  Mail,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  Zap,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const menuGroups = [
    {
      title: "OVERVIEW",
      items: [
        { id: 'home', label: 'HomePage', icon: LayoutDashboard },
        { id: 'press', label: 'Press & Awards', icon: Award },
      ]
    },
    {
      title: "COMMUNITY",
      items: [
        { id: 'stories', label: 'Success Stories', icon: BookOpen },
        { id: 'team', label: 'Our Team', icon: Users },
      ]
    },
    {
      title: "GROWTH",
      items: [
        { id: 'career', label: 'Career Path', icon: Briefcase },
        { id: 'cta', label: 'Cta', icon: Mail },
        { id: 'jobs', label: 'Jobs', icon: Info }
      ]
    }
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 
    bg-white text-slate-300 
    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
    border-r border-white/5
    flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:inset-0
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-8 border-b border-white/5 gap-3">
          <div className="md:w-10 w-10 h-auto md:ml-0 ml-4">
            <img 
              src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768272166/Frame_2147226388_1_bk3t7g.png" 
              alt="RWU Inc. Logo" 
              className="w-full h-auto object-cover" 
            />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-lg">Rwu Inc</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase">Enterprise Portal</p>
          </div>
          <button className="md:hidden ml-auto p-2 text-slate-500 hover:text-white" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="px-4 text-[10px] font-bold text-slate-500 tracking-[0.15em] mb-4">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 768) setIsOpen(false);
                      }}
                      className={`
                        group relative flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-[#478100]/10 text-[#E9C236] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                          : 'text-black hover:bg-gray-500 hover:text-slate-200'}
                      `}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 w-1 h-5 bg-[#E9C236] rounded-r-full" />
                      )}
                      
                      <Icon 
                        className={`mr-3 transition-colors ${isActive ? 'text-[#E9C236]' : 'text-slate-500 group-hover:text-slate-300'}`} 
                        size={18} 
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      
                      {isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E9C236] animate-pulse" />
                      ) : (
                        <ChevronRight className="opacity-0 -translate-x-2 transition-all group-hover:opacity-40 group-hover:translate-x-0" size={14} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;