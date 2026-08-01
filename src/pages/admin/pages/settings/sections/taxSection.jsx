import { Calculator } from 'lucide-react';
import InfoBox from '../components/infoBox';
import ToggleRow from '../components/toggleRow';
import FormInput from '../components/formInput';
import { toNumber } from '../utils/settingsHelpers';

export default function TaxSection({ form, handleChange, handleToggle }) {
  return (
    <div className="space-y-6">
      <InfoBox
        icon={Calculator}
        title="Tax / GST Settings"
        description="GST rate and GST number used for invoice calculations."
      />

      <ToggleRow
        label="Enable GST"
        description="Apply GST calculation on orders and invoices."
        checked={form.tax.isGSTEnabled}
        onChange={() => handleToggle('tax', 'isGSTEnabled')}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Default GST Rate"
          type="number"
          value={form.tax.defaultGSTRate}
          onChange={(value) =>
            handleChange('tax', 'defaultGSTRate', toNumber(value))
          }
          suffix="%"
        />

        <FormInput
          label="GST Number"
          value={form.tax.gstNumber}
          onChange={(value) => handleChange('tax', 'gstNumber', value)}
          placeholder="22AAAAA0000A1Z5"
        />
      </div>
    </div>
  );
}