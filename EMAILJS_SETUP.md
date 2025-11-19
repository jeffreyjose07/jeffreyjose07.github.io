# Contact Form Setup Guide

## Part 1: EmailJS Setup (5-10 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" (free account - 200 emails/month)
3. Verify your email

### Step 2: Add Email Service
1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Select **Gmail** (recommended)
4. Click **Connect Account** and sign in with `jeffreyjose.k@gmail.com`
5. Copy the **Service ID** (e.g., `service_xyz123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent from Portfolio Contact Form
```

4. Save the template
5. Copy the **Template ID** (e.g., `template_abc456`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `user_def789`)

### Step 5: Update Code
Open `src/components/Contact.tsx` and replace these values (around line 56-58):

```typescript
const serviceId = 'YOUR_SERVICE_ID';      // Replace with your Service ID
const templateId = 'YOUR_TEMPLATE_ID';    // Replace with your Template ID  
const publicKey = 'YOUR_PUBLIC_KEY';      // Replace with your Public Key
```

---

## Part 2: Telegram Notifications Setup (5 minutes)

There are **two ways** to get Telegram notifications:

### Option A: Using Gmail-to-Telegram Bot (Easier)

1. **Create Telegram Bot**:
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow instructions
   - Name it (e.g., "Portfolio Contact Bot")
   - Copy the **Bot Token** (looks like `123456:ABC-DEF1234...`)

2. **Get Your Chat ID**:
   - Search for `@userinfobot` on Telegram
   - Start a chat with it
   - It will show your **Chat ID** (a number like `123456789`)

3. **Set up Email Filter in Gmail**:
   - Go to Gmail settings
   - Create a filter for emails from EmailJS (`noreply@emailjs.com`)
   - Forward to a special email address we'll create

4. **Use IFTTT (Free)**:
   - Go to [https://ifttt.com/](https://ifttt.com/)
   - Create an applet:
     - **If this**: Gmail → New email matching search
     - Search: `from:noreply@emailjs.com subject:"New Contact Form"`
     - **Then that**: Webhooks → Make a web request
     - URL: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text={{Subject}}%0A%0A{{BodyPlain}}`
     - Method: GET

### Option B: Using Email Parser Bot (Simpler, Recommended)

1. **Add Bot to Telegram**:
   - Search for `@GmailBot` or `@IFTTT` on Telegram
   - Follow their setup instructions
   - Connect your Gmail account

2. **Set Notification Filter**:
   - Configure it to notify you for emails from `noreply@emailjs.com`
   - Or create a Gmail label "Portfolio Contacts" and forward EmailJS emails there

---

## Testing

1. **Test the Form**:
   - Run `npm run dev`
   - Go to the Contact section
   - Fill in the form and submit
   - Check your email

2. **Test Telegram**:
   - Submit another test message
   - You should receive a Telegram notification within seconds

---

## Quick Reference

**EmailJS Dashboard**: https://dashboard.emailjs.com/
**Telegram BotFather**: Search `@BotFather` in Telegram
**Test Email**: Send yourself a test contact form message

---

## Troubleshooting

### Form not sending?
- Check browser console for errors
- Verify Service ID, Template ID, and Public Key are correct
- Make sure EmailJS account is verified

### Not receiving Telegram notifications?
- Verify bot token is correct
- Make sure you've started a conversation with your bot
- Check IFTTT applet is enabled

---

## Next Steps After Setup

1. Replace the placeholder IDs in `Contact.tsx`
2. Test the form
3. Set up Telegram notifications
4. Commit and push changes
5. You're done! 🎉
