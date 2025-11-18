# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be provisioned (~2 minutes)

## Step 2: Run SQL Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the contents of `supabase-schema.sql` and paste it into the editor
5. Click "Run" to execute the SQL

This will create:
- `employer_job_submissions` table with all necessary columns
- Indexes for performance
- Row Level Security (RLS) policies
- A view for approved jobs

## Step 3: Get API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. You'll find two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

1. Create a file named `.env.local` in the root of your project
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials from Step 3
4. Save the file

**Note:** `.env.local` is gitignored and won't be committed to version control.

## Step 5: Set Up Storage Bucket (for logo uploads)

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Create bucket with these settings:
   - **Name**: `employer-logos`
   - **Public bucket**: ✅ Yes
   - **File size limit**: 2MB
4. Set up storage policies (see `STORAGE_SETUP.md` for details)

Quick SQL for storage policies:
```sql
-- Allow public uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'employer-logos');

-- Allow public reads
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'employer-logos');
```

**Full storage setup guide**: See `STORAGE_SETUP.md`

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Go to `http://localhost:3000/employers`
3. Fill out the job submission form
4. Upload a company logo (optional)
5. Submit the form
6. Check your Supabase dashboard:
   - **Table Editor** → `employer_job_submissions` to see the new entry
   - **Storage** → `employer-logos` to see uploaded logos

## Verify in Supabase Dashboard

After submitting a test job:

1. Go to **Table Editor** in Supabase
2. Select `employer_job_submissions` table
3. You should see your test submission with `status: 'pending'`

## Next Steps (Optional)

### Email Notifications
You can set up Supabase Edge Functions or use a service like SendGrid to send email notifications when new jobs are submitted.

### Admin Dashboard
Create an authenticated admin panel to:
- Review pending submissions
- Approve/reject jobs
- Update job status
- Add admin notes

### Automatic Approval
Modify the API route to automatically approve jobs from trusted companies or email domains.

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Verify the variable names match exactly (including `NEXT_PUBLIC_` prefix)
- Restart your dev server after creating `.env.local`

### Form submission fails silently
- Check browser console for errors
- Check Supabase dashboard → **Logs** → **API** for error details
- Verify RLS policies are set up correctly

### Can't see submitted data
- Make sure you ran the SQL schema in the correct project
- Check that RLS policy "Allow public inserts" is active
- Try disabling RLS temporarily to test: `ALTER TABLE employer_job_submissions DISABLE ROW LEVEL SECURITY;`

## Security Notes

- The `anon` key is safe to expose in client-side code (it's prefixed with `NEXT_PUBLIC_`)
- Row Level Security (RLS) is enabled to control data access
- Public users can only INSERT, not read/update/delete
- The honeypot field (`website`) helps prevent spam
- Consider adding rate limiting for production use

