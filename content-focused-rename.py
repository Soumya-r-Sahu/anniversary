#!/usr/bin/env python3
"""
Anniversary Website v4.0.0 - Content-Focused Class/ID Rename Session
Applies semantic, meaningful names based on content purpose rather than technical terms
Professional naming that reflects the love story and user experience
"""

import os
import re
import json
from pathlib import Path

# Content-focused naming mappings
CONTENT_NAMING_MAP = {
    # Container and Layout Elements
    'container': 'content-sanctuary',
    'wrapper': 'story-section', 
    'main-content': 'love-story-content',
    'content-area': 'narrative-space',
    'section': 'story-chapter',
    
    # Memory and Timeline Elements
    'timeline': 'love-journey',
    'memory': 'precious-moment',
    'memory-card': 'cherished-memory',
    'milestone': 'relationship-milestone',
    'timeline-entry': 'memory-marker',
    'timeline-item': 'journey-moment',
    
    # Photo and Visual Elements
    'photo-gallery': 'captured-memories',
    'gallery': 'visual-story',
    'photo-item': 'treasured-photo',
    'image-container': 'photo-frame',
    'slideshow': 'memory-slideshow',
    
    # Communication Elements
    'love-letters': 'letter-sanctuary',
    'letter-card': 'love-message',
    'letter-content': 'heartfelt-words',
    'message': 'sweet-communication',
    
    # Music and Entertainment
    'music-player': 'melody-heart',
    'playlist': 'romantic-soundtrack',
    'song-item': 'love-melody',
    'audio-controls': 'music-conductor',
    
    # Countdown and Celebrations
    'countdown': 'anniversary-countdown',
    'timer': 'love-timer',
    'celebration': 'joy-moment',
    'anniversary': 'love-milestone',
    
    # Navigation and Interface
    'nav': 'story-navigation',
    'navbar': 'love-story-nav',
    'menu': 'story-chapters',
    'sidebar': 'memory-details',
    'header': 'story-opening',
    'footer': 'story-closing',
    
    # Interactive Elements
    'button': 'action-heart',
    'btn': 'love-action',
    'link': 'story-connection',
    'card': 'memory-display',
    'modal': 'story-spotlight',
    
    # Technical to Emotional Conversions
    'component': 'story-element',
    'widget': 'love-feature',
    'module': 'narrative-piece',
    'panel': 'story-panel',
    'box': 'love-container',
    'item': 'story-piece'
}

# Relationship-specific naming
RELATIONSHIP_NAMING = {
    'jerry': 'jerry-beloved',
    'puja': 'jerry-sweetness',
    'soumya': 'mankada-loving',
    'mankada': 'mankada-heart',
    'couple': 'eternal-duo',
    'together': 'united-hearts',
    'relationship': 'love-bond'
}

# Emotional context naming
EMOTIONAL_NAMING = {
    'happy': 'joyful-moment',
    'romantic': 'heart-flutter',
    'sweet': 'tender-feeling',
    'loving': 'pure-affection',
    'special': 'precious-treasure',
    'beautiful': 'heart-beauty',
    'wonderful': 'magical-moment'
}

