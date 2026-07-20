# Google OAuth Verification Guide (`google-consent.md`)
> **Why does "Google hasn't verified this app" appear, how to bypass it instantly, and how to permanently remove it.**

---

## ❓ Why Are You Seeing This Warning Screen?

Google displays the **"Google hasn't verified this app"** screen whenever an application requests **Sensitive or Restricted OAuth Scopes** (such as reading/sending Gmail messages or managing Google Calendar events) without completing Google's formal brand verification process.

### Is there anything broken?
**No, nothing is broken!** Your app is working as intended in Production mode. Google shows this standard warning message for all newly created, unverified OAuth apps to prevent phishing.

---

## ⚡ 1. How to Bypass the Screen & Log In Right Now (Instant Solution)

You and your users can bypass this screen in **3 simple clicks**:

1. On the *"Google hasn't verified this app"* warning screen, click the small link that says **`Advanced`** (located on the bottom left).
2. Click **`Go to ExeOS-AI (unsafe)`** (or `Go to rajarshichakraborty20000@gmail.com (unsafe)`).
3. Review the permissions list and click **`Continue`** / **`Allow`**.

> 💡 **Note**: Once a user completes these steps once, Google will remember their consent, and they will **not** be prompted with this warning screen on subsequent sign-ins.

---

## 🛡️ 2. How to Permanently Remove the Warning Screen (Official Google Verification)

If you want to remove the warning screen completely so that users see a clean, official Google sign-in prompt without any security warnings, you must submit your app for **Google OAuth Verification**.

Here is the exact checklist to get verified:

### Step 1: Public Domain & Legal Links
Make sure your deployed app (`https://exe-os-ai.vercel.app`) has:
- A public **Privacy Policy** URL (e.g., `https://exe-os-ai.vercel.app/privacy`)
- A public **Terms of Service** URL (e.g., `https://exe-os-ai.vercel.app/terms`)
- Verified domain ownership of `exe-os-ai.vercel.app` in [Google Search Console](https://search.google.com/search-console).

### Step 2: Record a YouTube Demo Video
Google requires an unlisted 1 to 2-minute video demonstrating your app in action:
- Show your app's OAuth sign-in flow.
- Show the Google Client ID in the browser URL bar.
- Show how your app uses the Gmail API (reading email/drafting replies) and Google Calendar API (scheduling events).

### Step 3: Submit for Verification in Google Cloud Console
1. Go to [Google Cloud Console OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent).
2. Complete all required fields under **App information**, **App domain**, and **Developer contact information**.
3. Under **Scopes for Google APIs**, make sure your Gmail (`gmail.modify`) and Calendar (`calendar.events`) scopes are listed.
4. Click **Submit for Verification**.

---

## 📊 Summary Comparison

| Mode | Who Can Sign In? | Google Warning Screen Shown? | Requires Google Approval? |
| :--- | :--- | :--- | :--- |
| **Testing Mode** | Only manually added "Test Users" (max 100) | Yes | ❌ No |
| **Production (Unverified - Current)** | **ANY Google / Gmail account** (up to 100 users) | Yes *(Bypassable via "Advanced")* | ❌ No |
| **Production (Verified)** | **ANY Google / Gmail account** (Unlimited) | ❌ No warning screen | ✅ Yes |

---

<p align="center">
  <i>ExeOS-AI — Autonomous AI Executive Assistant</i>
</p>
