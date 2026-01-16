import React, { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar.jsx';
import Header from '../components/admin/Header.jsx';
import HomeEditor from '../components/admin/HomeEditor.jsx';
import StoriesManager from '../components/admin/StoriesManager.jsx';
import BenefitsManager from '../components/admin/BenefitsManager.jsx';
import TeamManager from '../components/admin/TeamEditor.jsx';
import CareerManager from '../components/admin/CareerManager.jsx';
import SuccessMessage from '../components/admin/SuccessMessage.jsx';
import JobsManager from '../components/admin/JobsManager.jsx';
import Profile from '../components/admin/Profile.jsx';
import PressAwardsManager from '../components/admin/ArticlesManager.jsx';
import CTAManager from '../components/admin/Ctamanger.jsx';
import { 
  Loader2, 
  CloudUpload,
  RefreshCw
} from 'lucide-react';
import EmailManager from '../components/admin/Emailmanager.jsx';
import AboutManager from '../components/admin/Aboutmanager.jsx';
import FooterManager from '../components/admin/FooterMnanger.jsx';

const PlaceholderEditor = ({ title }) => (
  <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
      <CloudUpload className="text-slate-400" size={32} />
    </div>
    <h3 className="text-lg font-bold text-slate-800">Workspace for {title}</h3>
    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">This management interface is ready for configuration.</p>
  </div>
);

const AdminPortal = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
       
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setLastSynced(new Date().toLocaleTimeString());
    };
    
    useEffect(() => {
        const handler = (e) => setActiveTab(e.detail);
        window.addEventListener('admin:navigate', handler);
        return () => window.removeEventListener('admin:navigate', handler);
    }, []);

    const handleSync = () => {
        setIsPageLoading(true);
        setTimeout(() => {
            setIsPageLoading(false);
            setLastSynced(new Date().toLocaleTimeString());
            showSuccess('Data synchronized successfully!');
        }, 1000);
    };

    const renderHeader = () => (
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {activeTab} Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Last synced at {lastSynced}
          </p>
        </div>
        <button
          onClick={handleSync}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
        >
          <RefreshCw size={16} />
          Sync
        </button>
      </div>
    );

    const renderContentArea = () => {
        if (isPageLoading) {
            
        }

        const renderManager = () => {
            switch (activeTab) {
                case 'home':
                    return <HomeEditor showSuccess={showSuccess} />;
                case 'benefits':
                    return <BenefitsManager showSuccess={showSuccess} />;
                case 'stories':
                    return <StoriesManager showSuccess={showSuccess} />;
                case 'team':
                    return <TeamManager showSuccess={showSuccess} />;
                case 'career':
                    return <CareerManager showSuccess={showSuccess} />;
                case 'jobs':
                    return <JobsManager showSuccess={showSuccess} />;
                case 'profile':
                    return <Profile showSuccess={showSuccess} />;
                case 'press':
                    return <PressAwardsManager showSuccess={showSuccess}/>;
                case 'about':
                    return <AboutManager showSuccess={showSuccess} />;
                case 'footer':
                  return <FooterManager showSuccess={showSuccess} />;
                case 'cta':
                    return <CTAManager showSuccess={showSuccess} />;
                case 'mail':
                     return <EmailManager showSuccess={showSuccess} />;
                default:
                    return <PlaceholderEditor title={activeTab} />;
            }
        };

        return (
          <div className="transition-opacity duration-300">
            {renderManager()}
          </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    activeTab={activeTab}
                    toggleSidebar={() => setSidebarOpen(true)}
                />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {renderHeader()}
                        {renderContentArea()}
                    </div>
                </div>
            </main>

            <SuccessMessage 
                message={successMsg} 
                onClose={() => setSuccessMsg(null)} 
            />
        </div>
    );
};

export default AdminPortal;