export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
  isNew: boolean;
  status: 'active' | 'reactivated' | 'already_active';
}

export interface NewsletterUnsubscribeResult {
  success: boolean;
  message: string;
  status: 'unsubscribed' | 'already_unsubscribed' | 'not_found';
}
