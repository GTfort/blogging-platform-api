// scripts/setup.js
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupProject() {
  console.log("🚀 Setting up Blogging Platform API...\n");

  // 1. Install dependencies
  console.log("📦 Installing dependencies...");
  await runCommand("npm install");

  // 2. Create .env file if not exists
  const envExamplePath = path.join(__dirname, "../.env.example");
  const envPath = path.join(__dirname, "../.env");

  if (!fs.existsSync(envPath)) {
    console.log("⚙️  Creating .env file...");
    fs.copyFileSync(envExamplePath, envPath);
    console.log(
      "✅ Created .env file. Please update with your database credentials.",
    );
  }

  // 3. Create database
  console.log("🗄️  Creating database...");
  await runCommand("npm run db:create");

  // 4. Run migrations
  console.log("📝 Running migrations...");
  await runCommand("npm run db:migrate");

  // 5. Seed database
  console.log("🌱 Seeding database...");
  await runCommand("npm run db:seed");

  console.log("\n✅ Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Update your .env file with correct database credentials");
  console.log("2. Start the server with: npm run dev");
  console.log("3. Access the API at: http://localhost:3000");
  console.log("4. Check health endpoint: http://localhost:3000/health");
  console.log("5. Run tests with: npm test");
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`⚠️  Warning: ${stderr}`);
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve();
    });
  });
}

setupProject().catch(console.error);
