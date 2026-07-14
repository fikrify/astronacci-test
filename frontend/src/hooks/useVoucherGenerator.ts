import { useState } from 'react'
import { AIRCRAFT_TYPES } from '@/lib/aircraft'
import type { ValidationErrors } from '@/lib/api'
import {
  checkVouchers,
  generateVouchers,
  RequestFailed,
  ValidationFailed,
} from '@/lib/api'
import { toDisplayDate } from '@/lib/date'
import type { VoucherFormData } from '@/types'

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.'

const initialFormData: VoucherFormData = {
  name: '',
  id: '',
  flightNumber: '',
  date: '',
  aircraft: AIRCRAFT_TYPES[0],
}

/**
 * Drives the check → generate flow against the API.
 */
export function useVoucherGenerator() {
  const [data, setFormData] = useState<VoucherFormData>(initialFormData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [processing, setProcessing] = useState(false)
  const [seats, setSeats] = useState<string[] | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function setData<K extends keyof VoucherFormData>(
    key: K,
    value: VoucherFormData[K],
  ): void {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function failWith(message: string): void {
    setSeats(null)
    setErrorMessage(message)
    setModalOpen(true)
  }

  async function submit(): Promise<void> {
    setErrors({})
    setProcessing(true)

    try {
      const { exists } = await checkVouchers({
        flightNumber: data.flightNumber,
        date: data.date,
      })

      if (exists) {
        failWith(
          `Vouchers have already been generated for flight ${data.flightNumber} on ${toDisplayDate(data.date)}.`,
        )

        return
      }

      const response = await generateVouchers(data)

      setErrorMessage(null)
      setSeats(response.seats)
      setModalOpen(true)
    } catch (error) {
      // Validation errors (422) belong on the fields, everything else in the modal.
      if (error instanceof ValidationFailed) {
        setErrors(error.errors)
      } else if (error instanceof RequestFailed) {
        failWith(error.message)
      } else {
        failWith(GENERIC_ERROR_MESSAGE)
      }
    } finally {
      setProcessing(false)
    }
  }

  return {
    data,
    setData,
    errors,
    processing,
    submit,
    seats,
    errorMessage,
    modalOpen,
    closeModal: () => setModalOpen(false),
  }
}
