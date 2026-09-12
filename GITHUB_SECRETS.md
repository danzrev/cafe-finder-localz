# GitHub Secrets Configuration

Go to **GitHub repo → Settings → Secrets and variables → Actions → New repository secret** and add these:

## Required Secrets

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `TAILSCALE_OAUTH_CLIENT_ID` | `tskey-abc123...` | Tailscale admin console → Machines → Generate auth key → OAuth client |
| `TAILSCALE_OAUTH_SECRET` | `tskey-secret-xyz...` | Same as above, the secret part |
| `TAILSCALE_IP` | `100.86.22.107` | Run `tailscale ip -4` on your Ubuntu server |
| `DEPLOY_USER` | `ubuntu` | Your SSH username on the Ubuntu box |
| `DEPLOY_PATH` | `/opt/cafe-finder` | Where you cloned the repo on Ubuntu |

## Optional Secrets

| Secret Name | Value | Purpose |
|-------------|-------|---------|
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/...` | Deploy notifications to Slack |

---

## Tailscale OAuth Setup (one-time)

1. Go to https://login.tailscale.com/admin/settings/oauth
2. Click **"Generate OAuth client"**
3. Name: `github-actions-deploy`
4. Tags: `tag:github-action,tag:ci` (or your preferred tags)
5. Copy **Client ID** → `TAILSCALE_OAUTH_CLIENT_ID`
6. Copy **Client Secret** → `TAILSCALE_OAUTH_SECRET`

---

## Ubuntu Server Prep (run once)

```bash
# 1. Create deploy user (or use existing)
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy

# 2. Set up SSH key for GitHub Actions
# On YOUR LOCAL MACHINE:
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/cafe-finder-deploy
# Copy the PUBLIC key to Ubuntu:
ssh-copy-id -i ~/.ssh/cafe-finder-deploy.pub deploy@100.86.22.107

# 3. Add private key as GitHub secret (optional, for SSH auth)
# cat ~/.ssh/cafe-finder-deploy  →  GitHub secret: DEPLOY_SSH_KEY
# Then update workflow to use SSH key instead of password auth

# 4. Ensure deploy user can run pm2 without password
echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/pm2" | sudo tee /etc/sudoers.d/deploy-pm2

# 4. Clone repo initially
sudo -u deploy bash -c '
  cd /opt
  git clone https://github.com/YOUR_USERNAME/cafe-finder-localz.git cafe-finder
  cd cafe-finder
  npm ci
  npm run prisma:generate --workspace=server
  npm run prisma:migrate --workspace=server -- deploy
  npm run prisma:seed --workspace=server
  npm run build
'

# 5. Create server .env on Ubuntu
sudo -u deploy tee /opt/cafe-finder/server/.env << 'EOF'
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://postgres:your_new_password@100.86.22.107:5432/cafefinder?schema=public

JWT_ACCESS_SECRET=openssl_rand_hex_32_here
JWT_REFRESH_SECRET=another_openssl_rand_hex_32_here
JWT_ACCESS_TTL_MIN=15
JWT_REFRESH_TTL_DAYS=30

CORS_ORIGIN=http://100.86.22.107:5173
COOKIE_SECURE=true

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=10
EOF

# 6. Start services with PM2
sudo -u deploy bash -c '
  cd /opt/cafe-finder
  pm2 start npm --name cafe-finder-api -- run start --prefix server
  pm2 start npm --name cafe-finder-client -- run preview --prefix client -- --port 5173 --host 0.0.0.0
  pm2 save
  pm2 startup systemd -u deploy --hp /home/deploy
'
```

---

## First Manual Deploy (before CI works)

```bash
# On your local machine
git push origin main

# Watch the GitHub Actions run
# If it fails, check the logs and adjust secrets
```

---

## Verify Deployment

```bash
# Health check
curl http://100.86.22.107:4000/api/health
# {"status":"ok","timestamp":"..."}

# API reachable
curl http://100.86.22.107:4000/api/cafes
# Should return JSON array

# Client
open http://100.86.22.107:5173
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ssh: connect to host 100.86.22.107 port 22: Connection refused` | Tailscale not running on Ubuntu, or SSH blocked. Run `sudo systemctl status tailscaled` and `sudo ufw allow 22/tcp` |
| `rsync: permission denied` | Deploy user doesn't own `/opt/cafe-finder`. Run `sudo chown -R deploy:deploy /opt/cafe-finder` |
| `pm2: command not found` | Install pm2 globally: `sudo npm install -g pm2` |
| `prisma:migrate deploy` fails | Database schema drift. Check `DATABASE_URL` and run `prisma migrate diff` locally first |
| Health check fails | Check `pm2 logs cafe-finder-api` on Ubuntu |