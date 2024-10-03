const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg, showUserMsg } from '../../../services/event-bus.service.js'
import { mailService } from '../../../apps/mail/services/mail.service.js'

export function MailIndex() {
  return <div>mail app</div>
}
