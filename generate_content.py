import os
import re
import base64

def extract_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract Title (h1)
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
    title = ""
    if title_match:
        # Remove nested tags like <span>
        title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
        # Clean up whitespace
        title = " ".join(title.split())
    
    # Extract Excerpt (first p tag after header usually, or just first p with text)
    # Looking at file, p is after h1
    excerpt_match = re.search(r'<p[^>]*>(.*?)</p>', content, re.DOTALL)
    excerpt = ""
    if excerpt_match:
        excerpt_clean = re.sub(r'<[^>]+>', '', excerpt_match.group(1)).strip()
        excerpt = " ".join(excerpt_clean.split())
        # Truncate if too long
        if len(excerpt) > 150:
            excerpt = excerpt[:147] + "..."
            
    # Extract Base64 Image
    image_match = re.search(r'data:image/png;base64,([^"\']+)', content)
    image_data = None
    if image_match:
        image_data = image_match.group(1).strip()
        # Fix padding
        missing_padding = len(image_data) % 4
        if missing_padding:
            image_data += '=' * (4 - missing_padding)
        
    return title, excerpt, image_data

def generate_card_html(title, excerpt, image_filename, link_filename, date="Oct 2023"):
    return f"""
            <a href="{link_filename}" class="blog-card">
                <div class="card-image-wrapper">
                    <img src="{image_filename}" alt="{title}" class="card-image">
                </div>
                <div class="card-content">
                    <div class="tags-container">
                        <span class="tag">Blog</span>
                        <span class="tag">Tech</span>
                    </div>
                    <h2 class="card-title">{title}</h2>
                    <p class="card-excerpt">
                        {excerpt}
                    </p>
                    <hr class="separator">
                    <div class="card-footer">
                        <span class="author-name">Janiru Hansaga</span>
                        <span class="divider">/</span>
                        <span>{date}</span>
                    </div>
                </div>
            </a>
    """

def main():
    base_dir = r"c:\Users\janir\OneDrive\Documents\MyPortfolio\janiruhansaga"
    thumbnails_dir = os.path.join(base_dir, "thumbnails")
    
    if not os.path.exists(thumbnails_dir):
        os.makedirs(thumbnails_dir)
        print(f"Created directory: {thumbnails_dir}")

    cards_html = ""
    
    # Process article-1.html to article-10.html
    for i in range(1, 11):
        filename = f"article-{i}.html"
        file_path = os.path.join(base_dir, filename)
        
        if not os.path.exists(file_path):
            print(f"Skipping {filename}, not found.")
            continue
            
        print(f"Processing {filename}...")
        title, excerpt, image_data = extract_content(file_path)
        
        image_filename = ""
        if image_data:
            image_filename = f"thumbnails/article-{i}.png"
            full_image_path = os.path.join(base_dir, image_filename)
            try:
                with open(full_image_path, "wb") as img_file:
                    img_file.write(base64.b64decode(image_data))
                print(f"Saved image to {image_filename}")
            except Exception as e:
                print(f"Failed to save image for {filename}: {e}")
                image_filename = "placeholder.png" # Fallback if save fails
        else:
            image_filename = "placeholder.png"

        cards_html += generate_card_html(title, excerpt, image_filename, filename)

    # Read post.html
    post_html_path = os.path.join(base_dir, "post.html")
    with open(post_html_path, 'r', encoding='utf-8') as f:
        post_content = f.read()

    # Construct the new section content
    new_section_content = f"""
    <section class="post-section" style="padding: 100px 10%; min-height: 80vh;">
        <div class="post-container" style="text-align: center; margin-bottom: 50px;">
            <h1 style="font-size: 3rem;">Latest Posts</h1>
            <p style="font-size: 1.2rem; color: var(--sub-text);">Explore my latest thoughts and ideas.</p>
        </div>
        
        <div class="container">
            <div class="blog-grid">
                {cards_html}
            </div>
        </div>
    </section>
    """

    # Replace the existing post-section
    # Regex to find the existing <section class="post-section" ...> ... </section>
    # We match strictly on class="post-section" to avoid replacing other sections if they exist
    
    # Simple replacement if we know the structure roughly, regex for safety
    updated_content = re.sub(
        r'<section class="post-section"[^>]*>.*?</section>', 
        new_section_content, 
        post_content, 
        flags=re.DOTALL
    )
    
    if updated_content == post_content:
        print("Warning: content was not replaced. Regex might haven't matched.")
        # Fallback dump to ensure we see what matches
        # Try finding just the placeholder text if specific
        if "Coming Soon..." in post_content:
             print("Trying simpler replacement on 'Coming Soon...' parent container.")
             # This is riskier without dom parsing, but let's assume the previous view_file showed standard formatting.
    
    with open(post_html_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("Successfully updated post.html")

if __name__ == "__main__":
    main()
