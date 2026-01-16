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
  Settings,
  Megaphone,
  FileText,
  Send,
  Star

} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const menuGroups = [
    {
      title: "PAGES",
      items: [
        { id: 'home', label: 'Home Page', icon: Home },
        { id: 'press', label: 'Press & Awards', icon: Award },
        { id: 'stories', label: 'Stories', icon: BookOpen },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'career', label: 'Career', icon: Briefcase },
        { id: 'about', label: 'About', icon: Info },
      ]
    },
    {
      title: "COMPONENTS",
      items: [
        { id: 'cta', label: 'Call to Action', icon: Megaphone },
        { id: 'jobs', label: 'Job Board', icon: Briefcase },
        { id: 'mail', label: 'Send Mail', icon: Send },
        { id: 'footer', label: 'Footer', icon: MessageSquare }
      ]
    }
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64
    bg-white
    transition-all duration-300 ease-in-out
    border-r border-gray-200
    flex flex-col
    shadow-lg
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:inset-0 md:shadow-none
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-gray-200 gap-3">
          <div className="w-8 h-8 flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768272166/Frame_2147226388_1_bk3t7g.png" 
              alt="RWU Inc. Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-gray-900 font-bold text-base truncate">RWU Inc</h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Admin Portal</p>
          </div>
          <button 
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-semibold text-gray-500 tracking-wider mb-3">
                {group.title}
              </h3>
              <div className="space-y-0.5">
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
                        group relative flex items-center w-full px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200
                        ${isActive 
                          ? 'bg-gray-100 text-gray-900 shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-gray-600 rounded-r-full" />
                      )}
                      
                      <Icon 
                        className={`mr-3 flex-shrink-0 transition-colors ${
                          isActive ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} 
                        size={18} 
                      />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
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