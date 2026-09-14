# Café Scraper & Ownership Claim System

## Overview

This system allows you to automatically discover cafés in Davao City using the Google Places API and enables café owners to claim ownership of their listings.

---

## 🔍 Café Scraper

The scraper fetches real café data from Google Places API including:
- Name, address, and location coordinates
- Photos and cover images
- Ratings and review counts
- Opening hours
- Price levels
- Phone numbers and websites
- Business status

### Prerequisites

1. **Google Cloud Console Setup**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one
   - Enable the following APIs:
     * Places API (New)
     * Geocoding API
   - Create an API key with Places API access
   - (Optional) Restrict the key to your server IP

2. **Environment Configuration**
   
   Add to `server/.env`:
   ```env
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

### Running the Scraper

#### Step 1: Run the Scraper

```bash
# From project root
npm run scraper:run -w server

# Or from server directory
cd server
npm run scraper:run
```

This will:
- Search for cafés in Davao City using multiple queries
- Fetch detailed information for each café
- Download high-quality images
- Save results to `server/prisma/scraped-cafes.json`

**Expected output:**
```
🔍 Searching for cafés in Davao City...

Searching: "coffee shop in Davao City"...
✓ Found 20 results

📍 Blugre Coffee
   1234 Sample St, Poblacion District, Davao City
   ⭐ 4.5 (234 reviews)

📍 Kalsada Coffee
   5678 Another St, Lanang, Davao City
   ⭐ 4.7 (156 reviews)

...

✅ Total unique cafés found: 45
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Scraped data saved to: F:\cafe-finder-localz\server\prisma\scraped-cafes.json

Next steps:
1. Review the scraped data in prisma/scraped-cafes.json
2. Run the import script to add cafés to database
3. Admin can approve cafés from the admin panel
4. Owners can claim their cafés
```

#### Step 2: Review Scraped Data

Open `server/prisma/scraped-cafes.json` and review the café data:

```json
[
  {
    "name": "Sample Café",
    "slug": "sample-cafe",
    "tagline": "Great coffee in Davao",
    "description": "...",
    "address": "123 Main St, Poblacion, Davao City",
    "district": "Poblacion District",
    "latitude": 7.0731,
    "longitude": 125.6128,
    "priceLevel": 2,
    "status": "PENDING",
    "phone": "+63 82 123 4567",
    "website": "https://example.com",
    "coverImage": "https://places.googleapis.com/...",
    "images": ["..."],
    "metadata": {
      "source": "google_places",
      "googleRating": 4.5,
      "googleReviewCount": 123
    }
  }
]
```

#### Step 3: Import to Database

```bash
# From project root
npm run scraper:import -w server

# Or from server directory
cd server
npm run scraper:import
```

This will:
- Create a system user for scraped cafés
- Import all cafés with PENDING status
- Skip duplicates (by slug or name)
- Create café images from Google Places photos

**Expected output:**
```
📥 Importing scraped cafés into database...

Found 45 cafés to import

✅ Imported "Blugre Coffee" (Poblacion District)
✅ Imported "Kalsada Coffee" (Lanang)
⏭️  Skipping "Commune Cafe + Bar" - already exists
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Import complete!
   Imported: 42
   Skipped:  3
   Errors:   0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Next steps:
