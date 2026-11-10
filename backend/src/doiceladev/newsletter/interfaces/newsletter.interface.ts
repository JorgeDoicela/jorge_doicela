export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
  isNew: boolean;
  status: 'active' | 'reactivated' | 'already_active';
}
