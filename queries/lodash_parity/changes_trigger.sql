-- First, make sure the pgsql-http extension is installed
CREATE EXTENSION IF NOT EXISTS http;

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS lodash_parity_changes_trigger ON lodash_parity;

-- Drop the old send_github_dispatch function if it exists
DROP FUNCTION IF EXISTS send_github_dispatch();

-- Create the function that the trigger will call
CREATE OR REPLACE FUNCTION send_github_dispatch()
RETURNS TRIGGER AS $$
DECLARE
  response http_response;
  event_type TEXT := 'lodash_parity';
  github_token TEXT;
BEGIN
  -- Fetch the GitHub token from Supabase Vault
  SELECT decrypted_secret INTO github_token
  FROM vault.decrypted_secrets
  WHERE name = 'github_token';

  SELECT status, content::json INTO response
  FROM http((
    'POST',
    'https://api.github.com/repos/radashi-org/radashi.github.io/dispatches',
    ARRAY[
      http_header('Accept', 'application/vnd.github.v3+json'),
      http_header('Authorization', format('Bearer %s', github_token))
    ],
    'application/json',
    format('{"event_type":"%s"}', event_type)
  )::http_request);

  -- Log the response status (optional)
  RAISE NOTICE 'GitHub API response status: %', response.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER lodash_parity_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON lodash_parity
FOR EACH STATEMENT
EXECUTE FUNCTION send_github_dispatch();
