// lib/notifications/index.ts
// Central notification dispatcher

import { sendWelcomeEmail, sendEnquiryNotification, sendListingApprovedEmail, sendVerificationStatusEmail } from './email'
import { sendEnquirySMS, sendListingApprovedSMS, sendWelcomeSMS } from './sms'
import { pushNewEnquiry, pushListingApproved } from './push'
import prisma from '@/lib/prisma'

// ── Notify on new enquiry ─────────────────────────────────────
export async function notifyNewEnquiry(opts: {
  agentUserId: string
  agentEmail:  string
  agentPhone?: string
  agentName:   string
  enquirerName:string
  enquirerPhone?:string
  propertyTitle:string
  message:     string
}) {
  const { agentUserId, agentEmail, agentPhone, agentName, enquirerName, enquirerPhone, propertyTitle, message } = opts

  // Check agent notification preferences
  const agent = await prisma.user.findUnique({
    where: { id: agentUserId },
    select: { notifyEnquiries: true }
  }).catch(() => null)

  if (!agent?.notifyEnquiries) return

  // Fire all channels concurrently
  await Promise.allSettled([
    sendEnquiryNotification(agentEmail, agentName, enquirerName, propertyTitle, message, enquirerPhone),
    agentPhone ? sendEnquirySMS(agentPhone, agentName, propertyTitle, enquirerName) : Promise.resolve(),
    pushNewEnquiry(agentUserId, propertyTitle, enquirerName),
    // Save in-app notification
    prisma.notification.create({
      data: {
        userId:  agentUserId,
        type:    'new_enquiry',
        title:   'New Enquiry',
        message: `${enquirerName} enquired about "${propertyTitle}"`,
        href:    '/portal/dashboard',
      }
    }),
  ])
}

// ── Notify on listing approved ────────────────────────────────
export async function notifyListingApproved(opts: {
  userId:        string
  email:         string
  phone?:        string
  firstName:     string
  propertyTitle: string
  listingId:     string
}) {
  const { userId, email, phone, firstName, propertyTitle, listingId } = opts
  await Promise.allSettled([
    sendListingApprovedEmail(email, firstName, propertyTitle, listingId),
    phone ? sendListingApprovedSMS(phone, propertyTitle) : Promise.resolve(),
    pushListingApproved(userId, propertyTitle),
    prisma.notification.create({
      data: {
        userId,
        type:    'listing_approved',
        title:   '🏠 Listing Approved!',
        message: `"${propertyTitle}" is now live on Naya`,
        href:    `/properties/${listingId}`,
      }
    }),
  ])
}

// ── Notify on welcome ─────────────────────────────────────────
export async function notifyWelcome(opts: {
  email:       string
  phone?:      string
  firstName:   string
  accountType: string
}) {
  const { email, phone, firstName, accountType } = opts
  await Promise.allSettled([
    sendWelcomeEmail(email, firstName, accountType),
    phone ? sendWelcomeSMS(phone, firstName) : Promise.resolve(),
  ])
}

// ── Notify verification status ────────────────────────────────
export async function notifyVerificationStatus(opts: {
  userId: string; email: string; firstName: string
  status: 'approved'|'rejected'; reason?: string
}) {
  const { userId, email, firstName, status, reason } = opts
  await Promise.allSettled([
    sendVerificationStatusEmail(email, firstName, status, reason),
    prisma.notification.create({
      data: {
        userId,
        type:    status === 'approved' ? 'verification_approved' : 'verification_rejected',
        title:   status === 'approved' ? '✅ RSSPC Verified!' : '⚠️ Verification Update',
        message: status === 'approved' ? 'Your RSSPC badge is now active' : `Verification rejected${reason ? ': ' + reason : ''}`,
        href:    '/portal/profile',
      }
    }),
  ])
}
