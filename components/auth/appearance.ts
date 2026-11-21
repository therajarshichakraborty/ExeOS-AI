/**
 * Clerk element overrides so the sign-in / sign-up forms sit flush inside our
 * own layout instead of a floating Clerk card. Colours come from the shadcn
 * theme (CSS variables), so light and dark mode follow the site theme.
 */
export const authAppearance = {
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full max-w-none! shadow-none! border-0! rounded-none! bg-transparent!",
    card: "bg-transparent! shadow-none! border-0! px-0! py-2! gap-7!",
    header: "items-start! text-left!",
    headerTitle: "text-[1.75rem]! leading-tight! font-bold! tracking-tight!",
    headerSubtitle: "text-[15px]! text-muted-foreground!",
    socialButtonsBlockButton:
      "h-11! rounded-xl! border! border-border! bg-background! shadow-xs! transition-all! duration-200! hover:bg-muted! hover:-translate-y-px!",
    socialButtonsBlockButtonText: "text-[15px]! font-medium!",
    dividerLine: "bg-border!",
    dividerText: "text-muted-foreground! text-xs! uppercase! tracking-widest!",
    formFieldLabel: "text-sm! font-medium!",
    formFieldInput:
      "h-11! rounded-xl! border-border! bg-background! text-[15px]! transition-shadow! focus:ring-4! focus:ring-foreground/5!",
    formButtonPrimary:
      "h-11! rounded-xl! bg-foreground! text-background! text-[15px]! font-semibold! normal-case! shadow-[0_8px_24px_-8px_oklch(0.2_0.02_262/0.5)]! transition-all! hover:opacity-90! hover:-translate-y-px!",
    footer: "bg-transparent! bg-none! [&>*]:bg-transparent!",
    footerAction: "justify-start! px-0!",
    footerActionText: "text-sm! text-muted-foreground!",
    footerActionLink: "text-sm! font-semibold! text-foreground! underline-offset-4! hover:underline!",
    identityPreview: "rounded-xl! border-border!",
    otpCodeFieldInput: "rounded-xl! border-border!",
    alert: "rounded-xl!",
  },
} as const;
