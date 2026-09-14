import { AlertTriangle } from 'lucide-react';
import InfoBox from '../components/infoBox';
import ToggleRow from '../components/toggleRow';
import FormTextarea from '../components/formTextarea';

export default function MaintenanceSection({
  form,
  handleChange,
  handleToggle,
}) {
  return (
    <div className="space-y-6">
      <InfoBox
        icon={AlertTriangle}
        title="Maintenance Mode"
        description="When enabled, customers can see a maintenance message. Admin panel should stay accessible."
      />

      <ToggleRow
        label="Enable Maintenance Mode"
        description="Temporarily put the store into maintenance mode."
        checked={form.maintenance.isEnabled}
        onChange={() => handleToggle('maintenance', 'isEnabled')}
      />

      <FormTextarea
        label="Maintenance Message"
        value={form.maintenance.message}
        onChange={(value) => handleChange('maintenance', 'message', value)}
        placeholder="We are under maintenance. Back soon!"
        rows={3}
      />
    </div>
  );
}