1. Login as admin: admin@cafefinder.ph / ChangeMe123!
2. Go to /admin to review and approve cafés
3. Café owners can claim their listings from the café detail page
```

### Scraper Configuration

Edit `server/src/scraper/googlePlacesScraper.ts` to customize:

**Search Queries:**
```typescript
const searchQueries = [
  'coffee shop in Davao City',
  'cafe in Davao City',
  'specialty coffee Davao',
  'coffee roastery Davao',
  // Add more search terms
];
```

**Search Radius:**
```typescript
locationBias: {
  circle: {
    center: davaoCityCenter,
    radius: 15000, // 15km radius - adjust as needed
  },
},
```

**Results Per Query:**
```typescript
maxResultCount: 20, // Increase to get more results (max 60)
```

---

## 👤 Ownership Claim System

Allows café owners to claim their listings and manage them.

### How It Works

1. **User Discovers Their Café**
   - Browse to their café's detail page
   - See "Claim Ownership" button

2. **Submit Claim**
   - Click "Claim Ownership"
   - Optionally add a message explaining their connection
   - Submit the claim

3. **Admin Reviews**
   - Admin sees claim in the admin panel
   - Reviews the claim details
   - Approves or rejects

4. **Ownership Granted**
   - On approval, user becomes the café owner
   - Owner gets access to owner dashboard
   - Can update café details, respond to reviews, etc.

### For Users (Café Owners)

#### Claiming a Café

1. Navigate to your café's page (e.g., `/cafe/your-cafe-name`)
2. Scroll to the top section
3. Click **"Claim Ownership"** button
4. Fill in optional information:
   ```
   Example: "I am the owner of this café. 
   We've been operating since 2020..."
   ```
5. Click **"Submit Claim"**
6. Wait for admin approval (usually 1-3 business days)

#### Checking Claim Status

1. Go to **Owner Dashboard** (`/owner`)
2. Click **"My Claims"** tab
3. See status:
   - 🟡 **PENDING** - Under review
   - 🟢 **APPROVED** - Ownership granted
   - 🔴 **REJECTED** - Claim denied (can resubmit with more info)

#### After Approval

Once approved, you can:
- ✅ Update café details (hours, menu, amenities)
- ✅ Upload new photos
- ✅ Respond to customer reviews
- ✅ View analytics and insights
- ✅ Add special offers or announcements

### For Admins

#### Reviewing Claims

1. Login as admin
2. Go to **Admin Panel** (`/admin`)
3. Click **"Claims"** tab
4. Review pending claims:
   - User name and email
   - Café name and location
   - Claim message
   - Submission date

#### Approving/Rejecting Claims

**To Approve:**
```typescript
// The system automatically:
1. Sets user as café owner
2. Updates café status to APPROVED
3. Notifies user via email (if configured)
4. User gains access to owner dashboard
```

**To Reject:**
```typescript
// The system:
1. Marks claim as REJECTED
2. Café remains without owner
3. User can see rejection and resubmit with more info
```

### API Endpoints

#### Create Claim (User)
```
POST /api/owner/claims
Authorization: Bearer <token>

Body:
{
  "cafeId": "cm123...",
  "message": "Optional explanation"
}

Response:
{
  "id": "claim_123",
  "status": "PENDING",
  "userId": "user_123",
  "cafeId": "cafe_123",
  "message": "...",
  "createdAt": "2026-09-12T09:00:00.000Z"
}
```

#### List My Claims (User)
```
GET /api/owner/claims
Authorization: Bearer <token>

Response:
[
  {
    "id": "claim_123",
    "status": "PENDING",
    "cafe": {
      "id": "cafe_123",
      "name": "My Café",
      "slug": "my-cafe"
    },
    "createdAt": "2026-09-12T09:00:00.000Z"
  }
]
```

#### List All Claims (Admin)
```
GET /api/admin/claims?status=PENDING
Authorization: Bearer <admin-token>

Response:
{
  "items": [...],
  "total": 10,
  "page": 1,
  "pageSize": 20
}
```

#### Decide Claim (Admin)
```
POST /api/admin/claims/:claimId/decide
Authorization: Bearer <admin-token>

Body:
{
  "decision": "APPROVED" | "REJECTED"
}

