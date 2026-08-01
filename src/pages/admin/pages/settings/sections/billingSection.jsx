import { Building2 } from 'lucide-react';
import InfoBox from '../components/infoBox';
import FormInput from '../components/formInput';
import FormTextarea from '../components/formTextarea';

export default function BillingSection({ form, handleChange }) {
  return (
    <div className="space-y-6">
      <InfoBox
        icon={Building2}
        title="Billing / Invoice Details"
        description="These company details will be printed on generated invoices."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <FormInput
            label="Company Name"
            value={form.billing.companyName}
            onChange={(value) => handleChange('billing', 'companyName', value)}
            placeholder="Your company name"
          />
        </div>

        <div className="md:col-span-2">
          <FormTextarea
            label="Company Address"
            value={form.billing.address}
            onChange={(value) => handleChange('billing', 'address', value)}
            placeholder="Building, street, area"
            rows={3}
          />
        </div>

        <FormInput
          label="City"
          value={form.billing.city}
          onChange={(value) => handleChange('billing', 'city', value)}
          placeholder="Delhi"
        />

        <FormInput
          label="State"
          value={form.billing.state}
          onChange={(value) => handleChange('billing', 'state', value)}
          placeholder="Delhi"
        />

        <FormInput
          label="Pincode"
          value={form.billing.pincode}
          onChange={(value) => handleChange('billing', 'pincode', value)}
          placeholder="110001"
        />

        <FormInput
          label="Country"
          value={form.billing.country}
          onChange={(value) => handleChange('billing', 'country', value)}
          placeholder="India"
        />

        <FormInput
          label="Billing Email"
          type="email"
          value={form.billing.email}
          onChange={(value) => handleChange('billing', 'email', value)}
          placeholder="billing@example.com"
        />

        <FormInput
          label="Billing Phone"
          value={form.billing.phone}
          onChange={(value) => handleChange('billing', 'phone', value)}
          placeholder="+91 9876543210"
        />

        <FormInput
          label="GSTIN"
          value={form.billing.gstin}
          onChange={(value) => handleChange('billing', 'gstin', value)}
          placeholder="22AAAAA0000A1Z5"
        />

        <FormInput
          label="PAN"
          value={form.billing.pan}
          onChange={(value) => handleChange('billing', 'pan', value)}
          placeholder="ABCDE1234F"
        />
      </div>
    </div>
  );
}