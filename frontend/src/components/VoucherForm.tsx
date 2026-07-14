import { Fieldset, Legend } from '@headlessui/react'
import type { FormEvent } from 'react'
import Button from '@/components/Form/Button'
import DateField from '@/components/Form/DateField'
import SelectField from '@/components/Form/SelectField'
import TextField from '@/components/Form/TextField'
import VoucherResultModal from '@/components/VoucherResultModal'
import { useVoucherGenerator } from '@/hooks/useVoucherGenerator'
import type { AircraftType } from '@/lib/aircraft'
import { AIRCRAFT_OPTIONS } from '@/lib/aircraft'

export default function VoucherForm() {
  const {
    data,
    setData,
    errors,
    processing,
    submit,
    seats,
    errorMessage,
    modalOpen,
    closeModal,
  } = useVoucherGenerator()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset
          disabled={processing}
          className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10"
        >
          <Legend className="text-base/7 font-semibold text-white">
            Flight details
          </Legend>
          <TextField
            id="name"
            label="Crew Name"
            value={data.name}
            error={errors.name}
            onChange={(event) => setData('name', event.target.value)}
          />
          <TextField
            id="id"
            label="Crew ID"
            value={data.id}
            error={errors.id}
            onChange={(event) => setData('id', event.target.value)}
          />
          <TextField
            id="flightNumber"
            label="Flight Number"
            value={data.flightNumber}
            error={errors.flightNumber}
            onChange={(event) => setData('flightNumber', event.target.value)}
          />
          <DateField
            id="date"
            label="Flight Date"
            value={data.date}
            error={errors.date}
            onChange={(date) => setData('date', date)}
          />

          <SelectField
            name="aircraft"
            label="Aircraft"
            options={AIRCRAFT_OPTIONS}
            value={data.aircraft}
            error={errors.aircraft}
            onChange={(aircraft: AircraftType) => setData('aircraft', aircraft)}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Generating…' : 'Generate Vouchers'}
            </Button>
          </div>
        </Fieldset>
      </form>

      <VoucherResultModal
        open={modalOpen}
        onClose={closeModal}
        seats={seats}
        errorMessage={errorMessage}
      />
    </>
  )
}
