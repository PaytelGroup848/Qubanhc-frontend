import { Plus, Trash2, Truck } from 'lucide-react';
import InfoBox from '../components/InfoBox';
import FormInput from '../components/FormInput';

export default function DeliverySection({
  form,
  handlePartnerChange,
  handlePartnerToggle,
  addDeliveryPartner,
  removeDeliveryPartner,
}) {
  return (
    <div className="space-y-6">
      <InfoBox
        icon={Truck}
        title="Delivery Partners / Tracking"
        description="Add delivery partners and tracking URL templates. Use {trackingNumber} in the URL."
      />

      <div className="space-y-4">
        {(form.delivery.partners || []).map((partner, index) => (
          <div
            key={partner._id || index}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-950">
                  Partner #{index + 1}
                </h3>
                <p className="text-xs text-gray-500">
                  Manage delivery partner tracking details.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePartnerToggle(index)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    partner.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {partner.isActive ? 'Active' : 'Inactive'}
                </button>

                <button
                  type="button"
                  onClick={() => removeDeliveryPartner(index)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white text-red-500 shadow-sm hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Partner Name"
                value={partner.name || ''}
                onChange={(value) => handlePartnerChange(index, 'name', value)}
                placeholder="Delhivery"
              />

              <FormInput
                label="Partner Code"
                value={partner.code || ''}
                onChange={(value) => handlePartnerChange(index, 'code', value)}
                placeholder="delhivery"
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Tracking URL Template"
                  value={partner.trackingUrlTemplate || ''}
                  onChange={(value) =>
                    handlePartnerChange(index, 'trackingUrlTemplate', value)
                  }
                  placeholder="https://example.com/track/{trackingNumber}"
                />
              </div>

              <FormInput
                label="Support Phone"
                value={partner.supportPhone || ''}
                onChange={(value) =>
                  handlePartnerChange(index, 'supportPhone', value)
                }
                placeholder="+91 9876543210"
              />

              <FormInput
                label="Support Email"
                type="email"
                value={partner.supportEmail || ''}
                onChange={(value) =>
                  handlePartnerChange(index, 'supportEmail', value)
                }
                placeholder="partner@example.com"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addDeliveryPartner}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-100"
      >
        <Plus className="h-4 w-4" />
        Add Delivery Partner
      </button>
    </div>
  );
}