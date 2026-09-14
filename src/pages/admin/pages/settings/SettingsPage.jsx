import { useEffect, useMemo, useState } from 'react';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { adminService } from '../../../../services/admin';

import {
  DEFAULT_SETTINGS,
  SETTINGS_SECTIONS,
} from './constants/settingsdefaults';

import { mergeSettings } from './utils/settingshelpers';

import SettingsSidebar from './components/settingssidebar';

import MaintenanceSection from './sections/maintenanceSections';
import SupportSection from './sections/supportsection';
import BillingSection from './sections/billingsection';
import OrderSection from './sections/ordersection';
import TaxSection from './sections/taxsection';
import DeliverySection from './sections/deliverysection';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('maintenance');
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeMeta = useMemo(
    () => SETTINGS_SECTIONS.find((section) => section.id === activeSection),
    [activeSection]
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await adminService.getSettings();

      const settings =
        response?.data?.settings ||
        response?.data?.data?.settings ||
        response?.settings;

      setForm(mergeSettings(settings));
    } catch (error) {
      console.error('Settings fetch error:', error);
      toast.error('Failed to load settings');
      setForm(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleToggle = (section, field) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handlePartnerChange = (index, field, value) => {
    setForm((prev) => {
      const partners = [...(prev.delivery.partners || [])];

      partners[index] = {
        ...partners[index],
        [field]: value,
      };

      return {
        ...prev,
        delivery: {
          ...prev.delivery,
          partners,
        },
      };
    });
  };

  const handlePartnerToggle = (index) => {
    setForm((prev) => {
      const partners = [...(prev.delivery.partners || [])];

      partners[index] = {
        ...partners[index],
        isActive: !partners[index]?.isActive,
      };

      return {
        ...prev,
        delivery: {
          ...prev.delivery,
          partners,
        },
      };
    });
  };

  const addDeliveryPartner = () => {
    setForm((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        partners: [
          ...(prev.delivery.partners || []),
          {
            name: '',
            code: '',
            isActive: true,
            trackingUrlTemplate: '',
            supportPhone: '',
            supportEmail: '',
          },
        ],
      },
    }));
  };

  const removeDeliveryPartner = (index) => {
    setForm((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        partners: prev.delivery.partners.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await adminService.updateSettings(form);

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error(error?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'maintenance':
        return (
          <MaintenanceSection
            form={form}
            handleChange={handleChange}
            handleToggle={handleToggle}
          />
        );

      case 'support':
        return <SupportSection form={form} handleChange={handleChange} />;

      case 'billing':
        return <BillingSection form={form} handleChange={handleChange} />;

      case 'order':
        return (
          <OrderSection
            form={form}
            handleChange={handleChange}
            handleToggle={handleToggle}
          />
        );

      case 'tax':
        return (
          <TaxSection
            form={form}
            handleChange={handleChange}
            handleToggle={handleToggle}
          />
        );

      case 'delivery':
        return (
          <DeliverySection
            form={form}
            handlePartnerChange={handlePartnerChange}
            handlePartnerToggle={handlePartnerToggle}
            addDeliveryPartner={addDeliveryPartner}
            removeDeliveryPartner={removeDeliveryPartner}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <SettingsIcon className="h-3.5 w-3.5" />
          Platform Control
        </div>

        <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
          Admin Settings
        </h1>

        <p className="max-w-3xl text-sm text-gray-500">
          Manage maintenance mode, invoice billing details, support email, order
          rules, GST, and delivery tracking partners.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]"
      >
        <SettingsSidebar
          sections={SETTINGS_SECTIONS}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  {activeMeta?.label}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeMeta?.description}
                </p>
              </div>

              <div className="hidden rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 sm:block">
                Save after changes
              </div>
            </div>

            {renderSection()}
          </div>

          <div className="sticky bottom-4 z-10 flex justify-end rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-lg backdrop-blur">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </main>
      </form>
    </div>
  );
}