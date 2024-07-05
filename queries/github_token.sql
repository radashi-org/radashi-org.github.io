-- Add the github_token secret to Supabase vault
SELECT vault.create_secret(
  'your_github_personal_access_token_here',
  'github_token',
  'GitHub Personal Access Token for repository dispatch'
);
