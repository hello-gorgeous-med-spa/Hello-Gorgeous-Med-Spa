# Hello Gorgeous Med Spa - Disaster Recovery Plan

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Owner:** Danielle Glazier-Alcala

---

## 1. Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Business Owner | Danielle Glazier-Alcala | (630) 636-6193 |
| Supabase Support | - | support@supabase.io |
| Vercel Support | - | support@vercel.com |
| Stripe Support | - | 1-888-926-2289 |
| Telnyx Support | - | support@telnyx.com |

---

## 2. System Components & Recovery

### 2.1 Frontend Application (Vercel)

**Hosting:** Vercel  
**Repository:** GitHub - hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa

**If Site Goes Down:**
1. Check Vercel Status: https://www.vercel-status.com/
2. Check GitHub Actions for failed deployments
3. Rollback to previous deployment in Vercel Dashboard:
   - Go to https://vercel.com/dashboard
   - Select project → Deployments
   - Find last working deployment → Click "..." → "Promote to Production"

**Recovery Time:** 5-10 minutes

---

### 2.2 Database (Supabase)

**Hosting:** Supabase  
**Project:** ljixwtwxjufbwpxpxpff.supabase.co

**Backup Schedule:**
- Automatic daily backups (enabled by default on Pro plan)
- Point-in-time recovery available

**If Database Issues:**
1. Check Supabase Status: https://status.supabase.com/
2. Check connection in Dashboard: https://supabase.com/dashboard
3. For data loss, restore from backup:
   - Go to Settings → Database → Backups
   - Select backup point → Restore

**Recovery Time:** 15-30 minutes (depending on backup size)

---

### 2.3 Payments (Stripe)

**Mode:** LIVE  
**Account:** Hello Gorgeous Med Spa

**If Payment Issues:**
1. Check Stripe Status: https://status.stripe.com/
2. Check webhook logs: Dashboard → Developers → Webhooks
3. Verify API keys haven't expired

**Manual Fallback:**
- Use Stripe Dashboard directly to process payments
- Use Square/Toast as backup if available

**Recovery Time:** Immediate (use dashboard directly)

---

### 2.4 SMS/Notifications (Telnyx)

**Phone Number:** +1 (331) 717-7545

**If SMS Fails:**
1. Check Telnyx Status: https://status.telnyx.com/
2. Check message logs in Telnyx Portal
3. Verify API key and messaging profile ID

**Manual Fallback:**
- Send reminders manually via personal phone
- Use email as backup notification channel

**Recovery Time:** Varies

---

## 3. Data Backup Procedures

### 3.1 Automated Backups
- **Supabase:** Daily automatic backups
- **Vercel:** Git-based (code in GitHub)
- **Stripe:** Transaction history in Stripe Dashboard

### 3.2 Manual Export (Monthly)
Run these exports monthly and store securely:

1. **Client Data:**
   - Supabase Dashboard → Table Editor → clients → Export CSV

2. **Appointment History:**
   - Supabase Dashboard → Table Editor → appointments → Export CSV

3. **Transaction History:**
   - Stripe Dashboard → Payments → Export

4. **Consent Records:**
   - Supabase Dashboard → Table Editor → signed_consents → Export CSV

**Storage:** Encrypted cloud storage (Google Drive with 2FA)

---

## 4. Security Incident Response

### 4.1 If Credentials Are Compromised

**Immediate Actions:**
1. Rotate Supabase API keys in Dashboard
2. Rotate Stripe API keys in Dashboard
3. Rotate Telnyx API key in Portal
4. Update .env variables in Vercel

**Notification:**
- Inform affected patients if PHI was accessed (HIPAA requirement)
- Document incident for compliance records

### 4.2 If Unauthorized Access Detected

1. Check Supabase audit logs
2. Review Stripe activity
3. Disable affected user accounts
4. Reset passwords

---

## 5. Business Continuity

### 5.1 If System Is Completely Down

**Manual Operations:**
1. Accept appointments by phone: (630) 636-6193
2. Process payments via Stripe Dashboard or backup terminal
3. Record services on paper, enter later
4. Send reminders via personal phone

**Paper Forms Location:** Front desk drawer

### 5.2 Minimum Viable Operations

These functions can continue without the system:
- Phone bookings (use calendar app)
- Card payments (Stripe Dashboard or backup)
- Cash payments (cash drawer)
- Basic client lookup (printed client list - update monthly)

---

## 6. Recovery Checklist

Use this checklist after any incident:

- [ ] System accessible at hellogorgeousmedspa.com
- [ ] Admin login working
- [ ] Database connected (check System Health page)
- [ ] Stripe payments processing
- [ ] SMS sending successfully
- [ ] Recent appointments visible
- [ ] Client records accessible
- [ ] No data loss confirmed

---

## 7. Testing Schedule

| Test | Frequency | Last Tested |
|------|-----------|-------------|
| Backup restoration | Quarterly | - |
| Failover to manual | Annually | - |
| Credential rotation | Annually | - |
| Full system health check | Monthly | - |

---

## 8. Key URLs & Dashboards

| Service | URL |
|---------|-----|
| Live Site | https://www.hellogorgeousmedspa.com |
| Admin Dashboard | https://www.hellogorgeousmedspa.com/admin |
| System Health | https://www.hellogorgeousmedspa.com/admin/system-health |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |
| Stripe Dashboard | https://dashboard.stripe.com |
| Telnyx Portal | https://portal.telnyx.com |
| GitHub Repository | https://github.com/hello-gorgeous-med-spa |

---

## 9. Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 2026 | Initial creation | System |

---

*This document should be reviewed and updated quarterly or after any significant incident.*
