import { PackageCheck } from 'lucide-react';
import InfoBox from '../components/infoBox';
import ToggleRow from '../components/toggleRow';
import FormInput from '../components/formInput';
import { toNumber } from '../utils/settingsHelpers';

export default function OrderSection({ form, handleChange, handleToggle }) {
  return (
    <div className="space-y-6">
      <InfoBox
        icon={PackageCheck}
        title="Order & Shipping Settings"
        description="Control shipping charges, COD availability, and cancellation window."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Free Shipping Above"
          type="number"
          value={form.order.freeShippingAbove}
          onChange={(value) =>
            handleChange('order', 'freeShippingAbove', toNumber(value))
          }
          prefix="₹"
        />

        <FormInput
          label="Default Shipping Charge"
          type="number"
          value={form.order.defaultShippingCharge}
          onChange={(value) =>
            handleChange('order', 'defaultShippingCharge', toNumber(value))
          }
          prefix="₹"
        />

        <FormInput
          label="COD Extra Charge"
          type="number"
          value={form.order.codCharge}
          onChange={(value) =>
            handleChange('order', 'codCharge', toNumber(value))
          }
          prefix="₹"
        />

        <FormInput
          label="Cancellation Window"
          type="number"
          value={form.order.cancellationWindowHours}
          onChange={(value) =>
            handleChange('order', 'cancellationWindowHours', toNumber(value))
          }
          suffix="hours"
        />

        <div className="md:col-span-2">
          <ToggleRow
            label="COD Enabled"
            description="Allow customers to place Cash on Delivery orders."
            checked={form.order.isCODEnabled}
            onChange={() => handleToggle('order', 'isCODEnabled')}
          />
        </div>
      </div>
    </div>
  );
}