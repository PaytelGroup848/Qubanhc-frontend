import { Headphones } from 'lucide-react';
import InfoBox from '../components/infoBox';
import FormInput from '../components/formInput';

export default function SupportSection({ form, handleChange }) {
  return (
    <div className="space-y-6">
      <InfoBox
        icon={Headphones}
        title="Support Details"
        description="This support email and phone can be shown to customers and invoices."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Support Email"
          type="email"
          value={form.support.email}
          onChange={(value) => handleChange('support', 'email', value)}
          placeholder="support@example.com"
        />

        <FormInput
          label="Support Phone"
          value={form.support.phone}
          onChange={(value) => handleChange('support', 'phone', value)}
          placeholder="+91 9876543210"
        />
      </div>
    </div>
  );
}