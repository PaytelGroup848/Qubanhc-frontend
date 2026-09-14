import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, User, Shield, Heart } from 'lucide-react';
import { authService } from '../../../services/auth';

import AccountSidebar from './components/AccountSidebar';
import OrdersTab from './tabs/OrdersTab';
import AddressesTab from './tabs/AddressesTab';
import ProfileTab from './tabs/ProfileTab';
import SecurityTab from './tabs/SecurityTab';
import WishlistTab from './tabs/WishlistTab';

const tabs = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const user = authService.getUser();

  const handleLogout = async () => {
    await authService.logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab />;

      case 'addresses':
        return <AddressesTab />;

      case 'profile':
        return <ProfileTab />;

      case 'security':
        return <SecurityTab />;

      case 'wishlist':
        return <WishlistTab />;

      default:
        return <OrdersTab />;
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
          <h1 className="text-2xl font-black text-slate-900">My Account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your orders, addresses, profile, security, and wishlist.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <AccountSidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            onLogout={handleLogout}
          />

          <main className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 min-h-[520px]">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}