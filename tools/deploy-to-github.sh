#!/bin/bash
# ===============================================================
# 🚀 Anniversary Website v5.0.0 - Final Deployment Helper Script
# ===============================================================

echo "🎉 Anniversary Website v5.0.0 - Final Deployment Helper"
echo "========================================================"

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to verify build process
verify_build() {
  echo -e "\n${BLUE}📦 Performing final build verification...${NC}"
  npm run build
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    return 0
  else
    echo -e "${RED}❌ Build failed! Please fix any errors and try again.${NC}"
    return 1
  fi
}

# Function to check if git is initialized
check_git() {
  if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository is already initialized.${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️ Git repository is not initialized.${NC}"
    echo -e "${BLUE}🔄 Initializing git repository...${NC}"
    git init
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✅ Git repository initialized successfully!${NC}"
      return 0
    else
      echo -e "${RED}❌ Failed to initialize git repository. Please check if git is installed.${NC}"
      return 1
    fi
  fi
}

# Function to set git remote
set_git_remote() {
  echo -e "\n${BLUE}🔄 Setting up git remote...${NC}"
  
  read -p "Enter your GitHub username: " username
  
  if [[ -z "$username" ]]; then
    echo -e "${RED}❌ GitHub username cannot be empty!${NC}"
    return 1
  fi
  
  echo -e "${BLUE}🔄 Adding remote origin...${NC}"
  git remote add origin "https://github.com/$username/anniversary-website.git"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Remote origin added successfully!${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️ Remote might already exist. Updating...${NC}"
    git remote set-url origin "https://github.com/$username/anniversary-website.git"
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✅ Remote origin updated successfully!${NC}"
      return 0
    else
      echo -e "${RED}❌ Failed to set git remote. Please manually set the remote.${NC}"
      return 1
    fi
  fi
}

# Function to commit and push changes
commit_and_push() {
  echo -e "\n${BLUE}🔄 Staging changes...${NC}"
  git add .
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes staged successfully!${NC}"
  else
    echo -e "${RED}❌ Failed to stage changes. Please check if there are any issues with the files.${NC}"
    return 1
  fi
  
  echo -e "\n${BLUE}🔄 Committing changes...${NC}"
  git commit -m "Anniversary Website v5.0.0 - Complete"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes committed successfully!${NC}"
  else
    echo -e "${RED}❌ Failed to commit changes. Please check if there are any issues with the commit.${NC}"
    return 1
  fi
  
  echo -e "\n${BLUE}🔄 Pushing changes to GitHub...${NC}"
  git push -u origin main
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes pushed to GitHub successfully!${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️ Push failed. Trying with master branch...${NC}"
    git push -u origin master
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✅ Changes pushed to GitHub successfully!${NC}"
      return 0
    else
      echo -e "${RED}❌ Failed to push changes. Please manually push the changes to GitHub.${NC}"
      return 1
    fi
  fi
}

# Function to help set up GitHub Pages
setup_github_pages() {
  echo -e "\n${PURPLE}🚀 GitHub Pages Setup Guide${NC}"
  echo -e "======================="
  echo -e "${BLUE}1. Go to your GitHub repository: ${YELLOW}https://github.com/[your-username]/anniversary-website${NC}"
  echo -e "${BLUE}2. Click on 'Settings' tab${NC}"
  echo -e "${BLUE}3. Scroll down to 'GitHub Pages' section${NC}"
  echo -e "${BLUE}4. Under 'Source', select 'main' or 'master' branch${NC}"
  echo -e "${BLUE}5. Click 'Save'${NC}"
  echo -e "${BLUE}6. Wait a few minutes for the site to be published${NC}"
  echo -e "${BLUE}7. Your website will be available at: ${YELLOW}https://[your-username].github.io/anniversary-website/${NC}"
  echo -e "${GREEN}✅ Once published, your Anniversary Website v5.0.0 will be live!${NC}"
}

# Main function
main() {
  echo -e "${PURPLE}🎮 Jerry & Soumya's Anniversary Website v5.0.0 - Final Deployment${NC}\n"
  
  # Run final deployment verification
  echo -e "${BLUE}🔍 Running final deployment verification...${NC}"
  bash tools/final-deployment-verification.sh
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Final deployment verification failed. Fix the issues before proceeding.${NC}"
    exit 1
  fi
  
  # Verify build
  verify_build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build verification failed. Fix the build issues before proceeding.${NC}"
    exit 1
  fi
  
  # Check git
  check_git
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git initialization failed. Please initialize git manually.${NC}"
    exit 1
  fi
  
  # Ask if user wants to proceed with remote setup and push
  echo -e "\n${BLUE}Do you want to set up the GitHub remote and push the changes? (y/n)${NC}"
  read response
  
  if [[ "$response" == "y" || "$response" == "Y" ]]; then
    # Set git remote
    set_git_remote
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}❌ Failed to set git remote. Please set up the remote manually.${NC}"
    else
      # Commit and push changes
      commit_and_push
      
      if [ $? -eq 0 ]; then
        # Setup GitHub Pages
        setup_github_pages
      fi
    fi
  else
    echo -e "${YELLOW}⚠️ Remote setup and push skipped. You'll need to do this manually.${NC}"
    setup_github_pages
  fi
  
  echo -e "\n${GREEN}🎉 Deployment helper process completed!${NC}"
  echo -e "${BLUE}Thank you for using the Anniversary Website v5.0.0 - Final Deployment Helper.${NC}"
  echo -e "${PURPLE}💕 Celebrate your love story!${NC}"
}

# Run the main function
main
