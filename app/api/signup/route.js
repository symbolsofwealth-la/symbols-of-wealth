import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dkmg6866',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // We'll need to add this
  useCdn: false
})

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Save to Sanity
    await client.create({
      _type: 'emailSignup',
      email: email.toLowerCase().trim(),
      signupDate: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email signup error:', error)
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    )
  }
}
```

**Fourth - Add the logo to public folder:**

Put the `SOW_lockup.png` file in `symbols-of-wealth-frontend/public/`

**Fifth - Get Sanity API token:**

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create new token with "Editor" permissions
5. Copy the token
6. Add to `symbols-of-wealth-frontend/.env.local`:
```
SANITY_API_TOKEN=your-token-here