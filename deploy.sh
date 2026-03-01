#!/bin/bash
# 배달 수수료 계산기 - 자동 빌드 & 배포 스크립트
# 사용법: ./deploy.sh

set -e

cd "$(dirname "$0")"

# .env 파일에서 환경변수 로드
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🔨 빌드 중..."
npm run build

echo "🚀 Netlify 배포 중..."
npx netlify-cli deploy \
  --dir=dist/web \
  --prod \
  --auth="$NETLIFY_AUTH_TOKEN" \
  --site="$NETLIFY_SITE_ID" \
  --message="$(date '+%Y-%m-%d %H:%M') 배포"

echo "✅ 배포 완료!"
echo "👉 https://helpful-sherbet-3349bb.netlify.app"
