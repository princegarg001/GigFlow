import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  source: z.enum(['website', 'instagram', 'referral']),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  submitLabel?: string;
}

export const LeadForm = ({ defaultValues, onSubmit, submitLabel = 'Save Lead' }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'new', source: 'website', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="lead-name" className="label">Full Name</label>
        <input
          id="lead-name"
          {...register('name')}
          className={`input ${errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
          placeholder="e.g. Rahul Sharma"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="lead-email" className="label">Email Address</label>
        <input
          id="lead-email"
          type="email"
          {...register('email')}
          className={`input ${errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
          placeholder="e.g. rahul@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      {/* Status & Source */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-status" className="label">Status</label>
          <select
            id="lead-status"
            {...register('status')}
            className={`select w-full ${errors.status ? 'border-red-500' : ''}`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1.5">{errors.status.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-source" className="label">Source</label>
          <select
            id="lead-source"
            {...register('source')}
            className={`select w-full ${errors.source ? 'border-red-500' : ''}`}
          >
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="referral">Referral</option>
          </select>
          {errors.source && (
            <p className="text-red-500 text-xs mt-1.5">{errors.source.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="lead-notes" className="label">
          Notes <span className="text-surface-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="lead-notes"
          {...register('notes')}
          rows={3}
          className="textarea"
          placeholder="Add any additional context…"
        />
      </div>

      {/* Submit */}
      <button
        id="lead-form-submit"
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};
