import { useState } from "react";
import { Modal } from "../Modal";
import { FormInput } from "../FormInput";
import { FormSelect } from "../FormSelect";
import { FormCheckbox } from "../FormCheckbox";
import { useToast } from "@/hooks/use-toast";
import { format, subMonths } from "date-fns";

interface ExportRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatOptions = [
  { value: 'CSV', label: 'CSV' },
  { value: 'PDF', label: 'PDF' },
  { value: 'Excel', label: 'Excel' }
];

export const ExportRevenueModal = ({ isOpen, onClose }: ExportRevenueModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    format: 'CSV',
    includeSubscriptions: true,
    includeOneTime: true,
    includeSupport: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    toast({
      title: "Exporting...",
      description: `Revenue data is being exported as ${formData.format}.`
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your file is ready for download."
      });
    }, 2000);
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Export Revenue Data"
      subtitle="Download revenue report"
      onClose={onClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Export', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
          <FormInput
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <FormSelect
          label="Format"
          name="format"
          value={formData.format}
          onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
          options={formatOptions}
        />

        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium">Include:</p>
          <FormCheckbox
            label="Subscription Revenue"
            name="includeSubscriptions"
            checked={formData.includeSubscriptions}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeSubscriptions: checked }))}
          />
          <FormCheckbox
            label="One-time Sales"
            name="includeOneTime"
            checked={formData.includeOneTime}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeOneTime: checked }))}
          />
          <FormCheckbox
            label="Support Revenue"
            name="includeSupport"
            checked={formData.includeSupport}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeSupport: checked }))}
          />
        </div>
      </div>
    </Modal>
  );
};
