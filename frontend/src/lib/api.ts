import type {
  VoucherCheckData,
  VoucherCheckResponse,
  VoucherFormData,
  VoucherResponse,
} from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.'
const NETWORK_ERROR_MESSAGE =
  'Could not reach the server. Check your connection and try again.'

/** Field name mapped to the first message the API returned for it. */
export type ValidationErrors = Record<string, string>

/** A 422 carrying an `errors` bag: the messages belong under the fields. */
export class ValidationFailed extends Error {
  errors: ValidationErrors

  constructor(errors: ValidationErrors) {
    super('The given data was invalid.')
    this.name = 'ValidationFailed'
    this.errors = errors
  }
}

/** Any other failure: an HTTP error carrying a message, or an unreachable server. */
export class RequestFailed extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestFailed'
  }
}

interface ErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

async function readErrorBody(response: Response): Promise<ErrorBody> {
  try {
    return (await response.json()) as ErrorBody
  } catch {
    return {}
  }
}

function firstMessagePerField(
  errors: Record<string, string[]>,
): ValidationErrors {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, messages[0]]),
  )
}

async function post<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new RequestFailed(NETWORK_ERROR_MESSAGE)
  }

  if (response.ok) {
    return (await response.json()) as TResponse
  }

  const failure = await readErrorBody(response)

  if (response.status === 422 && failure.errors) {
    throw new ValidationFailed(firstMessagePerField(failure.errors))
  }

  throw new RequestFailed(failure.message ?? GENERIC_ERROR_MESSAGE)
}

/** Report whether a flight already has vouchers on a date. */
export function checkVouchers(
  data: VoucherCheckData,
): Promise<VoucherCheckResponse> {
  return post<VoucherCheckData, VoucherCheckResponse>('/api/check', data)
}

/** Assign three unique seats to a flight and persist them. */
export function generateVouchers(
  data: VoucherFormData,
): Promise<VoucherResponse> {
  return post<VoucherFormData, VoucherResponse>('/api/generate', data)
}