Response:
{
  "id": "claim_123",
  "status": "APPROVED",
  ...
}
```

---

## 🔄 Complete Workflow Example

### Scenario: New Café "Java Junction" Opens in Davao

#### 1. Discovery (Automated)
```bash
# Admin runs scraper monthly
npm run scraper:run -w server
# Java Junction discovered from Google Places
```

#### 2. Import (Admin)
```bash
npm run scraper:import -w server
# Café imported with PENDING status
```

#### 3. Admin Approval
```
Admin logs in → Admin Panel → Cafés
Finds "Java Junction" (PENDING)
Reviews details
Clicks "Approve"
Status: PENDING → APPROVED
```

#### 4. Owner Claims
```
Owner discovers their café on the site
Clicks "Claim Ownership"
Submits: "Hi, I'm the owner of Java Junction..."
Status: Claim created (PENDING)
```

#### 5. Admin Verifies
```
Admin → Admin Panel → Claims
Sees claim from owner
Reviews information
Clicks "Approve"
Owner becomes café owner
```

#### 6. Owner Manages
```
Owner logs in
Goes to Owner Dashboard
Updates café hours, adds menu photos
Responds to customer reviews
```

---

## 🛠️ Troubleshooting

### Scraper Issues

**Error: "GOOGLE_MAPS_API_KEY not found"**
```bash
# Solution: Add API key to server/.env
GOOGLE_MAPS_API_KEY=your_key_here
```

**Error: "API key not valid" or "Places API not enabled"**
```bash
# Solution: Enable Places API (New) in Google Cloud Console
# Go to: https://console.cloud.google.com/apis/library
# Search: Places API (New)
# Click: Enable
```

**No cafés found**
```bash
# Check:
1. API key has proper permissions
2. Search radius is appropriate (default 15km)
3. Search queries are relevant
4. Davao City coordinates are correct (7.0731, 125.6128)
```

### Import Issues

**Error: "scraped-cafes.json not found"**
```bash
# Solution: Run scraper first
npm run scraper:run -w server
```

**All cafés skipped**
```bash
# Reason: Cafés already exist in database
# Solution: Check database with Prisma Studio
npm run db:studio -w server
```

### Claim Issues

**Can't submit claim**
```bash
# Check:
1. User is logged in
2. Café exists and is approved
3. User doesn't already own the café
4. User doesn't have pending claim for this café
```

**Claim not appearing in admin panel**
```bash
# Check:
1. Claim was successfully created
2. Admin is viewing correct status filter (PENDING)
3. Database connection is working
```

---

## 📊 Database Schema

### Café Table
```prisma
model Cafe {
  id       String     @id @default(cuid())
  name     String
  slug     String     @unique
  status   CafeStatus @default(PENDING)
  ownerId  String?
  owner    User?      @relation(fields: [ownerId], references: [id])
  claims   OwnershipClaim[]
  ...
}
```

### OwnershipClaim Table
```prisma
model OwnershipClaim {
  id        String      @id @default(cuid())
  status    ClaimStatus @default(PENDING)
  message   String?
  createdAt DateTime    @default(now())
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  cafeId String
  cafe   Cafe   @relation(fields: [cafeId], references: [id])
  
  @@unique([cafeId, userId])
}
```

### Enums
```prisma
enum CafeStatus {
  PENDING   // Awaiting admin approval
  APPROVED  // Live on site
  REJECTED  // Not approved
}

enum ClaimStatus {
  PENDING   // Awaiting admin review
  APPROVED  // Ownership granted
  REJECTED  // Claim denied
}
```

---

## 💡 Best Practices

### For Scraping
- ✅ Run scraper during off-peak hours
- ✅ Review scraped data before importing
- ✅ Check for duplicates
- ✅ Verify photo quality and relevance
- ✅ Update descriptions for better SEO
- ❌ Don't run too frequently (API quotas)
- ❌ Don't import without review

### For Claims
- ✅ Respond to claims within 24-48 hours
- ✅ Verify ownership legitimacy
- ✅ Provide clear rejection reasons
- ✅ Allow resubmission after rejection
- ❌ Don't auto-approve all claims
- ❌ Don't delay reviews too long

### For Owners
- ✅ Keep café information updated
- ✅ Add high-quality photos
- ✅ Respond to all reviews
- ✅ Update hours during holidays
- ❌ Don't spam with updates
- ❌ Don't respond rudely to negative reviews

---

## 📈 Analytics & Monitoring

### Scraper Metrics
```typescript
// Track in Google Analytics or database
- Cafés discovered per run
- Success rate
- API calls made
- Import success rate
- Duplicate rate
```

### Claim Metrics
```typescript
// Track in admin dashboard
- Claims submitted per day/week
- Average review time
- Approval rate
- Rejection reasons
- Active café owners
```

---

## 🚀 Future Enhancements

### Scraper
- [ ] Support for other data sources (Facebook, Instagram)
- [ ] Automatic periodic scraping (cron job)
- [ ] Machine learning for better café detection
- [ ] Automatic address geocoding
- [ ] Duplicate detection with fuzzy matching

### Ownership
- [ ] Email notifications for claim status
- [ ] Verification documents upload
- [ ] Multi-owner support (team management)
- [ ] Owner analytics dashboard
- [ ] Bulk claim submission for chains

---

## 📞 Support

For issues or questions:
- Check existing documentation
- Review error logs in console
- Check database with Prisma Studio
- Contact development team

**Common Files:**
- Scraper: `server/src/scraper/googlePlacesScraper.ts`
- Import: `server/src/scraper/importScrapedCafes.ts`
- Claim Component: `client/src/components/ClaimOwnership.tsx`
- Owner Service: `server/src/services/ownerService.ts`
- Admin Service: `server/src/services/adminService.ts`
