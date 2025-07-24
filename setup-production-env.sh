#!/bin/bash

echo "🚀 Setting up production environment variables..."

# Generate a secure secret key
SECRET_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "🔑 Generated secure secret key: $SECRET_KEY"

# Copy the template file
cp env.production.example .env.production

# Replace the placeholder secret key with the generated one
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/your_super_secret_key_change_this_in_production_123456789/$SECRET_KEY/g" .env.production
else
    # Linux
    sed -i "s/your_super_secret_key_change_this_in_production_123456789/$SECRET_KEY/g" .env.production
fi

echo "✅ Production environment file created: .env.production"
echo "📝 Please review and update the database connection details if needed:"
echo "   - DB_HOST"
echo "   - DB_USER" 
echo "   - DB_PASSWORD"
echo "   - DB_NAME"
echo ""
echo "🔧 To test locally with production settings, run:"
echo "   NODE_ENV=production npm start" 