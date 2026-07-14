import TextField from '@/components/Form/TextField'

interface DateFieldProps {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}

/**
 * A native date input. It only ever hands back a real calendar date, in the
 * YYYY-MM-DD the API expects — the picker itself is rendered in the browser's
 * locale, so dates are shown back to the crew as DD-MM-YYYY elsewhere.
 */
export default function DateField({
  id,
  label,
  value,
  error,
  onChange,
}: DateFieldProps) {
  return (
    <TextField
      id={id}
      label={label}
      type="date"
      value={value}
      error={error}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