class ContentFocusedRenamer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.renamed_count = 0
        self.files_processed = 0
        
    def rename_classes_in_file(self, file_path):
        """Apply content-focused naming to a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Apply naming transformations
            content = self.apply_content_naming(content)
            content = self.apply_relationship_naming(content)
            content = self.apply_emotional_naming(content)
            content = self.improve_semantic_structure(content)
            
            # Only write if changes were made
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Enhanced: {file_path}")
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
            return False
    
    def apply_content_naming(self, content):
        """Apply content-focused class and ID naming"""
        for tech_name, content_name in CONTENT_NAMING_MAP.items():
            # Replace class names
            content = re.sub(
                rf'class="([^"]*\b){tech_name}(\b[^"]*)"',
                rf'class="\1{content_name}\2"',
                content
            )
            
            # Replace ID names
            content = re.sub(
                rf'id="([^"]*\b){tech_name}(\b[^"]*)"',
                rf'id="\1{content_name}\2"',
                content
            )
            
            # Replace CSS selectors in style blocks
            content = re.sub(
                rf'\.{tech_name}\b',
                f'.{content_name}',
                content
            )
            
            content = re.sub(
                rf'#{tech_name}\b',
                f'#{content_name}',
                content
            )
        
        return content
    
    def apply_relationship_naming(self, content):
        """Apply relationship-specific naming"""
        for term, loving_term in RELATIONSHIP_NAMING.items():
            # Be careful with replacements to avoid breaking content
            content = re.sub(
                rf'\b{term}-([a-zA-Z-]+)\b',
                rf'{loving_term}-\1',
                content
            )
        
        return content
    
    def apply_emotional_naming(self, content):
        """Apply emotional context to naming"""
        for emotion, loving_emotion in EMOTIONAL_NAMING.items():
            content = re.sub(
                rf'class="([^"]*\b){emotion}(\b[^"]*)"',
                rf'class="\1{loving_emotion}\2"',
                content
            )
        
        return content
    
    def improve_semantic_structure(self, content):
        """Improve overall semantic structure"""
        improvements = [
            # Main content areas
            (r'<div class="main">', '<main class="love-story-sanctuary">'),
            (r'</div>(\s*<!--[^>]*main[^>]*-->)', '</main>\\1'),
            
            # Section improvements
            (r'<div class="([^"]*section[^"]*)">', r'<section class="\1">'),
            (r'</div>(\s*<!--[^>]*section[^>]*-->)', '</section>\\1'),
            
            # Article improvements for memory cards
            (r'<div class="([^"]*memory[^"]*)">', r'<article class="\1">'),
            (r'<div class="([^"]*letter[^"]*)">', r'<article class="\1">'),
            
            # Improve navigation semantics
            (r'<div class="([^"]*nav[^"]*)">', r'<nav class="\1">'),
            (r'</div>(\s*<!--[^>]*nav[^>]*-->)', '</nav>\\1'),
            
            # Header improvements
            (r'<div class="([^"]*header[^"]*)">', r'<header class="\1">'),
            (r'</div>(\s*<!--[^>]*header[^>]*-->)', '</header>\\1'),
            
            # Footer improvements  
            (r'<div class="([^"]*footer[^"]*)">', r'<footer class="\1">'),
            (r'</div>(\s*<!--[^>]*footer[^>]*-->)', '</footer>\\1'),
        ]
        
        for pattern, replacement in improvements:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        return content
    
    def process_html_files(self):
        """Process all HTML files in the project"""
        html_files = list(self.root_dir.rglob("*.html"))
        
        print(f"🎨 Starting content-focused renaming session...")
        print(f"📁 Found {len(html_files)} HTML files to process")
        
        for html_file in html_files:
            self.files_processed += 1
            if self.rename_classes_in_file(html_file):
                self.renamed_count += 1
        
        print(f"\n✨ Content-focused naming complete!")
        print(f"📊 Files processed: {self.files_processed}")
        print(f"🎭 Files enhanced: {self.renamed_count}")
    
    def process_css_files(self):
        """Process CSS files to update class references"""
        css_files = list(self.root_dir.rglob("*.css"))
        
        print(f"🎨 Processing CSS files for content-focused naming...")
        
        for css_file in css_files:
            try:
                with open(css_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Apply CSS selector naming updates
                for tech_name, content_name in CONTENT_NAMING_MAP.items():
                    content = re.sub(
                        rf'\.{tech_name}\b',
                        f'.{content_name}',
                        content
                    )
                    content = re.sub(
                        rf'#{tech_name}\b', 
                        f'#{content_name}',
                        content
                    )
                
                if content != original_content:
                    with open(css_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ Enhanced CSS: {css_file}")
                    
            except Exception as e:
                print(f"❌ Error processing CSS {css_file}: {e}")
    
    def generate_naming_report(self):
        """Generate a report of naming changes"""
        report = {
            "session_type": "Content-Focused Class/ID Rename Session",
            "files_processed": self.files_processed,
            "files_enhanced": self.renamed_count,
            "naming_philosophy": "Content-first, relationship-focused, emotionally meaningful",
            "key_improvements": [
                "Technical terms replaced with content-focused names",
                "Relationship terminology integrated throughout",
                "Emotional context added to class names",
                "Semantic HTML structure improved",
                "User experience terminology prioritized"
            ],
            "naming_examples": {
                "container": "content-sanctuary",
                "memory-card": "cherished-memory", 
                "timeline": "love-journey",
                "gallery": "visual-story",
                "countdown": "anniversary-countdown"
            }
        }
        
        report_path = self.root_dir / "Documentation" / "CONTENT_FOCUSED_NAMING_REPORT.md"
        
        # Create markdown report
        markdown_content = f"""# Content-Focused Naming Session Report

## Overview
- **Session Type**: {report['session_type']}
- **Files Processed**: {report['files_processed']}
- **Files Enhanced**: {report['files_enhanced']}
- **Philosophy**: {report['naming_philosophy']}

## Key Improvements
{chr(10).join([f'- {improvement}' for improvement in report['key_improvements']])}

## Naming Examples
{chr(10).join([f'- `{old}` → `{new}`' for old, new in report['naming_examples'].items()])}

## Generated: {Path(__file__).name}
"""
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        print(f"📋 Report generated: {report_path}")

def main():
    # Get the project root directory
    current_dir = Path.cwd()
    
    print(f"🎨 Starting content-focused renaming in: {current_dir}")
    
    # Initialize the renamer
    renamer = ContentFocusedRenamer(current_dir)
    
    # Process files
    renamer.process_html_files()
    renamer.process_css_files()
    
    # Generate report
    renamer.generate_naming_report()
    
    print("\n🎉 Content-focused naming session complete!")
    print("💝 All classes and IDs now reflect the beautiful love story content!")

if __name__ == "__main__":
    main()
